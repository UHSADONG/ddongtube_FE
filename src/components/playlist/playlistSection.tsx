import React from 'react'
import PlaylistHeader from "@/components/playlist/playlistHeader";
import PlaylistList from "@/components/playlist/playlistList";
import PlaylistFooter from "@/components/playlist/playlistFooter";
import { Video } from '@/types/video';


type PlaylistSectionProps = {
    videoList: Video[];
    openSuccessToast: (message: string) => void;
    handleNextVideo: (index?: number, isAutoPlay?: boolean) => void;
}

const PlaylistSection = ({
    videoList,
    openSuccessToast,
    handleNextVideo
}: PlaylistSectionProps) => {
    return (
        <div className="flex flex-col items-start justify-center w-full">
            <PlaylistHeader />
            <PlaylistList
                videoList={videoList}
                openSuccessToast={openSuccessToast}
                handleNextVideo={handleNextVideo} />
            <PlaylistFooter />
        </div>
    )
}

export default PlaylistSection