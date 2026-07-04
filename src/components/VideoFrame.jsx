import React, { useRef, useState } from 'react';
import studioPoster from '../assets/studio-poster.png';

function VideoFrame({ variant = 'small' }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const playVideo = async () => {
    if (!videoRef.current || videoError) return;
    try {
      await videoRef.current.play();
      setPlaying(true);
    } catch {
      setVideoError(true);
    }
  };

  return (
    <article className={`video-easel ${variant}`}>
      <div className="easel-back-peg" />
      <div className="easel-clip" />
      <div className="easel-board">
        <div className="video-screen">
          <video
            ref={videoRef}
            className="demo-video"
            src="/videos/client-demo.mp4"
            poster={studioPoster}
            preload="metadata"
            playsInline
            controls={playing}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onError={() => setVideoError(true)}
          />
          {!playing && (
            <button className="play-button" type="button" onClick={playVideo} aria-label="Play client demo video">
              ▶
            </button>
          )}
          {!playing && videoError && (
            <div className="video-note">
              Add video at <strong>public/videos/client-demo.mp4</strong>
            </div>
          )}
        </div>
        <div className="video-controls" aria-label="Video controls preview">
          <button type="button" onClick={playVideo}>{playing ? '❚❚' : '▶'}</button>
          <span>■</span>
          <span className="video-progress"><i /></span>
          <small>0:04 / 1:15</small>
          <span>🔊</span>
          <span>⛶</span>
        </div>
      </div>
      <div className="easel-legs" />
    </article>
  );
}

export default VideoFrame;
