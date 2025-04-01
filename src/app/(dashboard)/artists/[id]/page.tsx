"use client";
import { apiGet } from "@/helpers/axiosRequest";
import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Instagram, Twitter, Youtube, Calendar } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import EditArtistModal from "./components/EditArtistModal";
import AlbumCard from "./components/AlbumCard";

// import DeleteArtist from "./components/DeleteArtist";
// import Loading from "../../loading";

// Define the Artist type
interface Artist {
  labelId: string; // Change to the appropriate type if needed
  artistName: string;
  about: string;
  contact: string;
  email: string;
  iprs: boolean;
  iprsNumber?: number;
  facebook?: string;
  appleMusic?: string;
  spotify?: string;
  instagram?: string;
  profileImage?: string;
  isSinger: boolean;
  isLyricist: boolean;
  isComposer: boolean;
  isProducer: boolean;
}

type Album = {
  albumId: string;
  albumName: string;
  trackName: string;
  thumbnail: string;
  workAs: string[];
};

const ArtistPage = ({ params }: { params: { id: string } }) => {
  const artistId = params.id;
  const decodedArtistId = atob(artistId as string);

  const [isLoading, setIsLoading] = useState(true);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [albumData, setAlbumData] = useState([]);

  const fetchArtistDetails = useCallback(async () => {
    try {
      const response = await apiGet(
        `/api/artist/getArtistDetails?artistId=${decodedArtistId}`
      );

      if (response.success) {
        setArtist(response.data.artistData);
        setAlbumData(response.data.albums);
      } else {
        toast.error("Failed to fetch artist details");
      }
    } catch (error) {
      toast.error("Error!");
    } finally {
      setIsLoading(false);
    }
  }, [decodedArtistId]);

  useEffect(() => {
    fetchArtistDetails();
  }, [fetchArtistDetails]);

  const handleClose = () => {
    setIsModalVisible(false);
    // fetchAllArtist(labelId);
  };

  if (isLoading) {
    // return <Loading />;
    <div className="w-full h-screen flex items-center justify-center bg-white">
      <Image
        src="https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/loading.gif"
        width={100}
        height={100}
        alt="Loading"
      />
    </div>;
  }

  if (!artist) {
    return <div>No artist data found.</div>;
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
            <BreadcrumbPage>Artist</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Artist Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-4 mt-5 text-blue-600">
          Artist Details
        </h1>

        {/* <div className="flex justify-between items-center">
          <button
            className="bg-black text-white px-4 py-3 rounded me-4"
            onClick={() => setIsModalVisible(true)}
          >
            <i className="bi bi-pencil-square"></i> Edit
          </button>

          <DeleteArtist artistId={decodedArtistId as string} />
        </div> */}

      </div>

      {/* <p>Artist ID: {decodedArtistId}</p> */}

      {/* <pre>{JSON.stringify(artist, null, 2)}</pre> */}

      <div className="min-h-screen bg-white text-black">
        <div className="container mx-auto px-4 py-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center mb-12">
            {artist && artist.profileImage && (
              <div className="me-3">
                <Image
                  src={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}labels/artist/${artist.profileImage}`}
                  width={300}
                  height={300}
                  alt="artist profile"
                />
              </div>
            )}
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-2">
                {artist.artistName}
              </h1>

              {artist && (
                <p className="text-xl text-gray-600 mb-4">
                  {artist.isSinger && "Singer 🎤"}
                  {artist.isLyricist && " • Lyricist ✍️"}
                  {artist.isComposer && " • Composer 🎼"}
                  {artist.isProducer && " • Producer 🎚️"}
                </p>
              )}

              {artist && artist.iprs && (
                <p className="text-xl text-gray-600 mb-4">
                  <span className="text-bold">IPI: </span> {artist.iprsNumber}
                </p>
              )}

              <div className="flex justify-center md:justify-start space-x-4">
                {/* <Link
                  href={``}
                  className="border-black hover:bg-black hover:text-white"
                  target="_blank"
                >
                  <i className="bi bi-twitter-x"></i>
                </Link>
                <Link
                  href={``}
                  className="border-black hover:bg-black hover:text-white"
                  target="_blank"
                >
                  <i className="bi bi-youtube"></i>
                </Link>

                 */}
                {artist && artist.facebook !== "" && (
                  <Link
                    href={`https://www.facebook.com/${artist.facebook}`}
                    className="border-black "
                    target="_blank"
                  >
                    <i
                      className="bi bi-meta text-2xl"
                      style={{ color: "#0d76ea" }}
                    ></i>
                  </Link>
                )}

                {artist && artist.instagram !== "" && (
                  <Link
                    href={`https://www.instagram.com/${artist.artistName}`}
                    target="_blank"
                    className="border-black "
                  >
                    <i
                      className="bi bi-instagram text-2xl"
                      style={{ color: "#8a3ab9" }}
                    ></i>
                  </Link>
                )}

                {artist && artist.spotify !== "" && (
                  <Link
                    href={`https://open.spotify.com/artist/${artist.spotify}`}
                    className="border-black "
                    target="_blank"
                  >
                    <i
                      className="bi bi-spotify text-2xl"
                      style={{ color: "#1db954" }}
                    ></i>
                  </Link>
                )}

                {artist && artist.appleMusic !== "" && (
                  <Link
                    href={`https://music.apple.com/us/artist/${artist.appleMusic}`}
                    className="border-black "
                  >
                    <Image
                      src={`https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/music.png`}
                      width={30}
                      height={30}
                      alt="apple music"
                    />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <section className="mb-12">
            <div className="div">
              <h2 className="text-2xl font-semibold mb-4">About</h2>
              <p className="text-lg text-gray-700">
                {artist.about
                  ? artist.about
                  : "By clicking the edit button, you can add more artist details."}
              </p>
            </div>
          </section>

          {/* Contact Details */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Contact Details</h2>
            <Card className="bg-gray-100 border-none">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <i className="text-2xl mr-4 text-gray-600bi bi-envelope"></i>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600">
                      {artist.email
                        ? artist.email
                        : "By clicking the edit button, you can add more artist details."}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <i className="text-2xl mr-4 text-gray-600 bi bi-telephone"></i>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-gray-600">
                      {artist.contact
                        ? artist.contact
                        : "By clicking the edit button, you can add more artist details."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Latest Releases */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Latest Releases</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {albumData.map((album: Album) => (
                <AlbumCard key={album.albumId} album={album} />
              ))}
            </div>
          </section>

          {/* Upcoming Events */}
          {/* <section>
            <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((event) => (
                <Card
                  key={event}
                  className="bg-gray-100 border-none hover:bg-gray-200 transition-colors"
                >
                  <CardContent className="flex items-center p-4">
                    <Calendar className="h-12 w-12 mr-4 text-gray-600" />
                    <div>
                      <h3 className="font-semibold">Event Name {event}</h3>
                      <p className="text-sm text-gray-600">
                        Date • Venue • City
                      </p>
                    </div>
                    <Button className="ml-auto bg-black text-white hover:bg-gray-800">
                      Get Tickets
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section> */}

          <EditArtistModal
            isVisible={isModalVisible}
            onClose={handleClose}
            artistData={artist}
          />
        </div>
      </div>
    </div>
  );
};

export default ArtistPage;
