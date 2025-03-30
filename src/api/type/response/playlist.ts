import { PlayList } from "../../../types/playlist";

export type PostPlaylistResponse = {
    playlistCode : string;
    accessToken : string;
}

export type GetPlaylistMetaResponse = {
    result : Exclude<PlayList, "playlistCode">;
}