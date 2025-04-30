import React from 'react'
import Card from '../common/card'
import { Video } from '@/types/video'
import { usePlaylistContext } from '@/providers/PlaylistProvider';
import IconDelete from '@/assets/playlist/ic_delete.svg?react';
import IconHamburgerDisabled from '@/assets/playlist/ic_hamburger_disabled.svg?react';
import { useAuthCheck } from '@/hooks/auth/useAuthCheck';
import { usePlaylistActions } from '@/hooks/api/playlist';

type PlaylistListProps = {
    videoList: Video[];
    openSuccessToast: (message: string) => void;
    handleNextVideo: (index?: number, isAutoPlay?: boolean) => void;
}

const PlaylistList = ({
    videoList,
    openSuccessToast,
    handleNextVideo
}: PlaylistListProps) => {

    const { isAdmin, nickname, playlistCode } = useAuthCheck();
    const { currentIndex, isDeleteMode } = usePlaylistContext();

    if (!playlistCode) return null;

    const { removeVideo } = usePlaylistActions(playlistCode);

    const handleVideoDelete = (e: React.MouseEvent<SVGSVGElement, MouseEvent>, item: Video) => {
        e.stopPropagation();
        if (item.code === videoList[currentIndex]?.code) {
            openSuccessToast('현재 재생 중인 영상은 삭제할 수 없습니다.');
            return;
        }
        if (isAdmin || item.user.name === nickname) {
            if (confirm('정말 삭제하시겠습니까?')) {
                removeVideo({ videoCode: item.code });
            }
        } else {
            openSuccessToast('본인 영상만 삭제할 수 있습니다.');
        }
    };

    return (
        <div className="flex flex-col items-start justify-center w-full gap-2">
            {videoList.length > 0 ? (
                videoList.map((video, index) => (
                    <Card
                        key={video.code}
                        className={`playlist-card transition-all duration-300 border-[1px] ${videoList[currentIndex]?.code === video.code ? "border-main" : "border-stroke-2"
                            }`}
                        onClick={isDeleteMode ? () => openSuccessToast("편집 중에는 영상을 변경할 수 없습니다.") : () => handleNextVideo(index)}
                    >
                        <section className="flex flex-row items-center justify-between w-full">
                            <article className="flex flex-col items-start justify-center w-full text-left flex-1">
                                <div className="flex flex-row items-center justify-start w-full gap-2">
                                    <p
                                        className={`${videoList[currentIndex]?.code === video.code ? "text-font-enabled" : "text-font-disabled"
                                            } text-text-medium-md font-medium`}
                                    >
                                        {video.user.name}
                                    </p>
                                    {
                                        videoList[currentIndex]?.code === video.code && (
                                            <p
                                                className={`text-text-medium-md font-semibold text-main animate-pulse`}
                                            >
                                                현재 재생 중
                                            </p>
                                        )
                                    }

                                </div>

                                <h1
                                    className={`${videoList[currentIndex]?.code === video.code ? "text-font-enabled" : "text-font-disabled"
                                        } text-text-large-bold font-bold`}
                                >
                                    {video.title}
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
                                    onClick={(e) => handleVideoDelete(e, video)}
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
    )
}

export default PlaylistList