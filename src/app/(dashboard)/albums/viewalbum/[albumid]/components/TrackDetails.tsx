"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Style from "../../../../../styles/ViewAlbums.module.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiGet, apiPost } from "@/helpers/axiosRequest";
import toast from "react-hot-toast";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { onShare } from "@/helpers/urlShare";
import { MouseEvent } from "react";
import { AlbumDetailsTable } from "@/app/(dashboard)/marketing/details/components/AlbumDetailsTable";

interface TrackListProps {
  trackId: string;
  albumStatus: number;
  onFetchDetails: (songName: string, url: string) => void;
}

interface Props {
  trackId: string;
}

interface ArtistDetail {
  _id: string;

  artistName: string;
}

interface TrackDetail {
  albumId: string;
  songName: string | null;
  primarySinger: ArtistDetail | null;
  singers: ArtistDetail[] | null;
  composers: ArtistDetail[] | null;
  lyricists: ArtistDetail[] | null;
  producers: ArtistDetail[] | null;
  audioFile: string | null;
  audioFileWav: string | null;
  isrc: string | null;
  duration: string | null;
  crbt: string | null;
  platformLinks: {
    SpotifyLink: string | null;
    AppleLink: string | null;
    Instagram: string | null;
    Facebook: string | null;
  } | null;
  category: string | null;
  version: string | null;
  trackType: string | null;
  trackOrderNumber: string | null;
}

interface AlbumDetail {
  _id: string;
  labelId: string;
  title: string;
  artist: string;
  thumbnail: string;
  language: string;
  genre: string;
  releaseDate: string;
  status: string;
  totalTracks: number;
  cline: string;
  pline: string;
  tags: string[];
  comment: string;
}

enum AlbumProcessingStatus {
  Draft = 0, // on information submit
  Processing = 1, // on final submit
  Approved = 2,
  Rejected = 3,
  Live = 4,
}

const TrackDetails: React.FC<TrackListProps> = ({
  trackId,
  albumStatus,
  onFetchDetails,
}) => {
  const [trackDetails, setTrackDetails] = useState<TrackDetail | null>(null);
  const [albumDetails, setAlbumDetails] = useState<AlbumDetail | null>(null);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const fetchTrackDetails = async () => {
    try {
      const response = await apiGet(
        `/api/track/getTrackDetails?trackId=${trackId}`
      );

      if (response.success) {
        setTrackDetails(response.data);
        const songName = response.data.songName;
        const audioUrl = `${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${response.data.albumId}ba3/tracks/${response.data.audioFile}`;

        onFetchDetails(songName, audioUrl);

        fetchAlbumDetails(response.data.albumId);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("Internal server error");
    }
  };

  const fetchAlbumDetails = async (albumId: string) => {
    try {
      const albumResponse = await apiGet(
        `/api/albums/getAlbumsDetails?albumId=${albumId}`
      );

      if (albumResponse.success) {
        setAlbumDetails(albumResponse.data); // Set album details in state
      } else {
        setError(albumResponse.message);
      }
    } catch (error) {
      console.log("Error fetching album details:", error);
      setError("Failed to fetch album details");
    }
  };

  useEffect(() => {
    fetchTrackDetails();
  }, [trackId]);

  const downloadRef = useRef<HTMLAnchorElement>(null);

  const handleDownload = () => {
    if (downloadRef.current) {
      downloadRef.current.click();
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("URL copied to clipboard!");
      })
      .catch((err) => {
        // console.error('Failed to copy URL: ', err);
        toast.error("Failed to copy URL");
      });
  };

  const onDelete = async () => {
    setIsDialogOpen(true);
  };

  const handleContinue = async () => {
    try {
      const response: any = await apiPost("/api/track/deleteTrack", {
        trackId,
      });

      if (response.success) {
        toast.success("Success! Your album is deleted");
        window.location.reload();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("error in api", error);
      toast.error("Internal server error");
    }
  };

  const uploadToComos = async (albumId: any) => {
    toast.loading("Uploading to cosmos");
    try {
      const response = await apiPost("/api/cosmos/fetchdata", { albumId });
      // console.log(response);
      if (response.success) {
        toast.success("Success! Your album is uploaded to cosmos");
        window.location.reload();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("error in api", error);
      toast.error("Internal server error");
    }
  };

  const handleUploadAndPublish = async () => {
    const trackLink =
      `${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${trackDetails?.albumId}ba3/tracks/${trackDetails?.audioFile}` as string;
    const ytLabel = "SwaLay Digital"; // Replace with the actual label
    const ytAlbum = albumDetails?.title;
    const ytArtist = albumDetails?.artist;
    const ytIsrc = trackDetails?.isrc;
    const ytstitle = trackDetails?.songName;

    // Make sure required data is available
    if (
      !trackLink ||
      !ytLabel ||
      !ytAlbum ||
      !ytArtist ||
      !ytIsrc ||
      !ytstitle
    ) {
      alert("Missing required track details.");
      return;
    }

    // Send the data to the API
    try {
      const response = await fetch("/api/youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trackLink,
          ytLabel,
          ytAlbum,
          ytArtist,
          ytIsrc,
          ytstitle,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Track uploaded and published successfully.");
        // console.log('Response:', data.result);
      } else {
        alert("Error: " + data.error);
        // console.error('Error:', data.error);
      }
    } catch (error) {
      alert("Failed to upload and publish track.");
      // console.error('Upload error:', error);
    }
  };

  const onRecognize = async (audioFileUrl: string) => {
    toast.loading("Uploading to ACRCloud...");

    try {
      // Call the recognition API and pass the audio file URL and trackId
      const response = await apiPost("/api/recognition", {
        trackId,
        fileUrl: audioFileUrl,
      });

      console.log("Response from recognition API:", response);

      // Dismiss the loading toast once the response is received
      toast.dismiss();

      // Check if the API returned a success
      if (response && response.success) {
        // Check for the file details
        const fileDetails = response.fileDetails;

        if (fileDetails && fileDetails.data && fileDetails.data.length > 0) {
          const fileData = fileDetails.data[0];

          // Check if the engine_status and cover_songs fields exist
          if (
            fileData.engine_status &&
            fileData.engine_status.cover_songs !== undefined
          ) {
            // Check if the song is copyright free based on `cover_songs`
            if (fileData.engine_status.cover_songs === 0) {
              toast.success("Your song is copyright free!");
            } else {
              toast.success(
                `Cover song detected. Detail: ${
                  fileData.detail || "No additional details."
                }`
              );
            }
          } else {
            toast.error("Cover song status not found.");
          }

          // Optionally, display the file name and duration in the toast
          toast.success(
            `File Name: ${fileData.name}, Duration: ${fileData.duration} seconds`
          );
        } else {
          toast.error("File details not found.");
        }
      } else {
        // Display error toast if recognition fails
        toast.error(`Error: ${response.message || "Recognition failed"}`);
      }
    } catch (error) {
      // Dismiss loading toast and show error toast
      toast.dismiss();
      toast.error("Internal server error");
      console.error("Error:", error);
    }
  };

  return (
    <div className={`p-1 ${Style.trackDetails}`}>
      <div className={Style.trackDetailsTop}>
        <h5 className={`mt-3 ${Style.subheading}`}> Track Details</h5>

        <div className={Style.trackDetailsIconGroup}>
          { && (
            <button
              className="ms-3 px-3 py-2 bg-red-500 text-white rounded my-3"
              onClick={() =>
                onRecognize(
                  `${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${trackDetails?.albumId}ba3/tracks/${trackDetails?.audioFile}` as string
                )
              }
            >
              Recognization
            </button>
          )}

          {trackDetails?.audioFile && (
            <i
              className="bi bi-link-45deg"
              onClick={() =>
                handleCopyUrl(
                  `${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${trackDetails.albumId}ba3/tracks/${trackDetails.audioFile}`
                )
              }
            ></i>
          )}

          <Link href={`/albums/edittrack/${btoa(trackId)}`}>
            <i className="bi bi-pencil-square" title="Edit track"></i>
          </Link>

          {trackDetails?.audioFile && (
            <div onClick={handleDownload}>
              {/* Download icon */}
              <i className="bi bi-download"></i>

              {/* Hidden anchor tag to handle download */}
              <a
                ref={downloadRef}
                href={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${trackDetails.albumId}ba3/tracks/${trackDetails.audioFile}`}
                download={trackDetails.audioFile as string}
                style={{ display: "none" }}
              >
                Download
              </a>

              {/* Hidden audio tag (if you still need to keep it) */}
              <audio style={{ display: "none" }} controls>
                <source
                  src={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${trackDetails.albumId}ba3/tracks/${trackDetails.audioFile}`}
                  type="audio/mpeg"
                />
              </audio>
            </div>
          )}

          <button onClick={onDelete}>
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>
      <div className={`mt-2 ${Style.currentTrackDetails} `}>
        {/* <p className={`mb-3 ${Style.trackInfoTrackName}`}><span className={Style.trackNameLable}>Track Name: </span> Lost in Mountain</p> */}
        <p className={`mb-3 ${Style.trackInfoTrackName}`}>
          <i className={`bi bi-music-note-list ${Style.trackNameIcon}`}></i>
          {trackDetails && trackDetails?.songName}
        </p>

        {trackDetails && (
          <div className="flex items-center justify-start">
            <Link
              className="px-3 py-2 bg-cyan-600 text-white rounded my-3"
              href={`/albums/tracks/addLyrics/${btoa(
                trackId ?? ""
              )}?trackname=${encodeURIComponent(
                trackDetails?.songName ?? ""
              )}&trackurl=${encodeURIComponent(
                trackDetails?.audioFile
                  ? `${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${trackDetails?.albumId}ba3/tracks/${trackDetails.audioFile}`
                  : ""
              )}`}
            >
              Add Lyrics <i className="bi bi-pen-fill"></i>
            </Link>

            {(albumStatus === AlbumProcessingStatus.Approved ||
              albumStatus === AlbumProcessingStatus.Live) && (
              <>
                <button
                  className="ms-3 px-3 py-2 bg-cyan-500 text-white rounded my-3"
                  onClick={() => uploadToComos(trackDetails?.albumId)}
                >
                  COSMOS
                </button>

                <button
                  className="ms-3 px-3 py-2 youtube-bg text-white rounded my-3"
                  onClick={handleUploadAndPublish} // The onClick function is now here
                >
                  <i className="bi bi-youtube me-2"></i> YouTube
                </button>
              </>

            )}
            
          </div>
        )}

        <div className="mt-3">
          <Tabs defaultValue="track" className="w-100">
            <TabsList>
              <TabsTrigger value="track">Track Info</TabsTrigger>
              <TabsTrigger value="publishiling">Publishing Info</TabsTrigger>
            </TabsList>
            <TabsContent value="track">
              <div className={`mt-2  ${Style.trackInfoListContainer}`}>
                <ul className="p-3">
                  <li className={`mb-2 ${Style.albumInfoItem}`}>
                    <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      ISRC:
                    </span>{" "}
                    {trackDetails && trackDetails.isrc}
                  </li>
                  <li className={`mb-2 ${Style.albumInfoItem}`}>
                    <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      Category:
                    </span>{" "}
                    {trackDetails && trackDetails.category}
                  </li>
                  <li className={`mb-2 ${Style.albumInfoItem}`}>
                    <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      TrackType:
                    </span>{" "}
                    {trackDetails && trackDetails.trackType}
                  </li>
                  <li className={`mb-2 ${Style.albumInfoItem}`}>
                    <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      Version:
                    </span>{" "}
                    {trackDetails && trackDetails.version}
                  </li>

                  <li className={`mb-2 ${Style.albumInfoItem}`}>
                    <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      Crbt:
                    </span>{" "}
                    {trackDetails && trackDetails.crbt}
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="publishiling">
              <div className={`mt-2  ${Style.trackInfoListContainer}`}>
                <ul className="p-3">
                  <li className={`mb-2 ${Style.albumInfoItem}`}>
                    <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      Primary Singer:
                    </span>{" "}
                    {trackDetails?.primarySinger && (
                      <Link href={`/artist/${trackDetails.primarySinger._id}`}>
                        {trackDetails.primarySinger.artistName}
                      </Link>
                    )}
                  </li>
                  <li className={`mb-2 ${Style.albumInfoItem}`}>
                    <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      Other Singers:{" "}
                    </span>
                    {/* {trackDetails?.singers?.map((singer) => (
                      <span key={singer._id}>
                        <Link href={`/artist/${singer._id}`}>
                          {singer.artistName}
                        </Link>
                      </span>
                    ))} */}

                    {trackDetails?.singers?.map((singer, index) => (
                      <span key={singer._id}>
                        <Link href={`/artist/${singer._id}`}>
                          {singer.artistName}
                        </Link>
                        {index < (trackDetails.singers?.length ?? 0) - 1 &&
                          ", "}
                      </span>
                    ))}
                  </li>
                  <li className={`mb-2 ${Style.albumInfoItem}`}>
                    <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      Lyricists:
                    </span>{" "}
                    {trackDetails?.lyricists?.map((lyricist, index) => (
                      <span key={lyricist._id}>
                        <Link href={`/artist/${lyricist._id}`}>
                          {lyricist.artistName}
                        </Link>
                        {index < (trackDetails.lyricists?.length ?? 0) - 1 &&
                          ", "}
                      </span>
                    ))}
                  </li>
                  <li className={`mb-2 ${Style.albumInfoItem}`}>
                    <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      Composers:
                    </span>{" "}
                    {trackDetails?.composers?.map((composer) => (
                      <span key={composer._id}>
                        <Link href={`/artist/${composer._id}`}>
                          {composer.artistName}
                        </Link>
                      </span>
                    ))}
                  </li>
                  <li className={`mb-2 ${Style.albumInfoItem}`}>
                    <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      Producers:
                    </span>{" "}
                    {trackDetails?.producers?.map((producer) => (
                      <span key={producer._id}>
                        <Link href={`/artist/${producer._id}`}>
                          {producer.artistName}
                        </Link>
                      </span>
                    ))}
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* <div className={`mt-4 flex  ${Style.socialGroup}`}> */}
        <div className={`mt-4 flex `}>
          <Link href={"/"}>
            <Image
              src={"/images/image.png"}
              width={50}
              height={50}
              alt="music platfrom"
            />
          </Link>
          <Link href={"/"} className="ms-3">
            <Image
              src={"/images/spotify.png"}
              width={50}
              height={50}
              alt="music platfrom"
            />
          </Link>
        </div>

        <ConfirmationDialog
          confrimationText="Delete"
          show={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onContinue={handleContinue}
          title="Are You Sure ?"
          description="Once you delete this track, you will no longer be able to retrieve the tracks associated with it."
        />
      </div>
    </div>
  );
};

export default TrackDetails;
