'use client'

import React, { useContext, useEffect, useState, useCallback } from "react";
import Style from "../app/styles/HomeStatsCard.module.css";
import UserContext from "@/context/userContext";
import { apiGet } from "@/helpers/axiosRequest";

// Define the expected structure of the API response
interface NumberCountsResponse {
  totalAlbums: number;
  totalTracks: number;
  totalArtist: number;
}

const HomeStatsCard = () => {
  const context = useContext(UserContext);
  const labelId = context?.user?._id;
  const [stats, setStats] = useState<{ albums: number, tracks: number, labels: number }>({
    albums: 0,
    tracks: 0,
    labels: 0,
  });

  const userName = context?.user?.username || 'Guest';

  const fetchNumberCounts = useCallback(async () => {
    try {
      const response = await apiGet(`/api/numbers?labelId=${labelId}`) as NumberCountsResponse | null;

      if (response) {
        setStats({
          albums: response.totalAlbums,
          tracks: response.totalTracks,
          labels: response.totalArtist,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, [labelId]);

  useEffect(() => {
    if (labelId) {
      fetchNumberCounts();
    }
  }, [labelId, fetchNumberCounts]);

  return (
    <div className={Style.statsContainer}>
      <div className={Style.greetContainer}>
        <h1 className={Style.heading}>Welcome, {userName}</h1>
        {/* <p className={Style.para}>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p> */}
      </div>

      <div className={Style.statusCardContainer}>
        <div className={Style.statusCard}>
          <div className={Style.statCardDetails}>
            <p className={Style.statNumber}>{stats.albums}</p>
            <p className={Style.statLabel}>Albums</p>
          </div>
          <i className={`bi bi-vinyl ${Style.statIcon}`}></i>
        </div>

        <div className={Style.statusCard}>
          <div className={Style.statCardDetails}>
            <p className={Style.statNumber}>{stats.tracks}</p>
            <p className={Style.statLabel}>Tracks</p>
          </div>
          <i className={`bi bi-music-note ${Style.statIcon}`}></i>
        </div>

        <div className={Style.statusCard}>
          <div className={Style.statCardDetails}>
            <p className={Style.statNumber}>{stats.labels}</p>
            <p className={Style.statLabel}>Labels</p>
          </div>
          <i className={`bi bi-person-circle ${Style.statIcon}`}></i>
        </div>
      </div>
    </div>
  )
}

export default HomeStatsCard;
