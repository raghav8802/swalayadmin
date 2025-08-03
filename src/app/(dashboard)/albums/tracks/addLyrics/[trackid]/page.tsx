"use client"; // Add this at the top of the file

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS for styling
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb";
import AudioPlayer from "../../../viewalbum/[albumid]/components/AudioPlayer";
import { apiGet, apiPost } from "@/helpers/axiosRequest";
import toast from "react-hot-toast";

// Dynamically import react-quill with no SSR (server-side rendering)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Page = ({ params }: { params: { trackid: string } }) => {
  const trackIdParams = params.trackid;
  const [trackId, setTrackId] = useState<string | null>(null);
  const [trackName, setTrackName] = useState<string | null>(null);
  const [trackUrl, setTrackUrl] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState<string>(""); // State to hold the lyrics
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();

  // useEffect(() => {
  //   // Decode the trackId
  //   try {
  //     const decodedTrackID = atob(trackIdParams);
  //     setTrackId(decodedTrackID);
  //   } catch (e) {
  //     setError("Invalid Url");
  //     console.error("Decoding error:", e);
  //   }
  //   // Extract trackname and trackurl from the query parameters
  //   const tracknameParam = searchParams.get("trackname");
  //   const trackurlParam = searchParams.get("trackurl");
  //   if (tracknameParam) {
  //     setTrackName(tracknameParam);
  //   }
  //   if (trackurlParam) {
  //     setTrackUrl(trackurlParam);
  //   }
  // }, [trackIdParams, searchParams]);



  useEffect(() => {
    // Decode the trackId
    try {
      const decodedTrackID = atob(trackIdParams);
      setTrackId(decodedTrackID);
    } catch (e) {
      setError("Invalid Url");
      console.error("Decoding error:", e);
    }
  
    // Extract trackname and trackurl from the query parameters
    const tracknameParam = searchParams.get("trackname");
    const trackurlParam = searchParams.get("trackurl");
  
    if (tracknameParam) {
      setTrackName(tracknameParam);
    }
  
    if (trackurlParam) {
      setTrackUrl(trackurlParam);
    }
  
    // Fetch the lyrics when trackId is available
    if (trackId) {
      fetchLyrics(trackId);
    }
  }, [trackIdParams, searchParams, trackId]);
  


  const fetchLyrics = async (trackId: string) => {
    try {
      const response:any = await apiGet(`/api/lyrics/getLyrics?trackid=${trackId}`);
      if (response.success) {
        setLyrics(response.data.lyrics);
      } else {
        toast.error("Lyrics not found");
      }
    } catch (error) {
      toast.error("Failed to fetch lyrics");
    }
  };
  



  const handleLyricsChange = (value: string) => {
    setLyrics(value);
  };

  const saveLyrics = async () => {
    
    try {
      const response:any = await apiPost("/api/lyrics/updateLyrics/", {
        trackId,
        lyrics,
      });
    
      if (response.success) {
        toast.success("Lyrics updted");
        fetchLyrics(trackId as string)
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal server error");
    }

  };

  // Custom toolbar configuration for plain text only
  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ align: [] }],
      ["clean"], // Add 'clean' button for clearing formatting
    ],
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      className="w-full h-full p-6 bg-white rounded-sm"
      style={{ minHeight: "90vh" }}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Albums</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Track</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add Lyrics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mt-3">
        <h3 className="text-3xl font-bold mb-2 ">
          Add Lyrics of <span className="text-blue-500"> {trackName}</span>
        </h3>
        <button className="rounded px-4 py-3 btn-success" onClick={saveLyrics}>
          Save Changes
        </button>
      </div>
      <div className="bg-gray-100 p-4 rounded-md mb-4 mt-3">
        <p className="text-gray-700">
          <span className="text-lg font-semibold text-red-700">Note: </span>
          Please write lyrics in the following format:
        </p>
        <p className="text-gray-600 mt-2">
          <span className="font-bold">Line of song:</span>
          <span className="ml-2">Timestamp (minute:second)</span>
        </p>
      </div>

      {/* Quill Text Editor */}
      <div className="mt-3">
        <ReactQuill
          value={lyrics}
          onChange={handleLyricsChange}
          placeholder="Write your lyrics here..."
          theme="snow"
          modules={modules} // Apply custom modules
          style={{ height: "50vh" }} // Set the height to 50vh
          className="custom-quill-editor"
        />
      </div>

      <div className="mt-3">
        {trackName && (
          <AudioPlayer
            trackName={trackName as string}
            audioSrc={trackUrl as string}
          />
        )}
      </div>

    </div>
  );
};

export default Page;
