import PlaylistDescription from '@/components/common/playlistDescription';
import PlayNext from '@/assets/playlist/ic_play_next_disable.svg?react';

type VideoTitleProps = {
    title?: string | undefined;
    description?: string | undefined;
    handleNextVideo?: (index?: number, isAutoPlay?: boolean) => void;
}

const VideoTitle = ({
    title,
    description,
    handleNextVideo = () => { }
}: VideoTitleProps) => {

    return (
        <div className="flex flex-row items-end justify-center w-full my-3">
            <PlaylistDescription
                title={title ?? "영상 없음"}
                description={description ?? "영상이 없습니다"}
            />
            <button
                className="
                    transition-colors duration-200
                    group
                    text-transparent
                    hover:text-main
                    active:text-main-focus
                "
                onClick={() => handleNextVideo(-1, false)}>
                <PlayNext />
            </button>
        </div>
    )
}

export default VideoTitle