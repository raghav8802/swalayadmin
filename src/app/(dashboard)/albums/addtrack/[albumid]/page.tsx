"use client";
import { useContext, useEffect, useState } from "react";
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

interface Person {
  name: string;
  ipi: string;
  iprs: "Yes" | "No";
  role: string;
}

type ArtistTypeOption = {
  label: string;
  value: string;
};

export default function NewTrack({ params }: { params: { albumid: string } }) {
  
  const albumIdParams = params.albumid;
  const [albumId, setAlbumId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const context = useContext(UserContext);
  const labelId = context?.user?._id;

  const router = useRouter();

  useEffect(() => {
    const albumIdParams = params.albumid;
    try {
      const decodedAlbumId = atob(albumIdParams);
      setAlbumId(decodedAlbumId);
    } catch (e) {
      setError("Invalid Url");
      console.error("Decoding error:", e);
    }
  }, [albumIdParams]);

  //! here is code for artist type mulit select input

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

  // ! here is code for artist type mulit select input
  // primary singer
  const [primarySinger, setPrimarySinger] = useState("");

  //! fetch artist
  const fetchArtist = async (labelId: string) => {
    try {
      const response = await apiGet(
        `/api/artist/fetchArtists?labelId=${labelId}`
      );
      // console.log(response);
      // console.log(response.success);
      // console.log(response.data);
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

    if (albumId) {
      formData.append("albumId", albumId);
      console.log("album id added");
    }

    const audioFile = formData.get("audioFile") as File;
    if (!audioFile || !["audio/mpeg", "audio/wav"].includes(audioFile.type)) {
      toast.error("Invalid file type. Please upload an MP3 or WAV file.");
      return;
    }

    const audio = new Audio(URL.createObjectURL(audioFile));

    audio.onloadedmetadata = () => {
      const audioDuration = audio.duration;
      console.log("audio.duration");
      console.log(audioDuration);
      console.log(" | ");
      console.log(audioDuration.toString());
      formData.append("duration", audioDuration.toString());

      const callerTuneDuration = convertToSeconds(callerTuneTime);
      console.log("callerTuneDuration");
      console.log(callerTuneDuration);
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

    console.log(data);
    console.log("selected other artist");
    console.log(selectedSingers);
    console.log(selectedComposers);
    console.log(selectedLyricists);
    console.log(selectedProducers);

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
      setIsUploading(true)
      const response = await apiFormData("/api/track/addtrack", formData);
      console.log("API response:");
      console.log(response);

      if (response.success) {
        toast.success("Song uploaded successfully!");
        router.push(`/albums/viewalbum/${btoa(albumId!)}`);
      } else {
        setIsUploading(false)
        toast.error(response.message);
      }
    } catch (error) {
      setIsUploading(false)
      toast.error("Something went wrong while uploading the song.");
      console.error("Error:", error);
    }

    // console.log(data)
    // const result = TrackSchema.safeParse(data);
    // if (!result.success) {
    //   setErrors(result.error.format());
    // } else {
    //   setErrors({});
    //   // handle successful form submission
    //   console.log(data);
    // }
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
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.title._errors[0]}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-12 gap-6 ">
                  <div className="col-span-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Audio File (Max 128M)
                      </label>
                      <input
                        name="audioFile"
                        type="file"
                        accept="audio/mpeg, audio/wav"
                        className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.audioFile && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.audioFile._errors[0]}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-span-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Caller Tune Time (HH:MM:SS)
                      </label>
                      <input
                        name="crbt"
                        type="text"
                        placeholder="00:00:00"
                        value={callerTuneTime}
                        onChange={(e) => setCallerTuneTime(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.callerTuneTime && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.callerTuneTime._errors[0]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Primary Singer
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
                  </select>

                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.title._errors[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Other Singers
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
                  <h3>Lyricists</h3>
                  <MultiSelect
                    hasSelectAll={false}
                    options={formatOptions(artistData.lyricist)}
                    value={selectedLyricists}
                    onChange={handleSelectChange("lyricist")}
                    labelledBy="Select Lyricists"
                  />
                </div>

                <div>
                  <h3>Composers</h3>
                  <MultiSelect
                    hasSelectAll={false}
                    options={formatOptions(artistData.composer)}
                    value={selectedComposers}
                    onChange={handleSelectChange("composer")}
                    labelledBy="Select Composers"
                  />
                </div>

                <div>
                  <h3>Producers</h3>
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
                    Track Category
                  </label>
                  <select
                    name="category"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    Track Type
                  </label>
                  <select
                    name="trackType"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    Version
                  </label>
                  <select
                    name="version"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </>
      )}

      {
        isUploading && (
          <Uploading message="Your file is currently being uploaded" />
        )
      }



    </div>
  );
}
