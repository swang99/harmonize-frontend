import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Box, Button, Text, Avatar, Flex, Heading, VStack, Spacer, HStack, Grid } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import useStore from '../store';
import Post from './post';
import { updateToken } from '../utils/SpotifyAuth';

function Profile(props) {
  const { id } = useParams();
  const currentProfile = useStore((store) => store.profileSlice.currentProfile);
  const fetchProfile = useStore((store) => store.profileSlice.fetchProfile);
  const fetchOtherProfile = useStore((store) => store.profileSlice.fetchOtherProfile);
  const updateProfile = useStore((store) => store.profileSlice.updateProfile);
  const [profileFetched, setProfileFetched] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [profile, setProfile] = useState(null);
  const testPostProps = {
    id: '5hXEcqQhEjfZdbIZLO8mf2',
    type: 'track',
    comment: 'This is a test comment',
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (id === currentProfile.userID) { // If the profile is the current user's profile, fetch the profile from the store
          setIsOwnProfile(true);
          await fetchProfile(id);
          setProfile(currentProfile);
        } else { // Otherwise, fetch the profile from the server
          setIsOwnProfile(false);
          const otherProfile = await fetchOtherProfile(id);
          setProfile(otherProfile);
          if (currentProfile.following.includes(id)) {
            setIsFollowing(true);
          }
        }
        await updateToken();
        setProfileFetched(true);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfileData();
  }, [id, fetchProfile]);

  const handleFollow = async () => {
    // Update current profile following list
    const updatedProfile = {
      ...currentProfile,
      following: [...currentProfile.following, id],
    };
    await updateProfile(currentProfile.userID, updatedProfile);
    setIsFollowing(true);
  };
  const handleUnfollow = async () => {
    // Update current profile following list
    const updatedProfile = {
      ...currentProfile,
      following: currentProfile.following.filter((followeeID) => followeeID !== id),
    };
    await updateProfile(currentProfile.userID, updatedProfile);
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
    if (!profileFetched || !currentProfile) {
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
                <Heading as="h3" size="md">{profile.followers.length}</Heading>
                <Text size="md">Following</Text>
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
                    <Heading as="h3" size="md">{profile.followers.length}</Heading>
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
