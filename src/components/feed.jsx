import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Heading, Spacer, VStack } from '@chakra-ui/react';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import useStore from '../store';
import { getCurrentUserPlaylists, getRecentlyPlayedTracks, getUserProfile, getUserTopArtists, getUserTopTracks } from '../utils/spotify-api';
import { updateToken } from '../utils/SpotifyAuth';
import PostCard from './post-card';

function Feed(props) {
  const [dataLoaded, setDataLoaded] = useState(false); // track if user data is loaded
  const [tokenUpdated, setTokenUpdated] = useState(false); // track if token is updated
  const [feed, setFeed] = useState([]); // store the user's feed
  const { height } = props;

  // getting posts from the store
  const loadFeed = useStore((store) => store.profileSlice.loadFeed);
  const handleLogin = useStore((store) => store.profileSlice.handleLogin);

  // store the user's profile, top tracks, top artists, playlists, and recently played tracks
  const [userData, setUserData] = useState({
    profile: null,
    topTracks: null,
    topArtists: null,
    userPlaylists: null,
    recentlyPlayedTracks: null,
  });

  // const height = window.innerHeight - 165;

  useEffect(() => {
    const update = async () => {
      try {
        await updateToken();
        setTokenUpdated(true);
      } catch (error) {
        console.error('Failed to update token or fetch top tracks:', error);
      }
    };
    update();
  }, []);

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
    const loadFeedData = async () => {
      if (dataLoaded) {
        const { profile, topTracks, topArtists, userPlaylists } = userData;
        await handleLogin(profile, topTracks, topArtists, userPlaylists);
        setFeed(await loadFeed(profile.id));
      }
    };
    loadFeedData();
  }, [dataLoaded, userData]);

  const renderPosts = () => {
    if (!feed || feed.length === 0) {
      return <p>No posts to show</p>;
    }
    return (
      <VStack spacing={4} align="stretch" maxH={height} overflowY="auto" my="auto">
        <Spacer h={10} />
        <Heading pl="10%" textAlign="left">Your Feed</Heading>
        {feed.map((post) => (
          <Box key={post.id} w="80%" bg="gray.100" p={4} mx="auto" borderRadius="md" shadow="md">
            <PostCard post={post} />
          </Box>
        ))}
      </VStack>
    );
  };
  return (
    <motion.div
      initial={{ x: -1000, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 1000, opacity: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 50, damping: 12 }}
    >
      <Box position="absolute" mx="auto" w="100vw" overflowY="auto">
        {renderPosts()}
      </Box>
    </motion.div>
  );
}

export default Feed;
