'use client'
import React, { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Style from "../../styles/Profile.module.css"
import toast from "react-hot-toast"
import { useContext } from "react"
import { apiGet } from "@/helpers/axiosRequest"
import UserContext from "@/context/userContext"

interface BankData {
  _id: string;
  labelId: string;
  accountHolderName: string;
  bankName: string;
  branchName: string;
  gstNo: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  pan: string;
}

const ProfilePage = () => {

  const context = useContext(UserContext);
  // console.log(context);
  
  const labelId = context?.user?._id;
  const username = context?.user?.username;
  // const lableName = context?.user?.lable;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bankData, setBankData] = useState<BankData | null>(null);
  const [isLoading, setIsLoading] = useState(true)

  const fetchBankDetails = useCallback(async () => {
    try {
      const response: { success: boolean; data: BankData } | null = await apiGet(`/api/bank/getbankdetails?labelid=${labelId}`);
      if (response && response.success) {
        setBankData(response.data)
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      toast.error("Internal server down")
      console.log(error);

    }
  }, [labelId]);

  const handleClose = () => {
    setIsModalVisible(false);
    setIsLoading(true)
    fetchBankDetails()

  };

  useEffect(() => {
    if (labelId) {
      fetchBankDetails();
    }
  }, [labelId, fetchBankDetails])

  return (
    <div className="grid grid-cols-12 gap-4 ">

      <div className={`col-span-3 h-screen  ${Style.profileSidebar}`}>

        <div className={`my-4 ${Style.profileImgContainer}`}>
          <Image src={"/images/album3.jpg"} width={250} height={250} alt="profile" className={Style.profileImage} />
        </div>
        <div className="mt-5 mb-5">
          <p className={Style.labelName} >Label  name</p>
          <p className={Style.labelUserName} >Label user name</p>
          <p className={`mt-3 ${Style.labelDescription}`} >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere vitae recusandae dolores excepturi, rerum ullam sequi officiis non sit magni fugit animi quo officia quae aliquam. Possimus nam architecto deserunt.</p>
        </div>

        <div className="flex mt-5 items-center justify-evenly">
          <Image src={"/images/facebook.png"} width={50} height={50} alt="social" />
          <Image src={"/images/instagram.png"} width={50} height={50} alt="social" />
          <Image src={"/images/youtube.png"} width={50} height={50} alt="social" />

        </div>

      </div>
      <div className={`col-span-9 h-screen `}>

        <div className={Style.profileContainer}>
          <div className="flex items-center justify-between">
            <h3 className={Style.labelHeader}>Label Information</h3>
            <i className={`bi bi-pencil-square ${Style.editIcon}`}></i>
          </div>

          <div className="grid grid-cols-12 gap-4 mt-3 mb-3">

            <div className={`mb-3 col-span-4 `}>
              <p className={Style.labelSubHeader}>Label Name</p>
              <p>Sarkar World Music Ltd</p>
            </div>
            <div className={`mb-3 col-span-4 `}>
              <p className={Style.labelSubHeader}>Label Owner Name</p>
              <p>{username} </p>
            </div>
            <div className={`mb-3 col-span-4 `}>
              <p className={Style.labelSubHeader}>Joining Date</p>
              <p>10th March, 2024</p>
            </div>
            <div className={`mb-3 col-span-4 `}>
              <p className={Style.labelSubHeader}>Email</p>
              <p>s@gmail.com</p>
            </div>
            <div className={`mb-3 col-span-4 `}>
              <p className={Style.labelSubHeader}>Contact</p>
              <p>789654123</p>
            </div>
            <div className={`mb-3 col-span-4 `}>
              <p className={Style.labelSubHeader}>Address</p>
              <p>India</p>
            </div>
            <div className={`mb-3 col-span-4 `}>
              <p className={Style.labelSubHeader}>Total Album</p>
              <p>888k</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage