import React, { useRef } from 'react'
import { Video } from '@/types/video'
import { usePlaylistContext } from '@/providers/PlaylistProvider';
import { useAuthCheck } from '@/hooks/auth/useAuthCheck';
import { usePlaylistActions } from '@/hooks/api/playlist';
import { usePatchPlaylistPriority } from '@/hooks/api/video';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import autoAnimate from '@formkit/auto-animate';
import { useSortablePlaylist } from '@/hooks/playlist/useSortablePlaylist';
import SortableItem from '@/components/playlist/sortableItem';

type PlaylistListProps = {
    videoList: Video[];
    openSuccessToast: (message: string) => void;
}

const PlaylistList = ({
    videoList,
    openSuccessToast,
}: PlaylistListProps) => {
    const { isAdmin, nickname, playlistCode } = useAuthCheck();
    const { currentVideoCode, isDeleteMode, dispatch } = usePlaylistContext();
    const patchPlaylistPriority = usePatchPlaylistPriority();
    const { removeVideo, playNext } = usePlaylistActions(playlistCode || '');
    const listRef = useRef<HTMLDivElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const [localVideoList, handleDragEnd] = useSortablePlaylist({
        videoList,
        patchPlaylistPriority,
        playlistCode: playlistCode!,
        openSuccessToast,
        isAdmin,
    });

    React.useEffect(() => {
        if (listRef.current) {
            autoAnimate(listRef.current, {
                duration: 250,
                easing: 'ease-in-out',
            });
        }
    }, []);

    const handleCardClick = async (index: number) => {
        const video = localVideoList[index];
        if (!video) return;
        await playNext({ videoCode: video.code });
        dispatch({ type: 'SET_CURRENT_VIDEO_CODE', videoCode: video.code });
    };

    const handleVideoDelete = (e: React.MouseEvent<SVGSVGElement, MouseEvent>, item: Video) => {
        e.stopPropagation();
        if (item.code === currentVideoCode) {
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

    if (!playlistCode) return null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            autoScroll={true}
        >
            <SortableContext
                items={localVideoList.map(v => v.code)}
                strategy={verticalListSortingStrategy}
            >
                <div ref={listRef} className="flex flex-col items-start justify-center w-full gap-2">
                    {localVideoList.length > 0 ? (
                        localVideoList.map((video, index) => (
                            <SortableItem
                                key={video.code}
                                video={video}
                                index={index}
                                isPlaying={video.code === currentVideoCode}
                                isDeleteMode={isDeleteMode}
                                openSuccessToast={openSuccessToast}
                                handleCardClick={handleCardClick}
                                handleVideoDelete={handleVideoDelete}
                                disabled={false}
                            />
                        ))
                    ) : (
                        <p className="w-full text-left text-text-medium-sm text-font-disabled font-medium ml-1">
                            재생목록이 없습니다.
                        </p>
                    )}
                </div>
            </SortableContext>
        </DndContext>
    )
}

export default PlaylistList;