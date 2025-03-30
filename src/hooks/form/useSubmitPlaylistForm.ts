import { postPlaylist, postPlaylistThumbnail } from "../../api/playlist";
import { PostPlaylistRequest } from "../../api/type/request/playlist";
import { useDebouncedMutation } from "../react-query/useDebouncedMutation";

export const useSubmitPlaylistForm = () => {


  const {
    mutateAsync: uploadThumbnail,
    isPending: isUploadingThumbnail,
    error: thumbnailUploadError,
  } = useDebouncedMutation(
    {
      mutationFn: (file: File) => postPlaylistThumbnail({ file }),
    },
    500,
    true
  );

  const {
    mutateAsync: submitPlaylist,
    isPending: isSubmittingPlaylist,
    error: playlistSubmitError,
  } = useDebouncedMutation(
    {
      mutationFn: (payload : PostPlaylistRequest) => postPlaylist(payload),
    },
    500,
    true
  );

  const handleSubmitPlaylist = async (file: File, data: Omit<PostPlaylistRequest, "thumbnailUrl">) => {
    const uploadedImage = await uploadThumbnail(file);
    if (typeof uploadedImage !== 'object' || !uploadedImage.result) return false;

    const playlistData: PostPlaylistRequest = {
      ...data,
      thumbnailUrl: uploadedImage.result
    };

    const result = await submitPlaylist(playlistData);
    return result;
  };

  return {
    handleSubmitPlaylist,
    isUploadingThumbnail,
    isSubmittingPlaylist,
    thumbnailUploadError,
    playlistSubmitError,
  };
};