import { AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Feed from './feed';
import Login from './login';
import Profile from './Profile';
import SearchBar from './search-bar';
import NewPostPage from './NewPostPage';
import useStore from '../store';
import { getCurrentUserPlaylists, getRecentlyPlayedTracks, getUserProfile, getUserTopArtists, getUserTopTracks } from '../utils/spotify-api';
import { updateToken } from '../utils/SpotifyAuth';

const AnimatedRoutes = () => {
  const { initialFetch, currentProfile, fetchProfile } = useStore((store) => store.profileSlice);
  const routeHeight = window.innerHeight - 165; // NavBar: 75px, Footer: 90px
  const location = useLocation();
  const handleLogin = useStore((store) => store.profileSlice.handleLogin);
  const [dataLoaded, setDataLoaded] = useState(false); // track if user data is loaded
  const [tokenUpdated, setTokenUpdated] = useState(false); // track if token is updated
  const [notOnLogin, setNotOnLogin] = useState(false);

  // store the user's profile, top tracks, top artists, playlists, and recently played tracks
  const [userData, setUserData] = useState({
    profile: null,
    topTracks: null,
    topArtists: null,
    userPlaylists: null,
    recentlyPlayedTracks: null,
  });

  useEffect(() => {
    if (location.pathname !== '/') {
      setNotOnLogin(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    const update = async () => {
      try {
        await updateToken();
        setTokenUpdated(true);
      } catch (error) {
        console.error('Failed to update token or fetch top tracks:', error);
      }
    };
    if (notOnLogin) update();
  }, [notOnLogin]);

  useEffect(() => {
    async function fetchUserData() {
      if (tokenUpdated) {
        try {
          const [profile, tracks, artists, playlists, recents] = await Promise.all([
            getUserProfile(),
            getUserTopTracks(),
            getUserTopArtists(),
            getCurrentUserPlaylists(),
            getRecentlyPlayedTracks(),
          ]);

          setUserData({
            profile,
            topTracks: tracks,
            topArtists: artists,
            userPlaylists: playlists,
            recentlyPlayedTracks: recents,
          });
          setDataLoaded(true);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
    }
    fetchUserData();
  }, [tokenUpdated]);

  useEffect(() => {
    const login = async () => {
      if (dataLoaded) {
        const { profile, topTracks, topArtists, userPlaylists } = userData;
        console.log('Logging in:', profile);
        await handleLogin(profile, topTracks, topArtists, userPlaylists);
      }
    };
    login();
  }, [dataLoaded, userData]);

  useEffect(() => {
    async function fetchProfileData() {
      if (!initialFetch) {
        useStore.setState((state) => ({
          profileSlice: {
            ...state.profileSlice,
            initialFetch: true,
          },
        }), false, 'users/initialFetch');
      }
      // Refresh profile every 5 minutes
      const interval = setInterval(() => {
        if (currentProfile && currentProfile.userID) {
          fetchProfile(currentProfile.userID);
        }
      }, 300000); // 5 minutes in milliseconds
      return () => clearInterval(interval);
    }
    if (currentProfile && currentProfile.userID) {
      fetchProfileData();
    }
  }, [currentProfile, fetchProfile, initialFetch]);

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Feed height={routeHeight} />} />
        <Route path="/search" element={<SearchBar />} />
        <Route path="/users/:id" element={<Profile />} />
        <Route path="/new-post" element={<NewPostPage />} />
        <Route path="*" element={<div>Post not found</div>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
