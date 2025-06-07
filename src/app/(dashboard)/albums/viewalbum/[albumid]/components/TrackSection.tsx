"use client";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import TrackList from "./TrackList";
import Style from "../../../../../styles/ViewAlbums.module.css";
import { buttonVariants } from "@/components/ui/button";
import TrackDetails from "./TrackDetails";
import AudioPlayer from "./AudioPlayer";
import { toast } from "react-hot-toast";
import { apiGet } from "@/helpers/axiosRequest";

interface TrackSectionProps {
  albumId: string;
  albumStatus: number;
}

const TrackSection: React.FC<TrackSectionProps> = ({ albumId, albumStatus }) => {

  const [showTrackDetails, setShowTrackDetails] = useState(false);
  const [trackId, setTrackId] = useState<string | null>(null);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [audio, setAudio] = useState({
    songName: "",
    songUrl: "",
  });

  const handleTrackClick = useCallback((trackId: string) => {
    setShowTrackDetails(true);
    setTrackId(trackId);
  }, []);

  const getSongNameUrl = useCallback((songName: string, audioUrl: string) => {
    setShowAudioPlayer(true);
    setAudio({ songName, songUrl: audioUrl });
  }, []);

  const [tracks, setTracks] = useState([]);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTracks = useCallback(async () => {
    try {
      const response:any = await apiGet(
        `/api/track/getTracks?albumId=${albumId}`
      );
      if (response.data) {
        const reversedTracks = response.data.reverse();
        setTracks(reversedTracks);
        if (reversedTracks.length > 0) {
          const firstTrackId = reversedTracks[0]._id;
          setActiveTrackId(firstTrackId);
          handleTrackClick(firstTrackId);
        }
      }
    } catch (error) {
      toast.error("Internal server error");
    } finally {
      setIsLoading(false);
    }
  }, [albumId, handleTrackClick]);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

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
            <TrackList 
              albumId={albumId} 
              onTrackClick={handleTrackClick} 
            />
          )}
        </div>

        {showTrackDetails && trackId && (
          <TrackDetails 
            trackId={trackId}
            albumStatus={albumStatus}
            onFetchDetails={getSongNameUrl} 
          />
        )}
      </div>

      {showAudioPlayer && (
        <AudioPlayer
          trackName={audio.songName}
          audioSrc={audio.songUrl}
        />
      )}
    </div>
  );
};

export default TrackSection;
