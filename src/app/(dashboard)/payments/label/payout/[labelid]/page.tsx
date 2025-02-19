"use client";
import React, {  useEffect, useState } from "react";
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
import { PayoutList } from "./components/PayoutList";


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

  const fetchPayments = async () => {
    try {
      const response = await apiGet(
        `/api/payments/getPayments?labelId=${labelId}`
      );
      console.log("response.data earning");
      console.log(response.data);

      if (response.success) {
        setPaymentData(response.data.payments);
        setTotalPayoutBalance(response.data.totalPayoutBalance);
        setAvailableBalance(response.data.totalBalance);
        setLabelName(response.data.LabelName);
      }
    } catch (error) {
      console.log("error");
    }
  };


  const fetchPayOut = async () => {
    
    try {
      const response = await apiGet(
        `/api/payments/payout/getPayouts?labelId=${labelId}`
      );
      if (response.success) {
        setPayout(response.data);
      }
    } catch (error) {
      console.log("error");
    }
  };

  useEffect(() => {
    if (labelId) {
      fetchPayments();
      fetchPayOut();
    }
  }, [labelId]);



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
            <BreadcrumbPage>Payout Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mt-3">
        <h3 className="text-2xl font-bold mb-2 ">
          All Payout Details of{" "}
          <span className="text-blue-500">{labelName}</span>{" "}
        </h3>
      
      </div>


      <div className="bg-white mt-3">
        {payout && <PayoutList data={payout} />}
      </div>



    </div>
  );
};

export default Payments;
