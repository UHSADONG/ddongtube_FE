import { useCallback, useEffect, useRef, useState } from "react";
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
import IconDelete from '../assets/playlist/ic_delete.svg?react';

import { useDebouncedMutation } from "../hooks/react-query/useDebouncedMutation";
import { extractYoutubeVideoId } from "../utils/youtube";
import YoutubeEmbedPlayer from "../components/youtube/youtubeEmbedPlayer";
import PlaylistAddMusicModal from "../components/modal/playlistAddModal";
import * as Sentry from '@sentry/react';
import { useToast } from "../hooks/useToast";
import { deleteVideo } from '../api/video';
import { getSessionStorage } from "../utils/sessionStorage";

const Playlist = () => {

    const queryClient = useQueryClient();
    const { navigate, playlistCode, accessToken, isAdmin, nickname } = useAuthCheck();

    if (!playlistCode) {
        return null;
    }

    const { data: playListMeta } = useSuspenseQuery({
        queryKey: ["playlistMeta", playlistCode],
        queryFn: () => getPlaylistMeta(playlistCode),
    });

    const { data: playList } = useSuspenseQuery({
        queryKey: ["playlist", playlistCode],
        queryFn: () => getPlaylist(playlistCode),
        retry: 1,
        refetchOnWindowFocus: true,
        staleTime: 0
    });

    const { thumbnailUrl } = playListMeta.result;
    const { videoList = [] } = playList.result;

    const [isLive, setIsLive] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(playList?.result?.videoList?.findIndex((video: Video) => video.code === playList.result.nowPlayingVideoCode) ?? 0);
    const [currentListener, setCurrentListener] = useState(-1);

    const { mutateAsync: nextPlayPost } = useDebouncedMutation(
        {
            mutationFn: ({
                playlistCode,
                videoCode,
                isAuto = false,
            }: {
                playlistCode: string;
                videoCode: string;
                isAuto?: boolean;
            }) => postPlaylistNowPlaying(playlistCode, videoCode, isAuto),
            onSuccess: (data) => {
                if (!isLive) {
                    setCurrentIndex((prevIndex) => (prevIndex + 1) % videoList?.length);
                }
            },
            onError: (error) => {
                console.error(error);
            },
        },
        500,
        true
    );

    const {
        mutateAsync: _deleteVideo,
    } = useDebouncedMutation(
        {
            mutationFn: ({
                playlistCode,
                videoCode,
            }: {
                playlistCode: string;
                videoCode: string;
            }) => deleteVideo(playlistCode, videoCode),
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
    )

    const handleNextVideo = useCallback(
        (touchedIndex: number = -1, isAuto = false) => {

            const nextVideo =
                touchedIndex === -1
                    ? videoList[(currentIndex + 1) % videoList.length]
                    : videoList[touchedIndex];
            if (!nextVideo) return;

            const nextVideoCode = nextVideo.code;
            if (nextVideoCode) {
                nextPlayPost({ playlistCode, videoCode: nextVideoCode, isAuto }).then(() => {
                    // openSuccessToast("영상이 변경이 요청되었습니다.");
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

    const videoListRef = useRef(videoList);

    useEffect(() => {
        videoListRef.current = videoList;
    }, [videoList]);

    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectAttemptRef = useRef(0);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const sixteenCountRef = useRef(0);

    useEffect(() => {
        if (!playlistCode || !accessToken) return;

        let fullURL = `${import.meta.env.VITE_REACT_SERVER_BASE_URL}/sse/${playlistCode}/connect`;
        const EventSourceImpl = EventSourcePolyfill || NativeEventSource;

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

            eventSourceRef.current.addEventListener("connect", (message: MessageEvent) => {
                setIsLive(true);
                const data = JSON.parse(message.data);
                setCurrentListener(data.clientCount);
                reconnectAttemptRef.current = 0;
            });

            eventSourceRef.current.addEventListener("video", (message: MessageEvent) => {
                const data = JSON.parse(message.data);

                if (data?.status === "DELETE") {
                    queryClient.setQueryData(["playlist", playlistCode], (oldData: any) => {
                        const updatedVideoList = oldData.result.videoList.filter((video: Video) => video.code !== data.videoCode);
                        return {
                            ...oldData,
                            result: {
                                ...oldData.result,
                                videoList: [...updatedVideoList],
                            },
                        };
                    }
                    );

                    openSuccessToast("영상이 삭제되었습니다.");
                }
                if (data.status === "ADD") {
                    queryClient.setQueryData(["playlist", playlistCode], (oldData: any) => {
                        const updatedVideoList = [...oldData.result.videoList, data.video];
                        return {
                            ...oldData,
                            result: {
                                ...oldData.result,
                                videoList: updatedVideoList,
                            },
                        };
                    });
                    openSuccessToast("영상이 추가되었습니다.");
                }
            });

            eventSourceRef.current.addEventListener("enter", (message: MessageEvent) => {
                const data = JSON.parse(message.data);
                if (data?.clientCount) {
                    setCurrentListener(data.clientCount);
                }
                if (data?.userName) {
                    openSuccessToast(`${data.userName}님이 입장하셨습니다.`);
                }
            })

            eventSourceRef.current.addEventListener("playing", (message: MessageEvent) => {
                const data = JSON.parse(message.data);
                if (data?.videoCode && data?.userName) {

                    const videoCode = data.videoCode;
                    const videoIndex = videoListRef.current.findIndex((video: Video) => video.code === videoCode);
                    if (!data?.autoPlay) {
                        openSuccessToast(`${data.userName}님이 ${videoListRef.current[videoIndex]?.title}로 변경하였습니다.`);
                    }
                    if (videoIndex !== -1) {
                        setCurrentIndex(videoIndex);
                    }
                }


            });

            eventSourceRef.current.addEventListener("ping", (message) => {
                const data = JSON.parse(message.data);
                if (data?.clientCount) {
                    setCurrentListener(data.clientCount);
                }
            })

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
                reconnectAttemptRef.current++;
                const calculatedTimeSec = Math.pow(2, reconnectAttemptRef.current);
                const backoffTimeSec = Math.min(calculatedTimeSec, 16);
                const backoffTimeMs = backoffTimeSec * 1000;

                if (backoffTimeSec === 16) {
                    sixteenCountRef.current++;
                } else {
                    sixteenCountRef.current = 0;
                }

                if (sixteenCountRef.current >= 10) {
                    throw new Error("SSE connection failed after multiple attempts");
                }

                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                }

                reconnectTimeoutRef.current = setTimeout(() => {
                    connect();
                }, backoffTimeMs);
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
        };
    }, [playlistCode]);

    const [isAddMusicModalOpen, setIsAddMusicModalOpen] = useState(false);

    const openAddMusicModal = useCallback(() => {
        setIsAddMusicModalOpen(true);
    }, []);

    const closeAddMusicModal = useCallback(() => {
        setIsAddMusicModalOpen(false);
    }, []);

    const {
        openSuccessToast,
        ToastPortal, } = useToast();

    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const toggleDeleteMode = useCallback(() => {
        setIsDeleteMode((prev) => !prev);
    }, []);

    const hanldeVideoDelete = (e: Event, item: Video) => {
        e.stopPropagation();
        if (item.code === videoList[currentIndex].code) {
            openSuccessToast("현재 재생 중인 영상은 삭제할 수 없습니다.");
            return;
        }
        if (isAdmin || item.user.name === nickname) {
            if (confirm("정말 삭제하시겠습니까?")) {
                const videoCode = item.code;
                if (videoCode) {
                    _deleteVideo({ playlistCode, videoCode }).then(() => {

                    });
                }
            }
        } else {
            openSuccessToast("본인 영상만 삭제할 수 있습니다.");
        }
    }

    return (
        <ResponsiveContainer style={{ overflowY: "auto" }}>
            <nav className="relative flex items-center justify-center mt-[10%] py-3 w-full">
                <div className="absolute left-0" onClick={() => navigate("/home")}>
                    <IconHome />
                </div>
                <div className="flex-1 flex-row w-full text-center justify-center items-center inline-block">
                    <h1 className={`text-text-medium-sm font-bold text-center transition-colors duration-300 text-main`}>
                        {`${getSessionStorage()?.nickname}님${isLive ? '과' : '은'}`}
                    </h1>
                    <h1 className={`text-text-medium-sm font-semibold text-center transition-colors duration-300 text-font-disabled`}>
                        {isLive ? currentListener !== -1 ? ` ${currentListener}명이 같이 듣고 있어요!` : "같이 듣고 있어요!" : "실시간이 아닙니다."}
                    </h1>
                </div>

            </nav>

            <section key={`${playlistCode}-image`} className="flex flex-col items-start justify-center w-full mt-3 mb-8">
                {extractYoutubeVideoId(videoList[currentIndex]?.url || "") ? (
                    <YoutubeEmbedPlayer
                        videoId={extractYoutubeVideoId(videoList[currentIndex]?.url || "") ?? ""}
                        onPause={() => console.log("⏸사용자 일시정지")}
                        onEnded={() => handleNextVideo(-1, true)}
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
                <nav className="flex flex-row items-center justify-between w-full h-full">
                    <label className="text-head-medium-bold font-bold text-font-enabled text-left ml-1 mt-5 mb-3">
                        재생목록
                    </label>
                    <button className="text-text-medium-sm text-font-disabled font-medium pt-5 pb-3 underline underline-offset-2 pl-3 pr-3"
                        onClick={toggleDeleteMode}>편집</button>
                </nav>
                <div className="flex flex-col items-start justify-center w-full gap-2">
                    {videoList.length > 0 ? (
                        videoList.map((item, index) => (
                            <Card
                                className={`playlist-card transition-all duration-300 border-[1px] ${videoList[currentIndex]?.code === item.code ? "border-main" : "border-stroke-2"
                                    }`}
                                onClick={isDeleteMode ? () => openSuccessToast("편집 중에는 영상을 변경할 수 없습니다.") : () => handleNextVideo(index)}
                            >
                                <section className="flex flex-row items-center justify-between w-full">
                                    <article className="flex flex-col items-start justify-center w-full text-left flex-1">
                                        <div className="flex flex-row items-center justify-start w-full gap-2">
                                            <p
                                                className={`${videoList[currentIndex]?.code === item.code ? "text-font-enabled" : "text-font-disabled"
                                                    } text-text-medium-md font-medium`}
                                            >
                                                {item.user.name}
                                            </p>
                                            {
                                                videoList[currentIndex]?.code === item.code && (
                                                    <p
                                                        className={`text-text-medium-md font-semibold text-main animate-pulse`}
                                                    >
                                                        현재 재생 중
                                                    </p>
                                                )

                                            }

                                        </div>

                                        <h1
                                            className={`${videoList[currentIndex]?.code === item.code ? "text-font-enabled" : "text-font-disabled"
                                                } text-text-large-bold font-bold`}
                                        >
                                            {item.title}
                                        </h1>
                                    </article>
                                    <div className="relative w-6 h-6 overflow-hidden">
                                        <IconDelete
                                            className={`
                                                    absolute top-0 left-0
                                                    transition-all duration-300
                                                    ${isDeleteMode
                                                    ? 'translate-x-0 opacity-100'
                                                    : 'translate-x-full opacity-0'
                                                }
                                            `}
                                            onClick={(e) => hanldeVideoDelete(e, item)}
                                        />
                                        <IconHamburgerDisabled
                                            className={`
                                                    absolute top-0 left-0
                                                    transition-all duration-300
                                                    ${isDeleteMode
                                                    ? 'translate-x-full opacity-0'
                                                    : 'translate-x-0 opacity-100'
                                                }
                                            `}
                                        />
                                    </div>
                                </section>
                            </Card>
                        ))
                    ) : (
                        <p className="w-full text-left text-text-medium-sm text-font-disabled font-medium ml-1">
                            재생목록이 없습니다.
                        </p>
                    )}
                </div>
                <footer className="flex flex-row items-center justify-between w-full mb-[30%] max-sm:mb-[50%]"></footer>
            </div>
            <FloatingButton
                playlistCode={playlistCode}
                playlistMeta={playListMeta.result}
                openToast={openSuccessToast}
                text="영상 추가하기"
                onMusicButtonClick={openAddMusicModal} />
            <PlaylistAddMusicModal
                openToast={() => { }}
                isOpen={isAddMusicModalOpen}
                onClose={closeAddMusicModal}
                playlistCode={playlistCode}
            />
            {ToastPortal}
        </ResponsiveContainer >
    );
};

export default Playlist;
