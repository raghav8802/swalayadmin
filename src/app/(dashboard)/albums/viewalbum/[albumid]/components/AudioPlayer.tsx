import React, { useState, useRef, useEffect } from "react";
// import Style from './AudioPlayer.module.css';
import Style from "../../../../../styles/ViewAlbums.module.css";

interface AudioPlayerProps {
  trackName: string;
  audioSrc: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ trackName, audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Reset playback when trackName changes
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [trackName]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(e.target.value);
      setCurrentTime(Number(e.target.value));
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const onEnded = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };


  return (
    <div className={`border ${Style.MusicPlayerBox}`}>
      <div className={Style.MusicPlayercontainer}>
        <div className={Style.trackControllerButtonGroup}>
          {/* <i className="bi bi-rewind-fill ms-2"></i> */}
          <div
            className={`mx-5 ${Style.trackControllerMusicPlayRound}`}
            onClick={togglePlay}
          >
            <i
              className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"}`}
            ></i>
          </div>
          {/* <i className="me-2 bi bi-fast-forward-fill"></i> */}
        </div>

        <div className={Style.rangeContainer}>
          <span className="me-3">{formatTime(currentTime)}</span>
          <input
            type="range"
            name="progress"
            min="0"
            max={duration}
            step="1"
            value={currentTime}
            onChange={handleRangeChange}
            className={Style.progress}
            id="myRange"
          />
          <span className="ms-3">{formatTime(duration)}</span>
        </div>

        <p className={`m-0 ${Style.playingTrack}`}>
          {trackName.length > 50
            ? `${trackName.substring(0, 50)}...`
            : trackName}
        </p>

        <audio
          ref={audioRef}
          src={audioSrc}
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
