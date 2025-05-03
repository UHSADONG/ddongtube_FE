import { deleteFetch, postFetch, patchFetch } from '@/api/fetch/client';
import { PostVideoRequest } from '@/api/type/request/video';
import { PatchPlaylistPriorityResponse } from '@/api/type/response/video';

export const postVideo = (
  playlistCode: string,
  body: PostVideoRequest,
): Promise<boolean | object> => {
  return postFetch(`/video/${playlistCode}`, body).then((res) => res ?? false);
};

export const deleteVideo = (playlistCode: string, videoCode: string): Promise<boolean | object> => {
  return deleteFetch(`/video/${playlistCode}/${videoCode}`).then((res) => res ?? false);
};

export const patchPlaylistPriority = (
  playlistCode: string,
  videoCode: string,
  targetVideoCode: string,
  positionBefore: boolean,
): Promise<PatchPlaylistPriorityResponse> => {
  const query = `?targetVideoCode=${encodeURIComponent(targetVideoCode)}&positionBefore=${positionBefore}`;
  return patchFetch<PatchPlaylistPriorityResponse, undefined>(
    `/video/${playlistCode}/${videoCode}/priority${query}`,
    undefined,
  );
};
