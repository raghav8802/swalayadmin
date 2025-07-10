"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Style from "../../../../../styles/ViewAlbums.module.css";
import toast from "react-hot-toast";

interface AudioPlayerProps {
  trackName: string;
  audioSrc: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ trackName, audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const resetPlayer = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
      setError(null);
    }
  }, []);

  useEffect(() => {
    resetPlayer();
    setIsLoading(true);
    setError(null);
  }, [trackName, audioSrc, resetPlayer]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || error) return;

    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioRef.current.play().catch((err) => {
        setError("Failed to play audio");
        setIsPlaying(false);
        toast.error("Failed to play audio");
        console.error("Play error:", err);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, error]);

  const onLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
    }
  }, []);

  const onLoadedData = useCallback(() => {
    setIsLoading(false);
  }, []);

  const onError = useCallback((e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    setIsLoading(false);
    setError("Failed to load audio");
    toast.error("Failed to load audio");
    console.error("Audio error:", e);
  }, []);

  const onTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleRangeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(e.target.value);
      setCurrentTime(Number(e.target.value));
    }
  }, []);

  const formatTime = useCallback((time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, []);

  const onEnded = useCallback(() => {
    setCurrentTime(0);
    setIsPlaying(false);
  }, []);

  if (error) {
    return (
      <div className={`border ${Style.MusicPlayerBox}`}>
        <div className={Style.MusicPlayercontainer}>
          <p className="text-red-500">Error: {error}</p>
          <p className={`m-0 ${Style.playingTrack}`}>{trackName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`border ${Style.MusicPlayerBox}`}>
      <div className={Style.MusicPlayercontainer}>
        <div className={Style.trackControllerButtonGroup}>
          <div
            className={`mx-5 ${Style.trackControllerMusicPlayRound} ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={!isLoading ? togglePlay : undefined}
          >
            {isLoading ? (
              <i className="bi bi-arrow-repeat animate-spin"></i>
            ) : (
              <i className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"}`}></i>
            )}
          </div>
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
            className={`${Style.progress} ${isLoading ? 'opacity-50' : ''}`}
            disabled={isLoading}
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
          onLoadedData={onLoadedData}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
          onError={onError}
          preload="metadata"
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
