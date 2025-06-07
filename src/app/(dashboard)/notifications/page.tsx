"use client";
import React, { useState, useEffect } from "react";
import { apiGet, apiPost } from "@/helpers/axiosRequest";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { MultiSelect } from "react-multi-select-component";
import { NotificationTable } from "./components/NotificationTable";

// Dynamically import react-quill with no SSR (server-side rendering)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface LabelData {
  _id: string;
  lable: string | null;
  username: string;
  usertype: string;
}

const NotificationPage: React.FC = () => {
  const [selectedLabels, setSelectedLabels] = useState<
    { label: string; value: string }[]
  >([]);
  const [category, setCategory] = useState<string | null>(null);
  // const [message, setMessage] = useState<string>("");
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [notification, setNotification] = useState<string>("");
  const [labelData, setLabelData] = useState<LabelData[]>([]);

  const fetchLabels = async () => {
    try {
      const response:any = await apiGet("/api/labels/getLabels");
      console.log(response.data);

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

  const handleNotificationChange = (value: string) => {
    setNotification(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const labelIds = selectedLabels.map((label) => label.value); // Extract the _id of selected labels

      const response:any = await apiPost("/api/notification/add", {
        labels: labelIds.length > 0 ? labelIds : null,
        category,
        message: notification,
      });

      if (response.success) {
        toast.success("Notification created successfully!");
        setSelectedLabels([]);
        setCategory(null);
        // setMessage("");
        setNotification("");
        window.location.reload();
      } else {
        setResponseMessage(
          response.data.message || "Failed to create notification"
        );
      }
    } catch (error) {
      console.error("Error creating notification:", error);
      setResponseMessage("An error occurred while creating the notification.");
    }
  };

  const labelOptions = labelData.map((item) => {
    let displayText = "";

    if (item.usertype === "super") {
      if (item.lable) {
        displayText = item.lable;
      } else {
        displayText = item.username;
      }
    } else if (item.usertype === "normal") {
      displayText = item.username;
    }

    return {
      label: `${displayText} (${item.usertype})`,
      value: item._id,
    };
  });

  return (
    <div
      className="w-full h-full p-6 bg-white rounded-sm"
      style={{ minHeight: "90vh" }}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Notification</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mt-3">
        <h3 className="text-3xl font-bold mb-2">Add Notifications</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Labels
          </label>
          <MultiSelect
            options={labelOptions}
            value={selectedLabels}
            onChange={setSelectedLabels}
            labelledBy="Select Labels"
          />
        </div>

        <div className="mt-3">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="type"
          >
            Category
          </label>
          <select
            name="type"
            id="type"
            className="form-control"
            value={category || "Notification"}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Notification</option>
            <option value="Announcement">Announcement</option>
            <option value="Promotions">Promotions</option>
            <option value="Updates">Updates</option>
          </select>

          {/* <input
            type="text"
            value={category || "Notification"}
            onChange={e => setCategory(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          /> */}
        </div>

        <div className="mt-3" style={{ height: "30vh" }}>
          <ReactQuill
            value={notification}
            onChange={handleNotificationChange}
            placeholder="Write your Notification here..."
            theme="snow"
            style={{ height: "20vh" }}
            className="custom-quill-editor"
          />
        </div>

        {responseMessage && <p className="text-red">{responseMessage}</p>}

        {/* <div className="mt-4">
          </div>
           */}
        <button
          type="submit"
          className="rounded px-4 py-3 bg-blue-500 text-white"
        >
          Submit Notification
        </button>
      </form>

      <div className="my-4 p-2">
        <NotificationTable />
      </div>
    </div>
  );
};

export default NotificationPage;
