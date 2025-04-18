"use client";

import React, { useContext, useEffect, useState } from "react";

// import Style from '../'
import Style from "../../styles/Albums.module.css";

// import MusicPlayer from './components/MusicPlayer'
// import NewReleaseItem from "./components/NewReleaseItem";
import Link from "next/link";
import { AlbumDataTable } from "./components/AlbumDataTable";
import UserContext from "@/context/userContext";
import toast from "react-hot-toast";
import { apiGet } from "@/helpers/axiosRequest";
import AlbumsLoading from "@/components/AlbumsLoading";
import AlbumSlider from "./components/AlbumSlider";
// import DataTableUi from '../components/DataTable'

interface Album {
  _id: string;
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
  thumbnail: string | null;
  title: string;
  totalTracks: number;
  upc: string | null;
}

interface AlbumsResponse {
  success: boolean;
  data: Album[];
  message?: string;
}

const Albums = () => {
  const context = useContext(UserContext);
  const labelId = context?.user?._id;

  const [albumList, setAlbumList] = useState<Album[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchAlbums = async (labelId: string) => {
    try {
      const response = await apiGet<AlbumsResponse>(
        `./api/albums/getAlbums?labelid=${labelId}`
      );
      if (response?.success) {
        setAlbumList(response.data);
      } else {
        toast.error(response?.message || "Failed to fetch albums");
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
      toast.error("Internal server error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (labelId && isLoading) {
      fetchAlbums(labelId);
    }
  }, [labelId]);

  if (isLoading) {
    return <AlbumsLoading />;
  }

  return (
    <div className=" w-100">
      <div className={Style.topbar}>
        <div className={Style.tagLineBox}>
          <p className={Style.titleLabel}>Swalay Talent on core</p>
          <p className={Style.taglineLabel}>
            Swalay Talent on core Tag line for music for indepent artist
          </p>
        </div>
        <div className={Style.exportBtnGroup}>
          {/* <button className={`me-2 ${Style.ytExportButton}`}><i className={`bi bi-youtube ${Style.youtubeIcon} me-1`}></i> Exports</button>
                    <button className={`me-2 ${Style.importButton}`}> Exports</button> */}
          <Link href={"./albums/new-release"} className={Style.importButton}>
            + New Release
          </Link>
        </div>
      </div>

      {/* new releases  */}
      <div className={`mt-3 mb-3 ${Style.newReleseContainer}`}>
        <div className={` mb-3 ${Style.spaceBetween}`}>
          <h3 className={Style.titleHeading}>New releases</h3>
        </div>
        {/* <div className={`mb-3 ${Style.albumContainer}`}> */}
        <div className={`mb-3`}>
          {labelId && <AlbumSlider labelId={labelId} />}
        </div>
      </div>

      {/* all music list  */}

      <div
        className={`bg-white p-3 border rounded mt-5 ${Style.musicListContainer}`}
      >
        <div className={` ${Style.spaceBetween}`}>
          <h3 className={Style.titleHeading}>All releases</h3>
          <div className={Style.slideController}>
            <i className="bi bi-sort-alpha-down mr-3"></i>
            <i className="bi bi-sort-alpha-down-alt"></i>
          </div>
        </div>

        <div className={Style.musicList}>
          {albumList.length > 0 ? (
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
