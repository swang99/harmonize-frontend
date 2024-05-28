import { Box, Heading, Spacer, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import useStore from '../store';
import { updateToken } from '../utils/SpotifyAuth';
import AddTrackToPlaylistModal from './add-track-to-playlist';
import NewPostModal from './NewPostModal';
import PostCard from './post-card';
import TrackItem from './track-item';

function Feed(props) {
  const [tokenUpdated, setTokenUpdated] = useState(false); // track if token is updated
  const [feed, setFeed] = useState([]); // store the user's feed
  const [recs, setRecs] = useState([]);

  // getting posts from the store
  const { loadFeed, currentProfile, initialFetch } = useStore((store) => store.profileSlice);
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
        console.log('Following', currentProfile.following);
        setFeed(await loadFeed(currentProfile.userID));
        if (!feed || feed.length === 0) {
          // const fetchRecs = await getRecs();
          const fetchRecs = [];
          console.log('Recs: ', fetchRecs);
          setRecs(fetchRecs);
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
            {recs.map((track) => (
              <TrackItem
                key={track.id}
                id={track.id}
                name={track.name}
                artist={track.artists[0].name}
                imageURL={track.album.images[0].url}
              />
            ))}
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
      <VStack spacing={4} align="stretch" maxH="90vh" overflowY="auto" pb="90px" px="10%">
        <Heading py={5} textAlign="left">Your Feed</Heading>
        {renderPosts()}
      </VStack>
      <AddTrackToPlaylistModal />
      <NewPostModal />
    </motion.div>
  );
}

export default Feed;
