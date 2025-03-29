import { PlayList } from "../../../types/playlist";

export type GetPlaylistMetaResponse = {
    result : Exclude<PlayList, "playlistCode">;
}