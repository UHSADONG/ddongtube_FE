export const transformPlaylistThumbnail = (file : File) => {
    const formData = new FormData();
    formData.append("file", file);
    return formData;
}