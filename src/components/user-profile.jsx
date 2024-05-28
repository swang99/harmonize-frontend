import {
  Avatar,
  Box, Button, Flex, Grid, HStack, Heading, Icon, Spacer,
  Tab, TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text, VStack,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { IoPersonAdd } from 'react-icons/io5';
import useStore from '../store/profile-slice';
import AddFriendModal from './AddFriendModal';
import ViewFollowers from './ViewFollowers';
import ViewFollowing from './ViewFollowing';
import AddTrackToPlaylistModal from './add-track-to-playlist';
import FullPostModal from './full-post-modal';
import PostCard from './post-card';
import NewPostModal from './NewPostModal';
import TrackItem from './track-item';

export default function ProfileHeader(props) {
  const { isOwnProfile, profile, userProfile, id: profileId } = props;
  const addFDisc = useDisclosure();
  const followersDisc = useDisclosure();
  const followingDisc = useDisclosure();
  const postDisc = useDisclosure();
  const { followProfile, unfollowProfile, getLikedPosts } = useStore((store) => store.profileSlice);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likedPosts, setLikedPosts] = useState(profile.likedPosts || []);
  const [postModalContent, setPostModalContent] = useState(null);

  useEffect(() => {
    if (userProfile && userProfile.following.includes(profileId)) {
      setIsFollowing(true);
    }
  }, [userProfile, profileId]);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      const posts = await getLikedPosts(profileId);
      setLikedPosts(posts);
    };
    fetchLikedPosts();
  }, [profileId]);

  const handlePostModalOpen = (post) => {
    setPostModalContent(post);
    postDisc.onOpen();
  };

  const handleFollow = async () => {
    await followProfile(userProfile, profile);
    setIsFollowing(true);
  };

  const handleUnfollow = async () => {
    await unfollowProfile(userProfile, profile);
    setIsFollowing(false);
  };

  const renderFollowButton = () => (
    isFollowing ? (
      <Button size="lg" onClick={handleUnfollow}>
        Unfollow
      </Button>
    ) : (
      <Button size="lg" onClick={handleFollow}>
        Follow
      </Button>
    )
  );

  const finalRef = useRef();

  return (
    <Flex py={5} px={10} bg="white" height="100vh" overflowY="auto" position="relative" width="100vw" justify="center">
      <VStack w="100%" maxW="1000px" spacing={4}>
        <Box position="relative" w="100%">
          <HStack p={10} bg="gray.800" borderRadius="xl" justify="space-between" align="center" width="100%" spacing={10} color="white" shadow>
            <Avatar w="150px" h="150px" name={profile.name} src={profile.photo} />
            <VStack justify="flex-start" align="flex-start" mb={8}>
              <Heading as="h1" size="xl">
                {profile.name}
              </Heading>
              <Text size="md" fontWeight="bold">Total Posts: {profile.posts.length}</Text>
            </VStack>
            <Spacer />
            <VStack>
              <HStack spacing={4}>
                <VStack justify="flex-start"
                  align="center"
                  onClick={followersDisc.onOpen}
                  cursor="pointer"
                  _hover={{ color: 'teal.400' }}
                >
                  <Heading as="h3" size="md">{profile.followers.length}</Heading>
                  <Text size="md" onClick={followersDisc.onOpen} cursor="pointer">
                    Followers
                  </Text>
                </VStack>
                <VStack justify="flex-start"
                  align="center"
                  onClick={followingDisc.onOpen}
                  cursor="pointer"
                  _hover={{ color: 'teal.400' }}
                >
                  <Heading as="h3" size="md">{profile.following.length}</Heading>
                  <Text size="md">
                    Following
                  </Text>
                </VStack>
              </HStack>
              {!isOwnProfile && (
              <VStack mt={4}>
                {renderFollowButton()}
              </VStack>
              )}
            </VStack>
          </HStack>
          {isOwnProfile && (
            <Icon as={IoPersonAdd}
              w={7}
              h={7}
              position="absolute"
              right={4}
              top={4}
              cursor="pointer"
              color="gray.100"
              _hover={{ color: 'teal.400', transform: 'scale(1.1)' }}
              onClick={addFDisc.onOpen}
            />
          )}
        </Box>
        <Tabs variant="unstyled" align="center" defaultIndex={0} mt={4} w="100%">
          <TabList gap={4}>
            <Tab
              fontWeight="bold"
              borderRadius="full"
              _selected={{ color: 'teal.500', bg: 'gray.100', borderRadius: 'full' }}
              _focus={{ boxShadow: 'none' }}
            >
              Posts
            </Tab>
            <Tab
              fontWeight="bold"
              borderRadius="full"
              _selected={{ color: 'teal.500', bg: 'gray.100', borderRadius: 'full' }}
              _focus={{ boxShadow: 'none' }}
            >
              Activity
            </Tab>
            <Tab
              fontWeight="bold"
              borderRadius="full"
              _selected={{ color: 'teal.500', bg: 'gray.100', borderRadius: 'full' }}
              _focus={{ boxShadow: 'none' }}
            >
              Liked
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={0}>
              <Box py={5} w="100%" mb={10} gap={4}>
                <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6} w="100%" pb="20vh">
                  {profile.posts && profile.posts.length > 0 ? (
                    profile.posts.map((post) => (
                      <PostCard
                        key={post._id}
                        post={post}
                        profile={profile}
                        onPostModalOpen={handlePostModalOpen}
                        use="profile"
                      />
                    ))
                  ) : (
                    <Text>No posts yet.</Text>
                  )}
                </Grid>
              </Box>
            </TabPanel>
            <TabPanel p={0}>
              <VStack py={5} w="100%" mb={10} gap={4}>
                <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6} w="100%" pb="20vh">
                  {profile.topTracks && profile.topTracks.length > 0 ? (
                    profile.topTracks.map((track) => (
                      <TrackItem
                        key={track.id}
                        id={track.id}
                        name={track.name}
                        artist={track.artists[0].name}
                        imageURL={track.album.images[0].url}
                      />
                    ))
                  ) : (
                    <Text>No activity available.</Text>
                  )}
                </Grid>
              </VStack>
            </TabPanel>
            <TabPanel p={0}>
              <VStack py={5} w="100%" mb={10} gap={4}>
                <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6} w="100%" pb="20vh">
                  {likedPosts && likedPosts.length > 0 ? (
                    likedPosts.map((post) => (
                      <PostCard
                        key={post._doc._id}
                        post={post._doc}
                        name={post.name}
                        photo={post.photo}
                        authorID={post.authorID}
                        onPostModalOpen={handlePostModalOpen}
                        use="profile"
                      />
                    ))
                  ) : (
                    <Text>No liked posts yet.</Text>
                  )}
                </Grid>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
      <AddFriendModal
        isOpen={addFDisc.isOpen}
        onClose={addFDisc.onClose}
        finalFocusRef={finalRef}
      />
      <ViewFollowing
        isOpen={followingDisc.isOpen}
        onClose={followingDisc.onClose}
        finalFocusRef={finalRef}
        profile={profile}
      />
      <ViewFollowers
        isOpen={followersDisc.isOpen}
        onClose={followersDisc.onClose}
        finalFocusRef={finalRef}
        profile={profile}
      />
      <NewPostModal />
      <AddTrackToPlaylistModal />
      <FullPostModal />
    </Flex>
  );
}
