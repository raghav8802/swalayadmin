import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { SubscriptionDataTable } from "./components/SubcriptionDataTable";
import { api } from "@/lib/apiRequest";
import NewSubscription from "./components/NewSubsciption";

interface Label {
  _id: string;
  lable: string;
  subscriptionStatus: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  subscriptionPlan: string;
  subscriptionpaymentId: string;
  subscriptionprice: string;
}

export const dynamic = 'force-dynamic';

const SubscriptionPage = async () => {
  const apiResponse = await api.get<{ data: Label[] }>(
    "/api/labels/subscriptions"
  );

  const subcription = apiResponse.data;

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
            <BreadcrumbLink>Subscription</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mt-3">
        <h3 className="text-3xl font-bold mb-2">All Subscriptions</h3>
        <NewSubscription/>
      </div>

      <SubscriptionDataTable data={subcription} />
    </div>
  );
};

export default SubscriptionPage;
