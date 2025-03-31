
import React, { useEffect, useRef } from "react";

interface YoutubeEmbedPlayerProps {
  videoId: string;
  onPause?: () => void;
  onEnded?: () => void;
  autoplay?: boolean;
}

const YoutubeEmbedPlayer = ({ videoId, onPause, onEnded, autoplay = true }: YoutubeEmbedPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "string") return;
      try {
        const data = JSON.parse(event.data);
        if (data.event === "infoDelivery" && data.info) {
          if (data.info.playerState === 2 && onPause) {
            onPause();
          }
          if (data.info.playerState === 0 && onEnded) {
            onEnded();
          }
        }
      } catch (_) { }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onPause, onEnded]);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&enablejsapi=1`;

  return (
    <iframe
      ref={iframeRef}
      className="w-full aspect-video rounded-md"
      src={embedUrl}
      title="YouTube Video"
      allow="autoplay; encrypted-media"
      allowFullScreen
    ></iframe>
  );
};

export default YoutubeEmbedPlayer;