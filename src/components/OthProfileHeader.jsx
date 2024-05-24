import {
  Avatar,
  Box, Button,
  Flex,
  Grid,
  HStack,
  Heading,
  Spacer,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useStore from '../store/profile-slice';
import ViewFollowers from './ViewFollowers';
import ViewFollowing from './ViewFollowing';
import PostCard from './post-card';

export default function OthProfileHeader(props) {
  const { followProfile, unfollowProfile } = useStore((store) => store.profileSlice);
  const [isFollowing, setIsFollowing] = useState(false);
  const followersDisc = useDisclosure();
  const followingDisc = useDisclosure();

  useEffect(() => {
    if (props.userProfile) {
      console.log('Profile', props.userProfile); // Debugging log
      if (props.userProfile.following.includes(props.id)) {
        setIsFollowing(true);
      }
    }
  }, [props.userProfile]);

  useEffect(() => {
    console.log('Posts: ', props.profile.posts);
  }, [props.profile]);

  /* Filter profiles based on search input */
  const handleFollow = async () => {
    await followProfile(props.userProfile, props.profile);
    setIsFollowing(true);
  };

  const handleUnfollow = async () => {
    await unfollowProfile(props.userProfile, props.profile);
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

  return (
    <Flex py={5} px={10} bg="teal.600" color="white" minH="100vh" overflow="hidden" position="absolute" width="100vw" justify="center">
      <VStack p="5%" w="100%" maxW="1000px">
        <HStack p={10} bg="white" borderRadius="xl" justify="space-between" align="center" width="100%" spacing={10} color="gray.900">
          <Avatar w="150px" h="auto" name={props.profile.name} src={props.profile.photo} />
          <VStack justify="flex-start" align="flex-start" mb={8}>
            <Heading as="h1" size="xl" color="gray.900">
              {props.profile.name}
            </Heading>
            <Text size="md" fontWeight="bold">Total Posts: {props.profile.posts.length}</Text>
          </VStack>
          <Spacer />
          <VStack justify="flex-start" align="center" mb={8}>
            <HStack gap={10}>
              <VStack justify="flex-start" align="center" mb={8}>
                <Heading as="h3" size="md">{props.profile.followers.length}</Heading>
                <Text size="md" onClick={followersDisc.onOpen} cursor="pointer">
                  Followers
                </Text>
              </VStack>
              <VStack justify="flex-start" align="center" mb={8}>
                <Heading as="h3" size="md">{props.profile.following.length}</Heading>
                <Text size="md" onClick={followingDisc.onOpen} cursor="pointer">
                  Following
                </Text>
              </VStack>
            </HStack>
            {renderFollowButton()}
          </VStack>
        </HStack>
        <Box>
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {props.profile.posts && props.profile.posts.length > 0 ? (
              props.profile.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <Text>No posts yet.</Text>
            )}
          </Grid>
        </Box>
      </VStack>
      <ViewFollowing
        isOpen={followingDisc.isOpen}
        onClose={followingDisc.onClose}
        following={props.profile.following}
      />
      <ViewFollowers isOpen={followersDisc.isOpen}
        onClose={followersDisc.onClose}
        followers={props.profile.followers}
      />
    </Flex>
  );
}
