"use client";

import Style from "../styles/Home.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import HomeStatsCard from "@/components/HomeStatsCard";
import DashboradSection from "@/components/DashboradSection";
import React from "react";

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
