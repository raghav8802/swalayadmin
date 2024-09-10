'use client'

import { useContext, useEffect, useState } from "react";
import Style from "../app/styles/HomeStatsCard.module.css";

import UserContext from "@/context/userContext";
import { apiGet } from "@/helpers/axiosRequest";


const HomeStatsCard = () => {
  const context = useContext(UserContext);
  const labelId = context?.user?._id;
  const [stats, setStats] = useState<{ albums: number, tracks: number, labels: number }>({
    albums: 0,
    tracks: 0,
    labels: 0,
  });

  const userName = context?.user?.username || 'Guest';

  const fetchNumberCounts = async () => {
    try {
      const response = await apiGet(`/api/numbers?labelId=${labelId}`);

      if (response?.data) {
        setStats({
          albums: response.data.totalAlbums,
          tracks: response.data.totalTracks,
          labels: response.data.totalArtist,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (labelId) {
      fetchNumberCounts();
    }
  }, [labelId]);

  return (
    
    <div className={Style.statsContainer}>
      <div className={Style.greetContainer}>
        <h1 className={Style.heading}>Welcome, {userName}</h1>
        {/* <p className={Style.para}>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p> */}
      </div>

      {/* <div className={Style.statusCardContainer}>
        <div className={Style.statusCard}>
          <div className={Style.statCardDetails}>
            <p className={Style.statNumber}>{ stats && stats.albums}</p>
            <p className={Style.statLabel}>Albums</p>
          </div>
          <i className={`bi bi-vinyl ${Style.statIcon}`}></i>
        </div>

        <div className={Style.statusCard}>
          <div className={Style.statCardDetails}>
            <p className={Style.statNumber}>{stats && stats.tracks}</p>
            <p className={Style.statLabel}>Tracks</p>
          </div>
          <i className={`bi bi-music-note ${Style.statIcon}`}></i>
        </div>

        <div className={Style.statusCard}>
          <div className={Style.statCardDetails}>
            <p className={Style.statNumber}>{stats && stats.labels}</p>
            <p className={Style.statLabel}>Labels</p>
          </div>
          <i className={`bi bi-person-circle ${Style.statIcon}`}></i>
        </div>

      </div> */}

    </div>
  )
}

export default HomeStatsCard;
