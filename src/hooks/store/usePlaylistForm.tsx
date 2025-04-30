import { create } from 'zustand';
import { PlaylistForm } from '@/types/playlist';

interface PlaylistFormStore {
    playlistForm: Partial<PlaylistForm>;
    setPlaylistForm: (
        update: Partial<PlaylistForm> | ((prev: Partial<PlaylistForm>) => Partial<PlaylistForm>)
    ) => void;
    resetPlaylistForm: () => void;
}

const usePlaylistFormStore = create<PlaylistFormStore>((set) => ({
    playlistForm: {},
    setPlaylistForm: (update) =>
        set((state) => {
            const current = state.playlistForm;
            const newData =
                typeof update === "function" ? update(current) : update;
            return { playlistForm: { ...current, ...newData } };
        }),
    resetPlaylistForm: () => set({ playlistForm: {} }),
}));

export default usePlaylistFormStore;