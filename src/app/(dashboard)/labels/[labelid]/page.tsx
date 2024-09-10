"use client";

import Image from "next/image";
// import Style from "../../styles/Profile.module.css";
import Style from "../../../styles/Profile.module.css";
import toast from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import { apiGet } from "@/helpers/axiosRequest";
import UserContext from "@/context/userContext";

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

interface LabelData {
  email: string;
  isLable: boolean;
  isVerified: string;
  joinedAt: string;
  lable: string | null;
  username: string;
  contact: string;
  usertype: string;
  _id: string;
}

const page = ({ params }: { params: { labelid: string } }) => {
  const labelParams = params.labelid;
  // const [decodedArtistId, setDecodedArtistId] = useState('');
  const labelId = atob(labelParams as string);

//   const context = useContext(UserContext);
//   console.log(context?.user);

  //   const labelId = context?.user?._id;
  //   const username = context?.user?.username;
  //   const email = context?.user?.email;
  //   const contact = context?.user?.contact;
  //   const joinedat = context?.user?.joinedAt; // Update 'joinedAT' to 'joinedAt'

  //   const lableName = context?.user?.lable;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bankData, setBankData] = useState<BankData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [labelData, setLabelData] = useState<LabelData | null>(null);

  const labelDetails = async () => {
    try {
      const response = await apiGet(`/api/labels/details?labelId=${labelId}`);
      console.log("response.data -------");
      console.log(response.data);
      console.log("-------");

      if (response.success) {
        setLabelData(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Internal server down");
      console.log(error);
    }
  };

  const fetchBankDetails = async () => {
    try {
      const response = await apiGet(
        `/api/bank/getbankdetails?labelid=${labelId}`
      );
      if (response.success) {
        setBankData(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Internal server down");
      console.log(error);
    }
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setIsLoading(true);
    fetchBankDetails();
  };

  useEffect(() => {
    if (labelId) {
      fetchBankDetails();
      labelDetails();
    }
  }, [labelId]);

  return (
    // <div className="flex" >
    <div className="grid grid-cols-12 gap-4 ">
      {/* <div className={`col-span-3 h-screen  ${Style.profileSidebar}`}>
        <div className={`my-4 ${Style.profileImgContainer}`}>
          <Image
            src={""}
            width={250}
            height={250}
            alt="profile"
            className={Style.profileImage}
          />
        </div>
        <div className="mt-5 mb-5">
          <p className={Style.labelName}>{username}</p>
          <p className={Style.labelUserName}>{email}</p>
          <p className={`mt-3 ${Style.labelDescription}`}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere
            vitae recusandae dolores excepturi, rerum ullam sequi officiis non
            sit magni fugit animi quo officia quae aliquam. Possimus nam
            architecto deserunt.
          </p>
        </div>

        <div className="flex mt-5 items-center justify-evenly">
          <Image
            src={"/images/facebook.png"}
            width={50}
            height={50}
            alt="social"
          />
          <Image
            src={"/images/instagram.png"}
            width={50}
            height={50}
            alt="social"
          />
          <Image
            src={"/images/youtube.png"}
            width={50}
            height={50}
            alt="social"
          />
        </div>
      </div> */}
      {/* <div className={`col-span-9 h-screen ${Style.profileContainer}`}> */}
      <div className={`col-span-12 h-screen `}>
        <div className={Style.profileContainer}>
          <div className="flex items-center justify-between">
            <h3 className={Style.labelHeader}>Label Information</h3>
          </div>

          <div className="grid grid-cols-12 gap-4 mt-3 mb-3">
            <div className={`mb-3 col-span-4 `}>
              <p className={Style.labelSubHeader}>Label Name</p>
              <p>{  labelData?.lable ? labelData?.lable : "SwaLay Digittal"}</p>
            </div>
            <div className={`mb-3 col-span-4 `}>
              <p className={Style.labelSubHeader}>Label Owner Name</p>
              <p>{labelData?.username ? labelData.username : "Unknown Owner"}</p>
            </div>
            <div className={`mb-3 col-span-4 `}>
              <p className={Style.labelSubHeader}>Joining Date </p>
              <p>
                {labelData
                  ? new Date(labelData.joinedAt).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
            <div className={`mb-3 col-span-4 `}>
              <p className={Style.labelSubHeader}>Email</p>
              <p>{labelData && labelData.email}</p>
            </div>
            <div className={`mb-3 col-span-4 `}>
              <p className={Style.labelSubHeader}>Contact</p>
              <p>{labelData && labelData?.contact}</p>
            </div>
          </div>
        </div>

        {/* <div className={`mt-5 ${Style.profileContainer}`}>
          <div className="flex items-center justify-between">
            <h3 className={Style.labelHeader}>Bank Details</h3>
            <i
              onClick={() => setIsModalVisible(true)}
              className={`bi bi-pencil-square ${Style.editIcon}`}
            ></i>
          </div>

          {bankData && (
            <div className="grid grid-cols-12 gap-4 mt-3 mb-3">
              <div className={`mb-3 col-span-3 `}>
                <p className={Style.labelSubHeader}>Account Holder Name</p>

                {bankData && bankData.accountHolderName && (
                  <p>{bankData.accountHolderName}</p>
                )}
              </div>
              <div className={`col-span-3 `}>
                <p className={Style.labelSubHeader}>Bank Name</p>
                {bankData && bankData.bankName && <p>{bankData.bankName}</p>}
              </div>

              <div className={`mb-3 col-span-3 `}>
                <p className={Style.labelSubHeader}>Branch Name</p>
                {bankData && bankData.branchName && (
                  <p>{bankData.branchName}</p>
                )}
              </div>
              <div className={`mb-3 col-span-3 `}>
                <p className={Style.labelSubHeader}>Account Number</p>
                {bankData && bankData.accountNumber && (
                  <p>{bankData.accountNumber}</p>
                )}
              </div>
              <div className={`mb-3 col-span-3 `}>
                <p className={Style.labelSubHeader}>IFSC Code</p>
                {bankData && bankData.ifscCode && <p>{bankData.ifscCode}</p>}
              </div>
              <div className={`mb-3 col-span-3 `}>
                <p className={Style.labelSubHeader}>UPI Id</p>
                {bankData && bankData.upiId && <p>{bankData.upiId}</p>}
              </div>
              <div className={`mb-3 col-span-3 `}>
                <p className={Style.labelSubHeader}>PAN</p>
                {bankData && bankData.pan && <p>{bankData.pan}</p>}
              </div>
              <div className={`mb-3 col-span-3 `}>
                <p className={Style.labelSubHeader}>GST NO</p>
                {bankData && bankData.gstNo && <p>{bankData.gstNo}</p>}
              </div>
            </div>
          )}

          {isLoading && <h4 className="text-xl text-center">Loading</h4>}

          {!bankData && !isLoading && (
            <div className="flex mx-auto my-3 align-center justify-center items-center flex-col">
              <h4 className="text-xl text-center">No Record Found</h4>
              <button
                onClick={() => setIsModalVisible(true)}
                className="bg-black py-3 px-3 mt-4 text-white rounded"
              >
                Add Bank Details
              </button>
            </div>
          )}
        </div> */}

      </div>
    </div>
  );
};

export default page;
