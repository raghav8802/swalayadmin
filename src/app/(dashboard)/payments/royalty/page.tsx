"use client";
import React, { useEffect, useState } from "react";
import { apiFormData, apiGet } from "@/helpers/axiosRequest";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import PaymentList from "../components/PaymentList";
import RoyaltyLabelList from "../components/RoyaltyLabelList";

interface LabelData {
  _id: string;
  lable: string | null;
  username: string;
  usertype: string;
}

const page = () => {
  const [payoutRequestData, setPayoutRequestData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [labelData, setLabelData] = useState<LabelData[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null); // State to store uploaded PDF file

  const [data, setData] = useState({
    amount: "",
    period: "",
    lable: "",
    type: "",
    payout_report_url: "",
  });

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("labelId", data.lable);
      formData.append("amount", data.amount);
      formData.append("time", data.period);
      formData.append("type", data.type);
      if (pdfFile) {
        formData.append("payout_report_url", pdfFile);
      }

      Array.from(formData.entries()).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });

      // Use the apiFormData helper function
      const response = await apiFormData("/api/payments/addPayment", formData);
      console.log("response", response);
      setIsModalVisible(false);
      setData({
        amount: "",
        period: "",
        lable: "",
        type: "",
        payout_report_url: "",
      });
      setPdfFile(null); // Clear the uploaded file
    } catch (error) {
      toast.error("Internal server error");
    }
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const fetchLabels = async () => {
    try {
      const response = await apiGet("/api/labels/getLabels");

      if (response.success) {
        setLabelData(response.data);
      }
    } catch (error) {
      toast.error("Something went wrong to fetch data");
    }
  };

  useEffect(() => {
    // fetchRequestedData();
    fetchLabels();
  }, []);

  const renderLabelOptions = () => {
    return labelData.map((label) => {
      if (label.usertype === "super" && label.lable) {
        return (
          <option key={label._id} value={label._id}>
            {label.lable} ({label.usertype}){" "}
          </option>
        );
      } else if (label.usertype === "super" && !label.lable) {
        return (
          <option key={label._id} value={label._id}>
            {label.username} ({label.usertype}){" "}
          </option>
        );
      } else if (label.usertype === "normal") {
        return (
          <option key={label._id} value={label._id}>
            {label.username} ({label.usertype}){" "}
          </option>
        );
      } else {
        return null; // No option if conditions are not met
      }
    });
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setPdfFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/pdf": [] },
    maxFiles: 1,
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
            <BreadcrumbPage>Payments</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mt-3">
        <h3 className="text-3xl font-bold mb-2 text-blue-500">
          All Labels for royalty
        </h3>
        <Button onClick={() => setIsModalVisible(true)}>Add New Earn</Button>
      </div>

      {/* {payoutRequestData && <PaymentPendingList data={payoutRequestData} />} */}
      {/* {earningData && <PaymentList data={earningData} /> } */}
      {labelData && <RoyaltyLabelList data={labelData} />}

      <Modal
        isVisible={isModalVisible}
        triggerLabel="Submit"
        title="New Payment"
        onSave={handleSave}
        onClose={handleClose}
      >
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <label className="m-0">Amount</label>
            <input
              type="text"
              placeholder="Enter Amount"
              className="form-control"
              value={data.amount}
              onChange={(e) => setData({ ...data, amount: e.target.value })}
            />
          </div>
          <div className="col-span-6">
            <label className="m-0">Period</label>
            <input
              type="month"
              className="form-control"
              value={data.period}
              onChange={(e) => setData({ ...data, period: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="m-0">Label</label>
          <select
            name="trackType"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={data.lable}
            onChange={(e) => setData({ ...data, lable: e.target.value })}
          >
            <option value="">Select Label</option>
            {renderLabelOptions()}
          </select>
        </div>

        <div>
          <label className="m-0">Type</label>
          {/* <input
            type="text"
            placeholder="Enter Type"
            className="form-control"
            value={data.type}
            onChange={(e) => setData({ ...data, type: e.target.value })}
          /> */}
          <select
            className="form-control"
            value={data.type}
            onChange={(e) => setData({ ...data, type: e.target.value })}
          >
            <option value="">Select Type</option> {/* Default option */}
            <option value="Royalty">Royalty</option>
            <option value="Penalty">Penalty</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="m-0">Upload Payment Report (PDF)</label>
          <div
            {...getRootProps({
              className:
                "dropzone border-dashed border-2 border-gray-400 rounded-md p-4 text-center cursor-pointer",
            })}
          >
            <input {...getInputProps()} />
            {pdfFile ? (
              <p>{pdfFile.name}</p>
            ) : (
              <p>Drag & drop a PDF here, or click to select a file</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default page;
