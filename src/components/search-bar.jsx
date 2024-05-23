/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import { Input, Collapse, List, ListItem, Button, Flex, Box } from '@chakra-ui/react';
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
      return null;
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
    <Box bg="teal.600" w="100vw" h="100vh">
      <form onSubmit={(e) => handleSearch(e)}>
        <Flex gap="2">
          <Input
            value={query}
            onChange={handleInputChange}
            placeholder="Search..."
            size="lg"
            mb={2}
          />
          <Button colorScheme="green" type="submit" size="lg">
            Search
          </Button>
        </Flex>
      </form>
      {renderResults()}
    </Box>
  );
}

export default SearchBar;
