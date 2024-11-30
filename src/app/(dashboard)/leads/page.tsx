"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import React, { useContext, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import LeadModalForm from "@/components/leadmodalform";

import { apiGet } from "@/helpers/axiosRequest";
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
      const response = await apiGet(`/api/leads/getLeads`);
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
        <h3 className="text-3xl font-bold mb-2 text-blue-500">All Leads</h3>
        <Button onClick={() => setIsModalVisible(true)}>New Lead</Button>
      </div>

      {leads && (
        <div className="bg-white p-3">
          <LeadDataTable data={leads} />
        </div>
      )}

      {isLoading && <h5 className="text-2xl mt-5 pt-3 text-center">Loading...</h5>}
      {!leads && !isLoading && <h5 className="text-2xl mt-5 pt-3 text-center">No Record Found</h5>}

      <LeadModalForm 
        isVisible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
      />
    </div>
  );
}

export default LeadsPage;
