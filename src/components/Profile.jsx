import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
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
  const { filterProfiles, fetchProfile, fetchOtherProfile, followProfile, unfollowProfile } = useStore((store) => store.profileSlice);
  const navigate = useNavigate();
  const [profileFetched, setProfileFetched] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [tokenUpdated, setTokenUpdated] = useState(false);
  const [profile, setProfile] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [filteredProfiles, setFilteredProfiles] = useState([]);

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
        if (id === userSpotifyProfile.id) {
          const loadedProfile = await fetchProfile(id);
          setIsOwnProfile(true);
          setProfile(loadedProfile);
        } else {
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

  /* Filter profiles based on search input */
  async function handleFriendSearch(filter) {
    if (!filter) {
      setFilteredProfiles([]);
      setFriendName('');
      return;
    }
    setFriendName(filter);
    setFilteredProfiles(await filterProfiles(filter));
  }

  const handleFollow = async () => {
    await followProfile(userProfile, profile);
    setIsFollowing(true);
  };

  const handleUnfollow = async () => {
    await unfollowProfile(userProfile, profile);
    setIsFollowing(false);
  };

  const handleNavigateUser = (friendId) => {
    navigate(`/users/${friendId}`);
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
                        profile.posts.map((post) => (
                          <Post key={post.id} id={post.id} comment={post.comment} type={post.type} profile={profile} isOwnProfile={isOwnProfile} />
                        ))
                      ) : (
                        <Text>No posts yet.</Text>
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
                  onChange={(e) => handleFriendSearch(e.target.value)}
                />
                {filteredProfiles.length > 0 && (
                  <List mt={4} spacing={2}>
                    {filteredProfiles.map((p) => (
                      <ListItem
                        key={p.userID}
                        onClick={() => handleNavigateUser(p.userID)}
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
                    <Post key={post.id} id={post.id} type={post.type} comment={post.comment} />
                  ))
                ) : (
                  <Text>No posts yet.</Text>
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
