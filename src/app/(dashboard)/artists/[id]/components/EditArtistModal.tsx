import { Modal } from "@/components/Modal";
import UserContext from "@/context/userContext";
import { apiFormData } from "@/helpers/axiosRequest"; // API method for updates
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import { Accept } from "react-dropzone";

// Helper functions to validate and extract required parts from URLs
const validateAndExtract = {
  spotify: (url: string) => {
    const regex = /^https:\/\/open\.spotify\.com\/artist\/([\w\d]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  },
  apple: (url: string) => {
    const regex = /^https:\/\/music\.apple\.com\/.*\/artist\/.*\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  },
  instagram: (url: string) => {
    const regex = /^https:\/\/www\.instagram\.com\/([\w\.\_]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  },
  facebook: (url: string) => {
    const regex = /^https:\/\/www\.facebook\.com\/([\w\.]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  },
};

const EditArtistModal = ({
  isVisible,
  onClose,
  artistData, // Required prop to load artist data for updates
}: {
  isVisible: boolean;
  onClose: () => void;
  artistData: any; // Required prop for existing artist data
}) => {
  const context = useContext(UserContext);
  const labelId = context?.user?._id;

  const [formData, setFormData] = useState<{
    artistName: string;
    about: string;
    contact: string;
    email: string;
    spotifyID: string;
    appleID: string;
    instagramID: string;
    facebookID: string;
    isIPRSMember: boolean;
    iprsNumber: string;
    profileImage: File | null; // Allow File or null
  }>({
    artistName: "",
    about: "",
    contact: "",
    email: "",
    spotifyID: "",
    appleID: "",
    instagramID: "",
    facebookID: "",
    isIPRSMember: false,
    iprsNumber: "",
    profileImage: null, // Initialize as null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [artistType, setArtistType] = useState({
    singer: false,
    lyricist: false,
    composer: false,
    producer: false,
  });
  const [errors, setErrors] = useState({
    spotifyID: "",
    appleID: "",
    instagramID: "",
    facebookID: "",
  });

  // Handle Dropzone for Image Upload
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      "image/*": [], // Accept only images
    } as Accept,
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFormData({ ...formData, profileImage: acceptedFiles[0] as File });
    },
  });
  const [defaultIprsNumber, setDefaultIprsNumber] = useState(""); // State to store default IPRS number
  useEffect(() => {
    if (artistData) {
      // Pre-fill the form with the artist data
      setFormData({
        artistName: artistData.artistName || "",
        about: artistData.about || "",
        contact: artistData.contact || "",
        email:  artistData.email || "",
        spotifyID: artistData.spotify || "",
        appleID: artistData.appleMusic || "",
        instagramID: artistData.instagram || "",
        facebookID: artistData.facebook || "",
        isIPRSMember: artistData.iprs || false,
        iprsNumber: artistData.iprsNumber || "",
        profileImage: null,
      });
      setArtistType({
        singer: artistData.isSinger || false,
        lyricist: artistData.isLyricist || false,
        composer: artistData.isComposer || false,
        producer: artistData.isProducer || false,
      });
      setDefaultIprsNumber(artistData.iprsNumber || "");
    }
  }, [artistData]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    const newErrors = { ...errors };

    switch (name) {
      case "spotifyID":
        const spotifyID = validateAndExtract.spotify(value);
        newFormData.spotifyID = spotifyID || "";
        newErrors.spotifyID = spotifyID ? "" : "Enter a valid Spotify URL";
        break;
      case "appleID":
        const appleID = validateAndExtract.apple(value);
        newFormData.appleID = appleID || "";
        newErrors.appleID = appleID ? "" : "Enter a valid Apple Music URL";
        break;
      case "instagramID":
        const instagramID = validateAndExtract.instagram(value);
        newFormData.instagramID = instagramID || "";
        newErrors.instagramID = instagramID
          ? ""
          : "Enter a valid Instagram URL";
        break;
      case "facebookID":
        const facebookID = validateAndExtract.facebook(value);
        newFormData.facebookID = facebookID || "";
        newErrors.facebookID = facebookID ? "" : "Enter a valid Facebook URL";
        break;
      default:
        break;
    }

    setFormData(newFormData);
    setErrors(newErrors);
  };

  const handleSave = async () => {
    toast.loading("Updating artist details")
    // IPRS validation
    if (formData.isIPRSMember) {
      console.log("1");

      if (!formData.iprsNumber) {
        console.log("2");
        toast.error("IPRS Number must not be blank.");
        setIsSubmitting(false); // Ensure isSubmitting is reset to false
        return; // Prevent submission
      } else if (!/^\d{12}$/.test(formData.iprsNumber)) {
        console.log("3");
        toast.error("IPRS Number must be a 12-digit number.");
        setIsSubmitting(false); // Ensure isSubmitting is reset to false
        return; // Prevent submission
      }
    }
    console.log("4");

    setIsSubmitting(true);

    // Prepare form data for sending
    const data = new FormData();
    data.append("artistId", artistData._id);
    data.append("artistName", formData.artistName);
    data.append("about", formData.about);
    data.append("contact", formData.contact);
    data.append("email", formData.email);
    data.append("iprs", formData.isIPRSMember.toString());
    data.append("iprsNumber", formData.iprsNumber || "");
    data.append("facebook", formData.facebookID);
    data.append("appleMusic", formData.appleID);
    data.append("spotify", formData.spotifyID);
    data.append("instagram", formData.instagramID);
    data.append("isSinger", artistType.singer.toString());
    data.append("isLyricist", artistType.lyricist.toString());
    data.append("isComposer", artistType.composer.toString());
    data.append("isProducer", artistType.producer.toString());

    // Append image if available
    if (formData.profileImage) {
      data.append("profileImage", formData.profileImage);
    }

    try {
      // Use apiFormData to make the request
      const response = await apiFormData(`/api/artist/updateArtist`, data);

      if (response.success) {
        onClose();
        toast.success("Artist updated successfully");
        window.location.reload();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      setIsSubmitting(false);
    } catch (error) {
      toast.error(
        "An error occurred while updating the artist. Please try again."
      );
    }
  };

  // if (isSubmitting) {
  //   return (
  //     <div className="w-full">
  //       <Loading />
  //     </div>
  //   );
  // }

  return (
    <Modal
      isVisible={isVisible}
      triggerLabel="Update"
      title="Update Artist"
      onSave={handleSave}
      onClose={onClose}
      description="Update the details of the existing artist."
    >
      {/* Artist Name */}
      <div>
        <label className="form-label" htmlFor="name">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="artistName"
          value={formData.artistName}
          onChange={(e) =>
            setFormData({ ...formData, artistName: e.target.value })
          }
          className="form-control"
          placeholder="Write artist name"
        />
      </div>
      <div>
        <label className="form-label" htmlFor="name">
          About
        </label>

        <textarea
          id="about"
          name="about"
          value={formData.about}
          onChange={(e) =>
            setFormData({ ...formData, about: e.target.value })
          }
          className="form-control"
          placeholder="Write about artist"
          rows={2}
        ></textarea>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        <div>
          <label className="form-label" htmlFor="Email">
            Email
          </label>
          <input
            type="email"
            id="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`form-control `}
            placeholder="write email address"
          />
        </div>
        <div>
          <label className="form-label" htmlFor="Contact">
            Contact
          </label>
          <input
            type="number"
            id="Contact"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            className={`form-control `}
            placeholder="write contact number"
          />
          
        </div>

        {/* Spotify */}
        <div>
          <label className="form-label" htmlFor="spotifyID">
            Spotify ID
          </label>
          <input
            type="url"
            id="spotifyID"
            name="spotifyID"
            value={formData.spotifyID}
            onChange={handleInputChange}
            className={`form-control ${errors.spotifyID ? "error" : ""}`}
            placeholder="Spotify URL of artist"
          />
          {errors.spotifyID && (
            <p className="text-red-600">{errors.spotifyID}</p>
          )}
        </div>




        {/* Apple Music */}
        <div>
          <label className="form-label" htmlFor="appleID">
            Apple Music ID
          </label>
          <input
            type="url"
            id="appleID"
            name="appleID"
            value={formData.appleID}
            onChange={handleInputChange}
            className={`form-control ${errors.appleID ? "error" : ""}`}
            placeholder="Apple Music URL of artist"
          />
          {errors.appleID && <p className="text-red-600">{errors.appleID}</p>}
        </div>

        {/* Instagram */}
        <div>
          <label className="form-label" htmlFor="instagramID">
            Instagram URL
          </label>
          <input
            type="url"
            id="instagramID"
            name="instagramID"
            value={formData.instagramID}
            onChange={handleInputChange}
            className={`form-control ${errors.instagramID ? "error" : ""}`}
            placeholder="Instagram URL of artist"
          />
          {errors.instagramID && (
            <p className="text-red-600">{errors.instagramID}</p>
          )}
        </div>

        {/* Facebook */}
        <div>
          <label className="form-label" htmlFor="facebookID">
            Facebook URL
          </label>
          <input
            type="url"
            id="facebookID"
            name="facebookID"
            value={formData.facebookID}
            onChange={handleInputChange}
            className={`form-control ${errors.facebookID ? "error" : ""}`}
            placeholder="Facebook URL of artist"
          />
          {errors.facebookID && (
            <p className="text-red-600">{errors.facebookID}</p>
          )}
        </div>
      </div>

      {/* IPRS Member */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label" htmlFor="isIPRSMember">
            IPRS Member?
          </label>

          <ul className="flex items-center">
            <li className="w-1/2">
              <div className="flex items-center ps-3">
                <input
                  id="horizontal-list-radio-license"
                  type="radio"
                  value="true"
                  name="isIPRSMember"
                  className="w-4 h-4 text-blue-600 bg-gray-100 cursor-pointer"
                  checked={formData.isIPRSMember === true}
                  onChange={() =>
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      isIPRSMember: true,
                      iprsNumber: defaultIprsNumber,
                    }))
                  }
                />
                <label
                  htmlFor="horizontal-list-radio-license"
                  className="cursor-pointer w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Yes
                </label>
              </div>
            </li>

            <li className="w-1/2">
              <div className="flex items-center ps-3">
                <input
                  id="horizontal-list-radio-id"
                  type="radio"
                  value="false"
                  name="isIPRSMember"
                  className="w-4 h-4 text-blue-600 bg-gray-100 cursor-pointer"
                  checked={formData.isIPRSMember === false}
                  onChange={() =>
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      isIPRSMember: false,
                      iprsNumber: "",
                    }))
                  }
                />
                <label
                  htmlFor="horizontal-list-radio-id"
                  className="cursor-pointer w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  No
                </label>
              </div>
            </li>
          </ul>
        </div>

        {/* IPRS Number */}
        <div>
          <label className="form-label" htmlFor="iprsNumber">
            IPI Number
          </label>
          <input
            type="text"
            id="iprsNumber"
            name="iprsNumber"
            disabled={!formData.isIPRSMember}
            value={formData.iprsNumber}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,12}$/.test(value)) {
                setFormData({ ...formData, iprsNumber: value });
              }
            }}
            className={`form-control ${
              formData.isIPRSMember ? "" : "form-disabled"
            } `}
            placeholder="Enter 12-digit IPRS Number"
            maxLength={12}
          />
        </div>
      </div>

      {/* Artist Types */}
      <label className="mb-0" htmlFor="artistType">
        Artist Type
      </label>
      <div className="flex">
        {["singer", "lyricist", "composer", "producer"].map((type) => (
          <div key={type} className="flex items-center me-5">
            <input
              id={`inline-checkbox-${type}`}
              type="checkbox"
              name={type}
              checked={artistType[type as keyof typeof artistType]}
              onChange={(e) =>
                setArtistType((prev) => ({
                  ...prev,
                  [type]: e.target.checked,
                }))
              }
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor={`inline-checkbox-${type}`}
              className="cursor-pointer ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          </div>
        ))}
      </div>

      {/* Dropzone for Profile Image */}
      <div>
        <label className="form-label" htmlFor="profileImage">
          Profile Image
        </label>
        <div
          {...getRootProps()}
          className="border border-gray-300 bg-gray-50 p-4 cursor-pointer"
        >
          <input {...getInputProps()} />
          {acceptedFiles.length > 0 ? (
            <p>{acceptedFiles[0].name}</p>
          ) : (
            <p>Drag and drop an image, or click to select one</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EditArtistModal;
