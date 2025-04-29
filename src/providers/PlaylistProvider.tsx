import { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';

interface PlaylistState {
  currentIndex: number;
  isLive: boolean;
  listenerCount: number;
  isDeleteMode: boolean;
  isAddMusicModalOpen: boolean;
}

const initialState: PlaylistState = {
  currentIndex: 0,
  isLive: false,
  listenerCount: 0,
  isDeleteMode: false,
  isAddMusicModalOpen: false,
};


type PlaylistAction =
  | { type: 'SET_INDEX'; index: number }
  | { type: 'SET_LIVE'; live: boolean }
  | { type: 'SET_LISTENER'; listenerCount: number }
  | { type: 'TOGGLE_DELETE_MODE' }
  | { type: 'SET_ADD_MUSIC_MODAL_OPEN'; open: boolean };

const playlistReducer = (state: PlaylistState, action: PlaylistAction): PlaylistState => {
  switch (action.type) {
    case 'SET_INDEX':
      return { ...state, currentIndex: action.index };
    case 'SET_LIVE':
      return { ...state, isLive: action.live };
    case 'SET_LISTENER':
      return { ...state, listenerCount: action.listenerCount };
    case 'TOGGLE_DELETE_MODE':
      return { ...state, isDeleteMode: !state.isDeleteMode };
    case 'SET_ADD_MUSIC_MODAL_OPEN':
      return { ...state, isAddMusicModalOpen: action.open };
    default:
      return state;
  }
};


interface PlaylistContextProps extends PlaylistState {
  dispatch: React.Dispatch<PlaylistAction>;
}

const PlaylistContext = createContext<PlaylistContextProps | undefined>(undefined);

export const PlaylistProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(playlistReducer, initialState);

  // currentIndex 로그
  useEffect(() => {
    console.log('Current Index:', state.currentIndex);
  }
    , [state.currentIndex]);

  return (
    <PlaylistContext.Provider value={{ ...state, dispatch }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylistContext = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylistContext must be used within a PlaylistProvider');
  }
  return context;
};
