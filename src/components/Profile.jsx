import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  Box, Button, Text, Avatar, Flex, Heading, VStack, Spacer, HStack, Grid, Icon, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, useDisclosure, List, ListItem, Tab, Tabs, TabList, TabPanels, TabPanel,
} from '@chakra-ui/react';
import { IoPersonAdd } from 'react-icons/io5';
import useStore from '../store';
import { updateToken } from '../utils/SpotifyAuth';
import { getUserProfile } from '../utils/spotify-api';
import Post from './post';

function Profile(props) {
  const { id } = useParams();
  const fetchAllProfiles = useStore((store) => store.profileSlice.fetchAllProfiles);
  const fetchProfile = useStore((store) => store.profileSlice.fetchProfile);
  const fetchOtherProfile = useStore((store) => store.profileSlice.fetchOtherProfile);
  const updateProfile = useStore((store) => store.profileSlice.updateProfile);
  const [profileFetched, setProfileFetched] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [tokenUpdated, setTokenUpdated] = useState(false); // track if token is loaded
  const [profile, setProfile] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [allProfiles, setAllProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const testPostProps = {
    id: '5hXEcqQhEjfZdbIZLO8mf2',
    type: 'Track',
    comment: 'This is a test comment',
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [friendName, setFriendName] = useState('');

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
    const fetchAllProfilesData = async () => {
      try {
        const profiles = await fetchAllProfiles();
        setAllProfiles(profiles);
      } catch (error) {
        console.error('Failed to fetch all profiles:', error);
      }
    };

    fetchAllProfilesData();
  }, [fetchAllProfiles]);

  useEffect(() => {
    if (userProfile) {
      if (userProfile.following.includes(id)) {
        setIsFollowing(true);
      }
    }
  }, [userProfile]);

  useEffect(() => {
    if (friendName) {
      const uniqueProfiles = new Set();
      const filtered = allProfiles.filter((p) => {
        if (p.name.toLowerCase().includes(friendName.toLowerCase()) && !uniqueProfiles.has(p.userID)) {
          uniqueProfiles.add(p.userID);
          return true;
        }
        return false;
      });
      setFilteredProfiles(filtered);
    } else {
      setFilteredProfiles([]);
    }
  }, [friendName, allProfiles]);

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

  const handleAddFriend = (friendId) => {
    // Implement the logic to add a friend here
    console.log(`Adding friend: ${friendId}`);
    updateProfile(userProfile.userID, { ...userProfile, following: [...userProfile.following, friendId] });
    const friendProfile = allProfiles.find((p) => p.userID === friendId);
    updateProfile(friendId, { ...friendProfile, followers: [...friendProfile.followers, userProfile.userID] });
    setFriendName('');
    onClose();
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
            <Box position="relative">
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
              <Icon
                as={IoPersonAdd}
                w={7}
                h={7}
                position="absolute"
                right={4}
                top={4}
                cursor="pointer"
                color="teal.600"
                _hover={{ color: 'gray.500', transform: 'scale(1.1)' }}
                onClick={onOpen}
              />
            </Box>
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
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add Friend</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Input
                  placeholder="Enter friend's name"
                  value={friendName}
                  onChange={(e) => setFriendName(e.target.value)}
                />
                {filteredProfiles.length > 0 && (
                  <List mt={4} spacing={2}>
                    {filteredProfiles.map((p) => (
                      <ListItem
                        key={p.userID}
                        onClick={() => handleAddFriend(p.userID)}
                        cursor="pointer"
                        _hover={{ bg: 'gray.200' }}
                      >
                        <HStack>
                          <Avatar size="sm" name={p.name} src={p.photo} />
                          <Text>{p.name}</Text>
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                )}
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
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
