import { useSuspenseQuery } from "@tanstack/react-query";
import ImageViewer from "../components/common/imageViewer";
import PlaylistDescription from "../components/common/playlistDescription";
import { ResponsiveContainer } from "../container/responsiveContainer";
import { useAuthCheck } from "../hooks/auth/useAuthCheck";
import { getPlaylistMeta } from "../api/playlist";
import Card from "../components/common/card";
import FloatingButton from "../components/common/floatingButton";

import IconHome from "../assets/playlist/ic_home.svg?react";
import PlayNext from "../assets/playlist/ic_play_next.svg?react";
import IconHamburgerDisabled from "../assets/playlist/ic_hamburger_disabled.svg?react";
import IconCloseModal from "../assets/playlist/ic_close_modal.svg?react";

import useAddMusicModal from "../hooks/modal/useAddMusicModal";
import { useEffect, useState } from "react";
import Input from "../components/common/input";

const Playlist = () => {
    const { navigate, playlistCode } = useAuthCheck();

    if (!playlistCode) {
        return null;
    }

    const { data } = useSuspenseQuery({
        queryKey: ["playlist", playlistCode],
        queryFn: () => getPlaylistMeta(playlistCode),
    });

    const {
        thumbnailUrl,
        title,
        owner,
        userList,
    } = data.result;

    const resetYoutubeUrl = () => {
        setYoutubeUrl("");
    }
    const [AddMusicModal, _, openModal, closeModal] = useAddMusicModal(() => resetYoutubeUrl(), () => { });

    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [isValidYoutubeUrl, setIsValidYoutubeUrl] = useState(false);
    const [videoId, setVideoId] = useState<string | null>(null);

    const validateYoutubeUrlFormat = (url: string): boolean => {
        const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;
        return regex.test(url);
    };


    const checkYoutubeVideoExists = async (url: string): Promise<boolean> => {
        try {
            const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
            const res = await fetch(oEmbedUrl);
            return res.ok;
        } catch {
            return false;
        }
    };

    const extractYoutubeVideoId = (url: string): string | null => {
        const match = url.match(/(?:v=|youtu\.be\/)([0-9A-Za-z_-]{11})/);
        return match ? match[1] : null;
    };

    useEffect(() => {
        const check = async () => {
            if (!validateYoutubeUrlFormat(youtubeUrl)) {
                setIsValidYoutubeUrl(false);
                setVideoId(null);
                return;
            }

            const exists = await checkYoutubeVideoExists(youtubeUrl);
            setIsValidYoutubeUrl(exists);

            if (exists) {
                const id = extractYoutubeVideoId(youtubeUrl);
                setVideoId(id);
            } else {
                setVideoId(null);
            }
        };

        check();
    }, [youtubeUrl]);

    useEffect(() => {
        openModal();
    }, []);

    return (
        <ResponsiveContainer>
            <nav className="relative flex items-center justify-center mt-[10%] py-3 w-full">
                <div className="absolute left-0" onClick={() => navigate('/home')}>
                    <IconHome />
                </div>
                <h1 className="text-text-medium-sm font-semibold text-font-disabled text-center">
                    23명이 함께 보고 있어요!
                </h1>
            </nav>

            <section key={`${playlistCode}-image`} className="flex flex-col items-start justify-center w-full mt-3 mb-8">
                <ImageViewer src={thumbnailUrl} />
                <div className="flex flex-row items-end justify-center w-full my-3">
                    <PlaylistDescription title={title} description="플레이리스트 설명" />
                    <PlayNext />
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
                <Card>
                    <section className="flex flex-row items-center justify-between w-full">
                        <article className="flex flex-col items-start justify-center w-full text-left flex-1">
                            <p className="text-font-disabled text-text-medium-md font-medium">닉네임</p>
                            <h1 className="text-font-disabled text-text-large-bold font-bold">플리 제목</h1>
                        </article>
                        <IconHamburgerDisabled />
                    </section>
                </Card>
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
                        className={`w-full overflow-hidden transition-[max-height] duration-500 ease-in-out ${isValidYoutubeUrl && videoId ? 'max-h-[500px] my-3' : 'max-h-0'
                            }`}
                    >
                        {isValidYoutubeUrl && videoId && (
                            <iframe
                                className="w-full aspect-video rounded-md"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title="YouTube video preview"
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        )}
                    </div>
                    <Input
                        placeholder="유튜브 링크를 입력해주세요"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        isError={!!youtubeUrl && !isValidYoutubeUrl}
                        errorMessage={!!youtubeUrl && !isValidYoutubeUrl ? "유효하지 않은 유튜브 영상입니다." : ""}
                        className="mt-2 mb-8"
                        type="text"
                    />
                    <button
                        onClick={() => closeModal()}
                        className={`w-full h-fit text-text-large-bold font-bold text-white py-3 px-6 rounded-xl ${!!youtubeUrl && !isValidYoutubeUrl ? "bg-font-disabled" : "bg-main hover:bg-main-focus"} `}
                    >
                        확인
                    </button>
                </section>
            </AddMusicModal>
        </ResponsiveContainer>
    );
};

export default Playlist;