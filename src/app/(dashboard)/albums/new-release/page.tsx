"use client";
import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
} from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
// import { useDropzone } from "react-dropzone";
import UserContext from "@/context/userContext";
import { MultiSelect } from "react-multi-select-component";
import toast from "react-hot-toast";
import { apiFormData, apiGet } from "@/helpers/axiosRequest";
import { useRouter } from "next/navigation";
import Uploading from "@/components/Uploading";
import AsyncSelect from 'react-select/async';


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

interface LabelData {
  _id: string;
  lable: string | null;
  username: string;
  usertype: string;
  email: string;
}

type TagOption = {
  label: string;
  value: string;
};

const AlbumForm: React.FC = () => {
  
  const router = useRouter();

  // Move year to useMemo to avoid recreating it on every render
  const year = React.useMemo(() => new Date().getFullYear(), []);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    releaseDate: "",
    artist: "",
    genre: "",
    label: "",
    language: "",
    artwork: null,
    pLine: `${year} SL Web Team`,
    cLine: `${year} SL Web Team`,
  });

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

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
  const [isUploading, setIsUploading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<LabelData | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleSelectChange = (selectedItems: TagOption[]) => {
    if (selectedItems.length > 3) {
      toast.error("You can select a maximum of 3 Tags.");
    } else {
      setSelectedTags(selectedItems);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Async label search function for react-select
  const loadLabelOptions = async (inputValue: string) => {
    if (!inputValue) return [];
    try {
      const response: any = await apiGet(`/api/labels/search?q=${encodeURIComponent(inputValue)}`);
      if (response.success) {
        return response.data.map((item: LabelData) => ({
          value: item._id,
          label: item.lable
            ? `${item.username} (${item.lable}) [${item.usertype}] - ${item.email}`
            : `${item.username} [${item.usertype}] - ${item.email}`,
          data: item,
        }));
      }
      return [];
    } catch {
      return [];
    }
  };

  const handleLabelChange = (option: any) => {
    if (option) {
      setSelectedLabel(option.data);
      // Update pLine/cLine based on usertype
      const userType = option.data.usertype;
      let labelLine;
      if (userType === "super") {
        // Use label name if present, else username
        labelLine = `${year} ${option.data.lable || option.data.username}`;
      } else {
        labelLine = `${year} SL Web Team`;
      }
      setFormData((prev) => ({
        ...prev,
        label: option.value,
        pLine: labelLine,
        cLine: labelLine,
      }));
    } else {
      setSelectedLabel(null);
      setFormData((prev) => ({
        ...prev,
        label: "",
        pLine: `${year} SL Web Team`,
        cLine: `${year} SL Web Team`,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     toast.loading("Uploading...");
    setIsUploading(true);

    try {
      if (!formData.label) {
        toast.error("Label is not selected");
        return;
      }

      const artwork = formData.artwork;
      if (!artwork) {
        toast.error("Album cover image is required");
        const loadingToastId = toast.loading("Uploading...");
        return;
      }

      if (!["image/jpeg", "image/png"].includes(artwork.type)) {
        toast.error("Invalid file type. Only JPEG and PNG are allowed.");
        return;
      }

    //! Dimension check need to be done if dimension preferred **
    const image = new Image();
    const imageLoaded = new Promise<void>((resolve, reject) => {
      image.onload = () => {
        if (image.width !== 3000 || image.height !== 3000) {
          reject(new Error("Invalid image dimensions. Image must be 3000x3000 pixels."));
        } else {
          resolve();
        }
      };
      image.onerror = () => {
        reject(new Error("Failed to load image"));
      };
    });

    image.src = URL.createObjectURL(artwork);

    try {
      await imageLoaded; // Wait for the image to load and validate dimensions
    } catch (error:any) {
      toast.error(error.message);
      setIsUploading(false);
      return; // Exit the function if dimensions are invalid
    }

    
      const selectedTagValues = selectedTags.map((tag) => tag.value);

      const formDataObj = new FormData();
      formDataObj.append("labelId", selectedLabel?._id || "");
      formDataObj.append("title", formData.title);
      formDataObj.append("releaseDate", formData.releaseDate);
      formDataObj.append("artist", formData.artist);
      formDataObj.append("genre", formData.genre);
      formDataObj.append("label", formData.label);
      formDataObj.append("language", formData.language);
      formDataObj.append("pLine", formData.pLine);
      formDataObj.append("cLine", formData.cLine);
      formDataObj.append("tags", JSON.stringify(selectedTagValues));
      formDataObj.append("artwork", artwork);

      const response:any = await apiFormData("/api/albums/addAlbum", formDataObj);
      console.log("add album response");
      console.log(response);
      

      if (response.success) {
        toast.success("😉 Success! Album added");
        router.push(`/albums/viewalbum/${btoa(response.data._id)}`);
        setFormData({
          title: "",
          releaseDate: "",
          artist: "",
          genre: "",
          label: "",
          language: "",
          artwork: null,
          pLine: `${year} SL Web Team`,
          cLine: `${year} SL Web Team`,
        });
        setSelectedTags([]);
      } else {
        toast.error("🤔 Invalid Token");
      }
    } catch (error: any) {
      setIsUploading(false);
      if (error.name === "ValidationError") {
        const fieldErrors: { [key: string]: string[] } = {};
        for (const field in error.formErrors.fieldErrors) {
          fieldErrors[field] = error.formErrors.fieldErrors[field].map(
            (err: any) => err.message
          );
        }
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <div className="w-full min-h-screen p-6 bg-white rounded-sm border">
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
                <BreadcrumbPage>New Release</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-3xl font-bold mb-4 mt-5 text-blue-600">
            Album Details
          </h1>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8 space-y-6">
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
                    <p className="text-red-500 text-sm mt-1">
                      {errors.title[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Label
                  </label>
                  <AsyncSelect
                    cacheOptions
                    loadOptions={loadLabelOptions}
                    defaultOptions={false}
                    value={selectedLabel ? {
                      value: selectedLabel._id,
                      label: selectedLabel.lable
                        ? `${selectedLabel.username} (${selectedLabel.lable}) [${selectedLabel.usertype}] - ${selectedLabel.email}`
                        : `${selectedLabel.username} [${selectedLabel.usertype}] - ${selectedLabel.email}`,
                      data: selectedLabel,
                    } : null}
                    onChange={handleLabelChange}
                    isClearable
                    placeholder="Search by username, label name, or email..."
                    className="mt-1"
                    styles={{ menu: (provided) => ({ ...provided, zIndex: 9999 }) }}
                  />
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
                      placeholder="Main Artist"
                    />
                    {errors.artist && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.artist[0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Genre
                    </label>
                <select
                  name="genre"
                  value={formData.genre}
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
                  <option value="Carnatic Classical">Carnatic Classical</option>
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
                    Tags
                  </label>
                  <MultiSelect
                    options={albumTags}
                    value={selectedTags}
                    onChange={handleSelectChange}
                    labelledBy="Select Tags"
                    className="mt-1"
                  />
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
              <div className="col-span-4">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Upload Cover Image
                    </label>
                    <input
                      type="file"
                      name="artwork"
                      accept="image/jpeg, image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setFormData({
                          ...formData,
                          artwork: file,
                        });
                        if (file) {
                          setCoverPreview(URL.createObjectURL(file));
                        } else {
                          setCoverPreview(null);
                        }
                      }}
                      className="form-control"
                    />
                  </div>

                  {coverPreview && (
                    <div className="mt-2">
                      <img src={coverPreview} alt="Cover Preview" className="w-40 h-40 object-cover border rounded" />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      P Line
                    </label>
                    <input
                      type="text"
                      name="pLine"
                      value={formData.pLine}
                      readOnly
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      C Line
                    </label>
                    <input
                      type="text"
                      name="cLine"
                      value={formData.cLine}
                      readOnly
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </div>
          </form>
        </>
      )}
      {isUploading && <Uploading message="Album is creating" />}
    </div>
  );
};

export default AlbumForm;
