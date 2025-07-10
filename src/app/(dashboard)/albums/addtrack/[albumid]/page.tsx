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
import CallerTune from "./callertune/callertune";

type ArtistTypeOption = {
  label: string;
  value: string;
};

export default function NewTrack({ params }: { params: { albumid: string } }) {
  const searchParams = useSearchParams();
  const labelParam = searchParams.get("label"); // This will give you the label parameter

  const [albumId, setAlbumId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [labelId, setLabelId] = useState<string | null>(null);

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

  const router = useRouter();

  useEffect(() => {
    const albumIdParams = params.albumid;
    try {
      const decodedAlbumId = atob(albumIdParams);
      setAlbumId(decodedAlbumId);

      setLabelId(atob(labelParam || ""));
    } catch (e) {
      setError("Invalid Url");
      console.error("Decoding error:", {
        albumIdParams,
        labelParam,
        error: e,
      });
    }
  }, [params.albumid, labelParam]); // Add params.albumid to the dependency array

  //! fetch artist
  const fetchArtist = async (labelId: string) => {
    try {
      const response: any = await apiGet(
        `/api/artist/fetchArtists?labelId=${labelId}`
      );



      if (response.success) {
        setArtistData(response.data);
      } else {
        toast.error(response.message || "Failed to fetch artists");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching artists");
    }
  };

  useEffect(() => {
    if (labelId) {
      fetchArtist(labelId);
    }
  }, [labelId]);

  const formatOptions = (artists: any[]) => {
    return artists.map((artist: any) => ({
      value: artist.value,
      label: artist.label,
    }));
  };

  const handleSelectChange =
    (type: string) => (selectedItems: ArtistTypeOption[]) => {
      switch (type) {
        case "singer":
          if (selectedItems.length >= 20) {
            toast.error("You can select a maximum of 20 items.");
          } else {
            setSelectedSingers(selectedItems);
          }
          break;
        case "lyricist":
          if (selectedItems.length > 5) {
            toast.error("You can select a maximum of 5 items.");
          } else {
            setSelectedLyricists(selectedItems);
          }
          break;
        case "composer":
          if (selectedItems.length > 5) {
            toast.error("You can select a maximum of 5 items.");
          } else {
            setSelectedComposers(selectedItems);
          }
          break;
        case "producer":
          if (selectedItems.length > 5) {
            toast.error("You can select a maximum of 5 items.");
          } else {
            setSelectedProducers(selectedItems);
          }
          break;
        default:
          break;
      }
    };

  // ! here is code for artist type mulit select input
  // primary singer

  const [callerTuneTime] = useState("00:00:00");

  const [errors] = useState<any>({});

  const convertToSeconds = (time: string) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  // ! Handel form submit -->

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (albumId) {
      formData.append("albumId", albumId);
    }

    const audioFile = formData.get("audioFile") as File;
    if (!audioFile || !["audio/mpeg", "audio/wav"].includes(audioFile.type)) {
      toast.error("Invalid file type. Please upload an MP3 or WAV file.");
      return;
    }

    const audio = new Audio(URL.createObjectURL(audioFile));

    const loadAudioMetadata = new Promise<void>((resolve, reject) => {
      audio.onloadedmetadata = () => {
        const audioDuration = audio.duration;

        formData.append("duration", audioDuration.toString());

        const callerTuneDuration = convertToSeconds(callerTuneTime);

        if (callerTuneDuration > audioDuration) {
          toast.error(
            "Caller Tune Time can't be greater than audio file duration."
          );
          reject(
            new Error(
              "Caller Tune Time can't be greater than audio file duration."
            )
          );
        } else {
          resolve();
        }
      };
      audio.onerror = () => reject(new Error("Failed to load audio metadata"));
    });

    try {
      await loadAudioMetadata; // Wait for metadata to be loaded

      // const data: Record<string, any> = {};

      // formData.forEach((value, key) => {
      //   data[key] = value;
      // });

      if (selectedSingers.length === 0) {
        toast.error("Please select at least one singer.");
        return;
      }
      if (selectedComposers.length === 0) {
        toast.error("Please select at least one composer.");
        return;
      }
      if (selectedLyricists.length === 0) {
        toast.error("Please select at least one lyricist.");
        return;
      }
      if (selectedProducers.length === 0) {
        toast.error("Please select at least one Producer.");
        return;
      }

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

      // Add featured artist to form data
      const featuredArtist = formData.get("featuredArtist");

      if (featuredArtist) {
        formData.append("featuredArtist", featuredArtist.toString());
      }

      setIsUploading(true);
      const response: any = await apiFormData("/api/track/addtrack", formData);

      if (response.success) {
        toast.success("Song uploaded successfully!");
        router.push(`/albums/viewalbum/${btoa(albumId!)}`);
      } else {
        setIsUploading(false);
        toast.error(response.message);
      }
    } catch (error) {
      setIsUploading(false);
      toast.error("Something went wrong while uploading the song.");
      console.error("Error:", error);
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
                <BreadcrumbPage>New Track</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-3xl font-bold mb-6 text-blue-500">
            Track Details
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-12 gap-6 ">
              <div className="col-span-8 space-y-6 ">
                {/* {albumId && (<input type="hidden" name="albumid" value={albumId} />)} */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Song Title
                  </label>
                  <input
                    name="songName"
                    type="text"
                    placeholder="Song Title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.title._errors[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Audio File (Max 128M)
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
                          required
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
                  </div>
                </div>

                <div>
                  <CallerTune />
                </div>

                <div>
                  {/* <label className="block text-sm font-medium mb-2 text-gray-700">
                    Singer
                  </label>

                  <select
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
                  </select> */}
                  {/* <div className="inline-block text-blue-700 mt-2 cursor-pointer"
                  onClick={() => setIsModalVisible(true)}
                  >
                    <i className="bi bi-plus-circle-fill"></i> Add New Singer
                  </div> */}

                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.title._errors[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Singers
                  </label>
                  <MultiSelect
                    hasSelectAll={false}
                    options={formatOptions(artistData.singer)}
                    value={selectedSingers}
                    onChange={handleSelectChange("singer")}
                    labelledBy="Select Singers"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Featured Artist ({" "}
                    <span className="text-sm text-gray-500 italic">
                      You can use multiple featured artists separated by commas,
                      e.g., Artist1, Artist2
                    </span>
                    ){" "}
                  </label>

                  <input
                    name="featuredArtist"
                    type="text"
                    placeholder="ft. max, bob"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <h3>Lyricists </h3>
                  <MultiSelect
                    hasSelectAll={false}
                    options={formatOptions(artistData.lyricist)}
                    value={selectedLyricists}
                    onChange={handleSelectChange("lyricist")}
                    labelledBy="Select Lyricists"
                  />
                </div>

                <div>
                  <h3>Composers </h3>
                  <MultiSelect
                    hasSelectAll={false}
                    options={formatOptions(artistData.composer)}
                    value={selectedComposers}
                    onChange={handleSelectChange("composer")}
                    labelledBy="Select Composers"
                  />
                </div>

                <div>
                  <h3>Producers </h3>
                  <MultiSelect
                    hasSelectAll={false}
                    options={formatOptions(artistData.producer)}
                    value={selectedProducers}
                    onChange={handleSelectChange("producer")}
                    labelledBy="Select Producers"
                  />
                </div>
              </div>

              <div className="col-span-4 space-y-6 ">
                <div className="flex flex-col">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Track Category{" "}
                  </label>
                  <select
                    name="category"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Song Category</option>
                    <option value="POP">POP</option>
                    <option value="CHORAL MUSIC">CHORAL MUSIC</option>
                    <option value="COMMERCIAL JINGLE">COMMERCIAL JINGLE</option>
                    <option value="INSTRUMENTAL MUSIC">
                      INSTRUMENTAL MUSIC
                    </option>
                    <option value="INTERVAL MUSIC">INTERVAL MUSIC</option>
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.category._errors[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Track Type{" "}
                  </label>
                  <select
                    name="trackType"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Track Type</option>
                    <option value="Vocal">Vocal</option>
                    <option value="Instrumental">Instrumental</option>
                  </select>
                  {errors.trackType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.trackType._errors[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Version{" "}
                  </label>
                  <select
                    name="version"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Remix">Remix</option>
                    <option value="Original">Original</option>
                  </select>
                  {errors.version && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.version._errors[0]}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 mt-5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </>
      )}

      {isUploading && (
        <Uploading message="Your file is currently being uploaded" />
      )}
    </div>
  );
}
