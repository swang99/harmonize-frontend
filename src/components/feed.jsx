import React, { useEffect, useState } from 'react';
// import React, { useEffect, useState } from 'react';
// import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
// import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useStore from '../store';
import { updateToken } from '../utils/SpotifyAuth';
import { getCurrentUserPlaylists, getUserProfile, getUserTopArtists, getUserTopTracks } from '../utils/spotify-api';

function Feed() {
  // keep track of whether the token has been updated
  const [tokenUpdated, setTokenUpdated] = useState(false);
  // const [profileLoaded, setProfileLoaded] = useState(false);

  // getting posts from the store
  const allPosts = useStore((store) => store.postSlice.all);
  const fetchAllPosts = useStore((store) => store.postSlice.fetchAllPosts);
  const handleLogin = useStore((store) => store.profileSlice.handleLogin);

  // store the user's profile, top tracks, and top artists
  const [userProfile, setUserProfile] = useState(null);
  const [topTracks, setTopTracks] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState(null);

  useEffect(() => {
    fetchAllPosts();
    const fetchData = async () => {
      try {
        await updateToken().then(() => setTokenUpdated(true));
      } catch (error) {
        console.error('Failed to update token or fetch top tracks:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchUserData() {
      if (tokenUpdated) {
        try {
          const [profile, tracks, artists, playlists] = await Promise.all([
            getUserProfile(),
            getUserTopTracks(),
            getUserTopArtists(),
            getCurrentUserPlaylists(),
          ]);

          setUserProfile(profile);
          setTopTracks(tracks);
          setTopArtists(artists);
          setUserPlaylists(playlists);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
    }
    fetchUserData();
  }, [tokenUpdated]);

  useEffect(() => {
    if (userProfile && topTracks && topArtists) {
      console.log(userProfile.id, userProfile, topTracks, topArtists, userPlaylists);
      handleLogin(userProfile.id, userProfile, topTracks, topArtists, userPlaylists);
    }
  }, [userProfile, topTracks, topArtists]);

  const renderPosts = () => {
    return allPosts.map((post) => (
      <div key={post.id}>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </div>
    ));
  };
  return (
    <motion.div
      initial={{ x: -1000, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 1000, opacity: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 50, damping: 12 }}
    >
      Feed
      {renderPosts()}
    </motion.div>
  );
}

export default Feed;
