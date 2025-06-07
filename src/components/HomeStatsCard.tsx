'use client'

import React, { useContext, useEffect, useState, useCallback } from "react";
import Style from "../app/styles/HomeStatsCard.module.css";
import UserContext from "@/context/userContext";
import { apiGet } from "@/helpers/axiosRequest";
import toast from "react-hot-toast";

// Define the expected structure of the API response
interface NumberCountsResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    totalAlbums: number;
    totalArtist: number;
    totalLabels: number;
    upcomingReleases: number;
  };
}

const HomeStatsCard = () => {
  const context = useContext(UserContext);
  const labelId = context?.user?._id;
  const [stats, setStats] = useState<{ albums: number, artists: number, labels: number, upcomingReleases: number }>({
    albums: 0,
    artists: 0,
    labels: 0,
    upcomingReleases: 0
  });

  const userName = context?.user?.username || 'Guest';

  const fetchNumberCounts = useCallback(async () => {
    try {
      console.log('Fetching stats...');
      const response = await apiGet('/api/numbers') as NumberCountsResponse;
      console.log('API Response:', response);

      if (response?.success && response?.data) {
        setStats({
          albums: response.data.totalAlbums || 0,
          artists: response.data.totalArtist || 0,
          labels: response.data.totalLabels || 0,
          upcomingReleases: response.data.upcomingReleases || 0
        });
        console.log('Updated Stats:', {
          albums: response.data.totalAlbums,
          artists: response.data.totalArtist,
          labels: response.data.totalLabels,
          upcomingReleases: response.data.upcomingReleases
        });
      } else {
        console.error('Invalid API response:', response);
        toast.error('Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching numbers:', error);
      toast.error('Error loading statistics');
    }
  }, []);

  useEffect(() => {
    fetchNumberCounts();
  }, [fetchNumberCounts]);

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
            <p className={Style.statNumber}>{stats.artists}</p>
            <p className={Style.statLabel}>Artists</p>
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
