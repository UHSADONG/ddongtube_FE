import { useDebouncedMutation } from '@/hooks/react-query/useDebouncedMutation';
import { patchPlaylistPriority } from '@/api/video';
import { PatchPlaylistPriorityResponse } from '@/api/type/response/video';

export const usePatchPlaylistPriority = () => {
  const { mutateAsync } = useDebouncedMutation<
    PatchPlaylistPriorityResponse,
    unknown,
    [string, string, string, boolean],
    unknown
  >({
    mutationFn: ([playlistCode, videoCode, targetVideoCode, positionBefore]) =>
      patchPlaylistPriority(playlistCode, videoCode, targetVideoCode, positionBefore),
  });
  return mutateAsync;
};
