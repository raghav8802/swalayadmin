"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { useContext, useEffect, useState } from "react";

// import Style from '../'
import Style from "@/app/styles/Albums.module.css";

// import MusicPlayer from './components/MusicPlayer'
// import NewReleaseItem from './components/NewReleaseItem'
// import { AlbumDataTable } from "../components/AlbumDataTable";
import UserContext from "@/context/userContext";
import toast from "react-hot-toast";
import { apiGet } from "@/helpers/axiosRequest";
import AlbumsLoading from "@/components/AlbumsLoading";
import ErrorSection from "@/components/ErrorSection";
import { TrackDataTable } from "./components/TrackDataTable";
// import DataTableUi from '../components/DataTable'

const tracks = () => {
  // const filter = params.filter;
  //   const filter = params.filter.charAt(0).toUpperCase() + params.filter.slice(1).toLowerCase();

  //   const validFilters = ["All", "Draft", "Processing", "Approved", "Rejected", "Live"];
  //   if (!validFilters.includes(filter)) {
  //     return (
  //        <ErrorSection message="Invalid URL or Not Found" />
  //     );
  //   }
  // i want if filter is none of them then it show invalid url or url not NotFound

  //   const context = useContext(UserContext);
  //   const labelId = context?.user?._id;
  const [tracksData, setTracksData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  // walayadmin-main\src\app\api\\route.ts

  const fetchTracks = async () => {
    try {
      const response = await apiGet(`/api/track/fetchAllTracks`);
      if (response.success) {
        console.log(response.data);
        setIsLoading(false);
        setTracksData(response.data);
      }
    } catch (error) {
      toast.error("Internal server error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  //   if (isLoading) {
  //     return <AlbumsLoading />;
  //   }

  return (
    <div className="w-full h-dvh p-6 bg-white rounded-sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Albums</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize ">Tracks</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* all music list  */}

      <div className={`bg-white mt-3 rounded ${Style.musicListContainer}`}>
        <div className={` ${Style.spaceBetween}`}>
          <h3 className="text-3xl font-bold mb-2 text-blue-500 capitalize ">
            All Tracks
          </h3>
        </div>

        <div className={Style.musicList}>
          {!isLoading && tracksData ? (
            <TrackDataTable data={tracksData} />
          ) : (
            <h3 className="text-center mt-4">No Albums found</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default tracks;