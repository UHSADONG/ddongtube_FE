// src/components/playlist/PlaylistAddMusicModal.tsx

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { postVideo } from "@/api/video";
import { useDebouncedMutation } from "@/hooks/react-query/useDebouncedMutation";
import { extractYoutubeVideoId } from "@/utils/youtube";
import Input from "@/components/common/input";
import IconCloseModal from "@/assets/playlist/ic_close_modal.svg?react";
import useYoutubeState from "@/hooks/youtube/useYoutubeState";

interface PlaylistAddMusicModalProps {
    openToast: () => void;
    isOpen: boolean;
    onClose: () => void;
    playlistCode: string;
}

function PlaylistAddMusicModal({
    openToast,
    isOpen,
    onClose,
    playlistCode,
}: PlaylistAddMusicModalProps) {
    const queryClient = useQueryClient();

    const {
        youtubeUrl,
        resetYoutubeUrl,
        handleYoutubeUrlChange,
        handleVideoDescriptionChange,
        videoDescription,
        isValid,
        videoId,
        reason,
    } = useYoutubeState();

    const { mutateAsync: submitYoutubeUrl, isPending } = useDebouncedMutation(
        {
            mutationFn: ({
                playlistCode,
                youtubeUrl,
                videoDescription,
            }: {
                playlistCode: string;
                youtubeUrl: string;
                videoDescription: string;
            }) => postVideo(playlistCode, { videoUrl: youtubeUrl, videoDescription }),
            onSuccess: () => {
                openToast();
            },
            onError: (error) => {
                console.error("영상 추가 실패:", error);
            },
        },
        500,
        true
    );

    const handleSubmit = useCallback(async () => {
        if (!youtubeUrl || !isValid) return;
        // 제출
        await submitYoutubeUrl({
            playlistCode,
            youtubeUrl,
            videoDescription,
        });
        queryClient.invalidateQueries({
            queryKey: ["playlist", playlistCode],
        });
        queryClient.invalidateQueries({
            queryKey: ["playlistMeta", playlistCode],
        });
        onClose();
        resetYoutubeUrl();
    }, [
        playlistCode,
        youtubeUrl,
        videoDescription,
        isValid,
        queryClient,
        submitYoutubeUrl,
        onClose,
        resetYoutubeUrl,
    ]);

    if (!isOpen) {
        return null;
    }

    const embedId = extractYoutubeVideoId(youtubeUrl);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#1F1F20]/90" >
            <div className="w-full max-w-[400px] mx-6 flex flex-col bg-fill rounded-400 overflow-hidden items-center justify-center px-4 pb-7 pt-5 rounded-[20px]">
                <div className="relative w-full max-w-md rounded-md">
                    <nav className="relative flex items-center justify-center w-full">
                        <button className="absolute right-0" onClick={onClose}>
                            <IconCloseModal />
                        </button>
                        <h1 className="text-head-medium-bold font-bold py-2 text-white text-center">
                            링크 추가
                        </h1>
                    </nav>
                    <div
                        className={`w-full overflow-hidden transition-[max-height] duration-500 ease-in-out ${isValid && videoId ? "max-h-[500px] my-3" : "max-h-0"
                            }`}
                    >
                        <iframe
                            className={`w-full aspect-video rounded-md transition-opacity duration-300 ${isValid && videoId ? "opacity-100" : "opacity-0 pointer-events-none"
                                }`}
                            src={`https://www.youtube.com/embed/${embedId}`}
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
                        className="mt-2 mb-4"
                        type="text"
                    />
                    {isValid && videoId && (
                        <Input
                            placeholder="영상 설명을 입력해주세요"
                            value={videoDescription}
                            onChange={handleVideoDescriptionChange}
                            className="mb-4"
                            type="text"
                        />
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={!!youtubeUrl && !isValid && isPending}
                        className={`w-full text-text-large-bold font-bold text-white py-3 px-6 rounded-xl ${!!youtubeUrl && !isValid && isPending ? "bg-font-disabled" : "bg-main hover:bg-main-focus"
                            }`}
                    >
                        {isPending ? '영상 추가하는 중..' : '확인'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PlaylistAddMusicModal;
