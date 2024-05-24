/* eslint-disable react/jsx-no-bind */
import { Box, Button, Flex, FormControl, Grid, GridItem, HStack, Image, Input, Text } from '@chakra-ui/react';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getRecentlyPlayedTracks, searchSpotify } from '../utils/spotify-api';
import { playTrackInApp } from '../utils/spotify-player';

function SearchBar() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  useEffect(() => {
    async function fetchRecentlyPlayed() {
      let recents = await getRecentlyPlayedTracks();
      const seenIds = new Set();

      recents = recents.filter((item) => {
        if (seenIds.has(item.track.id)) return false;
        seenIds.add(item.track.id);
        return true;
      });

      console.log('Recents', recents);
      setRecentlyPlayed(recents);
    }
    fetchRecentlyPlayed();
  }, []);

  useEffect(() => {
    console.log('Recents:', recentlyPlayed);
  }, [recentlyPlayed]);

  async function handleInputChange(e) {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (query.length !== 0) {
      const searchResults = await searchSpotify(query);
      setResults(searchResults);
    }
  }

  useEffect(() => {
    console.log('Results:', results);
  }, [results]);

  const handlePlay = async (id) => {
    try {
      console.log('Function called:', playTrackInApp);
      await playTrackInApp(id);
    } catch (error) {
      console.error('Failed to play track:', error);
    }
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
          <GridItem key={item.id} w="100%" bg="gray.800" borderRadius="md" overflow="hidden" position="relative">
            <Image src={item.album.images[0].url} alt={item.name} />
            <Box p={3}>
              <Text fontSize="md" fontWeight="bold" color="white" isTruncated>{item.name}</Text>
              <Text fontSize="sm" color="gray.400" isTruncated>{item.artists[0].name}</Text>
            </Box>
            <Button
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              colorScheme="green"
              borderRadius="full"
              width="50px"
              height="50px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              onClick={() => handlePlay(item.id)}
            >
              <FontAwesomeIcon icon={faPlay} />
            </Button>
          </GridItem>
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
          <GridItem key={item.played_at} w="100%" bg="gray.800" borderRadius="md" overflow="hidden" position="relative">
            <Image src={item.track.album.images[0].url} alt={item.track.name} />
            <Box p={3}>
              <Text fontSize="md" fontWeight="bold" color="white" isTruncated>{item.track.name}</Text>
              <Text fontSize="sm" color="gray.400" isTruncated>{item.track.artists[0].name}</Text>
            </Box>
            <Button
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              colorScheme="green"
              borderRadius="full"
              width="50px"
              height="50px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              onClick={() => handlePlay(item.track.id)}
            >
              <FontAwesomeIcon icon={faPlay} />
            </Button>
          </GridItem>
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
      <HStack bg="teal.600" w="100vw" h="100vh" display="flex" justify="center" align="flex-start" overflowY="auto">
        <Box width="80%" p={10} borderRadius="md" mb="15vh">
          <form onSubmit={handleSearch}>
            <FormControl>
              <Flex m={10} gap="2" alignItems="center">
                <Input
                  value={query}
                  bg="white"
                  onChange={handleInputChange}
                  placeholder="Search..."
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
                <Button colorScheme="green" type="submit" size="lg" height="50px">
                  Search
                </Button>
              </Flex>
            </FormControl>
          </form>
          {query.length > 0 ? renderResults() : renderRecents()}
        </Box>
      </HStack>
    </motion.div>
  );
}

export default SearchBar;
