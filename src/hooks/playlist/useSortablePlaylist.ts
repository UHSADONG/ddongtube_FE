import { useState, useEffect, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core';
import { Video } from '@/types/video';
import { PatchPlaylistPriorityResponse } from '@/api/type/response/video';

export function useSortablePlaylist({
  videoList,
  patchPlaylistPriority,
  playlistCode,
  openSuccessToast,
  isAdmin,
}: {
  videoList: Video[];
  patchPlaylistPriority: (
    args: [string, string, string, boolean],
  ) => Promise<PatchPlaylistPriorityResponse>;
  playlistCode: string;
  openSuccessToast: (msg: string) => void;
  isAdmin: boolean;
}) {
  const [localVideoList, setLocalVideoList] = useState<Video[]>(videoList);

  useEffect(() => {
    setLocalVideoList(videoList);
  }, [videoList]);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      if (!isAdmin) {
        openSuccessToast('관리자만 순서를 변경할 수 있습니다.');
        return;
      }
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = localVideoList.findIndex((v) => v.code === active.id);
      const newIndex = localVideoList.findIndex((v) => v.code === over.id);

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

      setLocalVideoList((prevList) => arrayMove(prevList, oldIndex, newIndex));

      try {
        const positionBefore = oldIndex > newIndex;
        await patchPlaylistPriority([
          playlistCode,
          videoList[oldIndex].code,
          videoList[newIndex].code,
          positionBefore,
        ]);
      } catch {
        openSuccessToast('순서 변경에 실패했습니다.');
      }
    },
    [localVideoList, videoList, patchPlaylistPriority, playlistCode, openSuccessToast, isAdmin],
  );

  return [localVideoList, handleDragEnd, setLocalVideoList] as const;
}
