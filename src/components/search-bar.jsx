import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';
import { Input, Collapse, List, ListItem } from '@chakra-ui/react';
import { searchSpotify } from '../utils/spotify-api';

function SearchBar() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const debouncedSearch = useCallback(debounce(searchSpotify, 500), []);

  async function handleInputChange(e) {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    const searchResults = await debouncedSearch(searchQuery);
    // Simulated search results based on the query
    // const searchResults = [
    //   { id: 1, text: 'Result 1' },
    //   { id: 2, text: 'Result 2' },
    //   { id: 3, text: 'Result 3' },
    //   { id: 4, text: 'Result 4' },
    //   { id: 5, text: 'Result 5' },
    // ].filter((result) => result.text.toLowerCase().includes(searchQuery.toLowerCase()));

    setResults(searchResults);
  }

  const renderResults = () => {
    if (!results || results.length === 0) {
      return null;
    }
    return (
      <Collapse in={results.length > 0} animateOpacity>
        <List>
          {results.map((result, index) => (
            <ListItem key={result.id} p={2} _hover={{ bg: 'gray.100' }}>
              {result.text}
            </ListItem>
          ))}
        </List>
      </Collapse>
    );
  };

  return (
    <div>
      <Input
        value={query}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={handleInputChange}
        placeholder="Search..."
        size="lg"
        mb={2}
      />
      {renderResults()}
    </div>
  );
}

export default SearchBar;
