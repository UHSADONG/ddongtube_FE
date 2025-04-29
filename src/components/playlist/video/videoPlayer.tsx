import YoutubeEmbedPlayer from '@/components/youtube/youtubeEmbedPlayer';
import ImageViewer from '@/components/common/imageViewer';
import VideoTitle from '@/components/playlist/video/videoTitle';
import VideoDescription from '@/components/playlist/video/videoDescription';

import { extractYoutubeVideoId } from '@/utils/youtube';
import { Video } from '@/types/video';

type VideoPlayerProps = {
    currentVideo: Video;
    thumbnailUrl: string;
    handleNextVideo: (index?: number, isAutoPlay?: boolean) => void;
}

const VideoPlayer = ({ currentVideo, thumbnailUrl, handleNextVideo }: VideoPlayerProps) => {

    const { url = "", title = "", description = "" } = currentVideo;

    return (
        <section className="flex flex-col items-start justify-center w-full mt-3 mb-8">
            {extractYoutubeVideoId(url) ? (
                <YoutubeEmbedPlayer
                    videoId={extractYoutubeVideoId(url) ?? ""}
                    onPause={() => console.log("⏸사용자 일시정지")}
                    onEnded={() => handleNextVideo(-1, true)}
                />
            ) : (
                <ImageViewer src={thumbnailUrl} />
            )}
            <VideoTitle
                title={title}
                description={description}
                handleNextVideo={handleNextVideo}
            />
            <VideoDescription
                description={description}
            ></VideoDescription>
        </section>
    )
}

export default VideoPlayer