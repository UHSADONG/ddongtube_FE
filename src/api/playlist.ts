import { postFetch, postFormFetch } from "./fetch/client"
import { transformPlaylistThumbnail } from "./transformer/playlist"
import { PostPlaylistRequest, PostPlaylistThumbnailRequest } from "./type/request/playlist";
import { PostPlaylistResponse } from "./type/response/playlist";

export const postPlaylistThumbnail = (
    {file} : PostPlaylistThumbnailRequest
) : Promise<{imageUrl: string} | boolean> => {

    const formData = transformPlaylistThumbnail(file);
    return postFormFetch<{ imageUrl: string }>("/playlist/thumbnail", formData).then(res => res ?? false).catch(()=>
        {throw new Error("[POST] 썸네일 업로드 실패")});
}

export const postPlaylist = (body: PostPlaylistRequest): Promise<PostPlaylistResponse | boolean> => {
    return postFetch<PostPlaylistResponse, PostPlaylistRequest>("/playlist", { data: body }).then(res => res ?? false).catch(() =>
        {throw new Error("[POST] 플레이리스트 생성 실패")});
}