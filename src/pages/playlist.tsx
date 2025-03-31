
import { useState } from "react";
import { useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import ImageViewer from "../components/common/imageViewer";
import PlaylistDescription from "../components/common/playlistDescription";
import { ResponsiveContainer } from "../container/responsiveContainer";
import { useAuthCheck } from "../hooks/auth/useAuthCheck";
import { getPlaylist, getPlaylistMeta } from "../api/playlist";
import Card from "../components/common/card";
import FloatingButton from "../components/common/floatingButton";

import IconHome from "../assets/playlist/ic_home.svg?react";
import PlayNext from "../assets/playlist/ic_play_next.svg?react";
import IconHamburgerDisabled from "../assets/playlist/ic_hamburger_disabled.svg?react";
import IconCloseModal from "../assets/playlist/ic_close_modal.svg?react";

import useAddMusicModal from "../hooks/modal/useAddMusicModal";
import Input from "../components/common/input";
import useYoutubeState from "../hooks/youtube/useYoutubeState";
import { useDebouncedMutation } from '../hooks/react-query/useDebouncedMutation';
import { postVideo } from "../api/video";
import { extractYoutubeVideoId } from "../utils/youtube";
import YoutubeEmbedPlayer from "../components/youtube/youtubeEmbedPlayer";

const Playlist = () => {

    const { navigate, playlistCode } = useAuthCheck();

    if (!playlistCode) {
        return null;
    }

    const { data: playListMeta } = useSuspenseQuery({
        queryKey: ["playlistMeta", playlistCode],
        queryFn: () => getPlaylistMeta(playlistCode),
    });

    const queryClient = useQueryClient();

    const { data: playList } = useQuery({
        queryKey: ["playlist", playlistCode],
        queryFn: () => getPlaylist(playlistCode),
        enabled: !!playlistCode,
        retry: 1,
        refetchOnWindowFocus: true,
        staleTime: 0
    })

    const {
        thumbnailUrl,
        title,
    } = playListMeta.result;

    const {
        youtubeUrl,
        setYoutubeUrl,
        resetYoutubeUrl,
        isValid,
        videoId,
        reason
    } = useYoutubeState();

    const { mutateAsync: submitYoutubeUrl } = useDebouncedMutation(
        {
            mutationFn: ({ playlistCode, youtubeUrl }: { playlistCode: string; youtubeUrl: string }) => postVideo(playlistCode, { videoUrl: youtubeUrl }),
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.error(error);
            }
        },
        500,
        true
    )

    const [AddMusicModal, _, openModal, closeModal] = useAddMusicModal(() => resetYoutubeUrl(), () => { });

    const onSumbitYoutubeUrl = async () => {
        if (!videoId) return;

        await submitYoutubeUrl({
            playlistCode,
            youtubeUrl: youtubeUrl,
        });

        queryClient.invalidateQueries({
            queryKey: ["playlist", playlistCode],
        });

        closeModal();
        resetYoutubeUrl();

    }

    const [currentIndex, setCurrentIndex] = useState(0);
    const videoList = playList?.result?.videoList || [];
    const currentVideo = videoList[currentIndex];
    const currentVideoId = extractYoutubeVideoId(currentVideo?.url || "");
    const handleNextVideo = () => {
        setCurrentIndex((prev) => (prev + 1) % videoList.length);
    };

    return (
        <ResponsiveContainer style={{
            overflowY: "auto",
        }}>
            <nav className="relative flex items-center justify-center mt-[10%] py-3 w-full">
                <div className="absolute left-0" onClick={() => navigate('/home')}>
                    <IconHome />
                </div>
                <h1 className="text-text-medium-sm font-semibold text-font-disabled text-center">
                    23명이 함께 보고 있어요!
                </h1>
            </nav>

            <section key={`${playlistCode}-image`} className="flex flex-col items-start justify-center w-full mt-3 mb-8">
                {currentVideoId ? (
                    <YoutubeEmbedPlayer
                        videoId={currentVideoId}
                        onPause={() => console.log("⏸️ 사용자 일시정지")}
                        onEnded={handleNextVideo}
                    />
                ) : (
                    <ImageViewer src={thumbnailUrl} />
                )}
                <div className="flex flex-row items-end justify-center w-full my-3">
                    <PlaylistDescription title={title} description="플레이리스트 설명" />
                    <button onClick={handleNextVideo}>
                        <PlayNext />
                    </button>
                </div>
                <Card>
                    <p className="text-text-medium-md font-medium text-font-enabled">
                        바쿠고 카츠키는 신이 맞다. 그를 숭배해야만해.. 무조건.. 무조건 숭배해야만해 어? 알겠냐고?? 어어어?? 진짜
                    </p>
                </Card>
            </section>

            <div className="flex flex-col items-start justify-center w-full">
                <nav className="flex flex-row items-start justify-center w-full">
                    <label className="w-full text-head-medium-bold font-bold text-font-enabled text-left ml-1 mt-5 mb-3">
                        재생목록
                    </label>
                </nav>
                {
                    <div className="flex flex-col items-start justify-center w-full gap-2">
                        {playList && playList?.result ?
                            playList.result.videoList?.map((item, index) => (
                                <Card key={index}>
                                    <section className="flex flex-row items-center justify-between w-full">
                                        <article className="flex flex-col items-start justify-center w-full text-left flex-1">
                                            <p className="text-font-disabled text-text-medium-md font-medium">{item.authorName}</p>
                                            <h1 className="text-font-disabled text-text-large-bold font-bold">{item.title}</h1>
                                        </article>
                                        <IconHamburgerDisabled />
                                    </section>
                                </Card>
                            )) : (
                                <p className="w-full text-left text-text-medium-sm text-font-disabled font-medium ml-1">{"재생목록이 없습니다."}</p>
                            )}
                    </div>
                }
                <footer className="flex flex-row items-center justify-between w-full mb-[30%]">

                </footer>
            </div>

            <FloatingButton text="영상 추가하기" onClick={() => openModal()} />
            <AddMusicModal>
                <section className="flex flex-col items-center justify-start h-full w-full">
                    <nav className="relative flex items-center justify-center w-full">
                        <button className="absolute right-0" onClick={closeModal}>
                            <IconCloseModal />
                        </button>
                        <h1 className="text-head-medium-bold font-bold py-2 text-white text-center">
                            링크 추가
                        </h1>
                    </nav>
                    <div
                        className={`w-full overflow-hidden transition-[max-height] duration-500 ease-in-out ${isValid && videoId ? 'max-h-[500px] my-3' : 'max-h-0'
                            }`}
                    >
                        {isValid && videoId && (
                            <iframe
                                className="w-full aspect-video rounded-md"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title="Deeply YouTube video preview"
                                allowFullScreen
                            ></iframe>
                        )}
                    </div>
                    <Input
                        placeholder="유튜브 링크를 입력해주세요"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        isError={!!youtubeUrl && !isValid}
                        errorMessage={!!youtubeUrl && !isValid ? reason : ""}
                        className="mt-2 mb-8"
                        type="text"
                    />
                    <button
                        onClick={() => onSumbitYoutubeUrl()}
                        disabled={!!youtubeUrl && !isValid}
                        className={`w-full h-fit text-text-large-bold font-bold text-white py-3 px-6 rounded-xl ${!!youtubeUrl && !isValid ? "bg-font-disabled" : "bg-main hover:bg-main-focus"} `}
                    >
                        확인
                    </button>
                </section>
            </AddMusicModal>
        </ResponsiveContainer>
    );
};

export default Playlist;