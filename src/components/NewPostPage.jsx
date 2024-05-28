import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Input, Textarea, VStack, List, ListItem, useToast, Spinner, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { searchSpotify } from '../utils/spotify-api';
import useStore from '../store';

const NewPostPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [description, setDescription] = useState('');
  const createPost = useStore((state) => state.postSlice.createPost);
  const profile = useStore((state) => state.profileSlice.currentProfile);
  const fetchProfile = useStore((state) => state.profileSlice.fetchProfile);
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const userId = 'user-id-placeholder'; // Replace with actual user ID

  useEffect(() => {
    const loadProfile = async () => {
      try {
        await fetchProfile(userId);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!profile) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [profile, fetchProfile, userId]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query) {
      const searchResults = await searchSpotify(query);
      setResults(searchResults);
    }
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    setResults([]);
  };

  const handleSubmit = async () => {
    if (selectedItem && description) {
      if (!profile) {
        console.error('Profile is not loaded');
        return;
      }
      console.log('Selected Item:', selectedItem); // debugging
      const post = {
        id: selectedItem.id,
        type: selectedItem.type.toLowerCase(),
        description,
        imageURL: selectedItem.album.images[0].url,
        artists: selectedItem.artists.map((artist) => artist.name).join(', '),
        songName: selectedItem.name,
        likes: [],
        comments: [],
      };
      console.log('Post Object:', post); // debugging

      await createPost(profile.userID, post);
      toast({
        title: 'Post created.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      navigate(`/users/${profile.userID}`);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ x: -1000, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 1000, opacity: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 50, damping: 12 }}
      >
        <Box position="absolute" w="100vw">
          <VStack spacing={4} justifyContent="center" alignItems="center" height="100vh">
            <Spinner size="xl" />
            <Text>Loading profile...</Text>
          </VStack>
        </Box>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ x: -1000, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 1000, opacity: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 50, damping: 12 }}
    >
      <Box position="absolute" w="100vw">
        <VStack spacing={4}>
          <form onSubmit={handleSearch}>
            <Input
              placeholder="Search for a song/album/track"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit">Search</Button>
          </form>
          <List spacing={2} w="100%">
            {results.map((item) => (
              <ListItem
                key={item.id}
                onClick={() => handleSelect(item)}
                cursor="pointer"
                _hover={{ backgroundColor: 'gray.200' }}
                p={2}
              >
                {item.name} by {item.artists.map((artist) => artist.name).join(', ')}
              </ListItem>
            ))}
          </List>
          {selectedItem && (
            <Box>
              <Textarea
                placeholder="Add a comment"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button onClick={handleSubmit}>Create Post</Button>
            </Box>
          )}
        </VStack>
      </Box>
    </motion.div>
  );
};

export default NewPostPage;
