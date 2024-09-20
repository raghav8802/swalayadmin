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


// import { Modal } from "@/components/Modal";
// import toast from "react-hot-toast";
// import { DataTable } from "@/components/DataTable";
// import UserContext from "@/context/userContext";

import { apiGet } from "@/helpers/axiosRequest";
import { PaymentList } from "./components/PaymentList";
import { PaymentChart } from "./components/PaymentChart";
import { PayoutList } from "./components/PayoutList";

// import { PaymentList } from "./[labelid]/components/PaymentList"
// import { PaymentChart } from "./[labelid]/components/PaymentChart"
// import { PayoutList } from "./[labelid]/components/PayoutList"

const Payments = ({ params }: { params: { labelid: string } }) => {
  const labelIdParams = params.labelid;
  const labelId = atob(labelIdParams);

  //   const context = useContext(UserContext) || null
  //   const labelId = context?.user?._id

  const [data, setData] = useState({
    amount: "",
    period: "",
    label: "",
  });

  // const [data, setData] = useState({
  //   amount: ""
  // })

  // const [isModalVisible, setIsModalVisible] = useState(false);
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
    //
    try {
      const response = await apiGet(
        `/api/payments/payout/getPayouts?labelId=${labelId}`
      );
      console.log("payout response");
      console.log(response);
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
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mt-3">
        <h3 className="text-2xl font-bold mb-2 ">
          All Earnings Details of{" "}
          <span className="text-blue-500">{labelName}</span>{" "}
        </h3>
        {labelId}
        {/* <Button onClick={() => setIsModalVisible(true)} >Request Payout</Button> */}
      
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

      <div className="bg-white ">
        {paymentData && <PaymentList data={paymentData} />}

        {payout && <PayoutList data={payout} />}
      </div>

      {/* Pay request modal  */}
      {/* <Modal
        isVisible={isModalVisible}
        triggerLabel="Submit Request"
        title="Payout Request"
        onSave={handleSave}
        onClose={handleClose}
        description="Please update your bank details before requesting a payout."
      >
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-12">
            <label className="m-0">Amount</label>
            <input type="text"
              placeholder="Enter Amount"
              className="form-control"
              value={data.amount}
              onChange={(e) => setData({ ...data, amount: e.target.value })}
            />
          </div>
          
        </div>


      </Modal> */}

   


    </div>
  );
};

export default Payments;
