"use client";

import { apiPost } from "@/helpers/axiosRequest";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface AlbumStatusProps {
  albumid: string;
  labelid: string;
  albumName: string;
  onUpdate: () => void;
}

const AlbumStatusUpdate: React.FC<AlbumStatusProps> = ({
  albumid,
  albumName,
  labelid,
  onUpdate,
}) => {
  const [status, setStatus] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const onStatusUpdate = async () => {
    try {
      if (status === "") {
        toast.error("Select a status");
        return;
      }
      if (status === "3" && message === "") {
        toast.error("Reason required for rejection");
        return;
      }
      
      
      
      const payload = {
        id: albumid,
        labelid,
        albumName,
        status:  parseInt(status),
        comment: message,
      };


      const response = await apiPost("/api/albums/updateStatus", payload);

      console.log("update stattus response: ");
      console.log(response);
      

      setStatus('')
      if (response.success) {
        toast.success("Status updated successfully");
        onUpdate();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the status");
    }
  };

  return (
    <div className="w-full">
      <select
        className="form-control mt-2 mb-3"
        onChange={(e) => setStatus(e.target.value)}
        value={status}
        required
      >
        <option value="">Select Status</option>
        <option value="2">Approved </option>
        <option value="4">Live</option>
        <option value="3">Reject</option>
      </select>

      {status === "3" && (
        <textarea
          className="form-control mb-3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write reason for rejection"
        />
        
      )}

    

      <button
        className="px-3 py-2 rounded text-white bg-cyan-600"
        onClick={onStatusUpdate}
      >
        
        Update Status
      </button>
    </div>
  );
};

export default AlbumStatusUpdate;
