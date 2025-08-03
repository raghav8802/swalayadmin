import { Modal } from "@/components/Modal";
import { apiGet, apiPost } from "@/helpers/axiosRequest";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from 'swr';

interface LabelData {
  _id: string;
  lable: string | null;
  username: string;
  usertype: string;
}

const ArtistModalForm = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    labelId: "",
    artistName: "",
    spotify: "",
    appleMusic: "",
    instagram: "",
    facebook: "",
    isIPRSMember: false,
    iprsNumber: "",
  });

  const [artistType, setArtistType] = useState({
    singer: false,
    lyricist: false,
    composer: false,
    producer: false,
  });

  const [labelData, setLabelData] = useState<LabelData[]>([]);

  const fetchLabels = async () => {
    try {
      const response:any = await apiGet("/api/labels/getLabels") as { success: boolean; data: LabelData[] };

      if (response.success) {
        setLabelData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLabels();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Remove leading @ symbol if present
    const cleanValue = value.startsWith('@') ? value.substring(1) : value;
    setFormData({
      ...formData,
      [name]: cleanValue,
    });
  };

  const handleSave = async () => {
    const data = {
      labelId: formData.labelId,
      artistName: formData.artistName,
      iprs: formData.isIPRSMember,
      iprsNumber: formData.iprsNumber,
      facebook: formData.facebook,
      appleMusic: formData.appleMusic,
      spotify: formData.spotify,
      instagram: formData.instagram,
      isSinger: artistType.singer,
      isLyricist: artistType.lyricist,
      isComposer: artistType.composer,
      isProducer: artistType.producer,
    };

    try {
      const response:any = await apiPost("/api/artist/addArtist", data);
      console.log("api response addArtist", response);

      if (response.success) {
        // Trigger SWR revalidation for artists data
        mutate('/api/artist/getAllArtist');
        
        // Reset form
        setFormData({
          artistName: "",
          labelId: "",
          spotify: "",
          appleMusic: "",
          instagram: "",
          facebook: "",
          isIPRSMember: false,
          iprsNumber: "",
        });
        setArtistType({
          singer: false,
          lyricist: false,
          composer: false,
          producer: false,
        });

        onClose();

        setTimeout(() => {
          toast.success("Success! New artist added");
        }, 500);
      } else {
        toast.error(response.message || "Failed to add artist");
      }
    } catch (error) {
      console.error("Error adding artist:", error);
      toast.error("Failed to add artist. Please try again.");
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      triggerLabel="Submit"
      title="New Artist"
      onSave={handleSave}
      onClose={onClose}
      description="Note: You can add multiple artist types to a single artist"
    >
      <div className="overflow-y-auto">
        <label className="form-label" htmlFor="name">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.artistName}
          onChange={(e) =>
            setFormData({ ...formData, artistName: e.target.value })
          }
          className="form-control"
          placeholder="Write artist name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Label</label>
        <select
          name="label"
          value={formData.labelId}
          onChange={(e) =>
            setFormData({ ...formData, labelId: e.target.value })
          }
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Select Label</option>
          {labelData.map((item) => {
            const displayText = item.lable || item.username;
            return (
              <option key={item._id} value={item._id}>
                {displayText} ({item.usertype})
              </option>
            );
          })}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="form-label" htmlFor="spotify">
            Spotify URL
          </label>
          <input
            type="text"
            id="spotify"
            name="spotify"
            value={formData.spotify}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Spotify url of artist"
          />
        </div>

        <div>
          <label className="form-label" htmlFor="appleMusic">
            Apple Music URL
          </label>
          <input
            type="text"
            id="appleMusic"
            name="appleMusic"
            value={formData.appleMusic}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Apple url of artist"
          />
        </div>

        <div>
          <label className="form-label" htmlFor="instagram">
            Instagram URL
          </label>
          <input
            type="text"
            id="instagram"
            name="instagram"
            value={formData.instagram}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Instagram url of artist"
          />
        </div>

        <div>
          <label className="form-label" htmlFor="facebook">
            Facebook URL
          </label>
          <input
            type="text"
            id="facebook"
            name="facebook"
            value={formData.facebook}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Facebook url of artist"
          />
        </div>

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

        <div>
          <label className="form-label" htmlFor="iprsNumber">
            IPRS Number
          </label>
          <input
            type="text"
            id="iprsNumber"
            name="iprsNumber"
            disabled={formData.isIPRSMember ? false : true}
            value={formData.iprsNumber}
            onChange={(e) =>
              setFormData({ ...formData, iprsNumber: e.target.value })
            }
            className={`form-control ${
              formData.isIPRSMember ? "" : "form-disabled"
            } `}
            placeholder="Write IPRS Number"
          />
        </div>
      </div>

      <label className="mb-0" htmlFor="artistType">
        Artist Type
      </label>
      <div className="flex">
        <div className="flex items-center me-5">
          <input
            id="inline-checkbox-singer"
            type="checkbox"
            name="singer"
            checked={artistType.singer}
            onChange={(e) =>
              setArtistType((prev) => ({ ...prev, singer: e.target.checked }))
            }
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="inline-checkbox-singer"
            className="cursor-pointer ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Singer
          </label>
        </div>

        <div className="flex items-center me-5">
          <input
            id="inline-checkbox-lyricist"
            type="checkbox"
            name="lyricist"
            checked={artistType.lyricist}
            onChange={(e) =>
              setArtistType((prev) => ({ ...prev, lyricist: e.target.checked }))
            }
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="inline-checkbox-lyricist"
            className="cursor-pointer ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Lyricist
          </label>
        </div>

        <div className="flex items-center me-5">
          <input
            id="inline-checkbox-composer"
            type="checkbox"
            name="composer"
            checked={artistType.composer}
            onChange={(e) =>
              setArtistType((prev) => ({ ...prev, composer: e.target.checked }))
            }
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="inline-checkbox-composer"
            className="cursor-pointer ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Composer
          </label>
        </div>

        <div className="flex items-center me-5">
          <input
            id="inline-checkbox-producer"
            type="checkbox"
            name="producer"
            checked={artistType.producer}
            onChange={(e) =>
              setArtistType((prev) => ({ ...prev, producer: e.target.checked }))
            }
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="inline-checkbox-producer"
            className="cursor-pointer ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Producer
          </label>
        </div>
      </div>
    </Modal>
  );
};

export default ArtistModalForm;
