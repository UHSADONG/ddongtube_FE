import { getFetch, postFetch, postFormFetch } from "./fetch/client"
import { transformPlaylistThumbnail } from "./transformer/playlist"
import { PostPlaylistRequest, PostPlaylistThumbnailRequest } from "./type/request/playlist";
import { GetPlaylistMetaResponse, PostPlaylistResponse } from "./type/response/playlist";

export const getPlaylistMeta = (playlistCode : string) : Promise<GetPlaylistMetaResponse> => {
    return getFetch<GetPlaylistMetaResponse>(`/playlist/meta/${playlistCode}`).then(res => res ?? false);
}

export const postPlaylistThumbnail = (
    {file} : PostPlaylistThumbnailRequest
) : Promise<{result: string} | boolean> => {

    const formData = transformPlaylistThumbnail(file);

    
    return postFormFetch<{ result: string }>("/playlist/thumbnail", formData).then(res => res ?? false);
}

export const postPlaylist = (body: PostPlaylistRequest): Promise<PostPlaylistResponse | boolean> => {
    return postFetch<PostPlaylistResponse, string>("/playlist", body).then(res => res ?? false)
};