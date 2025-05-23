import { PlaylistMeta, PlaylistHealth } from '@/types/playlist';

export type PostPlaylistResponse = {
  result: {
    playlistCode: string;
    accessToken: string;
  };
};

export type GetPlaylistMetaResponse = {
  result: Exclude<PlaylistMeta, 'playlistCode'>;
};

export type GetPlaylistMetaPulicResponse = {
  result: Exclude<PlaylistMeta, 'playlistCode' | 'userList' | 'owner'>;
};

export type GetPlaylistHealthResponse = {
  result: {
    health: PlaylistHealth;
  };
};
