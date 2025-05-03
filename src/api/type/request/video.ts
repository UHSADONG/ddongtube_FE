export type PostVideoRequest = {
  videoUrl: string;
  videoDescription: string;
};

export type PatchPlaylistPriorityRequest = {
  playlistCode: string;
  videoCode: string;
  targetVideoCode: string;
  positionBefore: boolean;
};
