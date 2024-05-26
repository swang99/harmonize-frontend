import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Heading, Spacer, VStack, Text } from '@chakra-ui/react';
import useStore from '../store';
import { updateToken } from '../utils/SpotifyAuth';
import PostCard from './post-card';

function Feed(props) {
  const [tokenUpdated, setTokenUpdated] = useState(false); // track if token is updated
  const [feed, setFeed] = useState([]); // store the user's feed
  const { height } = props;

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
      }
    };
    loadFeedData();
  }, [tokenUpdated, initialFetch]);

  const renderPosts = () => {
    if (!feed || feed.length === 0) {
      return (
        <Box w="100vw" h="100vh" bg="teal.600" p={10} align="center">
          <VStack bg="white" maxW="1000px" borderRadius="lg" spacing={4} align="center" justify="center" p={10}>
            <Text as="h1" fontSize="4xl" color="gray.700" fontWeight="bold">No posts to show</Text>
            <Text as="h2" fontSize="2xl" color="gray.500" fontWeight="bold">For now, here are some recommendations:</Text>
          </VStack>
        </Box>
      );
    }
    return (
      <VStack spacing={4} align="stretch" maxH={height} overflowY="auto" my="auto">
        <Spacer h={10} />
        <Heading pl="10%" textAlign="left">Your Feed</Heading>
        {feed.map((post) => (
          <Box key={post._doc._id} w="80%" minW={550} bg="gray.100" p={4} mx="auto" borderRadius="md" shadow="md">
            <PostCard post={post._doc} use="feed" name={post.name} photo={post.photo} authorID={post.authorID} />
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
