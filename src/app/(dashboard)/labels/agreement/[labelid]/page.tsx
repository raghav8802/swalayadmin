'use client'

import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

interface User {
  _id: string;
  username: string;
  usertype: string;
  lable: string;
  email: string;
  contact: number;
  joinedAt: Date;
}

function Agreement({ params }: { params: { labelid: string } }) {
  const [labelId, setLabelId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [signatureURL, setSignatureURL] = useState<string | null>(null);
  const [uploadDate, setUploadDate] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch user details (dummy data fetching function)
  // const fetchUserDetails = async () => {
  //   try {
  //     // Dummy fetch simulation
  //     const response = {
  //       success: true,
  //       data: {
  //         username: "User A",
  //         usertype: "super",
  //         lable: "Label A",
  //         joinedAt: new Date(),
  //       },
  //     };
  //     if (response.success) {
  //       // const userInfo: User = response.data;
  //       // const userInfo = response.data;
  //       setUser(response.data);
  //     } else {
  //       setUser(null);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Error in loading current user");
  //     setUser(null);
  //   }
  // };

  // React.useEffect(() => {
  //   fetchUserDetails();
  // }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSignatureURL(result);
        setUploadDate(new Date().toISOString());
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSignature = () => {
    setSignatureURL(null);
    setUploadDate(null);
  };

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-700 p-8">
      <div className="bg-white text-gray-900 rounded-lg shadow-2xl p-12 w-full max-w-5xl">
        <div ref={contentRef} id="content-to-pdf">
          <h1 className="text-4xl font-bold text-center mb-8">
            TO WHOMSOEVER IT MAY CONCERN
          </h1>

          {/* Displaying user data */}
          <p className="mb-6 text-lg leading-relaxed">
            This is to inform that we{" "}
            <strong>
              {user?.usertype === "normal"
                ? user?.username
                : user?.usertype === "super"
                ? user?.lable || user?.username
                : null}
            </strong>{" "}
            have licensed our content Exclusively to{" "}
            <strong>“SwaLay Digital”</strong> for monetization across platforms
            and services, including but not limited to CRBT, IVR, Full Tracks,
            etc.
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
            <strong>Term</strong> – Valid from the Date of Signing and
            auto-renewed annually unless terminated by both parties.
          </p>
          <p className="mb-4 text-lg">
            <strong>Start Date</strong> –{" "}
            {user?.joinedAt
              ? new Date(user.joinedAt).toLocaleDateString()
              : "N/A"}
          </p>

          <p className="mt-8 text-lg">Regards,</p>
          <p className="mb-8 text-lg">
            For <strong>{user?.lable || user?.username}</strong>
          </p>

        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleDownload}
            className="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            Download as PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default Agreement;
