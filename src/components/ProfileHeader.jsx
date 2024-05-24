import React from 'react';
import {
  Box, Icon, Text, Avatar, Flex, Heading, VStack, Spacer, HStack, Grid, Tab, Tabs, TabList, TabPanels, TabPanel, useDisclosure,
} from '@chakra-ui/react';
import { IoPersonAdd } from 'react-icons/io5';
import PostCard from './post-card';
import AddFriendModal from './AddFriendModal';

export default function ProfileHeader(props) {
  const { onOpen, isOpen, onClose } = useDisclosure();
  console.log('Stephen\'s posts: ', props.profile.posts);

  return (
    <Flex py={5} px={10} bg="teal.600" color="white" minH="100vh" overflow="auto" position="relative" width="100vw" justify="center">
      <VStack p="5%" w="100%" maxW="1000px">
        <Box position="relative" mb={4}>
          <HStack p={10} bg="white" borderRadius="xl" justify="space-between" align="center" width="100%" spacing={10} color="gray.900">
            <Avatar w="150px" h="150px" name={props.profile.name} src={props.profile.photo} />
            <VStack justify="flex-start" align="flex-start" mb={8}>
              <Heading as="h1" size="xl" color="gray.900">
                {props.profile.name}
              </Heading>
              <Text size="md" fontWeight="bold">Total Posts: {props.profile.posts.length}</Text>
            </VStack>
            <Spacer />
            <VStack justify="flex-start" align="center" mb={8}>
              <Heading as="h3" size="md">{props.profile.followers.length}</Heading>
              <Text size="md">Followers</Text>
            </VStack>
            <VStack justify="flex-start" align="center" mb={8}>
              <Heading as="h3" size="md">{props.profile.following.length}</Heading>
              <Text size="md">Following</Text>
            </VStack>
          </HStack>
          <Icon as={IoPersonAdd}
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
                <Grid templateColumns="repeat(3, minmax(200px, 1fr))" gap={6}>
                  {props.profile.posts && props.profile.posts.length > 0 ? (
                    props.profile.posts.map((post) => (
                      <PostCard key={post.id} post={post} />
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
      <AddFriendModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}
