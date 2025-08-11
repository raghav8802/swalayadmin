import React from "react";
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
import { api } from "@/lib/apiRequest";

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


const Page = async () => {
 
 const response = await api.get<ApiResponse>("/api/marketing/fetchAlbumBymarketing");
 console.log("marketing data response");
 console.log(response.data);
 const marketingData = response.data;


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
