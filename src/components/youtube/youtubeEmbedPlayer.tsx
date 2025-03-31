import React from "react";
import ReactPlayer from "react-player/youtube";

interface YoutubePlayerProps {
  videoId: string;
  onPause?: () => void;
  onEnded?: () => void;
  autoplay?: boolean;
}

const YoutubePlayer: React.FC<YoutubePlayerProps> = ({
  videoId,
  onPause,
  onEnded,
  autoplay = true,
}) => {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className="w-full aspect-video rounded-md overflow-hidden">
      <ReactPlayer
        url={videoUrl}
        playing={autoplay}
        controls
        width="100%"
        height="100%"
        onPause={onPause}
        onEnded={onEnded}
      />
    </div>
  );
};

export default YoutubePlayer;