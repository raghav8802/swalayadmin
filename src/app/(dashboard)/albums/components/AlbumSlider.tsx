import { apiGet } from "@/helpers/axiosRequest";
import React, { useEffect, useState } from "react";
import NewReleaseItem from "./NewReleaseItem";

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
  status: number;
  tags: string[];
  thumbnail: string;
  title: string;
  _id: string;
}

// Define the interface for the props
interface AlbumSliderProps {
  labelId: string;
}


const AlbumSlider: React.FC<AlbumSliderProps> = ({ labelId }) => {
  const [albumList, setAlbumList] = useState<Album[]>([]);

  const fetchAlbums = async (labelId: string) => {
    try {
      const response = await apiGet(
        `/api/albums/filter?labelid=${labelId}&status=Processing&limit=6`
      );
      console.log("response card --");
      console.log(response);
      console.log(response.data);

      if (response.success) {
        setAlbumList(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (labelId) {
      fetchAlbums(labelId);
    }
  }, [labelId]);

  return (
    <div className="w-full flex items-center justify-start">
      {albumList &&
        albumList.map((album) => (
          <NewReleaseItem
            albumId={album._id}
            key={album._id}
            imageSrc={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${album._id}ba3/cover/${album.thumbnail}`}
            albumName={album.title}
            albumArtist={album.artist}
            status={album.status}
          />
        ))}
    </div>
  );
};

export default AlbumSlider;
