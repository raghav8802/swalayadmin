"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { apiPost } from "@/helpers/axiosRequest";
import Style from "../../../../../styles/Shemaroo.module.css";

interface ShemarooDeliveryButtonProps {
  albumId: string;
  shemarooDeliveryStatus: ShemarooStatus;
}

enum ShemarooStatus {
  Draft = 0, // Shemaroo draft - album is in draft state
  Approved = 1, // Shemaroo approved - send album to Shemaroo
  Live = 2, // Shemaroo live - album is live on Shemaroo
  Rejected = 3, // Shemaroo rejected - album is not live on Shemaroo
}

export function ShemarooDeliveryButton({
  albumId,
  shemarooDeliveryStatus,
}: ShemarooDeliveryButtonProps) {
  const [currentStatus, setCurrentStatus] = useState<ShemarooStatus>(
    shemarooDeliveryStatus
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    console.log("Sending Shemaroo status update for albumId:", albumId);
    console.log("Current Shemaroo status:", currentStatus);
    try {
      const response: any = await apiPost("/api/shemaroo/updatealbumstatus", {
        albumId,
        status: ShemarooStatus.Approved,
      });

      console.log("Response from Shemaroo status update:", response);

      if (!response.success) {
        throw new Error(response.message || "Failed to update status");
      }

      setCurrentStatus(ShemarooStatus.Approved);

      toast.success("Shemaroo status updated to Approved");
    } catch (error) {
      toast.error("Failed to update Shemaroo status");
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    switch (currentStatus) {
      case ShemarooStatus.Approved:
        return "Approved";
      case ShemarooStatus.Draft:
        return "Send to Shemaroo";
      case ShemarooStatus.Live:
        return "Live on Shemaroo";
      case ShemarooStatus.Rejected:
        return "Rejected by Shemaroo";
      default:
        return "Send to Shemaroo";
    }
  };

  return (
    <button
      className={`${Style.colorfulButton} `}
      onClick={handleApprove}
      disabled={currentStatus !== ShemarooStatus.Draft || isLoading}
    >
      <div className={Style.content}>
        {isLoading ? "Sending..." : getButtonText()}
      </div>
      <div className={Style.decorativeCircle1}></div>
      <div className={Style.decorativeCircle2}></div>
      <div className={Style.decorativeCircle3}></div>
    </button>
  );
}
