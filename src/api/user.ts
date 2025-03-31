import { postFetch } from "./fetch/client";
import { PostUserRequest } from "./type/request/user";
import { PostUserResponse } from "./type/response/user";

export const postUser = (playlistCode : string, body: PostUserRequest): Promise<PostUserResponse | {}> => {
    return postFetch(`/user/${playlistCode}`, body).then(res => res ?? false)
};