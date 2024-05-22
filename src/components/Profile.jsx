import { Avatar, Box, Button, Flex, Grid, HStack, Heading, Spacer, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useStore from '../store';
import { updateToken } from '../utils/SpotifyAuth';
import { getUserProfile } from '../utils/spotify-api';
import Post from './post';

function Profile(props) {
  const { id } = useParams();
  const fetchProfile = useStore((store) => store.profileSlice.fetchProfile);
  const fetchOtherProfile = useStore((store) => store.profileSlice.fetchOtherProfile);
  const updateProfile = useStore((store) => store.profileSlice.updateProfile);
  const [profileFetched, setProfileFetched] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [tokenUpdated, setTokenUpdated] = useState(false); // track if token is loaded
  const [profile, setProfile] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const testPostProps = {
    id: '5hXEcqQhEjfZdbIZLO8mf2',
    type: 'Track',
    comment: 'This is a test comment',
  };

  useEffect(() => {
    const update = async () => {
      try {
        await updateToken();
        setTokenUpdated(true);
      } catch (error) {
        console.error('Failed to update token:', error);
      }
    };
    update();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      const userSpotifyProfile = await getUserProfile();
      setUserProfile(await fetchProfile(userSpotifyProfile.id));
      try {
        if (id === userSpotifyProfile.id) { // If the profile is the current user's profile, fetch the profile from the store
          const loadedProfile = await fetchProfile(id);
          setIsOwnProfile(true);
          setProfile(loadedProfile);
        } else { // Otherwise, fetch the profile from the server
          setIsOwnProfile(false);
          const otherProfile = await fetchOtherProfile(id);
          setProfile(otherProfile);
        }
        await updateToken();
        setProfileFetched(true);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    if (tokenUpdated) {
      fetchProfileData();
    }
  }, [id, tokenUpdated]);

  useEffect(() => {
    if (userProfile) {
      if (userProfile.following.includes(id)) {
        setIsFollowing(true);
      }
    }
  }, [userProfile]);

  const handleFollow = async () => {
    // Update current profile following list
    const updatedUserProfile = {
      ...userProfile,
      following: [...userProfile.following, id],
    };
    await updateProfile(userProfile.userID, updatedUserProfile);
    const updatedProfile = {
      ...profile,
      followers: [...profile.followers, userProfile.userID],
    };
    await updateProfile(id, updatedProfile);
    setIsFollowing(true);
  };
  const handleUnfollow = async () => {
    // Update current profile following list
    const updatedUserProfile = {
      ...userProfile,
      following: userProfile.following.filter((followeeID) => followeeID !== id),
    };
    await updateProfile(userProfile.userID, updatedUserProfile);
    const updatedProfile = {
      ...profile,
      followers: profile.followers.filter((followerID) => followerID !== userProfile.userID),
    };
    await updateProfile(id, updatedProfile);
    setIsFollowing(false);
  };

  const renderFollowButton = () => {
    if (isFollowing) {
      return (
        <Button size="lg" onClick={handleUnfollow}>
          Unfollow
        </Button>
      );
    } else {
      return (
        <Button size="lg" onClick={handleFollow}>
          Follow
        </Button>
      );
    }
  };

  const renderProfile = () => {
    if (!profileFetched || !userProfile) {
      return <Text>Loading...</Text>;
    } else if (!profile) {
      return <Text>Profile not found</Text>;
    } else if (isOwnProfile) {
      return (
        <Flex py={5} px={10} bg="teal.600" color="white" minH="100vh" overflow="hidden" position="absolute" width="100vw" justify="center">
          <VStack p="5%" w="100%" maxW="1000px">
            <HStack p={10} bg="white" borderRadius="xl" justify="space-between" align="center" width="100%" spacing={10} color="gray.900">
              <Avatar w="150px" h="auto" name={profile.name} src={profile.photo} />
              <VStack justify="flex-start" align="flex-start" mb={8}>
                <Heading as="h1" size="xl" color="gray.900">
                  {profile.name}
                </Heading>
                <Text size="md" fontWeight="bold">Total Posts: {profile.posts.length}</Text>
              </VStack>
              <Spacer />
              <VStack justify="flex-start" align="center" mb={8}>
                <Heading as="h3" size="md">{profile.followers.length}</Heading>
                <Text size="md">Followers</Text>
              </VStack>
              <VStack justify="flex-start" align="center" mb={8}>
                <Heading as="h3" size="md">{profile.following.length}</Heading>
                <Text size="md">Following</Text>
              </VStack>
            </HStack>
            <Tabs variant="unstyled" align="center" defaultIndex={0} mt={4}>
              <TabList>
                <Tab
                  fontWeight="bold"
                  _selected={{ color: 'teal.500', bg: 'white', borderRadius: 'full' }}
                  _focus={{ boxShadow: 'none' }}
                >
                  Posts
                </Tab>
                <Tab
                  fontWeight="bold"
                  _selected={{ color: 'teal.500', bg: 'white', borderRadius: 'full' }}
                  _focus={{ boxShadow: 'none' }}
                >
                  Recents
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  <Box py={5}>
                    <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                      {profile.posts && profile.posts.length > 0 ? (
                        profile.posts.map((post) => (null))) : (
                          <Post id={testPostProps.id} comment={testPostProps.comment} type={testPostProps.type} profile={profile} isOwnProfile={isOwnProfile} />
                      )}
                    </Grid>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </Flex>
      );
    } else {
      return (
        <Flex py={5} px={10} bg="teal.600" color="white" minH="100vh" overflow="hidden" position="absolute" width="100vw" justify="center">
          <VStack p="5%" w="100%" maxW="1000px">
            <HStack p={10} bg="white" borderRadius="xl" justify="space-between" align="center" width="100%" spacing={10} color="gray.900">
              <Avatar w="150px" h="auto" name={profile.name} src={profile.photo} />
              <VStack justify="flex-start" align="flex-start" mb={8}>
                <Heading as="h1" size="xl" color="gray.900">
                  {profile.name}
                </Heading>
                <Text size="md" fontWeight="bold">Total Posts: {profile.posts.length}</Text>
              </VStack>
              <Spacer />
              <VStack justify="flex-start" align="center" mb={8}>
                <HStack gap={10}>
                  <VStack justify="flex-start" align="center" mb={8}>
                    <Heading as="h3" size="md">{profile.followers.length}</Heading>
                    <Text size="md">Followers</Text>
                  </VStack>
                  <VStack justify="flex-start" align="center" mb={8}>
                    <Heading as="h3" size="md">{profile.following.length}</Heading>
                    <Text size="md">Following</Text>
                  </VStack>
                </HStack>
                {renderFollowButton()}
              </VStack>
            </HStack>
            <Box>
              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                {profile.posts && profile.posts.length > 0 ? (
                  profile.posts.map((post) => (
                    <Flex key={post.id} bg="blue.800" p={4} borderRadius="md" justify="space-between" align="center">
                      <Box>
                        <Heading as="h4" size="sm">
                          {post.title}
                        </Heading>
                        <Text>
                          {post.artistName}, {post.artistAlbum}, {post.releaseYear}
                        </Text>
                      </Box>
                      <Box textAlign="right">
                        <Text>{post.timeAgo}</Text>
                        <Text as="u">view in feed</Text>
                      </Box>
                    </Flex>
                  ))
                ) : (
                  <Post id={testPostProps.id} comment={testPostProps.comment} type={testPostProps.type} />
                )}
              </Grid>
            </Box>
          </VStack>
        </Flex>
      );
    }
  };

  return (
    <motion.div
      initial={{ x: -1000, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 1000, opacity: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 50, damping: 12 }}
    >
      {renderProfile()}
    </motion.div>
  );
}

export default Profile;
