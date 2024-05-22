import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Input, Textarea, VStack, List, ListItem, useToast } from '@chakra-ui/react';
import { searchSpotify } from '../utils/spotify-api';
import useStore from '../store';

const NewPostPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [comment, setComment] = useState('');
  const createPost = useStore((state) => state.postSlice.createPost);
  const profile = useStore((state) => state.profileSlice.currentProfile);
  const navigate = useNavigate();
  const toast = useToast();

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
    if (selectedItem && comment) {
      const post = {
        id: selectedItem.id,
        type: selectedItem.type,
        comment,
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

  return (
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
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button onClick={handleSubmit}>Create Post</Button>
        </Box>
      )}
    </VStack>
  );
};

export default NewPostPage;
