import { postFetch, postFormFetch } from "./fetch/client"
import { transformPlaylistThumbnail } from "./transformer/playlist"
import { PostPlaylistRequest, PostPlaylistThumbnailRequest } from "./type/request/playlist";
import { PostPlaylistResponse } from "./type/response/playlist";

export const postPlaylistThumbnail = (
    {file} : PostPlaylistThumbnailRequest
) : Promise<{result: string} | boolean> => {

    const formData = transformPlaylistThumbnail(file);
    
    return postFormFetch<{ result: string }>("/playlist/thumbnail", formData).then(res => res ?? false);
}

export const postPlaylist = (body: PostPlaylistRequest): Promise<PostPlaylistResponse | boolean> => {
    return postFetch<PostPlaylistResponse, string>("/playlist", body).then(res => res ?? false)
};