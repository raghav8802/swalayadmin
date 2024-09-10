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
import Style from "../../../styles/Albums.module.css";

// import MusicPlayer from './components/MusicPlayer'
// import NewReleaseItem from './components/NewReleaseItem'
import Link from "next/link";
import { AlbumDataTable } from "../components/AlbumDataTable";
import UserContext from "@/context/userContext";
import toast from "react-hot-toast";
import { apiGet } from "@/helpers/axiosRequest";
import AlbumsLoading from "@/components/AlbumsLoading";
import ErrorSection from "@/components/ErrorSection";
// import DataTableUi from '../components/DataTable'

const albums = ({ params }: { params: { filter: string } }) => {
  // const filter = params.filter;
  const filter = params.filter.charAt(0).toUpperCase() + params.filter.slice(1).toLowerCase();


  const validFilters = ["All", "Draft", "Processing", "Approved", "Rejected", "Live"];
  if (!validFilters.includes(filter)) {
    return (
       <ErrorSection message="Invalid URL or Not Found" />
    );
  }
  // i want if filter is none of them then it show invalid url or url not NotFound
  
  const context = useContext(UserContext);
  const labelId = context?.user?._id;

  const [albumList, setAlbumList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchAlbums = async (labelId: string) => {
    try {
      const response = await apiGet(
        `/api/albums/filter?labelid=${labelId}&status=${filter}`
      );
      if (response.success) {
        setAlbumList(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal server error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (labelId) {
      fetchAlbums(labelId);
    }
  }, [labelId]);

  if (isLoading) {
    return <AlbumsLoading />;
  }




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
            <BreadcrumbPage className="capitalize ">{filter}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* all music list  */}

      <div className={`bg-white mt-3 rounded ${Style.musicListContainer}`}>
        <div className={` ${Style.spaceBetween}`}>
          <h3 className="text-3xl font-bold mb-2 text-blue-500 capitalize ">
            {filter} Albums 
          </h3>
        </div>

        <div className={Style.musicList}>
          {albumList ? (
            <AlbumDataTable data={albumList} />
          ) : (
            <h3 className="text-center mt-4">No Albums found</h3>
          )}
        </div>
      </div>

    </div>
  );
};

export default albums;
