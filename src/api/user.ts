import { postFetch } from '@/api/fetch/client';
import { PostUserRequest } from '@/api/type/request/user';
import { PostUserResponse } from '@/api/type/response/user';

export const postUser = (
  playlistCode: string,
  body: PostUserRequest,
): Promise<PostUserResponse | object> => {
  return postFetch(`/user/${playlistCode}`, body).then((res) => res ?? false);
};
