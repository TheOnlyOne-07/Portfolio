import React, { useState } from "react";
import { Link } from "react-router-dom";

interface WorkImageProps {
  image: string;
  alt?: string;
  video?: string;
  link?: string;
}

const ArrowOutwardIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M6 6v2h8.59L5 17.59 6.41 19 16 9.41V18h2V6z" />
  </svg>
);

const WorkImage: React.FC<WorkImageProps> = ({ image, alt, video, link }) => {
  const [isVideo, setIsVideo] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");
  const isExternal = Boolean(link && !link.startsWith("/"));

  const handleMouseEnter = async () => {
    if (video) {
      setIsVideo(true);
      if (!videoSrc) {
        try {
          const response = await fetch(video);
          const blob = await response.blob();
          setVideoSrc(URL.createObjectURL(blob));
        } catch {
          setIsVideo(false);
        }
      }
    }
  };

  const innerContent = (
    <>
      {link && (
        <div className="work-link">
          <ArrowOutwardIcon />
        </div>
      )}
      <img src={image} alt={alt || ""} loading="lazy" decoding="async" />
      {isVideo && videoSrc && (
        <video src={videoSrc} autoPlay muted playsInline loop />
      )}
    </>
  );

  return (
    <div className="work-image">
      {link ? (
        isExternal ? (
          <a
            className="work-image-in"
            href={link}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsVideo(false)}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="disable"
          >
            {innerContent}
          </a>
        ) : (
          <Link
            className="work-image-in"
            to={link}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsVideo(false)}
            data-cursor="disable"
          >
            {innerContent}
          </Link>
        )
      ) : (
        <div
          className="work-image-in"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setIsVideo(false)}
          data-cursor="disable"
        >
          {innerContent}
        </div>
      )}
    </div>
  );
};

export default WorkImage;
