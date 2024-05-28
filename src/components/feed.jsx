import { Box, Grid, Heading, Spacer, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import useStore from '../store';
import { updateToken } from '../utils/SpotifyAuth';
import AddTrackToPlaylistModal from './add-track-to-playlist';
import NewPostModal from './NewPostModal';
import PostCard from './post-card';
import TrackItem from './track-item';
import { getRecs } from '../utils/spotify-api';

function Feed(props) {
  const [tokenUpdated, setTokenUpdated] = useState(false); // track if token is updated
  const [feed, setFeed] = useState(useStore.getState().profileSlice.feed);
  const [recs, setRecs] = useState([]);

  // getting posts from the store
  const { loadFeed, currentProfile, initialFetch, updateProfile } = useStore((store) => store.profileSlice);
  useEffect(() => {
    const update = async () => {
      try {
        await updateToken();
        setTokenUpdated(true);
      } catch (error) {
        console.error('Failed to update token or fetch top tracks:', error);
      }
    };
    if (initialFetch) {
      update();
    }
  }, [initialFetch]);
  useEffect(() => {
    const loadFeedData = async () => {
      if (tokenUpdated && initialFetch && currentProfile.userID) {
        const newFeed = await loadFeed(currentProfile.userID);
        setFeed(newFeed);
        setFeed([]);
        useStore.setState({ profileSlice: { ...useStore.getState().profileSlice, feed: newFeed } });
        if (!feed || feed.length === 0) {
          const currDate = new Date().getTime();
          const lastUpdated = new Date(currentProfile.recommendationsLastUpdated).getTime();
          if (currDate - lastUpdated > 24 * 60 * 60 * 1000) {
            const fetchRecs = await getRecs();
            setRecs(fetchRecs);
            const newProfile = { ...currentProfile, recommendationsLastUpdated: currDate, recommendations: fetchRecs };
            updateProfile(currentProfile.userID, newProfile);
          } else {
            setRecs(currentProfile.recommendations);
          }
        }
      }
    };
    loadFeedData();
  }, [tokenUpdated, initialFetch]);

  const renderPosts = () => {
    if (!feed || feed.length === 0) {
      return (
        <Box w="100%" h="100%" bg="white" p={10} align="center">
          <VStack bg="white" maxW="1000px" borderRadius="lg" spacing={4} align="center" justify="center" p={10}>
            <Text as="h1" fontSize="4xl" color="gray.700" fontWeight="bold">No posts to show</Text>
            <Text as="h2" fontSize="2xl" color="gray.500" fontWeight="bold">For now, here are some recommendations:</Text>
            <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6} width="100%">
              {recs.map((track) => (
                <TrackItem
                  key={track.id}
                  id={track.id}
                  name={track.name}
                  artist={track.artists[0].name}
                  imageURL={track.album.images[0].url}
                />
              ))}
            </Grid>
          </VStack>
        </Box>
      );
    }
    return (
      <Box>
        {feed.map((post) => (
          <Box key={post._doc._id}>
            <Box w="100%" justify="center">
              <PostCard
                post={post._doc}
                use="feed"
                name={post.name}
                photo={post.photo}
                authorID={post.authorID}
              />
            </Box>
            <Spacer h={10} />
          </Box>
        ))}
      </Box>
    );
  };
  return (
    <motion.div
      initial={{ x: -1000, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 1000, opacity: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 50, damping: 12 }}
    >
      <Box position="absolute" w="100vw" mt={75}>
        <VStack spacing={4} align="stretch" maxH="90vh" overflowY="auto" pb="90px" px="10%">
          <Heading py={5} textAlign="left">Your Feed</Heading>
          <Text fontSize="lg" fontWeight="bold">See what your friends are listening to! </Text>
          {renderPosts()}
        </VStack>
        <AddTrackToPlaylistModal />
        <NewPostModal />
      </Box>
    </motion.div>
  );
}

export default Feed;
