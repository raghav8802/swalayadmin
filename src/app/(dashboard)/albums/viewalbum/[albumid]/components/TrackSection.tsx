"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import TrackList from "./TrackList";
import Style from "../../../../../styles/ViewAlbums.module.css";
import { buttonVariants } from "@/components/ui/button";
import TrackDetails from "./TrackDetails";
import AudioPlayer from "./AudioPlayer";

interface TrackSectionProps {
  albumId: string;
}

const TrackSection: React.FC<TrackSectionProps> = ({ albumId }) => {
  const [showTrackDetails, setShowTrackDetails] = useState(false);
  const [trackId, setTrackId] = useState<string | null>(null);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [audio, setAudio] = useState({
    songName: "",
    songUrl: "",
  });

  const handleTrackClick = (trackId: string) => {
    setShowTrackDetails(true);
    console.log("Track ID clicked in section :", trackId);
    setTrackId(trackId);
  };

  const getSongNameUrl = (songName: string, audioUrl: string) => {
    setShowAudioPlayer(true);
    console.log("Track ID clicked in section :", trackId);
    setAudio({ songName, songUrl: audioUrl });
  };

  useEffect(() => {
    setTrackId(trackId);
  }, [trackId]);

  return (
    <div>
      <div className={`mt-3 ${Style.trackContainer}`}>
        <div className={`p-1 ${Style.tracksContainer}`}>
          {/* <h5 className={Style.subheading}><i className="bi bi-music-note"></i> Tracks</h5> */}
          <div className={`mt-3 ${Style.trackDetailsTop}`}>
            <h5 className={Style.subheading}>Tracks</h5>
            <Link
              href={`/albums/addtrack/${btoa(albumId as string)}`}
              className={buttonVariants({ variant: "default" })}
            >
              <i className="bi bi-plus-circle mr-2"></i> Add Track
            </Link>
          </div>

          {albumId && (
            <TrackList albumId={albumId} onTrackClick={handleTrackClick} />
          )}
        </div>

        {showTrackDetails && trackId && (
          <TrackDetails trackId={trackId} onFetchDetails={getSongNameUrl} />
        )}
      </div>

      {showAudioPlayer && (
        <AudioPlayer
          trackName={audio.songName}
          audioSrc={audio.songUrl}
          />
        )}

        {/* audioSrc="https://swalay-music-files.s3.ap-south-1.amazonaws.com/albums/07c1a66b5f2c15f93960881fe7ce1ba3/tracks/The-beauty-of-green-legends-1723360369143.mp3" */}

      
    </div>
  );
};

export default TrackSection;
