import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { useDebouncedMutation } from '@/hooks/react-query/useDebouncedMutation';
import { getPlaylist, getPlaylistMeta, postPlaylistNowPlaying } from '@/api/playlist';
import { deleteVideo } from '@/api/video';
import { Video } from '@/types/video';
import { usePlaylistContext } from '@/providers/PlaylistProvider';
import { useEffect } from 'react';

interface UsePlaylistMetaResult {
  thumbnailUrl: string;
}

export const usePlaylistMeta = (playlistCode: string): UsePlaylistMetaResult => {
  const { data } = useSuspenseQuery({
    queryKey: ['playlistMeta', playlistCode],
    queryFn: () => getPlaylistMeta(playlistCode),
  });

  return { thumbnailUrl: data.result.thumbnailUrl };
};

interface UsePlaylistVideosResult {
  videoList: Video[];
}

export const usePlaylistVideos = (playlistCode: string): UsePlaylistVideosResult => {
  const { dispatch } = usePlaylistContext();

  const { data } = useSuspenseQuery({
    queryKey: ['playlist', playlistCode],
    queryFn: () => getPlaylist(playlistCode),
    retry: 1,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const videoList: Video[] = data.result.videoList ?? [];

  useEffect(() => {
    const nowPlayingVideoCode = data.result.nowPlayingVideoCode;
    dispatch({ type: 'SET_CURRENT_VIDEO_CODE', videoCode: nowPlayingVideoCode });
  }, []);

  return { videoList };
};

interface UsePlaylistActionsResult {
  playNext: (args: { videoCode: string; isAuto?: boolean }) => Promise<boolean | {}>;
  removeVideo: (args: { videoCode: string }) => Promise<boolean | {}>;
}

export const usePlaylistActions = (playlistCode: string): UsePlaylistActionsResult => {
  const queryClient = useQueryClient();

  const { mutateAsync: playNext } = useDebouncedMutation({
    mutationFn: ({ videoCode, isAuto = false }: { videoCode: string; isAuto?: boolean }) =>
      postPlaylistNowPlaying(playlistCode, videoCode, isAuto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlist', playlistCode] });
    },
  });

  const { mutateAsync: removeVideo } = useDebouncedMutation({
    mutationFn: ({ videoCode }: { videoCode: string }) => deleteVideo(playlistCode, videoCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlist', playlistCode] });
    },
  });

  return { playNext, removeVideo };
};
