"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";


import { apiGet } from "@/helpers/axiosRequest";
import { PaymentList } from "./components/PaymentList";
import { PaymentChart } from "./components/PaymentChart";
import Link from "next/link";


const Payments = ({ params }: { params: { labelid: string } }) => {
  const labelIdParams = params.labelid;
  const labelId = atob(labelIdParams);


  const [data, setData] = useState({
    amount: "",
    period: "",
    label: "",
  });

  const [paymentData, setPaymentData] = useState();
  const [payout, setPayout] = useState();
  const [totalPayoutBalance, setTotalPayoutBalance] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [labelName, setLabelName] = useState("");

  const fetchPayments = useCallback(async () => {
    try {
      const response: any = await apiGet(
        `/api/payments/getPayments?labelId=${labelId}`
      );
      console.log("response.data earning");
      console.log(response.data.payments);

      if (response.success) {
        setPaymentData(response.data.payments);
        setTotalPayoutBalance(response.data.totalPayoutBalance );
        setAvailableBalance(response.data.totalBalance);
        setLabelName(response.data.LabelName);
      }
    } catch (error) {
      console.log("error");
    }
  }, [labelId]);


  useEffect(() => {
    if (labelId) {
      fetchPayments();
    }
  }, [labelId, fetchPayments]);



  return (
    <div className="w-full min-h-[80dvh] p-6 bg-white rounded-sm ">
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
            <BreadcrumbPage>Pay In</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mt-3">
        <h3 className="text-2xl font-bold mb-2 ">
          All Earnings Details of{" "}
          <span className="text-blue-500">{labelName}</span>{" "}
        </h3>
        <Link className="px-2 py-2 rounded bg-black text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium text-sm" 
        href={`/payments/label/payout/${btoa(labelId)}`} >Payout Details</Link>
      
      </div>

      <div className="my-3">
        {paymentData && (
          <PaymentChart
            data={paymentData}
            totalPayout={totalPayoutBalance}
            availableBalance={availableBalance}
          />
        )}
      </div>

      <div className="bg-white mt-3">
        {paymentData && <PaymentList data={paymentData} />}
      </div>


    </div>
  );
};

export default Payments;
