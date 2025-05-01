import { PlayList } from '@/types/playlist';

export type GetPlaylistMetaResponse = {
  result: Exclude<PlayList, 'playlistCode'>;
};

export type GetPlaylistResponse = {
  result: Pick<PlayList, 'title' | 'videoList'> & {
    nowPlayingVideoCode: string;
  };
};

export type PatchPlaylistPriorityResponse = {
  result: {
    conflict: boolean;
    videoCode: string;
    newPriority: number;
    oldPriority: number;
  };
};
