/* eslint-disable react/jsx-no-bind */
import { Box, Button, Flex, FormControl, Grid, HStack, Input } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { getRecentlyPlayedTracks, searchSpotify } from '../utils/spotify-api';
import AddTrackToPlaylistModal from './add-track-to-playlist';
import TrackItem from './track-item';
import NewPostModal from './NewPostModal';

function SearchBar() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    async function fetchRecentlyPlayed() {
      let recents = await getRecentlyPlayedTracks();
      const seenIds = new Set();

      recents = recents.filter((item) => {
        if (seenIds.has(item.track.id)) return false;
        seenIds.add(item.track.id);
        return true;
      });

      setRecentlyPlayed(recents);
    }
    fetchRecentlyPlayed();
  }, []);

  const handleSearch = useCallback(async () => {
    if (query.length !== 0) {
      const searchResults = await searchSpotify(query);
      setResults(searchResults);
    }
  }, [query]);

  const handleInputChange = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      handleSearch();
    }, 300); // Adjust the debounce delay as needed (300ms here)

    setDebounceTimeout(newTimeout);
  };

  const renderResults = () => {
    if (!results || results.length === 0) {
      return (
        <Box p={2} color="white" />
      );
    }

    return (
      <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
        {results.map((item) => (
          <TrackItem
            key={item.id}
            id={item.id}
            name={item.name}
            artist={item.artists[0].name}
            imageURL={item.album.images[0].url}
          />
        ))}
      </Grid>
    );
  };

  const renderRecents = () => {
    if (!recentlyPlayed || recentlyPlayed.length === 0) {
      return (
        <Box p={2} color="white" />
      );
    }

    return (
      <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
        {recentlyPlayed.map((item, index) => (
          <TrackItem
            key={item.track.id}
            id={item.track.id}
            name={item.track.name}
            artist={item.track.artists[0].name}
            imageURL={item.track.album.images[0].url}
          />
        ))}
      </Grid>
    );
  };

  return (
    <motion.div
      initial={{ x: -1000, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 1000, opacity: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 50, damping: 12 }}
    >
      <Box position="absolute" w="100vw" mt={75}>
        <HStack bg="white" w="100vw" h="100vh" display="flex" justify="center" align="flex-start" overflowY="auto">
          <Box width="80%" p={10} borderRadius="md" mb="20vh">
            <form onSubmit={(e) => e.preventDefault()}>
              <FormControl>
                <Flex gap="2" mb={10} alignItems="center">
                  <Input
                    ref={inputRef}
                    value={query}
                    rounded="full"
                    bg="gray.100"
                    onChange={handleInputChange}
                    placeholder="Search for a song to play or share..."
                    size="lg"
                    height="50px"
                    color="black"
                    autoComplete="off"
                    border="none"
                    _focus={{
                      borderColor: 'transparent',
                      boxShadow: 'none',
                    }}
                    sx={{
                      '&::placeholder': {
                        color: 'gray',
                      },
                      '&:hover, &:focus': {
                        borderColor: 'transparent',
                        outline: 'none',
                        boxShadow: 'none',
                      },
                    }}
                  />
                  <Button colorScheme="green" rounded="full" type="submit" size="lg" height="50px" onClick={handleSearch}>
                    Search
                  </Button>
                </Flex>
              </FormControl>
            </form>
            {query.length > 0 ? renderResults() : renderRecents()}
          </Box>
        </HStack>
        <AddTrackToPlaylistModal />
        <NewPostModal />
      </Box>
    </motion.div>
  );
}

export default SearchBar;
