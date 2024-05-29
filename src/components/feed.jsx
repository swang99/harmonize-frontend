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
  const [tokenUpdated, setTokenUpdated] = useState(false);
  const [feed, setFeed] = useState(useStore.getState().profileSlice.feed);
  const [recs, setRecs] = useState([]);

  // getting posts from the store
  const { loadFeed, currentProfile, initialFetch, updateProfile, getFriendActivity } = useStore((store) => store.profileSlice);
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
        const newFriendPosts = await loadFeed(currentProfile.userID);
        const newFriendActivity = await getFriendActivity(currentProfile.userID);
        // Shuffle New Friend Activity
        for (let i = newFriendActivity.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [newFriendActivity[i], newFriendActivity[j]] = [newFriendActivity[j], newFriendActivity[i]];
        }
        const combinedFeed = new Array(newFriendPosts.length + newFriendActivity.length).fill(null);

        // Insert friend posts in order
        let postIndex = 0;
        let activityIndex = 0;

        for (let i = 0; i < combinedFeed.length; i += 1) {
          if (Math.random() < 0.5 && postIndex < newFriendPosts.length) {
            combinedFeed[i] = newFriendPosts[postIndex];
            postIndex += 1;
          } else if (activityIndex < newFriendActivity.length) {
            combinedFeed[i] = newFriendActivity[activityIndex];
            activityIndex += 1;
          } else if (postIndex < newFriendPosts.length) {
            combinedFeed[i] = newFriendPosts[postIndex];
            postIndex += 1;
          }
        }
        setFeed(combinedFeed);
        useStore.setState({ profileSlice: { ...useStore.getState().profileSlice, feed: combinedFeed } });
        const currDate = new Date().getTime();
        const lastUpdated = new Date(currentProfile.recommendationsLastUpdated).getTime();
        if (currDate - lastUpdated > 24 * 60 * 60 * 1000 && currentProfile.recommendationsLastUpdated) {
          const fetchRecs = await getRecs();
          setRecs(fetchRecs);
          const newProfile = { ...currentProfile, recommendationsLastUpdated: currDate, recommendations: fetchRecs };
          updateProfile(currentProfile.userID, newProfile);
        } else {
          setRecs(currentProfile.recommendations);
        }
      }
    };
    loadFeedData();
  }, [tokenUpdated, initialFetch]);

  const renderPostCard = (post) => {
    if (post._doc) {
      return (
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
      );
    }
    return (
      <Box key={post.id + post.userID}>
        <Box w="100%" justify="center">
          <PostCard
            use="activity"
            name={post.username}
            photo={post.photo}
            authorID={post.userID}
            songName={post.name}
            songID={post.id}
            album={post.album}
          />
        </Box>
        <Spacer h={10} />
      </Box>
    );
  };

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
          renderPostCard(post)
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
