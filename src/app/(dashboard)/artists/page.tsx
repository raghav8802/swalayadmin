"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import ArtistModalForm from "@/components/ArtistModalForm";
import { apiGet } from "@/helpers/axiosRequest";
import { ArtistDataTable } from "./components/ArtistDataTable";
import useSWR from "swr";

// Create a fetcher function for SWR
const fetcher = (url: string) =>
  apiGet(url).then((res: any) => {
    if (!res.success) throw new Error("Failed to fetch artists");
    return res.data;
  });

function ArtistPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // SWR hook for data fetching
  const {
    data: artists,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/artist/getAllArtist", fetcher, {
    refreshInterval: 60000, // Auto-revalidate every 60 seconds
    revalidateOnFocus: true, // Revalidate when window gains focus
    revalidateOnReconnect: true, // Revalidate when regaining network connection
    shouldRetryOnError: true, // Auto-retry failed requests
  });

  const handleClose = () => {
    setIsModalVisible(false);
    mutate(); // Trigger immediate revalidation after modal closes
  };

  // Handle errors
  if (error) {
    toast.error("🤔 Failed to load artists");
  }

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
            <BreadcrumbPage>Artists</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mt-3">
        <h3 className="text-3xl font-bold mb-2 text-blue-500">All Artists</h3>
        <Button onClick={() => setIsModalVisible(true)}>New Artist</Button>
      </div>

      {isLoading ? (
        <h5 className="text-2xl mt-5 pt-3 text-center">Loading...</h5>
      ) : artists ? (
        <div className="bg-white p-3">
          <ArtistDataTable data={artists} />
        </div>
      ) : (
        <h5 className="text-2xl mt-5 pt-3 text-center">No Record Found</h5>
      )}

      <ArtistModalForm isVisible={isModalVisible} onClose={handleClose} />
    </div>
  );
}

export default ArtistPage;
