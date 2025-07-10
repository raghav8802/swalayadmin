'use client'
import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import Style from "../../styles/Labels.module.css"
import React from "react"
import { apiGet } from "@/helpers/axiosRequest"
import { LabelList } from "./components/LabelList"
import { useQuery } from "@tanstack/react-query"


const Labels = () => {
  const { data: labelData, isLoading, error, refetch } = useQuery({
    queryKey: ['labels'],
    queryFn: async () => {
      const response = await apiGet<{ success: boolean; data: any[] }>('/api/labels/getLabels')
      if (response?.success) {
        return response.data
      }
      throw new Error('Failed to fetch labels')
    },
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: false,
    retry: false,
  })

  return (
    <div className="w-full h-full p-6 bg-white rounded-sm" style={{ minHeight: "90vh" }} >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              Home
            </BreadcrumbLink>
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
          <Button onClick={() => refetch()}>
            Refresh Data
          </Button>
          <Button>
            <Link href={'/labels/register'}>
              New Label
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-3 bg-white p-3">
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error loading labels</div>
        ) : (
          labelData && <LabelList data={labelData} />
        )}
      </div>
    </div>
  )
}

export default Labels