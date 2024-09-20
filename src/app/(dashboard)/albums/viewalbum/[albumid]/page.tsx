"use client";

import React, { useEffect, useState } from "react";
import Style from "../../../../styles/ViewAlbums.module.css";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { apiGet, apiPost } from "@/helpers/axiosRequest";
import ErrorSection from "@/components/ErrorSection";
import AlbumStatus from "../components/AlbumStatus";
import TrackSection from "./components/TrackSection";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import DeleteButton from "./components/DeleteButton";
import AlbumStatusUpdate from "./components/AlbumStatusUpdate";

// import MusicPlayer from '../components/MusicPlayer'

interface AlbumDetails {
  artist: string;
  cline: string;
  comment: string | null;
  date: string;
  genre: string;
  labelId: string;
  language: string;
  platformLinks: string | null;
  pline: string;
  releasedate: string;
  status: number;
  tags: string[];
  thumbnail: string;
  title: string;
  totalTracks: number;
  upc: string | null;
  _id: string;
}

enum AlbumProcessingStatus {
  Draft = 0, // on information submit
  Processing = 1, // on final submit
  Approved = 2,
  Rejected = 3,
  Live = 4,
}

const albums = ({ params }: { params: { albumid: string } }) => {
  const albumIdParams = params.albumid;
  const [albumId, setAlbumId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [albumDetails, setAlbumDetails] = useState<AlbumDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const albumIdParams = params.albumid;

    try {
      const decodedAlbumId = atob(albumIdParams);
      setAlbumId(decodedAlbumId);
    } catch (e) {
      setError("Invalid Url");
      console.error("Decoding error:", e);
    }
  }, [albumIdParams]);

  const fetchAlbumDetails = async (albumId: string) => {
    try {
      const response = await apiGet(
        `/api/albums/getAlbumsDetails?albumId=${albumId}`
      );

      if (response.data) {
        setAlbumDetails(response.data);
        setIsLoading(false);
      } else {
        console.log("go to error");
        setError("Invalid Url");
      }
    } catch (error) {
      toast.error("Internal server error");
    }
  };

  useEffect(() => {
    if (albumId) {
      fetchAlbumDetails(albumId);
    }
  }, [albumId]);

  const onFinalSubmit = () => {

    setIsDialogOpen(true);
  };

  const handleContinue = async () => {
    

    const payload = {
      id: albumId,
      status: AlbumProcessingStatus.Processing,
      comment: "",
    };

    try {
      const response = await apiPost("/api/albums/updateStatus", payload);
      
      if (response.success) {
        toast.success("Thank you! Your album(s) are currently being processed");
        // check it
        if (albumDetails) {
          setAlbumDetails((prevDetails) =>
            prevDetails
              ? {
                  ...prevDetails,
                  status: AlbumProcessingStatus.Processing,
                }
              : null
          );
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("error in api", error);
      toast.error("Internal server error");
    }
  };

  if (error) {
    return <ErrorSection message="Invalid Url" />;
  }

  return (
    <div>
      <div className={Style.albumContainer}>
        <div className={Style.albumThumbnailContainer}>
          {albumDetails && albumDetails.thumbnail && (
            <Image
              src={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${albumId}ba3/cover/${albumDetails.thumbnail}`}
              alt="album thumbnail"
              width={480}
              height={480}
              className={Style.albumThumbnail}
            />
          )}
        </div>

        <div className={`p-3 border rounded ${Style.albumDetails}`}>
          {albumDetails && (
            <div style={{ width: "100%" }}>
              <AlbumStatus
                status={albumDetails.status}
                comment={albumDetails.comment ?? ""}
              />
            </div>
          )}
          <h2 className={Style.albumTitle}>
            {albumDetails && albumDetails.title}
          </h2>
          <p className={`${Style.albumArtist} mb-2`}>
            {albumDetails && albumDetails.artist}
          </p>
          <div className="flex mb-3">
            {albumDetails &&
              albumDetails.tags.map((tag) => (
                <span
                  key={tag}
                  className="me-2 inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
                >
                  {tag}
                </span>
              ))}
          </div>

          <ul className={Style.albumInfoList}>
            <li className={`mb-2 ${Style.albumInfoItem}`}>
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                Genre:{" "}
              </span>
              {albumDetails?.genre}
            </li>
            <li className={`mb-2 ${Style.albumInfoItem}`}>
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                Language:{" "}
              </span>
              {albumDetails?.language}
            </li>
            <li className={`mb-2 ${Style.albumInfoItem}`}>
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                UPC:{" "}
              </span>
              {albumDetails?.upc}
            </li>
            <li className={`mb-2 ${Style.albumInfoItem}`}>
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                Release Date:{" "}
              </span>{" "}
              {albumDetails?.releasedate
                ? new Date(albumDetails.releasedate).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )
                : ""}
            </li>

            <li className={`mb-2 ${Style.albumInfoItem}`}>
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                C Line:{" "}
              </span>{" "}
              {albumDetails ? `© ${albumDetails.cline}` : ""}
            </li>
            <li className={`mb-2 ${Style.albumInfoItem}`}>
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                Submission Date:{" "}
              </span>
              {albumDetails?.date
                ? new Date(albumDetails.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </li>
            <li className={`mb-2 ${Style.albumInfoItem}`}>
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                P Line:{" "}
              </span>
              {albumDetails ? `℗ ${albumDetails.pline}` : ""}
            </li>
          </ul>

          <div className="flex">

            {albumDetails &&
              albumDetails.status !== AlbumProcessingStatus.Live && (
                <Link
                  href={`/albums/addtrack/${btoa(albumId as string)}`}
                  className={`mt-4 mb-2 me-3 btn ${Style.albumAddTrack} p-3`}
                >
                  <i className="me-2 bi bi-plus-circle"></i>
                  Add track
                </Link>
              )}

            <Link
              href={`/albums/edit/${btoa(albumId as string)}`}
              className={`mt-4 mb-2 ${Style.albumEditBtn} p-3`}
            >
              <i className="me-2 bi bi-pencil-square"></i>
              Edit Album
            </Link>

            {albumDetails &&
              (albumDetails.status === AlbumProcessingStatus.Draft ||
                albumDetails.status === AlbumProcessingStatus.Rejected) &&
              albumDetails.totalTracks > 0 && (
                <button
                  type="button"
                  className={`mt-4 ms-5 mb-2 ${Style.albumSuccessBtn} p-3`}
                  onClick={onFinalSubmit}
                >
                  Final Submit <i className="me-2 bi bi-send-fill"></i>
                </button>
              )}

            {albumId && <DeleteButton albumId={albumId} />}
          </div>

          {albumId && (
            <AlbumStatusUpdate
              albumid={albumId}
              onUpdate={() => fetchAlbumDetails(albumId)}
            />
          )}
        </div>
      </div>

      {/* list of tracks  */}

      {albumDetails && albumDetails.totalTracks > 0 ? (
        albumId && <TrackSection albumId={albumId} />
      ) : (
        <div className="mt-5 pt-4">
          <h1 className="text-center text-2xl mt-5">No track found</h1>
        </div>
      )}

      {/* {albumId && <TrackSection albumId={albumId} />} */}

      <ConfirmationDialog
        show={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onContinue={handleContinue}
        title="Are You Sure ?"
        description="Please note that once you submit your final details, you will not be able to make any further changes."
      />

      {/* list of tracks  */}
    </div>
  );
};

export default albums;
