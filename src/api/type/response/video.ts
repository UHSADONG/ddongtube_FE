import { PlayList } from "../../../types/playlist";

export type GetPlaylistMetaResponse = {
    result : Exclude<PlayList, "playlistCode">;
}

export type GetPlaylistResponse = {
    
    result: Pick<PlayList, 'title' | 'videoList'> & {
        nowPlayingVideoCode: string;
    }
}