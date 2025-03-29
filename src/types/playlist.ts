import { Video } from "./video";

export type PlaylistMeta = {
    title : string;
    thumbnailUrl : string;
    owner : string;
    userList : string[];
    playlistCode ?: string;
}

export interface PlayList extends PlaylistMeta {
    videoList : Video[];
}