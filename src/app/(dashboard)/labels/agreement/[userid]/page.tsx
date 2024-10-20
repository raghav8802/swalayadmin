"use client";

import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";
import { apiGet } from "@/helpers/axiosRequest";
import Image from "next/image";

interface User {
  _id: string;
  username: string;
  usertype: string;
  lable: string;
  email: string;
  contact: number;
  joinedAt: Date;
  signature: string;
}

function Agreement({ params }: { params: { userid: string } }) {
  const [labelId, setLabelId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [signatureURL, setSignatureURL] = useState<string | null>(null);
  const [uploadDate, setUploadDate] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const labelIdParams = params.userid;

  useEffect(() => {
    const labelIdParams = params.userid;

    try {
      const decodedLabelId = atob(labelIdParams);
      setLabelId(decodedLabelId);
    } catch (e) {
      setError("Invalid Url");
      console.error("Decoding error:", e);
    }
  }, [labelIdParams]);

  useEffect(() => {
    if (labelId) {
      fetchUserDetails();
    }
  }, [labelId]);

  // Fetch user details (dummy data fetching function)
  const fetchUserDetails = async () => {
    if (!labelId) return; // Avoid making API calls if albumId is null
    setIsLoading(true);
    try {
      const response = await apiGet(`/api/labels/details?labelId=${labelId}`);
      if (response.success) {
        setUser(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Internal server down");
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchUserDetails();
  }, []);

  // Convert the marked content to PDF
  const handleDownload = async () => {
    if (!contentRef.current) return;

    try {
      const canvas = await html2canvas(contentRef.current);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Handle multi-page PDF if necessary
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("agreement.pdf");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-700 p-8">
      <div className="bg-white text-gray-900 rounded-lg shadow-2xl p-12 w-full max-w-5xl">

        <div ref={contentRef} className="p-12" id="content-to-pdf">
          
          <h1 className="text-4xl font-bold text-center mb-8">
            TO WHOMSOEVER IT MAY CONCERN
          </h1>

          <Image
            width={500}
            height={500}
            className="watermarkLogo"
            src={`https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/SwaLay+-2.png`}
            alt="SwaLay"
          />
          <p className="mb-6 text-lg leading-relaxed">
            This is to inform that we{" "}
            <strong>
              “{" "}
              {user?.usertype === "normal"
                ? user?.username
                : user?.usertype === "super"
                ? user?.lable || user?.username
                : null}{" "}
              ”
            </strong>{" "}
            have licensed our content Exclusively to{" "}
            <strong>“ SwaLay Digital ” </strong> for monetization of content
            across any and all platforms and services including but not limited
            to CRBT, IVR Full Tracks (Operator Based) and OTT platforms
            (international, domestic), streaming services, video
            streaming/download etc across various services and all telecom
            operators for the territory of world, on terms as detailed below –
          </p>
          <p className="mb-4 text-lg">
            <strong>License Type</strong> – Exclusive
          </p>
          <p className="mb-4 text-lg">
            <strong>Content</strong> – All Past catalogue and Future new
            releases.
          </p>
          <p className="mb-4 text-lg">
            <strong>Territory</strong> – Worldwide
          </p>
          <p className="mb-4 text-lg">
            <strong>Date of Signing </strong> – 03/10/2024
          </p>
          <p className="mb-4 text-lg">
            <strong>Term</strong> – This B2B is valid from Date of Signing of
            this Document and valid till two year and will be auto renewed if
            not requested and agreed for termination on or before sixty days of
            expiry of this document in written by both the parties.
          </p>

          <p className="mt-8 text-lg">
            <strong>Regards,</strong>
          </p>
          <p className="mb-8 text-lg">{user?.lable || user?.username}</p>
          <p className="mt-4 text-lg">
            <strong>Sign</strong>
          </p>
          <div className="flex justify-between items-center w-full">
            {user?.signature && (
              <Image
                width={200}
                height={200}
                src={`https://swalay-music-files.s3.ap-south-1.amazonaws.com/labels/signature/${user?.signature}`}
                alt="signature"
              />
            )}

            <Image
              width={150}
              height={150}
              src={`https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/SwaLay+-2.png`}
              alt="SwaLay"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        {user?.signature && (
          <button
            onClick={handleDownload}
            className="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            Download as PDF
          </button>
        )}
      </div>
    </div>
  );
}

export default Agreement;
