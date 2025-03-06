"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { useContext, useEffect, useState } from "react";
import { apiGet } from "@/helpers/axiosRequest";

import Link from "next/link";
import ErrorSection from "@/components/ErrorSection";
import { PaymentPendingList } from "../components/pendingPaymentsList";
// import DataTableUi from '../components/DataTable'

const payments = ({ params }: { params: { filter: string } }) => {
  // const filter = params.filter;
  const filter = params.filter.charAt(0).toUpperCase() + params.filter.slice(1).toLowerCase();
  
  const validFilters = ["All", "Pending", "Completed", "Rejected", "Failed", "Approved"]; 
  if (!validFilters.includes(filter)) {
    return <ErrorSection message="Invalid URL or Not Found" />;
  }

  const [isLoading, setIsLoading] = useState(true);

  const [payoutRequestData, setPayoutRequestData] = useState([]);

  const fetchRequestedData = async () => {
    
    try {
      const response = await apiGet(
        `/api/payments/payout/getAllPayouts?status=${filter}`
      );
      if (response.success) {
        setPayoutRequestData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRequestedData();
  }, []);


  return (
    <div className="w-full h-dvh p-6 bg-white rounded-sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Payments</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Payouts</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className={`bg-white mt-3 rounded `}>
        <h3 className="text-3xl font-bold mb-2 text-blue-500 capitalize ">
            {filter} Payouts
          </h3>

        {payoutRequestData ? (
          <PaymentPendingList data={payoutRequestData} />
        ) : (
          <h3 className="text-center mt-4">No Albums found</h3>
        )}


      </div>
    </div>
  );
};

export default payments;
