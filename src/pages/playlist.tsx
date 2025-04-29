import { useCallback } from "react";

import { useAuthCheck } from "@/hooks/auth/useAuthCheck";

import FloatingButton from "@/components/common/floatingButton";
import PlaylistAddMusicModal from "@/components/modal/playlistAddModal";

import { ResponsiveContainer } from "@/container/responsiveContainer";

import { useToast } from "@/hooks/useToast";
import { usePlaylistSSE } from "@/hooks/sse/usePlaylistSSE";
import { usePlaylistActions, usePlaylistMeta, usePlaylistVideos } from "@/hooks/api/playlist";

import { usePlaylistContext } from "@/providers/PlaylistProvider";
import Header from "@/components/playlist/header";
import VideoPlayer from "@/components/playlist/video/videoPlayer";
import PlaylistSection from "@/components/playlist/playlistSection";

const Playlist = () => {

    const { playlistCode, accessToken } = useAuthCheck();

    if (!playlistCode || !accessToken) {
        return null;
    }

    const { openSuccessToast, ToastPortal } = useToast();

    const { thumbnailUrl } = usePlaylistMeta(playlistCode);
    const { videoList } = usePlaylistVideos(playlistCode);
    const { playNext } = usePlaylistActions(playlistCode);
    const { currentIndex, isLive, listenerCount, isAddMusicModalOpen, dispatch } = usePlaylistContext();

    usePlaylistSSE({ playlistCode, accessToken });

    const handleNextVideo = useCallback((touchedIndex: number = -1, isAuto = false) => {
        const nextVideo = touchedIndex === -1
            ? videoList[(currentIndex + 1) % videoList.length]
            : videoList[touchedIndex];

        if (!nextVideo) return;

        playNext({ videoCode: nextVideo.code, isAuto }).then(() => {
            if (!isLive) {
                const nextIndex = touchedIndex === -1
                    ? (currentIndex + 1) % videoList.length
                    : touchedIndex;
                dispatch({ type: 'SET_INDEX', index: nextIndex });
            }
        });
    }, [currentIndex, videoList, isLive, playNext, dispatch]);

    const openAddMusicModal = useCallback(() => {
        dispatch({ type: 'SET_ADD_MUSIC_MODAL_OPEN', open: true });
    }, [dispatch]);

    const closeAddMusicModal = useCallback(() => {
        dispatch({ type: 'SET_ADD_MUSIC_MODAL_OPEN', open: false });
    }, [dispatch]);

    if (!playlistCode) return null;

    return (
        <ResponsiveContainer style={{ overflowY: "auto" }}>
            <Header isLive={isLive} listenerCount={listenerCount} />
            <VideoPlayer
                currentVideo={videoList[currentIndex]}
                thumbnailUrl={thumbnailUrl}
                handleNextVideo={handleNextVideo} />
            <PlaylistSection
                videoList={videoList}
                openSuccessToast={openSuccessToast}
                handleNextVideo={handleNextVideo} />
            <FloatingButton
                playlistCode={playlistCode}
                openToast={openSuccessToast}
                text="영상 추가하기"
                onMusicButtonClick={openAddMusicModal} />
            <PlaylistAddMusicModal
                openToast={() => { }}
                isOpen={isAddMusicModalOpen}
                onClose={closeAddMusicModal}
                playlistCode={playlistCode}
            />
            {ToastPortal}
        </ResponsiveContainer >
    );
};

export default Playlist;
