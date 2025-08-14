'use client'

import React, { useContext, useEffect, useState, useCallback } from 'react';
import { apiGet, safeApiGet } from '@/helpers/axiosRequest';
import UserContext from '@/context/userContext';
import toast from 'react-hot-toast';
import Style from '../app/styles/HomeStatsCard.module.css';

interface NumberCountsResponse {
  success: boolean;
  data: {
    totalAlbums: number;
    totalArtist: number;
    totalLabels: number;
    upcomingReleases: number;
  };
}

const HomeStatsCard = () => {
  const context = useContext(UserContext);

  
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
      const response = await safeApiGet('/api/numbers', { 
        success: false, 
        data: { 
          totalAlbums: 0, 
          totalArtist: 0, 
          totalLabels: 0, 
          upcomingReleases: 0 
        } 
      }) as NumberCountsResponse;
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
      <div className={Style.welcomeSection}>
        <h2 className={Style.welcomeText}>Welcome back, {userName}! 👋</h2>
        <p className={Style.welcomeSubtext}>Here's what's happening with your music platform today.</p>
      </div>

      <div className={Style.statsGrid}>
        <div className={Style.statCard}>
          <div className={Style.statIcon}>🎵</div>
          <div className={Style.statContent}>
            <h3 className={Style.statNumber}>{stats.albums}</h3>
            <p className={Style.statLabel}>Total Albums</p>
          </div>
        </div>

        <div className={Style.statCard}>
          <div className={Style.statIcon}>🎤</div>
          <div className={Style.statContent}>
            <h3 className={Style.statNumber}>{stats.artists}</h3>
            <p className={Style.statLabel}>Total Artists</p>
          </div>
        </div>

        <div className={Style.statCard}>
          <div className={Style.statIcon}>🏷️</div>
          <div className={Style.statContent}>
            <h3 className={Style.statNumber}>{stats.labels}</h3>
            <p className={Style.statLabel}>Total Labels</p>
          </div>
        </div>

        <div className={Style.statCard}>
          <div className={Style.statIcon}>🚀</div>
          <div className={Style.statContent}>
            <h3 className={Style.statNumber}>{stats.upcomingReleases}</h3>
            <p className={Style.statLabel}>Upcoming Releases</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeStatsCard;
