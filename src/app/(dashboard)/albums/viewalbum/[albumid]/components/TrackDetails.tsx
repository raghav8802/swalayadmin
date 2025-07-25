"use client";
import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
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
import UserContext from "@/context/userContext";
import { Modal } from "@/components/Modal";

interface TrackListProps {
  trackId: string;
  albumStatus: number;
  onFetchDetails: (songName: string, url: string) => void;
}

interface ApiResponse {
  success: boolean;
  message?: string;
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
    spotify: string | null;
    appleMusic: string | null;
    amazon: string | null;
    amazonMusic: string | null;
    youtube: string | null;
    youtubeMusic: string | null;
    shazam: string | null;
    wynkMusic: string | null;
    _id: string;
  } | null;
  category: string | null;
  version: string | null;
  trackType: string | null;
  trackOrderNumber: string | null;
  deliveryStatus: 'pending' | 'delivered' | 'failed' | null;
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
  Draft = 0,
  Processing = 1,
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
  const context = useContext(UserContext);
  const userType = context?.user?.usertype || "";
  const [isLoading, setIsLoading] = useState(true);
  const [isUPCModalOpen, setIsUPCModalOpen] = useState(false);
  const [editedUPC, setEditedUPC] = useState("");
  const [isDelivering, setIsDelivering] = useState(false);
  const [isISRCModalOpen, setIsISRCModalOpen] = useState(false);
  const [editedISRC, setEditedISRC] = useState("");
  const [cosmosDeliveryStatus, setCosmosDeliveryStatus] = useState("")
  const [labelId, setLabelId] = useState("");

  const audioRef = useRef<HTMLAudioElement>(null);

  const fetchAlbumDetails = useCallback(async (albumId: string) => {
    try {

      const albumResponse:any = await apiGet(
        `/api/albums/getAlbumsDetails?albumId=${albumId}`
      );

      console.log("Response from getAlbumsDetails API :::::->>>:", albumResponse);
      
      console.log(albumResponse.data.label._id);
      setLabelId(albumResponse.data.label._id);

      if (albumResponse.success) {
        setAlbumDetails(albumResponse.data.album); // <-- FIXED: set to album object
      } else {
        setError(albumResponse.message);
      }
    } catch (error) {
      console.log("Error fetching album details:", error);
      setError("Failed to fetch album details");
    }
  }, []);

  const fetchTrackDetails = useCallback(async () => {
    try {
      const response:any = await apiGet(
        `/api/track/getTrackDetails?trackId=${trackId}`
      );

      console.log("Response from getTrackDetails API:", response);

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
  }, [trackId, onFetchDetails, fetchAlbumDetails]);

  useEffect(() => {
    fetchTrackDetails();
  }, [fetchTrackDetails]);

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
    if (isDelivering) {
      return;
    }

    setIsDelivering(true);
    toast.loading("Uploading to cosmos");
    try {
      const response:any = await apiPost("/api/cosmos/fetchdata", { albumId });

      console.log("Response from cosmos API: STEP 1 DONE", response);

      if (response.success) {
        // Update the track's delivery status
        await apiPost("/api/track/updateDeliveryStatus", {
          trackId,
          status: 'delivered'
        });
        console.log("Track delivery status updated to delivered 1");

        setTrackDetails(prev => prev ? {
          ...prev,
          deliveryStatus: 'delivered'
        } : null);
        toast.success("Success! Your album is uploaded to cosmos");
      } else {
        // Update the track's delivery status to failed
        await apiPost("/api/track/updateDeliveryStatus", {
          trackId,
          status: 'failed'
        });
        console.log("Track delivery status updated to failed 2");

        setTrackDetails(prev => prev ? {
          ...prev,
          deliveryStatus: 'failed'
        } : null);
        toast.error(response.message);
      }
    } catch (error) {
      // Update the track's delivery status to failed
      await apiPost("/api/track/updateDeliveryStatus", {
        trackId,
        status: 'failed'
      });
      setTrackDetails(prev => prev ? {
        ...prev,
        deliveryStatus: 'failed'
      } : null);
      console.log("error in api 3", error);
      toast.error("Internal server error");

    } finally {
      setIsDelivering(false);
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

    console.log({
      trackLink,
      ytLabel,
      ytAlbum,
      ytArtist,
      ytIsrc,
      ytstitle
    });

    // Make sure required data is available
    if (
      !trackLink ||
      !ytLabel ||
      !ytAlbum ||
      !ytArtist ||
      !ytIsrc ||
      !ytstitle
    ) {
      toast.error("Missing required track details");
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
      console.log("YT API response:", data); // <-- Added for debugging

      if (data.success) {
        toast.success("Track uploaded and published successfully.");
      } else {
        toast.error(data.error || "Failed to upload track");
      }
    } catch (error) {
      toast.error("Failed to upload and publish track.");
      console.error("Upload error:", error);
    }
  };

  const onRecognize = async (audioFileUrl: string) => {
    toast.loading("Uploading to ACRCloud...");

    try {
      // Call the recognition API and pass the audio file URL and trackId
      const response:any = await apiPost("/api/recognition", {
        trackId,
        fileUrl: audioFileUrl,
      });

      console.log("Response from recognition API:", response);

      // Dismiss the loading toast once the response is received
      toast.dismiss();

      // Check if the API returned a success
      if (response && response.success) {
        const fileDetails = response.fileDetails;

        if (fileDetails && fileDetails.data && fileDetails.data.length > 0) {
          const fileData = fileDetails.data[0];

          // Check if results field exists
          if (fileData.results === null) {
            toast.success("Your song is copyright-free!");
          } else {
            // Access the cover songs array
            const coverSongs = fileData.results.cover_songs;

            if (coverSongs && coverSongs.length > 0) {
              const songInfo = coverSongs[0].result;

              // Access specific song details
              const title = songInfo.title;
              const duration = coverSongs[0].played_duration; // Access played_duration from the first cover song
              const isrc = songInfo.external_ids?.isrc;

              // Display a toast with song information
              toast.error(
                `Match found: "${title}"\nDuration: "${duration}" seconds\nISRC: ${isrc}`
              );

              // Optionally log the entire result for debugging
              console.log(
                "Match details:",
                JSON.stringify(fileData.results, null, 2)
              );
            } else {
              toast.error("Cover song data not found in results.");
            }
          }
        } else {
          toast.error("File details not found.");
        }
      } else {
        toast.error(`Error: ${response.message || "Recognition failed"}`);
      }
    } catch (error) {
      // Dismiss loading toast and show error toast
      toast.dismiss();
      toast.error("Internal server error");
      console.error("Error:", error);
    }
  };

  //fetch msic links

  const onlinkfetch = async (isrc: string) => {
    toast.loading("Getting Links  ");

    try {
      const response = await apiPost("/api/musicfetch", {
        isrc: isrc,
      });
      console.log("Response from recognition API:", response);
    } catch (error) {
      toast.error("Internal server error");
    }
  };

  const handleISRCUpdate = async () => {
    if (!trackId || !trackDetails) return;

    try {
      const response = await apiPost<ApiResponse>("/api/tracks/updateISRC", {
        id: trackId,
        isrc: editedISRC
      });

      if (response?.success) {
        setTrackDetails(prev => prev ? {
          ...prev,
          isrc: editedISRC
        } : null);
        setIsISRCModalOpen(false);
        toast.success("ISRC updated successfully");
      } else {
        toast.error(response?.message || "Failed to update ISRC");
      }
    } catch (error) {
      console.error("Error updating ISRC:", error);
      toast.error("Failed to update ISRC");
    }
  };

  return (
    <div className={`p-1 ${Style.trackDetails}`}>
      <div className={Style.trackDetailsTop}>
        <h5 className={`mt-3 ${Style.subheading}`}>Track Details</h5>
        {userType !== "customerSupport" && (
          <div className={Style.trackDetailsIconGroup}>
            <button
              className="ms-1 px-3 py-2 bg-red-500 text-white rounded my-3"
              onClick={() =>
                onRecognize(
                  `${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${trackDetails?.albumId}ba3/tracks/${trackDetails?.audioFile}` as string
                )
              }
            >
              Audio Check
            </button>
            <button
              className="ms-3 px-2 py-2 bg-green-500 text-white rounded ms-2 bi bi-link-45deg"
              onClick={() => onlinkfetch(`${trackDetails && trackDetails.isrc}`)}
            >
              Link
            </button>
              {trackId && labelId && (
                 <Link href={`/albums/edittrack/${btoa(trackId)}?labelId=${btoa(labelId)}`}>
                 <i className="bi bi-pencil-square" title="Edit track"></i>
               </Link>
            ) }
           
            {trackDetails?.audioFile && (
              <div onClick={handleDownload}>
                <i className="bi bi-download"></i>
                <a
                  ref={downloadRef}
                  href={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${trackDetails.albumId}ba3/tracks/${trackDetails.audioFile}`}
                  download={trackDetails.audioFile as string}
                  style={{ display: "none" }}
                >
                  Download
                </a>
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
        )}
      </div>
      <div className={`mt-2 ${Style.currentTrackDetails}`}>
        <p className={`mb-3 ${Style.trackInfoTrackName}`}>
          <i className={`bi bi-music-note-list ${Style.trackNameIcon}`}></i>
          {trackDetails && trackDetails?.songName}
        </p>

        {trackDetails && (
          <div className="flex items-center justify-start">
            {userType !== "customerSupport" && (
              <Link
                className="px-3 py-2 bg-cyan-600 text-white rounded my-3"
                href={`/albums/tracks/addLyrics/${btoa(trackId ?? "")}?trackname=${encodeURIComponent(
                  trackDetails?.songName ?? ""
                )}&trackurl=${encodeURIComponent(
                  trackDetails?.audioFile
                    ? `${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${trackDetails?.albumId}ba3/tracks/${trackDetails.audioFile}`
                    : ""
                )}`}
              >
                Add Lyrics <i className="bi bi-pen-fill"></i>
              </Link>
            )}

            {(albumStatus === AlbumProcessingStatus.Approved ||
              albumStatus === AlbumProcessingStatus.Live) && (
              <>

                <button
                  className={`ms-3 px-3 py-2 rounded my-3 ${
                    isDelivering
                      ? 'bg-gray-400 cursor-wait'
                      : 'bg-cyan-500 hover:bg-cyan-600'
                  } text-white`}
                  onClick={() => uploadToComos(trackDetails?.albumId)}
                >
                  {isDelivering ? 'Uploading...' : 
                   trackDetails?.deliveryStatus ? 'Re Delivery' : 'DSP Delivery'}
                </button>

                {trackDetails?.deliveryStatus === 'delivered' && (
                  <span className="text-green-500 ms-2">
                    <i className="bi bi-check-circle-fill"></i> Delivered
                  </span>
                )}

                <button
                  className="ms-3 px-3 py-2 youtube-bg text-white rounded my-3"
                  onClick={handleUploadAndPublish}
                >
                  <i className="bi bi-youtube me-2"></i> YT Delivery
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
              <TabsTrigger value="links">Track Links</TabsTrigger>
            </TabsList>
            <TabsContent value="track">
              <div className={`mt-2 ${Style.trackInfoListContainer}`}>
                <ul className="p-3">
                  <li className={`mb-2 ${Style.albumInfoItem}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        ISRC:
                      </span>
                      <div className="flex items-center gap-2">
                        {trackDetails?.isrc || "Not set"}
                        {userType !== "customerSupport" && (
                          <button
                            onClick={() => {
                              setIsISRCModalOpen(true);
                              setEditedISRC(trackDetails?.isrc || "");
                            }}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                        )}
                      </div>
                    </div>
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
                      CRBT:
                    </span>{" "}
                    {trackDetails && trackDetails.crbt}
                  </li>
                  <li className={`mb-2 ${Style.albumInfoItem}`}>
                    <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      Duration:
                    </span>{" "}
                    {trackDetails && trackDetails.duration
                      ? (() => {
                          const durationNum = Number(trackDetails.duration);
                          if (!isNaN(durationNum)) {
                            const minutes = Math.floor(durationNum / 60);
                            const seconds = Math.floor(durationNum % 60);
                            // Format seconds as two digits, but use dot instead of colon
                            return `${minutes}.${seconds.toString().padStart(2, "0")}`;
                          }
                          return trackDetails.duration;
                        })()
                      : "Not set"}

                  </li>
                  <li className={`mb-2 ${Style.albumInfoItem}`}>
                    <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      COSMOS Delivery Status:
                    </span>{" "}
                    {trackDetails && trackDetails.deliveryStatus}
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

            <TabsContent value="links">
              <div className={`mt-2 ${Style.trackInfoListContainer}`}>
                <div className="p-3 grid grid-cols-4 gap-4">
                  {trackDetails?.platformLinks?.spotify && (
                    <div className="flex flex-col items-center">
                      <a 
                        href={trackDetails.platformLinks.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center hover:opacity-80 transition-opacity"
                      >
                        <i className="bi bi-spotify text-3xl mb-2" style={{ color: '#1DB954' }}></i>
                        <p className="text-sm">Spotify</p>
                      </a>
                    </div>
                  )}

                  {trackDetails?.platformLinks?.appleMusic && (
                    <div className="flex flex-col items-center">
                      <a 
                        href={trackDetails.platformLinks.appleMusic}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center hover:opacity-80 transition-opacity"
                      >
                        <i className="bi bi-apple text-3xl mb-2" style={{ color: '#FB2D3F' }}></i>
                        <p className="text-sm">Apple Music</p>
                      </a>
                    </div>
                  )}

                  {trackDetails?.platformLinks?.amazon && (
                    <div className="flex flex-col items-center">
                      <a 
                        href={trackDetails.platformLinks.amazon}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center hover:opacity-80 transition-opacity"
                      >
                        <i className="bi bi-amazon text-3xl mb-2" style={{ color: '#FF9900' }}></i>
                        <p className="text-sm">Amazon</p>
                      </a>
                    </div>
                  )}

                  {trackDetails?.platformLinks?.amazonMusic && (
                    <div className="flex flex-col items-center">
                      <a 
                        href={trackDetails.platformLinks.amazonMusic}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center hover:opacity-80 transition-opacity"
                      >
                        <i className="bi bi-amazon text-3xl mb-2" style={{ color: '#FF9900' }}></i>
                        <p className="text-sm">Amazon Music</p>
                      </a>
                    </div>
                  )}

                  {trackDetails?.platformLinks?.youtube && (
                    <div className="flex flex-col items-center">
                      <a 
                        href={trackDetails.platformLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center hover:opacity-80 transition-opacity"
                      >
                        <i className="bi bi-youtube text-3xl mb-2" style={{ color: '#FF0000' }}></i>
                        <p className="text-sm">YouTube</p>
                      </a>
                    </div>
                  )}

                  {trackDetails?.platformLinks?.youtubeMusic && (
                    <div className="flex flex-col items-center">
                      <a 
                        href={trackDetails.platformLinks.youtubeMusic}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center hover:opacity-80 transition-opacity"
                      >
                        <i className="bi bi-youtube text-3xl mb-2" style={{ color: '#FF0000' }}></i>
                        <p className="text-sm">YouTube Music</p>
                      </a>
                    </div>
                  )}

                  {trackDetails?.platformLinks?.shazam && (
                    <div className="flex flex-col items-center">
                      <a 
                        href={trackDetails.platformLinks.shazam}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center hover:opacity-80 transition-opacity"
                      >
                        <i className="bi bi-music-note text-3xl mb-2" style={{ color: '#08F' }}></i>
                        <p className="text-sm">Shazam</p>
                      </a>
                    </div>
                  )}

                  {trackDetails?.platformLinks?.wynkMusic && (
                    <div className="flex flex-col items-center">
                      <a 
                        href={trackDetails.platformLinks.wynkMusic}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center hover:opacity-80 transition-opacity"
                      >
                        <i className="bi bi-music-note text-3xl mb-2" style={{ color: '#FF0000' }}></i>
                        <p className="text-sm">Wynk Music</p>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
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

      <Modal
        isVisible={isISRCModalOpen}
        triggerLabel="Save"
        title="Update ISRC"
        onSave={handleISRCUpdate}
        onClose={() => setIsISRCModalOpen(false)}
      >
        <div>
          <label className="form-label" htmlFor="isrc">
            ISRC
          </label>
          <input
            id="isrc"
            type="text"
            value={editedISRC}
            onChange={(e) => setEditedISRC(e.target.value)}
            className="form-control"
            placeholder="Enter ISRC"
          />
        </div>
      </Modal>
    </div>
  );
};

export default TrackDetails;