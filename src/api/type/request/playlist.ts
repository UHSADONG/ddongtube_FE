export type PostPlaylistRequest = {
    userName: string;
    playlistTitle: string;
    playlistDescription : string;
    thumbnailUrl: string;
    userPassword: string;
}
// Multipart/form-data
export type PostPlaylistThumbnailRequest = {
    file : File;
}