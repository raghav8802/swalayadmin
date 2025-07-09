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
import { useRouter, useSearchParams } from "next/navigation";
import Uploading from "@/components/Uploading";
import Loading from "@/app/(dashboard)/loading";


type ArtistTypeOption = {
  label: string;
  value: string;
};

interface Track {
  _id: string;
  songName: string;
  primarySinger: { _id: string; artistName: string } | null;
  singers: Array<{ _id: string; artistName: string }>;
  composers: Array<{ _id: string; artistName: string }>;
  lyricists: Array<{ _id: string; artistName: string }>;
  producers: Array<{ _id: string; artistName: string }>;
  isrc: string;
  duration: string;
  crbt: string;
  category: string;
  version: string;
  trackType: string;
  audioFile?: string;
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  
  const labelId = atob(useSearchParams().get("labelId") || "");
 
  const router = useRouter();

  useEffect(() => {
    try {
      const decodedTrackId = atob(trackIdParams);
      setTrackId(decodedTrackId);
    } catch (e) {
      setError("Invalid Url");

    }
  }, [trackIdParams]);

  const [artistData, setArtistData] = useState<any>({
    singer: [],
    lyricist: [],
    composer: [],
    producer: [],
  });

  const [selectedSingers, setSelectedSingers] = useState<ArtistTypeOption[]>(
    []
  );
  const [selectedLyricists, setSelectedLyricists] = useState<
    ArtistTypeOption[]
  >([]);
  const [selectedComposers, setSelectedComposers] = useState<
    ArtistTypeOption[]
  >([]);
  const [selectedProducers, setSelectedProducers] = useState<
    ArtistTypeOption[]
  >([]);

  const formatOptions = (artists: any[]) => {
    return artists.map((artist: any) => ({
      value: artist._id,
      label: artist.artistName,
    }));
  };

  const handleSelectChange =
    (type: string) => (selectedItems: ArtistTypeOption[]) => {
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
    };

  // fetch track details
  useEffect(() => {
    const fetchTrackDetails = async () => {
      try {
        const response:any = await apiGet(
          `/api/track/getTrackDetails?trackId=${trackId}`
        );
  
        if (response.success) {
          const trackData = response.data;
          setTrack(trackData);
          setAlbumId(trackData.albumId || "");
  
          // Set selected artists
          setSelectedSingers(
            trackData.singers.map((s: any) => ({
              value: s._id,
              label: s.artistName,
            }))
          );
          setSelectedComposers(
            trackData.composers.map((c: any) => ({
              value: c._id,
              label: c.artistName,
            }))
          );
          setSelectedLyricists(
            trackData.lyricists.map((l: any) => ({
              value: l._id,
              label: l.artistName,
            }))
          );
          setSelectedProducers(
            trackData.producers.map((p: any) => ({
              value: p._id,
              label: p.artistName,
            }))
          );
          setCallerTuneTime(trackData.crbt || "00:00:00");
        } else {
          setError(response.message);
        }
      } catch (error) {
        console.error("Error fetching track details:", error);
        toast.error("Failed to fetch track details");
      }
    };
  
    if (trackId) {
      fetchTrackDetails();
    }
  }, [trackId]);


  // fetch artist
  const fetchArtist = async (labelId: string) => {
 
    try {
      const response:any = await apiGet(
        `/api/artist/fetchArtists?labelId=${labelId}`
      );
  
      if (response.success) {
        // Transform the artist data to match the track details structure
        const transformedData = {
          singer: response.data.singer.map((artist: any) => ({
            _id: artist.value,
            artistName: artist.label,
          })),
          lyricist: response.data.lyricist.map((artist: any) => ({
            _id: artist.value,
            artistName: artist.label,
          })),
          composer: response.data.composer.map((artist: any) => ({
            _id: artist.value,
            artistName: artist.label,
          })),
          producer: response.data.producer.map((artist: any) => ({
            _id: artist.value,
            artistName: artist.label,
          })),
        };
        setArtistData(transformedData);
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

  const convertToSeconds = (time: string) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (trackId) {
      formData.append("trackId", trackId);
    }

    if (albumId) {
      formData.append("albumId", albumId);
    }

    const audioFile = formData.get("audioFile") as File;

    // If a new audio file is uploaded, process its metadata
    let audioDuration = track?.duration || "0"; // Use existing duration if

    if (audioFile && audioFile.size > 0) {
      if (audioFile && !["audio/mpeg", "audio/wav"].includes(audioFile.type)) {
        toast.error("Invalid file type. Please upload an MP3 or WAV file.");
        return;
      }

      const audio = new Audio(URL.createObjectURL(audioFile));

      try {
        await new Promise<void>((resolve, reject) => {
          audio.onloadedmetadata = () => {
            audioDuration = audio.duration.toString();
            formData.append("duration", audioDuration);
            resolve();
          };
          audio.onerror = () =>
            reject(new Error("Failed to load audio metadata"));
        });
      } catch (error) {
        toast.error("Failed to process audio file metadata.");
        return;
      }
    } else {
      // Append the existing duration if no new file is uploaded
      formData.append("duration", audioDuration);
    }

    // Validate Caller Tune Time
    const callerTuneDuration = convertToSeconds(callerTuneTime);
    if (callerTuneDuration > parseFloat(audioDuration)) {
      toast.error(
        "Caller Tune Time can't be greater than audio file duration."
      );
      return;
    }

    // Append other fields
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
      const response:any = await apiFormData("/api/track/updatetrack", formData);


      if (response.success) {
        toast.success("Track updated successfully!");
        router.push(`/albums/viewalbum/${btoa(albumId!)}`);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong while updating the track.");
      console.error("Error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  if (error) {
    return <ErrorSection message="Invalid track url" />;
  }

  if (!track) {
    return <Loading />;
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
                    defaultValue={track.songName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    defaultValue={track.category}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="POP">POP</option>
                    <option value="CHORAL MUSIC">CHORAL MUSIC</option>
                    <option value="COMMERCIAL JINGLE">COMMERCIAL JINGLE</option>
                    <option value="INSTRUMENTAL MUSIC">
                      INSTRUMENTAL MUSIC
                    </option>
                    <option value="INTERVAL MUSIC">INTERVAL MUSIC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Version
                  </label>
                  <select
                    name="version"
                    defaultValue={track.version}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="Remix">Remix</option>
                    <option value="Original">Original</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Track Type
                  </label>
                  <select
                    name="trackType"
                    defaultValue={track.trackType}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="Vocal">Vocal</option>
                    <option value="Instrumental">Instrumental</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Audio File
                  </label>
                  <div className="relative">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            MP3 or WAV (MAX. 128MB)
                          </p>
                        </div>
                        <input
                          name="audioFile"
                          type="file"
                          accept=".mp3, .wav"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    {selectedFile && (
                      <div className="mt-2 flex items-center justify-between bg-blue-50 p-2 rounded border border-blue-200">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-blue-500 mr-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <span className="text-sm text-blue-600 font-medium">
                            {selectedFile.name}
                          </span>
                        </div>
                        <span className="text-xs text-blue-500 font-medium">
                          New file
                        </span>
                      </div>
                    )}
                    {track.audioFile && (
                      <div className="mt-2 flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-gray-500 mr-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <span className="text-sm text-gray-600">
                            {track.audioFile}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          Current file
                        </span>
                      </div>
                    )}
                  </div>
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
                    className="min-h-[42px]"
                    overrideStrings={{
                      selectSomeItems: "Select singers...",
                      allItemsAreSelected: "All singers selected",
                      selectAll: "Select all singers",
                      search: "Search singers...",
                    }}
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
                    className="min-h-[42px]"
                    overrideStrings={{
                      selectSomeItems: "Select lyricists...",
                      allItemsAreSelected: "All lyricists selected",
                      selectAll: "Select all lyricists",
                      search: "Search lyricists...",
                    }}
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
                    className="min-h-[42px]"
                    overrideStrings={{
                      selectSomeItems: "Select composers...",
                      allItemsAreSelected: "All composers selected",
                      selectAll: "Select all composers",
                      search: "Search composers...",
                    }}
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
                    className="min-h-[42px]"
                    overrideStrings={{
                      selectSomeItems: "Select producers...",
                      allItemsAreSelected: "All producers selected",
                      selectAll: "Select all producers",
                      search: "Search producers...",
                    }}
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="w-full px-6 py-3 mt-5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
