import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import Style from "../../styles/Labels.module.css";
import React from "react";
import { LabelList } from "./components/LabelList";
import { api } from "@/lib/apiRequest";

// Add this export to disable static generation
export const dynamic = "force-dynamic";

const Labels = async () => {
  // Use safe API method with fallback data for static generation
  const apiResponse = await api.safeGet<{ data: any }>(
    "/api/labels/getLabels",
    { data: [] },
    { cache: 'no-store' }
  );

  let Labels = apiResponse.data || [];

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
            <BreadcrumbPage>Labels</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mt-3">
        <h3 className={Style.heading}>All Labels</h3>
        <div className="flex gap-2">
          <Button>
            <Link href={"/labels/register"}>New Label</Link>
          </Button>
        </div>
      </div>

      <div className="mt-3 bg-white p-3">
        <LabelList data={Labels} />
      </div>
    </div>
  );
};

export default Labels;
