"use client";
import React, { useContext, useEffect, useState } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ErrorSection from "@/components/ErrorSection";
import toast from "react-hot-toast";
import { apiFormData, apiGet } from "@/helpers/axiosRequest";
import UserContext from "@/context/userContext";
import { MultiSelect } from "react-multi-select-component";
import { useRouter } from "next/navigation";
import Uploading from "@/components/Uploading";

// interface Person {
//   name: string;
//   ipi: string;
//   iprs: "Yes" | "No";
//   role: string;
// }

type ArtistTypeOption = {
  label: string;
  value: string;
};

interface Track {
  songName: string;
  primarySinger: string;
  singers: string[];
  composers: string[];
  lyricists: string[];
  producers: string[];
  isrc: string;
  duration: string;
  crbt: string;
  category: string;
  version: string;
  trackType: string;
  audioFile?: string; // Add optional field for audio file
  albumId?: string;
}

export default function UpdateTrack({
  params,
}: {
  params: { trackid: string };
}) {
  const trackIdParams = params.trackid;
  const [trackId, setTrackId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [albumId, setAlbumId] = useState<string | null>(null);
  const [track, setTrack] = useState<Track | null>(null);

  const context = useContext(UserContext);
  const labelId = context?.user?._id;

  const router = useRouter();

  useEffect(() => {
    try {
      const decodedTrackId = atob(trackIdParams);
      setTrackId(decodedTrackId);
    } catch (e) {
      setError("Invalid Url");
      console.error("Decoding error:", e);
    }
  }, [trackIdParams]);

  //! here is code for artist type mulit select input

  const [artistData, setArtistData] = useState<any>({
    singer: [],
    lyricist: [],
    composer: [],
    producer: [],
  });
  // primary singer
  const [primarySinger, setPrimarySinger] = useState("");

  const [selectedSingers, setSelectedSingers] = useState<ArtistTypeOption[]>([]);
  const [selectedLyricists, setSelectedLyricists] = useState<ArtistTypeOption[]>([]);
  const [selectedComposers, setSelectedComposers] = useState<ArtistTypeOption[]>([]);
  const [selectedProducers, setSelectedProducers] = useState<ArtistTypeOption[]>([]);

  const formatOptions = (artists: any[]) => {
    return artists.map((artist: any) => ({
      value: artist.value,
      label: artist.label,
    }));
  };

  const handleSelectChange =
    (type: string) => (selectedItems: ArtistTypeOption[]) => {
      if (selectedItems.length > 3) {
        toast.error("You can select a maximum of 3 items.");
      } else {
        switch (type) {
          case "singer":
            setSelectedSingers(selectedItems);
            break;
          case "lyricist":
            setSelectedLyricists(selectedItems);
            break;
          case "composer":
            setSelectedComposers(selectedItems);
            break;
          case "producer":
            setSelectedProducers(selectedItems);
            break;
          default:
            break;
        }
      }
    };

  // fetch track details
  const fetchTrackDetails = async () => {
    try {
      const response = await apiGet(
        `/api/track/getTrackDetails?trackId=${trackId}`
      );
      console.log("response : ");
      console.log(response.data);
      
      if (response.success) {
        const trackData = response.data;
        setTrack(trackData);
        setAlbumId(trackData.albumId || "");
        console.log(trackData.primarySinger._id);
        setPrimarySinger(trackData.primarySinger._id)

        let ss =  trackData.singers.map((s: string) => ({ value: s, label: s }));
        console.log("ss : ");
        console.log(ss);
        

        setSelectedSingers(
          trackData.singers.map((s: string) => ({ value: s, label: s }))
        );
        setSelectedComposers(
          trackData.composers.map((c: string) => ({ value: c, label: c }))
        );
        setSelectedLyricists(
          trackData.lyricists.map((l: string) => ({ value: l, label: l }))
        );
        setSelectedProducers(
          trackData.producers.map((p: string) => ({ value: p, label: p }))
        );
        setCallerTuneTime(trackData.crbt || "00:00:00");
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (trackId) {
      fetchTrackDetails();
    }
  }, [trackId]);

  //! fetch artist
  const fetchArtist = async (labelId: string) => {
    try {
      const response = await apiGet(
        `/api/artist/fetchArtists?labelId=${labelId}`
      );
      if (response.success) {
        setArtistData(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong to fetch artist");
    }
  };

  useEffect(() => {
    if (labelId) {
      fetchArtist(labelId);
    }
  }, [labelId]);

  const [callerTuneTime, setCallerTuneTime] = useState("00:00:00");
  const [errors, setErrors] = useState<any>({});

  const convertToSeconds = (time: string) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  // ! Handel form submit -->

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (trackId) {
      formData.append("trackId", trackId);
    }

    const audioFile = formData.get("audioFile") as File;
    if (!audioFile || !["audio/mpeg", "audio/wav"].includes(audioFile.type)) {
      toast.error("Invalid file type. Please upload an MP3 or WAV file.");
      return;
    }

    const audio = new Audio(URL.createObjectURL(audioFile));

    audio.onloadedmetadata = () => {
      const audioDuration = audio.duration;
      formData.append("duration", audioDuration.toString());

      const callerTuneDuration = convertToSeconds(callerTuneTime);
      if (callerTuneDuration > audioDuration) {
        toast.error(
          "Caller Tune Time can't be greater than audio file duration."
        );
        return;
      }
    };

    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    formData.append(
      "singers",
      JSON.stringify(selectedSingers.map((s) => s.value))
    );
    formData.append(
      "composers",
      JSON.stringify(selectedComposers.map((c) => c.value))
    );
    formData.append(
      "lyricists",
      JSON.stringify(selectedLyricists.map((l) => l.value))
    );
    formData.append(
      "producers",
      JSON.stringify(selectedProducers.map((p) => p.value))
    );

    try {
      setIsUploading(true);
      const response = await apiFormData("/api/track/updateTrack", formData);
      if (response.success) {
        toast.success("Track updated successfully!");
      } else {
        setIsUploading(false);
        toast.error(response.message);
      }
    } catch (error) {
      setIsUploading(false);
      toast.error("Something went wrong while updating the track.");
      console.error("Error:", error);
    }
  };

  if (error) {
    return <ErrorSection message="Invalid track url" />;
  }

  return (
    <div className="w-full h-full p-6 bg-white rounded-sm">
      {!isUploading && (
        <>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Albums</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit Track</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-3xl font-bold mb-6 text-blue-500">
            Track Details
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-12 gap-6 ">
              <div className="col-span-8 space-y-6 ">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Song Title
                  </label>
                  <input
                    name="songName"
                    type="text"
                    defaultValue={track?.songName || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Primary Singer 
                  </label>

                      <select
                      value={primarySinger}
                      onChange={(e) => setPrimarySinger(e.target.value)}
                    name="primarySinger"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Primary Singer</option>
                    {artistData &&
                      artistData.singer.map((singer: any) => (
                        <option
                          className="py-2 border"
                          key={singer.value}
                          value={singer.value}
                        >
                          {singer.label}
                        </option>
                      ))}
                  </select>

                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Category
                  </label>
                  <input
                    name="category"
                    type="text"
                    defaultValue={track?.category || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Version
                  </label>
                  <input
                    name="version"
                    type="text"
                    defaultValue={track?.version || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Track Type
                  </label>
                  <input
                    name="trackType"
                    type="text"
                    defaultValue={track?.trackType || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Audio File
                  </label>
                  <input
                    name="audioFile"
                    type="file"
                    accept=".mp3, .wav"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Caller Tune Time
                  </label>
                  <input
                    name="crbt"
                    type="text"
                    value={callerTuneTime}
                    onChange={(e) => setCallerTuneTime(e.target.value)}
                    placeholder="HH:MM:SS"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="col-span-4 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Singers
                  </label>
                  <MultiSelect
                    options={formatOptions(artistData.singer)}
                    value={selectedSingers}
                    onChange={handleSelectChange("singer")}
                    labelledBy="Select Singers"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Lyricists
                  </label>
                  <MultiSelect
                    options={formatOptions(artistData.lyricist)}
                    value={selectedLyricists}
                    onChange={handleSelectChange("lyricist")}
                    labelledBy="Select Lyricists"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Composers
                  </label>
                  <MultiSelect
                    options={formatOptions(artistData.composer)}
                    value={selectedComposers}
                    onChange={handleSelectChange("composer")}
                    labelledBy="Select Composers"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Producers
                  </label>
                  <MultiSelect
                    options={formatOptions(artistData.producer)}
                    value={selectedProducers}
                    onChange={handleSelectChange("producer")}
                    labelledBy="Select Producers"
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Update Track
                  </button>
                </div>
              </div>
            </div>
          </form>
        </>
      )}

      {isUploading && <Uploading message="Track details are updating" />}
    </div>
  );
}
