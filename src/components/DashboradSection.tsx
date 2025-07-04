"use client";
import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import UserContext from "@/context/userContext";
import { apiGet } from "@/helpers/axiosRequest";
import { NotificationSection } from "./NotificationSection";
import Image from "next/image";

interface Stats {
  albums: number;
  artists: number; // Updated to reflect total artists instead of labels
  labels: number; // Added to reflect totalBalance
  upcomingReleases: number; // Added to reflect upcoming releases (Processing status)
}

// Define the interface for the album item
interface Album {
  artist: string;
  cline: string;
  comment: string;
  date: string;
  genre: string;
  labelId: string;
  language: string;
  platformLinks: string | null;
  pline: string;
  releasedate: string;
  totalTracks: number;
  status: number;
  tags: string[];
  thumbnail: string;
  title: string;
  _id: string;
}

interface ArtistData {
  iprs: boolean;
  iprsNumber: string;
  isComposer: boolean;
  isLyricist: boolean;
  isProducer: boolean;
  isSinger: boolean;
  labelId: string;
  artistName: string;
  _id: string;
}

// Define the expected structure of the API response
interface NumberCountsResponse {
  totalAlbums: number;
  totalArtist: number;
  totalLabels: number;
  upcomingReleases: number;
}

export default function DashboradSection() {
  const context = useContext(UserContext);
  const labelId = context?.user?._id;

  const [stats, setStats] = useState<Stats>({
    albums: 0,
    artists: 0,
    labels: 0,
    upcomingReleases: 0,
  });

  // new relese
  const [newReleseData, setNewReleseData] = useState<Album[]>([]);
  const [draftAlbums, setDraftAlbums] = useState<Album[]>([]);
  const [artistData, setArtistData] = useState<ArtistData[]>([]);

  const fetchNumberCounts = useCallback(async () => {
    try {
      const response = await apiGet(`/api/numbers`) as NumberCountsResponse;

      if (response) {
        setStats({
          albums: response.totalAlbums,
          artists: response.totalArtist,
          labels: response.totalLabels,
          upcomingReleases: response.upcomingReleases,
        });
      }
    } catch (error) {
      console.error("Error fetching number counts:", error);
    }
  }, []);

  const fetchNewRelese = useCallback(async () => {
    try {
      const response = await apiGet(`/api/albums/filter?status=Live&limit=3`) as { success: boolean; data: Album[] };
      if (response.success) {
        setNewReleseData(response.data);
      }
    } catch (error) {
      console.log("Error fetching new releases:", error);
    }
  }, []);

  const fetchDraft = useCallback(async () => {
    try {
      const response = await apiGet(`/api/albums/filter?status=Draft&limit=3`) as { success: boolean; data: Album[] };
      if (response.success) {
        setDraftAlbums(response.data);
      }
    } catch (error) {
      console.log("Error fetching draft albums:", error);
    }
  }, []);

  const fetchAllArtist = useCallback(async () => {
    try {
      const response = await apiGet(`/api/artist/getArtists?labelId=${labelId}&limit=3`) as { success: boolean; data: ArtistData[] };
      if (response.success) {
        setArtistData(response.data);
      }
    } catch (error) {
      console.log("Error fetching artists:", error);
    }
  }, [labelId]);

  useEffect(() => {
    if (labelId) {
      fetchNumberCounts();
      fetchNewRelese();
      fetchDraft();
      fetchAllArtist();
    }
  }, [labelId, fetchNumberCounts, fetchNewRelese, fetchDraft, fetchAllArtist]);

  return (
    <div className="flex w-full flex-col bg-muted/40">
      <main className="flex flex-1 items-start gap-4 py-4 sm:py-0 md:gap-8 lg:grid lg:grid-cols-[1fr_300px]">
        <div className="grid gap-4 lg:col-span-2">
          {/* counts  */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          
          </div>
          {/* counts  */}

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-9">
              <div className="grid grid-cols-3 gap-4">
                {newReleseData && (
                  <div className="col-span-1 anlyticsCard">
                    {/* New Releases  */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">New Releases</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2">
                          {newReleseData.map((album) => (
                            <div
                              className="flex items-center justify-between"
                              key={album._id}
                            >
                              <div className="flex items-center gap-2">
                                <Image
                                  src={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${album._id}ba3/cover/${album.thumbnail}`}
                                  alt="Album Cover"
                                  width={40}
                                  height={40}
                                  className="rounded-md"
                                  style={{
                                    aspectRatio: "40/40",
                                    objectFit: "cover",
                                  }}
                                />
                                <div>
                                  <div className="font-medium">
                                    {album.title}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {album.artist}
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm font-medium">
                                {album.totalTracks}
                              </div>
                            </div>
                          ))}
                          <Link
                            href="/albums"
                            className="text-blue-600 hover:text-blue-800 underline mt-4 inline-block"
                          >
                            View More
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* upcoming Release  */}
                {draftAlbums && (
                  <div className="col-span-1 anlyticsCard">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Draft Albums</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2">
                          {draftAlbums.map((album) => (
                            <div
                              className="flex items-center justify-between"
                              key={album._id}
                            >
                              <div className="flex items-center gap-2">
                                <Image
                                  src={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${album._id}ba3/cover/${album.thumbnail}`}
                                  alt="Album Cover"
                                  width={40}
                                  height={40}
                                  className="rounded-md"
                                  style={{
                                    aspectRatio: "40/40",
                                    objectFit: "cover",
                                  }}
                                />
                                <div>
                                  <div className="font-medium">
                                    {album.title}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {album.artist}
                                  </div>
                                </div>
                              </div>
                              <Link
                                href={`/albums/viewalbum/${btoa(album._id)}`}
                                className="text-sm font-medium"
                              >
                                <i className="bi bi-pencil-square"></i>
                              </Link>
                            </div>
                          ))}

                          <Link
                            href="/albums/draft"
                            className="text-blue-600 hover:text-blue-800 underline mt-4 inline-block"
                          >
                            View More
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                {/* top artist  */}
                {artistData && (
                  <div className="col-span-1 anlyticsCard">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Top Artists</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2">
                          {artistData.map((artist) => (
                            <div
                              className="flex items-center justify-between mb-2"
                              key={artist._id}
                            >
                              <div className="flex items-center gap-2">
                                <div className="rounded-full bg-[#55efc4] w-8 h-8 flex items-center justify-center text-xl">
                                  🎤
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {artist.artistName}
                                  </div>
                                  {/* <div className="text-xs text-muted-foreground">
                                  1.2M monthly listeners
                                </div> */}
                                </div>
                              </div>
                              <Link
                                href={`/artist/${btoa(artist._id)}`}
                                className="text-sm font-medium"
                              >
                                <i className="bi bi-person-fill"></i>
                              </Link>
                            </div>
                          ))}

                          <Link
                            href="/artists"
                            className="text-blue-600 hover:text-blue-800 underline mt-4 inline-block"
                          >
                            View More
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <div className="col-span-12">
               
                  <Card className="w-full ">
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <Link
                          href={"/albums/new-release"}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className="bg-[#8B5CF6] rounded-full QuickAccessItem group-hover:bg-[#7C3AED] transition-colors">
                            <i className="bi bi-plus-circle QuickAccessItemIcon text-white"></i>
                          </div>
                          <span className="text-sm text-[#8B5CF6] group-hover:text-[#7C3AED] transition-colors">
                            New Release
                          </span>
                        </Link>

                        <Link
                          href={"/albums"}
                          className=" flex flex-col items-center gap-2 group"
                        >
                          <div className="QuickAccessItem bg-[#6366F1] rounded-full group-hover:bg-[#4F46E5] transition-colors">
                            <i className="QuickAccessItemIcon bi bi-inbox text-white"></i>
                          </div>
                          <span className="text-m text-[#6366F1] group-hover:text-[#4F46E5] transition-colors">
                            Releases
                          </span>
                        </Link>

                        <Link
                          href={"/earnings"}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className="QuickAccessItem bg-[#10B981] rounded-full  group-hover:bg-[#059669] transition-colors">
                            <i className="bi bi-currency-rupee QuickAccessItemIcon text-white"></i>
                          </div>
                          <span className="text-sm text-[#10B981] group-hover:text-[#059669] transition-colors">
                            Earnings
                          </span>
                        </Link>

                        <Link
                          href={"/artists"}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className="bg-[#EC4899] rounded-full QuickAccessItem group-hover:bg-[#D8336D] transition-colors">
                            <i className="bi bi-people QuickAccessItemIcon text-white"></i>
                          </div>
                          <span className="text-sm text-[#EC4899] group-hover:text-[#D8336D] transition-colors">
                            Artists
                          </span>
                        </Link>

                        <Link
                          href={"support"}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className="bg-[#3B82F6] rounded-full QuickAccessItem group-hover:bg-[#2563EB] transition-colors">
                            <i className="bi bi-headset QuickAccessItemIcon text-white"></i>
                          </div>
                          <span className="text-sm text-[#3B82F6] group-hover:text-[#2563EB] transition-colors">
                            Support
                          </span>
                        </Link>

                        <Link
                          href={"/labels/custom-email"}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className="bg-[#F59E42] rounded-full QuickAccessItem group-hover:bg-[#F59E42]/80 transition-colors">
                            <i className="bi bi-envelope-paper-fill QuickAccessItemIcon text-white"></i>
                          </div>
                          <span className="text-sm text-[#F59E42] group-hover:text-[#F59E42]/80 transition-colors">
                            Send Custom Email
                          </span>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="col-span-3 ">
              
              {labelId && <NotificationSection labelId={labelId} />}
            
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
