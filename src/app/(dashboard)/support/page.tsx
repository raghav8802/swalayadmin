'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { apiGet } from "@/helpers/axiosRequest";
import toast from "react-hot-toast";
import { SupportDataTable } from "./components/SupportDataTable";

interface supportData {
  name: string;
  email: string;
  subject: string;
  message: string;
  labelId?: string; 
  _id: string;
  __v: number;
}

export default function Component() {
  const [error, setError] = useState<string | null>(null);
  const [supportData, setsupportData] = useState<supportData[]>([]); // Updated to an array of supportData

  const fetchSupportData = async () => {
    try {
      const response = await apiGet("/api/support/getall");
      console.log("support response.data", response.data);

      if (response.success) {
        setsupportData(response.data); // Assuming response.data is an array of supportData
      } else {
        toast.error(response.message);
        setError("Failed to fetch the data. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    fetchSupportData();
  }, []);

  return (
    <div className="w-full h-full p-6 bg-white rounded-sm" style={{ minHeight: "90vh" }}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Supports</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mt-3">
        <h3 className="text-3xl font-bold mb-2 text-blue-500">Supports</h3>
      </div>

      {
        supportData.length > 0 ? (
          <div className="bg-white p-3">
            <SupportDataTable data={supportData} />
          </div>
        ) : (
          <div>No support data found.</div>
        )
      }
    </div>
  );
}
