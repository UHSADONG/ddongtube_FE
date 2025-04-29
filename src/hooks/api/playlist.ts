import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useDebouncedMutation } from "@/hooks/react-query/useDebouncedMutation";
import { getPlaylist, getPlaylistMeta, postPlaylistNowPlaying } from "@/api/playlist";
import { deleteVideo } from "@/api/video";
import { Video } from "@/types/video";

interface UsePlaylistMetaResult {
  thumbnailUrl: string;
}

export const usePlaylistMeta = (playlistCode: string): UsePlaylistMetaResult => {
  const { data } = useSuspenseQuery({
    queryKey: ["playlistMeta", playlistCode],
    queryFn: () => getPlaylistMeta(playlistCode),
  });

  return { thumbnailUrl: data.result.thumbnailUrl };
};

interface UsePlaylistVideosResult {
  videoList: Video[];
  nowPlayingIndex: number;
  setNowPlayingIndex: (index: number) => void;
}

export const usePlaylistVideos = (playlistCode: string): UsePlaylistVideosResult => {
  const queryClient = useQueryClient();

  const { data } = useSuspenseQuery({
    queryKey: ["playlist", playlistCode],
    queryFn: () => getPlaylist(playlistCode),
    retry: 1,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const videoList: Video[] = data.result.videoList ?? [];
  const nowPlayingIndex =
    videoList.findIndex((v) => v.code === data.result.nowPlayingVideoCode) ?? 0;

  const setNowPlayingIndex = (index: number) => {
    queryClient.setQueryData(["playlist", playlistCode], (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        result: {
          ...oldData.result,
          nowPlayingVideoCode: videoList[index]?.code,
        },
      };
    });
  };

  return { videoList, nowPlayingIndex, setNowPlayingIndex };
};

interface UsePlaylistActionsResult {
  playNext: (args: { videoCode: string; isAuto?: boolean }) => Promise<boolean | {}>;
  removeVideo: (args: { videoCode: string }) => Promise<boolean | {}>;
}

export const usePlaylistActions = (playlistCode: string): UsePlaylistActionsResult => {
  const queryClient = useQueryClient();

  const { mutateAsync: playNext } = useDebouncedMutation(
    {
      mutationFn: ({
        videoCode,
        isAuto = false,
      }: {
        videoCode: string;
        isAuto?: boolean;
      }) => postPlaylistNowPlaying(playlistCode, videoCode, isAuto),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["playlist", playlistCode] });
      },
    },
    500,
    true
  );

  const { mutateAsync: removeVideo } = useDebouncedMutation(
    {
      mutationFn: ({ videoCode }: { videoCode: string }) => deleteVideo(playlistCode, videoCode),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["playlist", playlistCode] });
      },
    },
    500,
    true
  );

  return { playNext, removeVideo };
};
