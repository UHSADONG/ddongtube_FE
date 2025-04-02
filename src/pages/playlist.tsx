
import { useCallback, useState } from "react";
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
import { useDebouncedMutation } from '../hooks/react-query/useDebouncedMutation';
import { postVideo } from "../api/video";
import { extractYoutubeVideoId } from "../utils/youtube";
import YoutubeEmbedPlayer from "../components/youtube/youtubeEmbedPlayer";
import useYoutubeState from "../hooks/youtube/useYoutubeState";

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

    const { data: playList } = useSuspenseQuery({
        queryKey: ["playlist", playlistCode],
        queryFn: () => getPlaylist(playlistCode),
        retry: 1,
        refetchOnWindowFocus: true,
        staleTime: 0
    })

    const {
        thumbnailUrl,
        title,
        description
    } = playListMeta.result;

    const {
        youtubeUrl,
        resetYoutubeUrl,
        handleYoutubeUrlChange,
        handleVideoDescriptionChange,
        videoDescription,
        isValid,
        videoId,
        reason
    } = useYoutubeState();

    const { mutateAsync: submitYoutubeUrl } = useDebouncedMutation(
        {
            mutationFn: ({ playlistCode, youtubeUrl, videoDescription }: { playlistCode: string; youtubeUrl: string, videoDescription: string }) => postVideo(playlistCode, { videoUrl: youtubeUrl, videoDescription: "" }),
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
            videoDescription: ""
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
                        onPause={() => console.log("⏸사용자 일시정지")}
                        onEnded={handleNextVideo}
                    />
                ) : (
                    <ImageViewer src={thumbnailUrl} />
                )}
                <div className="flex flex-row items-end justify-center w-full my-3">
                    <PlaylistDescription title={videoList[currentIndex]?.title ?? "영상을 추가해주세요"} description={videoList[currentIndex]?.authorName ?? "영상이 없습니다"} />
                    <button onClick={handleNextVideo}>
                        <PlayNext />
                    </button>
                </div>
                <Card>
                    <p className="text-text-medium-md font-medium text-font-enabled">
                        {videoList[currentIndex]?.description === "" || !videoList[currentIndex]?.description ? "상세 설명이 없습니다." : videoList[currentIndex].description}
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
                        {videoList.length > 0 ? (
                            videoList.map((item, index) => (
                                <Card
                                    key={index}
                                    className={`transition-all duration-300 border-[1px]
                                        ${index === currentIndex
                                            ? "border-main"
                                            : "border-stroke-2"
                                        }`}
                                    onClick={() => setCurrentIndex(index)}
                                >
                                    <section className="flex flex-row items-center justify-between w-full">
                                        <article className="flex flex-col items-start justify-center w-full text-left flex-1">
                                            <p className="text-font-disabled text-text-medium-md font-medium">
                                                {item.user.name}
                                            </p>
                                            <h1 className="text-font-disabled text-text-large-bold font-bold">
                                                {item.title}
                                            </h1>
                                        </article>
                                        <IconHamburgerDisabled />
                                    </section>
                                </Card>
                            ))
                        ) : (
                            <p className="w-full text-left text-text-medium-sm text-font-disabled font-medium ml-1">
                                재생목록이 없습니다.
                            </p>
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
                        <iframe
                            className={`w-full aspect-video rounded-md transition-opacity duration-300 ${isValid && videoId ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                }`}
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="Deeply YouTube video preview"
                            allowFullScreen
                        ></iframe>
                    </div>
                    <Input
                        placeholder="유튜브 링크를 입력해주세요"
                        value={youtubeUrl}
                        onChange={handleYoutubeUrlChange}
                        isError={!!youtubeUrl && !isValid}
                        errorMessage={!!youtubeUrl && !isValid ? reason : ""}
                        className="mt-2 mb-8"
                        type="text"
                    />
                    {isValid && videoId && (
                        <Input
                            placeholder="영상 설명을 입력해주세요"
                            value={videoDescription}
                            onChange={handleVideoDescriptionChange}
                            isError={!!youtubeUrl && !isValid}
                            errorMessage={!!youtubeUrl && !isValid ? reason : ""}
                            className="-mt-6 mb-8"
                            type="text"
                        />
                    )}
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