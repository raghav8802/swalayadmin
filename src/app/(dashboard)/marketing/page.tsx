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

const Page = () => {
  const context = useContext(UserContext);
  const labelId = context?.user?._id ?? "";
  const [marketingData, setMarketingData] = useState<Album[]>([]);

  // const fetchMarketingDetails = async () => {
  //   try {
  //     const response = await apiGet(`/api/marketing/get?labelId=${labelId}`);
  //     // console.log("response : ");
  //     // console.log(response);
  //     if (response.success) {
  //         setMarketingData(response.data)
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const fetchAlbumBymarketing = async () => {
  const fetchAlbumBymarketing = async () => {
    try {
      // const response = await apiGet(`/api/marketing/fetchAlbumBymarketing?labelId=${labelId}`);
      const response:any  = await apiGet(`/api/marketing/fetchAlbumBymarketing`);

      if (response.success) {
        setMarketingData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (labelId) {
      // fetchMarketingDetails();
      fetchAlbumBymarketing();
    }
  }, [labelId]);

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

      {/* <MarketingList data={marketingData} /> */}

      {/* <div className="w-full flex items-center justify-start">

  </div> */}

      <div className="w-full flex items-center justify-start flex-wrap" >
        {marketingData &&
          marketingData.map((album) => (
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
