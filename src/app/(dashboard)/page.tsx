"use client";

import Image from "next/image";
import Style from "../styles/Home.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import HomeStatsCard from "@/components/HomeStatsCard";
import Link from "next/link";
import toast from "react-hot-toast";
import { NotificationSection } from "@/components/NotificationSection";
import DashboradSection from "@/components/DashboradSection";

const Home = () => {


  return (
    <div className="min-h-screen bg-white rounded ">

      <HomeStatsCard />

      <div className={`mt-4  ${Style.toolContainer}`}>
        
      <DashboradSection/>

      </div>
    </div>
  );
};

export default Home;
