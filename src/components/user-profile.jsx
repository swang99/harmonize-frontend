import React, { useEffect, useState } from 'react';
import {
  Box, Button, Flex, Grid, HStack, Heading, Icon, Spacer, Text, VStack, Avatar, Tabs, Tab, TabList, TabPanels, TabPanel, useDisclosure,
} from '@chakra-ui/react';
import { IoPersonAdd } from 'react-icons/io5';
import useStore from '../store/profile-slice';
import PostCard from './post-card';
import AddFriendModal from './AddFriendModal';
import ViewFollowers from './ViewFollowers';
import ViewFollowing from './ViewFollowing';

export default function ProfileHeader(props) {
  const { isOwnProfile, profile, userProfile, id } = props;
  const addFDisc = useDisclosure();
  const followersDisc = useDisclosure();
  const followingDisc = useDisclosure();
  const { followProfile, unfollowProfile, getLikedPosts } = useStore((store) => store.profileSlice);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    if (userProfile && userProfile.following.includes(id)) {
      setIsFollowing(true);
    }
  }, [userProfile, id]);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      const posts = await getLikedPosts(id);
      setLikedPosts(posts);
      console.log('Liked Posts', posts);
    };
    fetchLikedPosts();
  }, []);

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

  return (
    <Flex py={5} px={10} bg="teal.600" color="white" height="100vh" overflowY="auto" position="relative" width="100vw" justify="center">
      <VStack p="5%" w="100%" maxW="1000px" spacing={4}>
        <Box position="relative" w="100%">
          <HStack p={10} bg="white" borderRadius="xl" justify="space-between" align="center" width="100%" spacing={10} color="gray.900">
            <Avatar w="150px" h="150px" name={profile.name} src={profile.photo} />
            <VStack justify="flex-start" align="flex-start" mb={8}>
              <Heading as="h1" size="xl" color="gray.900">
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
                  _hover={{ color: 'teal.500' }}
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
                  _hover={{ color: 'teal.500' }}
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
              color="teal.600"
              _hover={{ color: 'gray.500', transform: 'scale(1.1)' }}
              onClick={addFDisc.onOpen}
            />
          )}
        </Box>
        <Tabs variant="unstyled" align="center" defaultIndex={0} mt={4} w="100%">
          <TabList gap={4}>
            <Tab
              fontWeight="bold"
              borderRadius="full"
              _selected={{ color: 'teal.500', bg: 'white', borderRadius: 'full' }}
              _focus={{ boxShadow: 'none' }}
            >
              Recents
            </Tab>
            <Tab
              fontWeight="bold"
              borderRadius="full"
              _selected={{ color: 'teal.500', bg: 'white', borderRadius: 'full' }}
              _focus={{ boxShadow: 'none' }}
            >
              Liked
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={0}>
              <Box py={5} w="100%" mb={10}>
                <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6} w="100%" pb="20vh">
                  {profile.posts && profile.posts.length > 0 ? (
                    profile.posts.map((post) => (
                      <PostCard key={post.id} post={post} profile={profile} />
                    ))
                  ) : (
                    <Text>No posts yet.</Text>
                  )}
                </Grid>
              </Box>
            </TabPanel>
            <TabPanel p={0}>
              <VStack py={5} w="100%" mb={10} gap={4}>
                {likedPosts && likedPosts.length > 0 ? (
                  likedPosts.map((post) => (
                    <Box key={post._doc._id} w="100%" bg="gray.100" p={4} mx="auto" borderRadius="md" shadow="md">
                      <PostCard post={post._doc} use="feed" name={post.name} photo={post.photo} authorID={post.authorID} />
                    </Box>
                  ))
                ) : (
                  <Text>No liked posts yet.</Text>
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
      <AddFriendModal isOpen={addFDisc.isOpen} onClose={addFDisc.onClose} />
      <ViewFollowing
        isOpen={followingDisc.isOpen}
        onClose={followingDisc.onClose}
        profile={profile}
      />
      <ViewFollowers isOpen={followersDisc.isOpen}
        onClose={followersDisc.onClose}
        profile={profile}
      />
    </Flex>
  );
}
