import { create } from 'zustand';
import { PlayList } from '../../types/playlist';

interface PlaylistDataStore {
    playlist: PlayList | undefined;
    setPlaylist: (playlist: Partial<PlayList>) => void;
    resetPlaylist: () => void;
}

const usePlaylistData = create<PlaylistDataStore>((set, get) => ({
    playlist: undefined,
    setPlaylist: (newData) =>
        set(() => {
            const current = get().playlist ?? {};
            return {
                playlist: { ...current, ...newData } as PlayList,
            };
        }),
    resetPlaylist: () => set({ playlist: undefined }),
}));

export default usePlaylistData;