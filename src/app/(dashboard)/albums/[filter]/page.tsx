"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { useContext, useEffect, useState, useCallback } from "react";

import Style from "../../../styles/Albums.module.css";

import { AlbumDataTable } from "../components/AlbumDataTable";
import UserContext from "@/context/userContext";
import toast from "react-hot-toast";
import { apiGet } from "@/helpers/axiosRequest";
import AlbumsLoading from "@/components/AlbumsLoading";
import ErrorSection from "@/components/ErrorSection";

interface AlbumResponse {
  success: boolean;
  data: any[];
  error?: string;
}

const Albums = ({ params }: { params: { filter: string } }) => {

  const filter = params.filter.charAt(0).toUpperCase() + params.filter.slice(1).toLowerCase();

  const context = useContext(UserContext);
  const labelId = context?.user?._id;

  const [albumList, setAlbumList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInvalidFilter, setIsInvalidFilter] = useState(false);

  const validFilters = ["All", "Draft", "Processing", "Approved", "Rejected", "Live"];

  useEffect(() => {
    if (!validFilters.includes(filter)) {
      setIsInvalidFilter(true);
    }
  }, [filter, validFilters]);

  const fetchAlbums = useCallback(async (labelId: string) => {
    try {
      const response = await apiGet<AlbumResponse>(
        `/api/albums/filter?status=${filter}`
      );
      if (response?.success) {
        setAlbumList(response.data);
      }
    } catch (error) {
      toast.error("Internal server error");
    }
    setIsLoading(false);
  }, [filter]);

  useEffect(() => {
    if (labelId && !isInvalidFilter) {
      fetchAlbums(labelId);
    }
  }, [labelId, fetchAlbums, isInvalidFilter]);

  if (isInvalidFilter) {
    return <ErrorSection message="Invalid URL or Not Found" />;
  }

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
          {albumList && albumList.length > 0 ? (
            <AlbumDataTable data={albumList} />
          ) : (
            <h3 className="text-center mt-4">No Albums found</h3>
          )}
        </div>
      </div>

    </div>
  );
};

export default Albums;
