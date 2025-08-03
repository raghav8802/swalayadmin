"use client";
import UserContext from "@/context/userContext";
import { apiGet } from "@/helpers/axiosRequest";
import React, { useContext, useEffect, useState } from "react";
// import { MarketingList } from "./components/MarketingList";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import MarketingCard from "./components/MarketingCard";
import useSWR from "swr";

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
  status: number;
  marketingStatus: string;
  tags: string[];
  thumbnail: string;
  title: string;
  _id: string;
}

interface ApiResponse {
  success: boolean;
  data: Album[];
}

// Create a fetcher function for SWR
const fetcher = (url: string) =>
  apiGet(url).then((res: any) => {
    console.log(" markeitng res :");
    console.log(res);
    if (!res.success) throw new Error("Failed to fetch marketing data");
    return res.data;
  });

const Page = () => {
  const context = useContext(UserContext);
  const labelId = context?.user?._id ?? "";

  // SWR data fetching
  const {
    data: marketingData,
    error,
    isLoading,
  } = useSWR(labelId ? "/api/marketing/fetchAlbumBymarketing" : null, fetcher, {
    refreshInterval: 60000, // 60 seconds
    revalidateOnFocus: true,
    shouldRetryOnError: true,
  });

  if (error) {
    console.error("Error fetching marketing data:", error);
    return <div>Error loading marketing data</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen p-6 bg-white rounded-sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Marketing</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-4 mt-5 text-blue-600">
        All marketings
      </h1>

      <div className="w-full flex items-center justify-start flex-wrap">
        {marketingData?.map((album: Album) => (
          <MarketingCard
            albumId={album._id}
            key={album._id}
            imageSrc={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${album._id}ba3/cover/${album.thumbnail}`}
            albumName={album.title}
            albumArtist={album.artist}
            status={album.marketingStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
