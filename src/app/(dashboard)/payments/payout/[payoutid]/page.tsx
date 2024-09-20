"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { apiGet, apiPost } from "@/helpers/axiosRequest";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Link from "next/link";
import toast from "react-hot-toast";

interface PayoutDetails {
  _id: string;
  amount: number;
  labelId: string;
  labelName: string;
  request_at: string;
  update_at: string;
  status: string;
  type: string;
  comment: string;
  payout_report_url: string;
}

const Page = ({ params }: { params: { payoutid: string } }) => {
  const payOutIdParams = params.payoutid;
  const payoutId = atob(payOutIdParams);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [payoutDetails, setPayoutDetails] = useState<PayoutDetails | null>(
    null
  );
  const [formData, setFormData] = useState({
    type: "Royalty",
    comment: "",
    status: "PENDING", // Default status
    amount: "",
  });
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"], 
    },
  });

  const fetchPayoutDetails = async () => {
    try {
      const response = await apiGet(
        `/api/payments/payout/payoutDetails?payoutId=${payoutId}`
      );
      if (response.success) {
        setPayoutDetails(response.data);
        setFormData({ ...formData, status: response.data.status });
        setFormData({ ...formData, amount: response.data.amount.toString() });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (payoutId) {
      fetchPayoutDetails();
    }
  }, [payoutId]);

  const handleSubmit = async () => {
    const payload = {
      labelName: payoutDetails?.labelName || "",
      labelId: payoutDetails?.labelId || "",
      payoutId: payoutId,
      amount: formData.amount,
      status: "APPROVED" // Status for approval
    };

    try {
      const response = await apiPost(
        `/api/payments/payout/submitPayout`,
        payload
      );
      console.log("Payout submitted successfully:", response);
      if (response.success) {
        toast.success("Payout has been successfully processed.");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting payout:", error);
      toast.error("Internal server error");
    }
  };

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
            <BreadcrumbPage>Payout details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mt-3 mb-3">
        <h3 className="text-2xl font-bold mb-2">
          Payout request from{" "}
          <span className="text-blue-500">{payoutDetails && payoutDetails.labelName}</span>
        </h3>
      </div>

      {payoutDetails && (
        <div className="w-full bg-gradient-to-br from-purple-100 to-indigo-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
            <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
              <div className="md:flex">
                <div className="p-8 w-full">
                  <div
                    className={`uppercase tracking-wide text-sm font-semibold ${
                      payoutDetails.status === "Pending"
                        ? "text-blue-500"
                        : payoutDetails.status === "APPROVED"
                        ? "text-green-500"
                        : ""
                    }`}
                  >
                    {payoutDetails.status}
                  </div>

                  <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    {payoutDetails.labelName} {payoutDetails.status}
                  </h1>
                  <p className="mt-4 max-w-2xl text-xl text-gray-500">
                    {payoutDetails.comment}
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <div className="flex items-center space-x-2">
                        <i className="bi bi-calendar" />
                        <span className="text-gray-900">
                          {new Date(
                            payoutDetails.request_at
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="sm:col-span-1">
                      <div className="flex items-center space-x-2 text-2xl ">
                        <span className="font-bold">Amount</span>
                        <span className="text-gray-900">
                          ₹{payoutDetails.amount}
                        </span>
                      </div>
                    </div>
                    <div className="sm:col-span-1">
                      <div className="flex items-center space-x-2">
                        Request at:{" "}
                        {new Date(
                          payoutDetails.request_at
                        ).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="sm:col-span-1">
                      <div className="flex items-center space-x-2">
                        Last Updated:{" "}
                        {new Date(payoutDetails.update_at).toLocaleDateString()}
                      </div>
                    </div>
                    {payoutDetails.payout_report_url !== "" && (
                      <div className="sm:col-span-1">
                        <div className="flex items-center space-x-2">
                          <i className="bi bi-link-45deg text-2xl" /> Report
                          Link:{" "}
                          <Link target="_blank" href={` ${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}labels/payments/payoutReports/${payoutDetails.payout_report_url}`}>
                            {payoutDetails.payout_report_url}
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <i className="bi bi-credit-card" />
                        <span className="text-lg font-medium text-gray-900">
                          Payment Details
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{payoutDetails.amount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-2 p-3 mt-3">
        <div className="col-span-6 mb-3">
          <label className="block text-sm font-medium">Label Name</label>
          <input
            type="text"
            className="form-control disabled:opacity-75"
            value={payoutDetails?.labelName}
            readOnly
          />
        </div>
        <div className="col-span-6 mb-3">
          <label className="block text-sm font-medium">Amount</label>
          <input
            type="text"
            className="form-control disabled:opacity-75"
            value={payoutDetails?.amount}
            readOnly
          />
        </div>

        <div className="col-span-12 mb-3 text-right">
          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={() => setIsDialogOpen(true)}
          >
            Proceed Payout
          </button>
        </div>
      </div>

      <ConfirmationDialog
        show={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onContinue={handleSubmit}
        title="Are You Sure ?"
        description="Please note that once you proceed, you will not be able to make any further changes."
      />
    </div>
  );
};

export default Page;
