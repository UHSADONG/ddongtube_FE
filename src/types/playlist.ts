import { Video } from "@/types/video";

export type PlaylistForm = {
    userName: string;
    playlistTitle: string;
    thumbnailUrl: string;
    userPassword?: string;
}

export type PlaylistMeta = {
    title : string;
    thumbnailUrl : string;
    owner : string;
    userList : string[];
    playlistCode ?: string;
    description : string;
}

export interface PlayList extends PlaylistMeta {
    videoList? : Video[];
}