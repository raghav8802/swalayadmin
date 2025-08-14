"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import React, { useContext, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import LeadModalForm from "@/components/leadmodalform";

import { safeApiGet } from "@/helpers/axiosRequest";
import UserContext from "@/context/userContext";
import { LeadDataTable } from "./components/leaddatatable";

function LeadsPage() {
  const context = useContext(UserContext);
  const labelId = context?.user?._id;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [leads, setLeads] = useState();

  const fetchAllLeads = async (labelId: any) => {
    setIsLoading(true);
    try {
      const response:any = await safeApiGet(`/api/leads/getLeads`, { success: false, data: [] });
      if (response.success) {
        setLeads(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error("Something went wrong");
      setIsLoading(false);
    }
    
  };

  useEffect(() => {
    if (labelId) {
      fetchAllLeads(labelId);
    }
  }, [labelId]);

  return (
    <div className="w-full h-full p-6 bg-white rounded-sm" style={{ minHeight: "90vh" }}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Leads</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mt-3">
        <h3 className="text-3xl font-bold mb-2">All Leads</h3>
        <Button onClick={() => setIsModalVisible(true)}>New Lead</Button>
      </div>

      <div className="mt-3 bg-white p-3">
        <LeadDataTable data={leads} />
      </div>

      <LeadModalForm isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </div>
  );
}

export default LeadsPage;
