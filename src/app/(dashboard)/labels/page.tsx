'use client'
import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import Style from "../../styles/Labels.module.css"
import React, { useEffect, useState } from "react"
import { apiGet } from "@/helpers/axiosRequest"
import { LabelList } from "./components/LabelList"




const lables = () => {

  const [labelData, setLabelData] = useState([])

  
  const fetchLebels = async () => {
    try {
      const response = await apiGet('/api/labels/getLabels')  
      console.log(response);
      console.log(response.data);
      if (response.success) {
        setLabelData(response.data)
      }

    } catch (error) {
      console.log(error);
    }

  }


  useEffect(() => {
    fetchLebels()
  }, [])





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
        <h3 className={Style.heading}>All Labeles</h3>
        <Button>
          <Link href={'/labels/register'}>
          New Label
          </Link>
          </Button>
      </div>

      <div className="mt-3 bg-white p-3">
    {
      labelData && (
        <LabelList data={labelData} />
      )
    }

      </div>


    </div>
  )
}

export default lables