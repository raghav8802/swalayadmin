"use client";
import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useCallback,
} from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useDropzone } from "react-dropzone";
import UserContext from "@/context/userContext";
import { MultiSelect } from "react-multi-select-component";
import toast from "react-hot-toast";
import { apiFormData, apiGet } from "@/helpers/axiosRequest";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Image from "next/image";

interface FormData {
  title: string;
  releaseDate: string;
  artist: string;
  genre: string;
  label: string;
  language: string;
  artwork: File | null;
  pLine: string;
  cLine: string;
}

type TagOption = {
  label: string;
  value: string;
};

type OptionType = {
  value: string;
  label: string;
};

interface LabelData {
  _id: string;
  label: string | null;
  username: string;
  usertype: string;
  email: string;
}

interface AlbumResponse {
  success: boolean;
  data: {
    album?: {
      title: string;
      releasedate: string;
      artist: string;
      genre: string;
      label: string | LabelData;
      language: string;
      artwork: string;
      pline: string;
      cline: string;
      tags: string[];
      _id: string;
    };
    message?: string;
  };
}

interface UpdateAlbumResponse {
  success: boolean;
  data: {
    _id: string;
  };
  message?: string;
}

const EditAlbumForm = ({ params }: { params: { albumid: string } }) => {
  const albumIdParams = params.albumid;
  const [albumId, setAlbumId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Move options before their usage
  const pLineOptions = React.useMemo<OptionType[]>(() => [
    { value: "2025 SL Web Team", label: "2025 SL Web Team" },
  ], []);

  const cLineOptions = React.useMemo<OptionType[]>(() => [
    { value: "2025 SL Web Team", label: "2025 SL Web Team" },
  ], []);

  const year = React.useMemo(() => new Date().getFullYear(), []);
  const labelLine = React.useMemo(() => `${year} SL Web Team`, [year]);

  const router = useRouter();

  // useState hook to manage the form data
  const [formData, setFormData] = useState<FormData>({
    title: "",
    releaseDate: "",
    artist: "",
    genre: "",
    label: "SwaLay Digital",
    language: "",
    artwork: null,
    pLine: labelLine,
    cLine: labelLine,
  });

  const albumTags = [
    { label: "Romantic", value: "Romantic" },
    { label: "Happy", value: "Happy" },
    { label: "Sad", value: "Sad" },
    { label: "Dance", value: "Dance" },
    { label: "Bhangra", value: "Bhangra" },
    { label: "Partiotic", value: "Partiotic" },
    { label: "Nostalgic", value: "Nostalgic" },
    { label: "Inspirational", value: "Inspirational" },
    { label: "Enthusiastic", value: "Enthusiastic" },
    { label: "Optimistic", value: "Optimistic" },
    { label: "Passion", value: "Passion" },
    { label: "Pessimistic", value: "Pessimistic" },
    { label: "Spiritual", value: "Spiritual" },
    { label: "Peppy", value: "Peppy" },
    { label: "Philosophical", value: "Philosophical" },
    { label: "Mellow", value: "Mellow" },
    { label: "Calm", value: "Calm" },
  ];

  const [selectedTags, setSelectedTags] = useState<TagOption[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<OptionType | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<OptionType | null>(
    null
  );

  const [selectedPLine, setSelectedPLine] = useState<OptionType | null>(null);
  const [selectedCLine, setSelectedCLine] = useState<OptionType | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<LabelData | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    try {
      const decodedAlbumId = atob(albumIdParams);
      setAlbumId(decodedAlbumId);
    } catch (e) {
      setError("Invalid Album URL");
      toast.error("Invalid Album URL");
      console.error("Decoding error:", e);
    }
  }, [albumIdParams]);

  const fetchAlbumData = useCallback(async () => {
    if (!albumId) return;

    try {
      const response = await apiGet<AlbumResponse>(
        `/api/albums/getAlbumsDetails?albumId=${albumId}`
      );

      if (!response?.success || !response?.data) {
        throw new Error("Failed to fetch album data");
      }

      const albumData = response.data.album || response.data;
      if (!('title' in albumData)) {
        throw new Error("Invalid album data structure");
      }

      setFormData({
        title: albumData.title || "",
        releaseDate: albumData.releasedate
          ? new Date(albumData.releasedate).toISOString().split("T")[0]
          : "",
        artist: albumData.artist || "",
        genre: albumData.genre || "",
        label: typeof albumData.label === 'string'
          ? albumData.label
          : ((albumData.label as LabelData)?.label || (albumData.label as LabelData)?.username || (albumData.label as LabelData)?._id || ""),
        language: albumData.language || "",
        artwork: null,
        pLine: albumData.pline || labelLine,
        cLine: albumData.cline || labelLine,
      });

      if (Array.isArray(albumData.tags)) {
        setSelectedTags(
          albumData.tags.map((tag: string) => ({ label: tag, value: tag }))
        );
      }

      setSelectedPLine(
        pLineOptions.find((option) => option.value === albumData.pline) || null
      );
      setSelectedCLine(
        cLineOptions.find((option) => option.value === albumData.cline) || null
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error fetching album data";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  }, [albumId, labelLine, pLineOptions, cLineOptions]);

  useEffect(() => {
    if (albumId) {
      fetchAlbumData();
    }
  }, [albumId, fetchAlbumData]);

  const handleSelectChange = (selectedItems: TagOption[]) => {
    if (selectedItems.length > 3) {
      toast.error("You can select a maximum of 3 Tags.");
      return;
    }
    setSelectedTags(selectedItems);
  };

  // Handling file drop for artwork
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Invalid file type. Only JPEG and PNG are allowed.");
      return;
    }

    // Validate image dimensions
    const image = new window.Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => {
      if (image.width !== 3000 || image.height !== 3000) {
        toast.error("Invalid image dimensions. Image must be 3000x3000 pixels.");
        return;
      }
      setFormData(prev => ({ ...prev, artwork: file }));
    };
  }, []);

  // useDropzone hook for handling file uploads
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    multiple: false,
  });

  // Handling changes to form input fields
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handling form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Basic validation
    if (!formData.title.trim()) {
      setErrors(prev => ({ ...prev, title: ["Title is required"] }));
      return;
    }

    if (!formData.artist.trim()) {
      setErrors(prev => ({ ...prev, artist: ["Artist is required"] }));
      return;
    }

    if (!formData.genre) {
      setErrors(prev => ({ ...prev, genre: ["Genre is required"] }));
      return;
    }

    if (!formData.language) {
      setErrors(prev => ({ ...prev, language: ["Language is required"] }));
      return;
    }

    const loadingToastId = toast.loading("Updating album...");
    
    try {
      const selectedTagValues = selectedTags.map((tag) => tag.value);
      const formDataObj = new FormData();

      if (!albumId) {
        throw new Error("Album ID is missing");
      }

      formDataObj.append("albumId", albumId);
      formDataObj.append("title", formData.title.trim());
      formDataObj.append("releaseDate", formData.releaseDate);
      formDataObj.append("artist", formData.artist.trim());
      formDataObj.append("genre", formData.genre);
      formDataObj.append("label", formData.label);
      formDataObj.append("language", formData.language);
      formDataObj.append("pLine", formData.pLine);
      formDataObj.append("cLine", formData.cLine);
      formDataObj.append("tags", JSON.stringify(selectedTagValues));
      
      if (formData.artwork) {
        formDataObj.append("artwork", formData.artwork);
      }

      const response = await apiFormData<UpdateAlbumResponse>(
        "/api/albums/updateAlbum",
        formDataObj
      );

      if (!response?.success || !response?.data) {
        throw new Error(response?.message || "Failed to update album");
      }

      toast.success("Album updated successfully");
      router.push(`/albums/viewalbum/${btoa(response.data._id)}`);
    } catch (error: any) {
      const errorMessage = error?.message || "Error updating album";
      toast.error(errorMessage);
      
      if (error.name === "ValidationError" && error.formErrors?.fieldErrors) {
        const fieldErrors: { [key: string]: string[] } = {};
        (Object.entries(error.formErrors.fieldErrors) as [string, Array<{ message: string }>][]).forEach(([field, errors]) => {
          fieldErrors[field] = errors.map(err => err.message);
        });
        setErrors(fieldErrors);
      }
    } finally {
      toast.dismiss(loadingToastId);
    }
  };

  if (error) {
    return (
      <div className="w-full min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-6 bg-white rounded-sm border">
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
            <BreadcrumbPage>Edit Album</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-4 mt-5 text-blue-600">
        Edit Album Details
      </h1>

      <form onSubmit={handleSubmit} className="w-full ">
        
        <div className="grid grid-cols-12 gap-6 ">
          <div className="col-span-8 space-y-6 ">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Song Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Title of Album or Song"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Main Artist
                </label>
                <input
                  type="text"
                  name="artist"
                  value={formData.artist}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Name of Artist"
                />
                {errors.artist && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.artist[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Genre {formData.genre}
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  // value="Hip Hop"
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                    <option value="">Select Genre</option>
                  <option value="Pop">Pop</option>
                  <option value="Film"> Film</option>
                  <option value="Folk"> Folk</option>
                  <option value="Devotional"> Devotional</option>
                  <option value="Traditional"> Traditional</option>
                  <option value="Instrumental"> Instrumental</option>
                  <option value="Western Classical"> Western Classical</option>
                  <option value="Carnatic Classical">
                    Carnatic Classical
                  </option>
                  <option value="Hindustani Classical">
                    Hindustani Classical
                  </option>
                  <option value="Spiritual"> Spiritual</option>
                  <option value="English Pop"> English Pop</option>
                  <option value="Gazal"> Gazal</option>
                  <option value="Regional Pop"> Regional Pop</option>
                  <option value="Patriotic Pop"> Patriotic Pop</option>
                  <option value="Lounge"> Lounge</option>
                  <option value="Fusion"> Fusion</option>
                  <option value="Electronic"> Electronic</option>
                  <option value="Hip Hop"> Hip Hop</option>
                  <option value="Rock"> Rock</option>
                  <option value="Alternative"> Alternative</option>
                </select>

                {errors.genre && (
                  <p className="text-red-500 text-sm mt-1">{errors.genre[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Release Date
                </label>
                <input
                  type="date"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.releaseDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.releaseDate[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Language
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                   <option value="">Select Song Language</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="English">English</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Assamese">Assamese</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="Rajasthini">Rajasthini</option>
                  <option value="Konkani">Konkani</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Gadhwali">Gadhwali</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Bhojpuri">Bhojpuri</option>
                  <option value="Oriya">Oriya</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Nagpuri">Nagpuri</option>
                  <option value="Haryanvi">Haryanvi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Maithli">Maithli</option>
                  <option value="Chhastisgarhi">Chhastisgarhi</option>
                  <option value="Santhali">Santhali</option>
                  <option value="Kasmiri">Kasmiri</option>
                  <option value="Nepali">Nepali</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Arabic">Arabic</option>
                  <option value="African">African</option>
                  <option value="Urdu">Urdu</option>
                  <option value="Hadoti-Rajasthini">Hadoti-Rajasthini</option>
                  <option value="Dogri">Dogri</option>
                  <option value="Gharwali">Gharwali</option>
                  <option value="Sanskrit">Sanskrit</option>
                  <option value="Himchali">Himchali</option>
                </select>

                {errors.language && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.language[0]}
                  </p>
                )}
              </div>

              



            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  P-Line
                </label>
                <input
                  type="text"
                  name="pLine"
                  value={formData.pLine}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.pLine && (
                  <p className="text-red-500 text-sm mt-1">{errors.pLine[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  C-Line
                </label>
                <input
                  type="text"
                  name="cLine"
                  value={formData.cLine}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.cLine && (
                  <p className="text-red-500 text-sm mt-1">{errors.cLine[0]}</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-6 ">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <MultiSelect
                options={albumTags}
                value={selectedTags}
                onChange={handleSelectChange}
                labelledBy="Select Tags"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Artwork
              </label>
              <div
                {...getRootProps({
                  className: `dropzone border-2 border-dashed rounded-lg p-4 cursor-pointer ${
                    isDragActive ? "border-blue-500" : "border-gray-300"
                  }`,
                })}
              >
                <input {...getInputProps()} />
                <p className="text-center text-gray-500">
                  Drag & drop an image file here, or click to select one
                </p>
              </div>
              {formData.artwork && (
                <div className="relative w-32 h-32 mt-2">
                  <Image
                    src={URL.createObjectURL(formData.artwork)}
                    alt="Artwork preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 128px) 100vw, 128px"
                  />
                </div>
              )}
              {errors.artwork && (
                <p className="text-red-500 text-sm mt-1">{errors.artwork[0]}</p>
              )}
            </div>

            <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="w-100 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>


          </div>
        </div>

        


      </form>
    </div>
  );
};

export default EditAlbumForm;
