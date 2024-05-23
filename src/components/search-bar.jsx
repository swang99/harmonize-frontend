/* eslint-disable react/jsx-no-bind */
import { Box, Button, Collapse, Flex, FormControl, Grid, GridItem, HStack, Image, Input, List, ListItem, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { getEmbedFromSearch, getRecentlyPlayedTracks } from '../utils/spotify-api';

function SearchBar() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  useEffect(() => {
    async function fetchRecentlyPlayed() {
      const recents = await getRecentlyPlayedTracks();
      console.log('Recents', recents.items);
      setRecentlyPlayed(recents.items);
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
      const embedHTMLs = await getEmbedFromSearch(query);
      setResults(embedHTMLs);
    }
  }

  const renderResults = () => {
    if (!results || results.length === 0) {
      return (
        <Box p={2} color="white" />
      );
    }

    return (
      <Collapse in={results.length > 0} animateOpacity>
        <List>
          {results.map((result, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <ListItem key={index} p={2} _hover={{ bg: 'gray.100' }}>
              <iframe src={result} title="Spotify Embed" width="300" height="80" allow="encrypted-media" />
            </ListItem>
          ))}
        </List>
      </Collapse>
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
            >
              <FontAwesomeIcon icon={faPlay} />
            </Button>
          </GridItem>
        ))}
      </Grid>
    );
  };

  return (
    <HStack bg="teal.600" w="100vw" h="100vh" display="flex" justify="center" align="flex-start">
      <Box width="80%" p={10} borderRadius="md">
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
        {(results.length > 0) ? (renderResults()) : (renderRecents())}
      </Box>
    </HStack>
  );
}

export default SearchBar;
