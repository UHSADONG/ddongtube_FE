import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
import { useAuthCheck } from "../hooks/auth/useAuthCheck";
import { getPlaylist, getPlaylistMeta, postPlaylistNowPlaying } from "../api/playlist";
import { Video } from "../types/video";
import ImageViewer from "../components/common/imageViewer";
import PlaylistDescription from "../components/common/playlistDescription";
import { ResponsiveContainer } from "../container/responsiveContainer";
import Card from "../components/common/card";
import FloatingButton from "../components/common/floatingButton";

import IconHome from "../assets/playlist/ic_home.svg?react";
import PlayNext from "../assets/playlist/ic_play_next.svg?react";
import IconHamburgerDisabled from "../assets/playlist/ic_hamburger_disabled.svg?react";

import { useDebouncedMutation } from "../hooks/react-query/useDebouncedMutation";
import { extractYoutubeVideoId } from "../utils/youtube";
import YoutubeEmbedPlayer from "../components/youtube/youtubeEmbedPlayer";
import PlaylistAddMusicModal from "../components/modal/playlistAddModal";
import * as Sentry from '@sentry/react';

const Playlist = () => {
    const { navigate, playlistCode, accessToken } = useAuthCheck();

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
        staleTime: 0,
    });

    const { thumbnailUrl } = playListMeta.result;

    const [isLive, setIsLive] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(playList?.result?.videoList?.findIndex((video: Video) => video.code === playList.result.nowPlayingVideoCode) ?? 0);

    const videoList = useMemo(() => {
        return playList?.result?.videoList?.sort((v1, v2) => v1.priority - v2.priority) || [];
    }, [playList?.result?.videoList]);

    const currentVideo = videoList[currentIndex];
    const currentVideoId = extractYoutubeVideoId(currentVideo?.url || "");

    const { mutateAsync: nextPlayPost } = useDebouncedMutation(
        {
            mutationFn: ({
                playlistCode,
                videoCode,
            }: {
                playlistCode: string;
                videoCode: string;
            }) => postPlaylistNowPlaying(playlistCode, videoCode),
            onSuccess: (data) => {
                if (!isLive) {
                    setCurrentIndex((prevIndex) => (prevIndex + 1) % videoList.length);
                }
            },
            onError: (error) => {
                console.error(error);
            },
        },
        500,
        true
    );

    const handleNextVideo = useCallback(
        (touchedIndex: number = -1) => {
            const nextVideo =
                touchedIndex === -1
                    ? videoList[(currentIndex + 1) % videoList.length]
                    : videoList[touchedIndex];
            if (!nextVideo) return;

            const nextVideoCode = nextVideo.code;
            if (nextVideoCode) {
                nextPlayPost({ playlistCode, videoCode: nextVideoCode }).then(() => {
                    if (!isLive) {
                        if (touchedIndex === -1) {
                            setCurrentIndex((prevIndex) => (prevIndex + 1) % videoList.length);
                        } else {
                            setCurrentIndex(touchedIndex);
                        }
                    }
                });
            }
        },
        [currentIndex, videoList, playlistCode, isLive, nextPlayPost]
    );

    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectAttemptRef = useRef(0);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!playlistCode || !accessToken) return;

        let fullURL = `${import.meta.env.VITE_REACT_SERVER_BASE_URL}/sse/${playlistCode}/connect`;
        const EventSourceImpl = EventSourcePolyfill || NativeEventSource;

        const maxReconnectAttempts = 5;

        const connect = () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }

            eventSourceRef.current = new EventSourceImpl(fullURL, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                heartbeatTimeout: 30 * 60 * 1000,
            });

            eventSourceRef.current.addEventListener("connect", () => {
                setIsLive(true);
                reconnectAttemptRef.current = 0;
            });

            eventSourceRef.current.addEventListener("video", (message: MessageEvent) => {
                queryClient.invalidateQueries({
                    queryKey: ["playlist", playlistCode],
                });
                queryClient.invalidateQueries({
                    queryKey: ["playlistMeta", playlistCode],
                });
            });

            eventSourceRef.current.addEventListener("playing", (message: MessageEvent) => {
                const data = JSON.parse(message.data);
                if (data?.code) {
                    const videoCode = data.code;
                    const videoIndex = videoList.findIndex((video: Video) => video.code === videoCode);
                    if (videoIndex !== -1) {
                        setCurrentIndex(videoIndex);
                    }
                }
            });

            eventSourceRef.current.onerror = function (error) {
                eventSourceRef.current?.close();
                setIsLive(false);
                Sentry.withScope((scope) => {
                    scope.setContext("SSE", {
                        playlistCode,
                    });
                    scope.setTag("errorType", "SSE Error");
                    scope.setTag("errorCode", "SSE000");
                    Sentry.captureException(error);
                });

                if (reconnectAttemptRef.current < maxReconnectAttempts) {
                    reconnectAttemptRef.current++;
                    const backoffTime = Math.min(1000 * Math.pow(2, reconnectAttemptRef.current - 1), 16000);

                    if (reconnectTimeoutRef.current) {
                        clearTimeout(reconnectTimeoutRef.current);
                    }

                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, backoffTime);
                } else {
                    // SSE 포기
                    throw new Error("SSE connection failed after multiple attempts");
                }
            };
        };

        connect();

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
            setIsLive(false);
            console.log("SSE connection closed due to component unmount");
        };
    }, [playlistCode]);

    const [isAddMusicModalOpen, setIsAddMusicModalOpen] = useState(false);

    const openAddMusicModal = useCallback(() => {
        setIsAddMusicModalOpen(true);
    }, []);

    const closeAddMusicModal = useCallback(() => {
        setIsAddMusicModalOpen(false);
    }, []);

    return (
        <ResponsiveContainer style={{ overflowY: "auto" }}>

            <nav className="relative flex items-center justify-center mt-[10%] py-3 w-full">
                <div className="absolute left-0" onClick={() => navigate("/home")}>
                    <IconHome />
                </div>
                <h1 className={`text-text-medium-sm font-semibold text-center transition-colors duration-300 ${isLive ? "text-main" : "text-font-disabled"}`}>
                    {isLive ? "🟢 함께 보고 있어요" : "혼자 보고 있어요 😶"}
                </h1>
            </nav>

            <section key={`${playlistCode}-image`} className="flex flex-col items-start justify-center w-full mt-3 mb-8">
                {currentVideoId ? (
                    <YoutubeEmbedPlayer
                        videoId={currentVideoId}
                        onPause={() => console.log("⏸사용자 일시정지")}
                        onEnded={() => handleNextVideo()}
                    />
                ) : (
                    <ImageViewer src={thumbnailUrl} />
                )}
                <div className="flex flex-row items-end justify-center w-full my-3">
                    <PlaylistDescription
                        title={videoList[currentIndex]?.title ?? "영상 없음"}
                        description={videoList[currentIndex]?.authorName ?? "영상이 없습니다"}
                    />
                    <button onClick={() => handleNextVideo()}>
                        <PlayNext />
                    </button>
                </div>
                <Card>
                    <p className="text-text-medium-md font-medium text-font-enabled">
                        {videoList[currentIndex]?.description === "" || !videoList[currentIndex]?.description
                            ? "상세 설명이 없습니다."
                            : videoList[currentIndex].description}
                    </p>
                </Card>
            </section>

            <div className="flex flex-col items-start justify-center w-full">
                <nav className="flex flex-row items-start justify-center w-full">
                    <label className="w-full text-head-medium-bold font-bold text-font-enabled text-left ml-1 mt-5 mb-3">
                        재생목록
                    </label>
                </nav>
                <div className="flex flex-col items-start justify-center w-full gap-2">
                    {videoList.length > 0 ? (
                        videoList.map((item, index) => (
                            <Card
                                key={item.code}
                                className={`playlist-card transition-all duration-300 border-[1px] ${index === currentIndex ? "border-main" : "border-stroke-2"
                                    }`}
                                onClick={() => handleNextVideo(index)}
                            >
                                <section className="flex flex-row items-center justify-between w-full">
                                    <article className="flex flex-col items-start justify-center w-full text-left flex-1">
                                        <p
                                            className={`${index === currentIndex ? "text-font-enabled" : "text-font-disabled"
                                                } text-text-medium-md font-medium`}
                                        >
                                            {item.user.name}
                                        </p>
                                        <h1
                                            className={`${index === currentIndex ? "text-font-enabled" : "text-font-disabled"
                                                } text-text-large-bold font-bold`}
                                        >
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
                <footer className="flex flex-row items-center justify-between w-full mb-[30%]"></footer>
            </div>
            <FloatingButton
                playlistCode={playlistCode}
                playlistMeta={playListMeta.result}
                text="영상 추가하기"
                onMusicButtonClick={openAddMusicModal} />
            <PlaylistAddMusicModal
                isOpen={isAddMusicModalOpen}
                onClose={closeAddMusicModal}
                playlistCode={playlistCode}
            />
            {/* <Toast /> */}
        </ResponsiveContainer >
    );
};

export default Playlist;
