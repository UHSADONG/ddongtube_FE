import { postFetch, postFormFetch } from "./fetch/client"
import { transformPlaylistThumbnail } from "./transformer/playlist"
import { PostPlaylistRequest, PostPlaylistThumbnailRequest } from "./type/request/playlist";
import { PostPlaylistResponse } from "./type/response/playlist";

export const postPlaylistThumbnail = (
    {file} : PostPlaylistThumbnailRequest
) : Promise<{result: string} | boolean> => {

    const formData = transformPlaylistThumbnail(file);
    
    return postFormFetch<{ result: string }>("/playlist/thumbnail", formData).then(res => res ?? false).catch((err)=>
        {
            throw new Error("[POST] 썸네일 업로드 실패 : " + err)
        }
    );
}

export const postPlaylist = (body: PostPlaylistRequest): Promise<PostPlaylistResponse | boolean> => {
    return postFetch<PostPlaylistResponse, string>("/playlist", body).then(res => res ?? false).catch((err) =>
        {
            throw new Error("[POST] 플레이리스트 생성 실패 : " + err)
        }
    );
}