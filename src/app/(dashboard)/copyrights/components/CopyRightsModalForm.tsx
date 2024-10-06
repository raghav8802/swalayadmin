"use client";

import { Modal } from "@/components/Modal";
// import UserContext from "@/context/userContext";
import { apiGet, apiPost } from "@/helpers/axiosRequest";
import React, {  useEffect, useState } from "react";
import toast from "react-hot-toast";

interface LabelData {
  _id: string;
  lable: string | null;
  username: string;
  usertype: string;
}


const CopyRightsModalForm = ({ isVisible, onClose, }: {  isVisible: boolean;  onClose: () => void; }) => {

  // const context = useContext(UserContext);
  // const labelId = context?.user?._id;

  const [formData, setFormData] = useState({
    labelId: "",
    youtubeUrl: "",
  });
  const [labelData, setLabelData] = useState<LabelData[]>([]);

  const fetchLabels = async () => {
    try {
      const response = await apiGet("/api/labels/getLabels");

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


  const isValidYouTubeUrl = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/|youtu\.be\/).+$/;
    return regex.test(url);
  };
  


  const handleSave = async () => {
    // console.log("all data");
    // console.log(formData);

    if (!formData.labelId && formData.labelId === "") {
      toast.error("Please select a track");
      return;
    }
    if (!formData.youtubeUrl && formData.youtubeUrl === "") {
      toast.error("Please paste your youtube link");
      return;
    }

    if (!formData.youtubeUrl || !isValidYouTubeUrl(formData.youtubeUrl)) {
      toast.error("Please paste a valid YouTube link");
      return;
    }

    console.log("dsfsed");
    
    console.log({
      label: formData.labelId,  
      url : formData.youtubeUrl
    });
    

    const response = await apiPost("/api/copyright/addCopyright", {
      labelId: formData.labelId,
      link: formData.youtubeUrl,
    });
console.log(response);

    if (response.success) {
      onClose();
      toast.success("New Copyright added");
      setFormData({ labelId: "", youtubeUrl: "" });
    } else {
      onClose();
      toast.error("Internal server error");
    }


  };

  return (
    <Modal
      isVisible={isVisible}
      triggerLabel="Submit"
      title="New Copyright"
      onSave={handleSave}
      onClose={onClose}
    >
      <div>
        <label className="form-label" htmlFor="trackname">
          Label
        </label>

        <select
          name="label"
          className="form-select outline-none"
          id="labelname"
          value={formData.labelId}
          onChange={(e) =>
            setFormData({ ...formData, labelId: e.target.value })
          }
        >
          <option value="">Select Label</option>

          {labelData.map((item) => {
            let displayText;
            if (item.lable) {
              displayText = item.lable;
            } else {
              displayText = item.username;
            }

            return (
              <option key={item._id} value={item._id}>
                {displayText} ({item.usertype})
              </option>
            );
          })}

        </select>
      </div>

      <div>
        <label className="form-label" htmlFor="trackname">
          Youtube url
        </label>
        <input
          id="inline-checkbox-singer"
          type="text"
          name="singer"
          placeholder="Paste your youtbe url here"
          value={formData.youtubeUrl}
          onChange={(e) =>
            setFormData({ ...formData, youtubeUrl: e.target.value })
          }
          className="form-control"
        />
      </div>
    </Modal>
  );
};

export default CopyRightsModalForm;
