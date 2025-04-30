import { useCallback } from 'react';
import { usePlaylistContext } from '@/providers/PlaylistProvider';

const PlaylistHeader = () => {

    const { dispatch } = usePlaylistContext();

    const toggleDeleteMode = useCallback(() => {
        dispatch({ type: 'TOGGLE_DELETE_MODE' });
    }, [dispatch]);

    return (
        <nav className="flex flex-row items-center justify-between w-full h-full">
            <label className="text-head-medium-bold font-bold text-font-enabled text-left ml-1 mt-5 mb-3">
                재생목록
            </label>
            <button
                className="text-text-medium-sm text-font-disabled font-medium pt-5 pb-3 underline underline-offset-2 pl-3 pr-3"
                onClick={toggleDeleteMode}>편집</button>
        </nav>
    )
}

export default PlaylistHeader