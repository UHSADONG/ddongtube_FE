import { GetPlaylistResponse } from "@/api/type/response/video";

export const transformPlaylistThumbnail = (file : File) => {
    const formData = new FormData();
    formData.append("file", file);
    return formData;
}

export const transformPlaylist = (data : GetPlaylistResponse) => {
    const videoList = data?.result?.videoList?.slice().sort((v1, v2) => v1.priority - v2.priority);

    return {
        ...data,
        result: {
            ...data.result,
            videoList: videoList ?? []
        },
    };
}