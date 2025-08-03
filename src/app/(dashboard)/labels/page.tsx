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
import { apiGet } from "@/helpers/axiosRequest";
import { LabelList } from "./components/LabelList";
import { apiUrl } from "@/helpers/serverFetch";

// This makes the page dynamically render on each request
export const dynamic = "force-dynamic";

async function fetchLabels() {
  try {
    const res = await fetch(apiUrl("/api/labels/getLabels"), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // cache: "no-store"   // optional if you want to bypass fetch cache
    });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    // console.log("Fetched labels:", data); // Debug log
    return data.success ? data.data : [];
  } catch (e) {
    console.error("fetchLabels error:", e);
    return [];
  }
}

// Update your page component
// async function fetchLabels() {
//   try {
//     // Next.js fetch automatically handles server/client context
//     const response = await fetch('local/api/labels/getLabels', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }

//     const data = await response.json()
//     return data.success ? data.data : []
//   } catch (error) {
//     console.error('Error fetching labels:', error)
//     return []
//   }
// }

export default async function LabelsPage() {
  const labelData = await fetchLabels();

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
        <Button>
          <Link href={"/labels/register"}>New Label</Link>
        </Button>
      </div>

      <div className="mt-3 bg-white p-3">
        {labelData && labelData.length > 0 ? (
          <LabelList data={labelData} />
        ) : (
          <p>No labels found</p>
        )}
      </div>
    </div>
  );
}
