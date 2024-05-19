import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Box, Text, Avatar, Flex, Heading, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import useStore from '../store';
/* const testProfile = {
  name: 'Stephen Wang',
  email: 'swang@secret.io',
  password: '',
  followers: ['User 1', 'User 2'],
  following: ['User 3', 'User 4'],
  highlights: ['Perfect Melody', 'Airplanes', 'Moves Like Jagger'],
}; */

function Profile(props) {
  const { id } = useParams();
  const profile = useStore((store) => store.profileSlice.profile);
  const fetchProfile = useStore((store) => store.profileSlice.fetchProfile);
  const [profileFetched, setProfileFetched] = useState(false);

  useEffect(() => {
    fetchProfile(id).then(setProfileFetched(true));
  }, []);

  const renderProfile = () => {
    if (!profileFetched) {
      return <Text>Loading...</Text>;
    }
    return (
      <Box p={4} bg="blue.900" color="white" minH="100vh" overflow="hidden">
        <Flex justify="space-between" align="center" my={10} mx="auto" width="75%">
          <Avatar size="2xl" name={profile.name} />
          <Heading as="h1" size="lg">
            {profile.userID}
          </Heading>
          <Box>
            <Heading as="h2" size="md">
              total posts: {profile.posts.length}
            </Heading>
            <Text>most recent artist: Frank Sinatra</Text>
          </Box>
        </Flex>
        <Box>
          <Heading as="h3" size="md" mb={2}>
            post history:
          </Heading>
          <VStack align="stretch">
            {profile.posts.map((post, index) => (
              <Flex
                key={post.id}
                bg="blue.800"
                p={4}
                borderRadius="md"
                justify="space-between"
                align="center"
              >
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
            ))}
          </VStack>
        </Box>
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
      {renderProfile()}
    </motion.div>
  );
}

export default Profile;
