/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import { Input, Collapse, List, ListItem, Button, Flex, Box, HStack, FormControl } from '@chakra-ui/react';
import { getEmbedFromSearch } from '../utils/spotify-api';

function SearchBar() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');

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

  return (
    <HStack bg="teal.600" w="100vw" h="100vh" display="flex" justify="center" align="flex-start">
      <Box width="80%" p={10} borderRadius="md">
        <form onSubmit={handleSearch}>
          <FormControl>
            <Flex gap="2" alignItems="center">
              <Input
                value={query}
                bg="white"
                onChange={handleInputChange}
                placeholder="Search..."
                size="lg"
                height="50px"
                color="black"
                placeholderTextColor="gray"
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
        {renderResults()}
      </Box>
    </HStack>
  );
}

export default SearchBar;
