"use client";

import React, { useContext, useEffect, useState } from "react";
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
import UserContext from "@/context/userContext";
import { Modal } from "@/components/Modal";

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

interface ApiResponse {
  data: AlbumDetails;
  success: boolean;
  message?: string;
}

interface UpdateStatusPayload {
  id: string | null;
  labelid: string | undefined;
  albumName: string | undefined;
  status: AlbumProcessingStatus;
  comment: string;
}

interface UpdateStatusResponse {
  success: boolean;
  message?: string;
  data?: AlbumDetails;
}

enum AlbumProcessingStatus {
  Draft = 0, // on information submit
  Processing = 1, // on final submit
  Approved = 2,
  Rejected = 3,
  Live = 4,
}

const Albums = ({ params }: { params: { albumid: string } }) => {
  const context = useContext(UserContext);
  const userType = context?.user?.usertype || "";

  const [albumId, setAlbumId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [albumDetails, setAlbumDetails] = useState<AlbumDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUPCModalOpen, setIsUPCModalOpen] = useState(false);
  const [editedUPC, setEditedUPC] = useState("");

  // Decode album ID only once
  useEffect(() => {
    try {
      const decodedAlbumId = atob(params.albumid);
      setAlbumId(decodedAlbumId);
    } catch (e) {
      setError("Invalid Url");
    }
  }, [params.albumid]);

  const fetchAlbumDetails = React.useCallback(async (albumId: string) => {
    try {
      const response = await apiGet<ApiResponse>(
        `/api/albums/getAlbumsDetails?albumId=${albumId}`
      );

      if (response?.data) {
        setAlbumDetails(response.data);
        setIsLoading(false);
      } else {
        setError("Invalid Url");
      }
    } catch (error) {
      toast.error("Internal server error");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (albumId && isLoading) {
      fetchAlbumDetails(albumId);
    }
  }, [albumId, fetchAlbumDetails, isLoading]);

  const onFinalSubmit = React.useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleContinue = React.useCallback(async () => {
    if (!albumId || !albumDetails) return;

    const payload: UpdateStatusPayload = {
      id: albumId,
      labelid: albumDetails.labelId,
      albumName: albumDetails.title,
      status: AlbumProcessingStatus.Processing,
      comment: "",
    };

    try {
      const response = await apiPost<UpdateStatusResponse, UpdateStatusPayload>("/api/albums/updateStatus", payload);

      if (response?.success) {
        toast.success("Thank you! Your album(s) are currently being processed");
        setAlbumDetails(prev => prev ? {
          ...prev,
          status: AlbumProcessingStatus.Processing,
        } : null);
      } else {
        toast.error(response?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error in API:", error);
      toast.error("Internal server error");
    }
  }, [albumId, albumDetails]);

  const handleUPCUpdate = async () => {
    if (!albumId || !albumDetails) return;

    try {
      const response = await apiPost<UpdateStatusResponse, { id: string; upc: string }>(
        "/api/albums/updateUPC",
        {
          id: albumId,
          upc: editedUPC
        }
      );

      if (response?.success) {
        setAlbumDetails(prev => prev ? {
          ...prev,
          upc: editedUPC
        } : null);
        setIsUPCModalOpen(false);
        toast.success("UPC updated successfully");
      } else {
        toast.error(response?.message || "Failed to update UPC");
      }
    } catch (error) {
      console.error("Error updating UPC:", error);
      toast.error("Failed to update UPC");
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
            <a
              href={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${albumId}ba3/cover/${albumDetails.thumbnail}`}
              download={albumDetails.thumbnail as string}
              target="_blank"
              rel="noreferrer"
              className="w-full"
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${albumId}ba3/cover/${albumDetails.thumbnail}`}
                alt="album thumbnail"
                width={480}
                height={480}
                className={Style.albumThumbnail}
              />
            </a>
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
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                  UPC:
                </span>
                <div className="flex items-center gap-2">
                  {albumDetails?.upc || "Not set"}
                  {userType !== "customerSupport"  && (
                    <button
                      onClick={() => {
                        setIsUPCModalOpen(true);
                        setEditedUPC("");
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

          {userType !== "customerSupport" && (
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
          )}

          { userType !== "customerSupport" &&  albumId && (
            <AlbumStatusUpdate
              albumid={albumId}
              labelid={albumDetails?.labelId as string}
              albumName={albumDetails?.title as string}
              onUpdate={() => fetchAlbumDetails(albumId)}
            />
          )}
        </div>
      </div>

      {/* list of tracks  */}

      {albumDetails && albumDetails.totalTracks > 0 ? (
        albumId && (
          <TrackSection albumId={albumId} albumStatus={albumDetails.status} />
        )
      ) : (
        <div className="mt-5 pt-4">
          <h1 className="text-center text-2xl mt-5">No track found</h1>
        </div>
      )}

      <ConfirmationDialog
        show={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onContinue={handleContinue}
        title="Are You Sure ?"
        description="Please note that once you submit your final details, you will not be able to make any further changes."
      />

      <Modal
        isVisible={isUPCModalOpen}
        triggerLabel="Save"
        title="Update UPC"
        onSave={handleUPCUpdate}
        onClose={() => setIsUPCModalOpen(false)}
      >
        <div>
          <label className="form-label" htmlFor="upc">
            UPC
          </label>
          <input
            id="upc"
            type="text"
            value={editedUPC}
            onChange={(e) => setEditedUPC(e.target.value)}
            className="form-control"
            placeholder="Enter UPC"
          />
        </div>
      </Modal>

      {/* list of tracks  */}
    </div>
  );
};

export default Albums;
