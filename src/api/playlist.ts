import { deleteFetch, getFetch, postFetch, postFormFetch } from "@/api/fetch/client"
import { transformPlaylistThumbnail, transformPlaylist } from '@/api/transformer/playlist';
import { PostPlaylistRequest, PostPlaylistThumbnailRequest } from "@/api/type/request/playlist";
import { GetPlaylistMetaResponse, PostPlaylistResponse } from "@/api/type/response/playlist";
import { GetPlaylistResponse } from "@/api/type/response/video";

export const getPlaylistMeta = (playlistCode : string) : Promise<GetPlaylistMetaResponse> => {
    return getFetch<GetPlaylistMetaResponse>(`/playlist/meta/${playlistCode}`).then(res => res ?? false);
}


export const getPlaylistMetaPublic = (playlistCode : string) : Promise<GetPlaylistMetaResponse> => {
    return getFetch<GetPlaylistMetaResponse>(`/playlist/meta/${playlistCode}/public`).then(res => res ?? false);
}

export const getPlaylist = (playlistCode : string) : Promise<GetPlaylistResponse> => {
    return getFetch<GetPlaylistResponse>(`/playlist/${playlistCode}`).then(res => transformPlaylist(res) ?? false);
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


export const postPlaylistNowPlaying = (playlistCode: string, videoCode : string, isAuto: boolean = false): Promise<boolean | {}> => {
    return postFetch<boolean, string>(`/playlist/${playlistCode}/now-playing?videoCode=${videoCode}&autoPlay=${isAuto}`).then(res => res ?? false)
}

export const deletePlaylist = (playlistCode: string): Promise<boolean | {}> => {
    return deleteFetch(`/playlist/${playlistCode}`).then(res => res ?? false)
}
