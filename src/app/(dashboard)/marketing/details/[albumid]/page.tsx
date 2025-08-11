"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useState, FC, useCallback } from "react";
import React from "react";
import { apiGet, apiPost } from "@/helpers/axiosRequest";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal";
// Loading
import toast from "react-hot-toast";
import Loading from "@/app/(dashboard)/loading";
import { formatDuration } from "@/lib/utils";

interface Track {
  composer: string[];
  duration: string;
  isrc: string;
  lyricist: string[];
  number: number | null;
  producer: string[];
  singer: string[];
  title: string;
}

type AlbumDetailsType = {
  _id: string;
  labelId: string;
  artist: string;
  iprs: boolean;
  iprsNumber: string;
  isComposer: boolean;
  isLyricist: boolean;
  isProducer: boolean;
  isSinger: boolean;
  cline: string;
  comment: string | null;
  date: string;
  genre: string;
  language: string;
  pline: string;
  releasedate: string;
  status: number;
  tags: string[];
  thumbnail: string;
  title: string;
  totalTracks: number;
  upc: string | null;
};

type MarketingData = {
  aboutArtist: string;
  aboutSong: string;
  albumId: string;
  albumName: string;
  artistInstagramUrl: string;
  extraFile: string;
  isExtraFileRequested: boolean;
  isSelectedForPromotion: boolean; // Add this field
  labelId: string;
  mood: string;
  promotionLinks: string;
  comment: string;
  __v: number;
  _id: string;
};

type MarketingType = {
  Marketing: MarketingData;
  albumDetails: AlbumDetailsType;
  artist: string;
  coverUrl: string;
  genre: string;
  labelName: string;
  labelType: string;
  releaseYear: number;
  title: string;
  tracks: Track[];
};

const Page = ({ params }: { params: { albumid: string } }) => {
  const albumIdParams = params.albumid;

  const [albumId, setAlbumId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const albumIdParams = params.albumid;

    try {
      const decodedAlbumId = atob(albumIdParams);

      setAlbumId(decodedAlbumId);
    } catch (e) {
      setError("Invalid Url");
      console.error("Decoding error:", e);
    }
  }, [params.albumid]);

  const fetchDetails = useCallback(async () => {
    if (!albumId) return; // Avoid making API calls if albumId is null
    setIsLoading(true);

    try {
      const response: any = await apiGet(
        `/api/marketing/details?albumId=${albumId}`
      );


      if (response.success) {
        setMarketingDetails(response.data);
        setAlbumDetails(response.data.albumDetails);
        setTrackDetails(response.data.tracks);
        setMarketingData(response.data.marketing);
      }
    } catch (error) {
      toast.error("Internal Server error");
    } finally {
      setIsLoading(false);
    }
  }, [albumId]);

  // Call fetchDetails when albumId is set
  useEffect(() => {
    if (albumId) {
      fetchDetails();
    }
  }, [albumId, fetchDetails]); // Fetch details only after albumId is set

  const [albumDetails, setAlbumDetails] = useState<AlbumDetailsType | null>(
    null
  );

  const [marketingDetails, setMarketingDetails] =
    useState<MarketingType | null>(null);

  const [trackDetails, setTrackDetails] = useState<Track | null>(null);
  const [MarketingData, setMarketingData] = useState<MarketingData | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [requestData, setRequestData] = useState({
    message: "",
  });

  const handleSave = async () => {
    toast.loading("updating...");
    setIsLoading(true);
    setIsModalVisible(false);
    try {
      const marketingId = MarketingData?._id;
      const message = requestData?.message;

      const response: any = await apiPost("/api/marketing/requestExtraFile", {
        marketingId,
        message,
        albumName: albumDetails?.title,
        labelId: albumDetails?.labelId,
      });
      toast.dismiss();
      setIsLoading(false);

      if (response.success) {
        toast.success(response.message);
        fetchDetails();
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleTogglePromotion = async () => {
    if (!MarketingData?._id) return;

    toast.loading("Updating promotion status...");
    try {
      const response: any = await apiPost("/api/marketing/togglePromotion", {
        marketingId: MarketingData._id,
      });

      toast.dismiss();
      if (response.success) {
        toast.success(response.message);
        // Update local state
        setMarketingData(response.data);
      } else {
        toast.error(response.message || "Failed to update promotion status");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to update promotion status");
      console.error("Error toggling promotion:", error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      className="w-full h-full p-2 bg-white rounded-sm"
      style={{ minHeight: "90vh" }}
    >
      {MarketingData?.isSelectedForPromotion && (
        <div className="mb-4 p-4 border rounded-lg bg-green-50 border-green-200">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-600 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-green-700 font-medium">
              This album has been selected for promotion
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {albumDetails && albumDetails.thumbnail && (
          <div className="flex-shrink-0">
            <Image
              src={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${albumDetails._id}ba3/cover/${albumDetails.thumbnail}`}
              alt={`album cover`}
              width={400}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        )}

        <div className="w-full">
          <h1 className="text-4xl font-bold mb-2">{albumDetails?.title}</h1>
          <p className="text-xl mb-2">{albumDetails?.artist}</p>
          <p className="text-xl mb-2">albumid : {albumId}</p>

          <div className="mb-4">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              {albumDetails?.genre}
            </span>
          </div>

          <section className="mb-8 w-full">
            <h2 className="text-2xl font-semibold mb-4">Album Details</h2>
            {/* {
              albumDetails && (
                <AlbumDetailsTable data={albumDetails} />
              )
            } */}

            {albumDetails && (
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Label Name</TableCell>
                    <TableCell>
                      <Link
                        className="text-blue-400"
                        href={`/labels/${btoa(albumDetails?.labelId)}`}
                      >
                        {marketingDetails?.labelName}
                      </Link>
                      <span>{}</span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Label Type</TableCell>
                    <TableCell>
                      {marketingDetails?.labelType === "normal"
                        ? "Artist"
                        : marketingDetails?.labelType === "super"
                        ? "Music label"
                        : ""}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Release Date</TableCell>
                    <TableCell>
                      {new Date(albumDetails.releasedate).toLocaleString(
                        "en-IN",
                        {
                          timeZone: "Asia/Kolkata",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        }
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Submission Date
                    </TableCell>
                    <TableCell>
                      {new Date(albumDetails.date).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      Number of Tracks
                    </TableCell>
                    <TableCell>{albumDetails.totalTracks}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Language</TableCell>
                    <TableCell>{albumDetails.language}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">P Line</TableCell>
                    <TableCell>{albumDetails.pline}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">C Line</TableCell>
                    <TableCell>{albumDetails.cline}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tags</TableCell>
                    <TableCell>{albumDetails.tags.join(", ")}</TableCell>
                  </TableRow>
                  {albumDetails.upc && (
                    <TableRow>
                      <TableCell className="font-medium">UPC</TableCell>
                      <TableCell>{albumDetails.upc}</TableCell>
                    </TableRow>
                  )}
                  {albumDetails.comment && (
                    <TableRow>
                      <TableCell className="font-medium">Comment</TableCell>
                      <TableCell>{albumDetails.comment}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </section>
        </div>
      </div>

      <section className="mb-4">
        <h2 className="text-2xl font-semibold mb-4">Track Listing</h2>
        {trackDetails && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No.</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Singers</TableHead>
                <TableHead>Producers</TableHead>
                <TableHead>Lyricists</TableHead>
                <TableHead>Composers</TableHead>
                <TableHead className="w-[100px]">Duration</TableHead>
                <TableHead>ISRC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(trackDetails) &&
                trackDetails.map((track, index) => (
                  <TableRow key={track.index + track.title}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="text-blue-500">
                      <Link
                        href={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${albumId}ba3/tracks/${track.audioFile}`}
                        target="_blank"
                        title="Click to Download"
                      >
                        {track.title}
                      </Link>
                    </TableCell>
                    <TableCell>{track.singer.join(", ")}</TableCell>
                    <TableCell>{track.producer.join(", ")}</TableCell>
                    <TableCell>{track.lyricist.join(", ")}</TableCell>
                    <TableCell>{track.composer.join(", ")}</TableCell>
                    <TableCell>
                      {formatDuration(parseFloat(track.duration))}
                    </TableCell>
                    <TableCell>{track.isrc}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold mb-4 mt-6">
            Marketing Details
          </h2>
          <div className="flex gap-2">
            <Button
              variant={
                MarketingData?.isSelectedForPromotion
                  ? "destructive"
                  : "default"
              }
              onClick={handleTogglePromotion}
            >
              {MarketingData?.isSelectedForPromotion
                ? "Remove from Promotion"
                : "Select for Promotion"}
            </Button>
            <Button onClick={() => setIsModalVisible(true)}>
              Request Extra File{" "}
            </Button>
          </div>
        </div>

        {MarketingData && (
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Album Name</TableCell>
                <TableCell>{MarketingData.albumName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">About Artist</TableCell>
                <TableCell>{MarketingData.aboutArtist}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">About Song</TableCell>
                <TableCell>{MarketingData.aboutSong}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Mood</TableCell>
                <TableCell>{MarketingData.mood}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Instagram</TableCell>
                <TableCell>
                  <a
                    className="text-blue-400"
                    href={MarketingData.artistInstagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {MarketingData.artistInstagramUrl}
                  </a>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">Promotion Status</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      MarketingData.isSelectedForPromotion
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {MarketingData.isSelectedForPromotion
                      ? "Selected for Promotion"
                      : "Not Selected"}
                  </span>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">Promotion Links</TableCell>
                <TableCell>
                  <a
                    className="text-blue-400"
                    href={MarketingData.promotionLinks}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {MarketingData.promotionLinks}
                  </a>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">
                  Is Extra File Requested
                </TableCell>
                <TableCell>
                  {MarketingData.isExtraFileRequested ? "Yes" : "No"}
                </TableCell>
              </TableRow>

              {MarketingData.comment && (
                <TableRow>
                  <TableCell className="font-medium">Message</TableCell>
                  <TableCell>{MarketingData.comment}</TableCell>
                </TableRow>
              )}

              {MarketingData.extraFile && (
                <TableRow>
                  <TableCell className="font-medium">Extra File</TableCell>

                  <TableCell>
                    <Link
                      href={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}labels/marketing/${MarketingData.extraFile}`}
                    >
                      {`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}labels/marketing/${MarketingData.extraFile}`}
                    </Link>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </section>

      <Modal
        isVisible={isModalVisible}
        triggerLabel="Submit"
        title="New Payment"
        onSave={handleSave}
        onClose={() => setIsModalVisible(false)}
      >
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-12">
            <label className="mb-2">Message</label>
            <textarea
              name=""
              id=""
              placeholder="Write about Requested file"
              className="form-control"
              onChange={(e) =>
                setRequestData({ ...requestData, message: e.target.value })
              }
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Page;
