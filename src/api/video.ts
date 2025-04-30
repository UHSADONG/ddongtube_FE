import { deleteFetch, postFetch } from "@/api/fetch/client";
import { PostVideoRequest } from "@/api/type/request/video";

export const postVideo = (playlistCode : string, body: PostVideoRequest): Promise<boolean | {}> => {
    return postFetch(`/video/${playlistCode}`, body).then(res => res ?? false)
};

export const deleteVideo = (playlistCode : string, videoCode : string): Promise<boolean | {}> => {
    return deleteFetch(`/video/${playlistCode}/${videoCode}`).then(res => res ?? false)
};