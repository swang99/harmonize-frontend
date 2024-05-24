import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Input, Textarea, VStack, List, ListItem, useToast, Spinner, Text } from '@chakra-ui/react';
import { searchSpotify } from '../utils/spotify-api';
import useStore from '../store';

const NewPostPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [comment, setComment] = useState('');
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
    if (selectedItem && comment) {
      if (!profile) {
        console.error('Profile is not loaded');
        return;
      }

      const post = {
        id: selectedItem.id,
        type: selectedItem.type.toLowerCase(),
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

  if (loading) {
    return (
      <VStack spacing={4} justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
        <Text>Loading profile...</Text>
      </VStack>
    );
  }

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

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Box, Button, Input, Textarea, VStack, List, ListItem, useToast, Spinner, Text } from '@chakra-ui/react';
// import { searchSpotify } from '../utils/spotify-api';
// import useStore from '../store';

// const NewPostPage = () => {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState([]);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [comment, setComment] = useState('');
//   const createPost = useStore((state) => state.postSlice.createPost);
//   const profile = useStore((state) => state.profileSlice.currentProfile);
//   const navigate = useNavigate();
//   const toast = useToast();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (profile) {
//       setLoading(false);
//     }
//   }, [profile]);

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (query) {
//       const searchResults = await searchSpotify(query);
//       setResults(searchResults);
//     }
//   };

//   const handleSelect = (item) => {
//     setSelectedItem(item);
//     setResults([]);
//   };

//   const handleSubmit = async () => {
//     if (selectedItem && comment) {
//       if (!profile) {
//         console.error('Profile is not loaded');
//         return;
//       }

//       const post = {
//         id: selectedItem.id,
//         type: selectedItem.type,
//         comment,
//       };
//       console.log('Post Object:', post); // debugging
//       console.log('Profile: ', profile);

//       await createPost(profile.userID, post);
//       toast({
//         title: 'Post created.',
//         status: 'success',
//         duration: 2000,
//         isClosable: true,
//       });
//       navigate(`/users/${profile.userID}`);
//     }
//   };

//   useEffect(() => {
//     console.log('Current Profile:', profile);
//   }, [profile]);

//   if (loading) {
//     return (
//       <VStack spacing={4} justifyContent="center" alignItems="center" height="100vh">
//         <Spinner size="xl" />
//         <Text>Loading profile...</Text>
//       </VStack>
//     );
//   }

//   return (
//     <VStack spacing={4}>
//       <form onSubmit={handleSearch}>
//         <Input
//           placeholder="Search for a song/album/track"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//         <Button type="submit">Search</Button>
//       </form>
//       <List spacing={2} w="100%">
//         {results.map((item) => (
//           <ListItem
//             key={item.id}
//             onClick={() => handleSelect(item)}
//             cursor="pointer"
//             _hover={{ backgroundColor: 'gray.200' }}
//             p={2}
//           >
//             {item.name} by {item.artists.map((artist) => artist.name).join(', ')}
//           </ListItem>
//         ))}
//       </List>
//       {selectedItem && (
//         <Box>
//           <Textarea
//             placeholder="Add a comment"
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//           />
//           <Button onClick={handleSubmit}>Create Post</Button>
//         </Box>
//       )}
//     </VStack>
//   );
// };

// export default NewPostPage;

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Box, Button, Input, Textarea, VStack, List, ListItem, useToast, Spinner, Text } from '@chakra-ui/react';
// import { searchSpotify } from '../utils/spotify-api';
// import useStore from '../store';

// const NewPostPage = () => {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState([]);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [comment, setComment] = useState('');
//   const createPost = useStore((state) => state.postSlice.createPost);
//   const profile = useStore((state) => state.profileSlice.currentProfile);
//   const navigate = useNavigate();
//   const toast = useToast();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (profile) {
//       setLoading(false);
//     }
//   }, [profile]);

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (query) {
//       const searchResults = await searchSpotify(query);
//       setResults(searchResults);
//     }
//   };

//   const handleSelect = (item) => {
//     setSelectedItem(item);
//     setResults([]);
//   };

//   const handleSubmit = async () => {
//     if (selectedItem && comment) {
//       if (!profile) {
//         console.error('Profile is not loaded');
//         return;
//       }

//       const post = {
//         id: selectedItem.id,
//         type: selectedItem.type,
//         comment,
//       };
//       console.log('Post Object:', post); // debugging
//       console.log('Profile: ', profile);

//       await createPost(profile.userID, post);
//       toast({
//         title: 'Post created.',
//         status: 'success',
//         duration: 2000,
//         isClosable: true,
//       });
//       navigate(`/users/${profile.userID}`);
//     }
//   };

//   if (loading) {
//     return (
//       <VStack spacing={4} justifyContent="center" alignItems="center" height="100vh">
//         <Spinner size="xl" />
//         <Text>Loading profile...</Text>
//       </VStack>
//     );
//   }

//   return (
//     <VStack spacing={4}>
//       <form onSubmit={handleSearch}>
//         <Input
//           placeholder="Search for a song/album/track"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//         <Button type="submit">Search</Button>
//       </form>
//       <List spacing={2} w="100%">
//         {results.map((item) => (
//           <ListItem
//             key={item.id}
//             onClick={() => handleSelect(item)}
//             cursor="pointer"
//             _hover={{ backgroundColor: 'gray.200' }}
//             p={2}
//           >
//             {item.name} by {item.artists.map((artist) => artist.name).join(', ')}
//           </ListItem>
//         ))}
//       </List>
//       {selectedItem && (
//         <Box>
//           <Textarea
//             placeholder="Add a comment"
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//           />
//           <Button onClick={handleSubmit}>Create Post</Button>
//         </Box>
//       )}
//     </VStack>
//   );
// };

// export default NewPostPage;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Box, Button, Input, Textarea, VStack, List, ListItem, useToast } from '@chakra-ui/react';
// import { searchSpotify } from '../utils/spotify-api';
// import useStore from '../store';

// const NewPostPage = () => {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState([]);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [comment, setComment] = useState('');
//   const createPost = useStore((state) => state.postSlice.createPost);
//   const profile = useStore((state) => state.profileSlice.currentProfile);
//   const navigate = useNavigate();
//   const toast = useToast();

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (query) {
//       const searchResults = await searchSpotify(query);
//       setResults(searchResults);
//     }
//   };

//   const handleSelect = (item) => {
//     setSelectedItem(item);
//     setResults([]);
//   };

//   const handleSubmit = async () => {
//     if (selectedItem && comment) {
//       const post = {
//         id: selectedItem.id,
//         type: selectedItem.type,
//         comment,
//       };
//       console.log('Post Object:', post); // debugging
//       console.log('Profile: ', profile);

//       await createPost(profile.userID, post);
//       toast({
//         title: 'Post created.',
//         status: 'success',
//         duration: 2000,
//         isClosable: true,
//       });
//       navigate(`/users/${profile.userID}`);
//     }
//   };

//   return (
//     <VStack spacing={4}>
//       <form onSubmit={handleSearch}>
//         <Input
//           placeholder="Search for a song/album/track"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//         <Button type="submit">Search</Button>
//       </form>
//       <List spacing={2} w="100%">
//         {results.map((item) => (
//           <ListItem
//             key={item.id}
//             onClick={() => handleSelect(item)}
//             cursor="pointer"
//             _hover={{ backgroundColor: 'gray.200' }}
//             p={2}
//           >
//             {item.name} by {item.artists.map((artist) => artist.name).join(', ')}
//           </ListItem>
//         ))}
//       </List>
//       {selectedItem && (
//         <Box>
//           <Textarea
//             placeholder="Add a comment"
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//           />
//           <Button onClick={handleSubmit}>Create Post</Button>
//         </Box>
//       )}
//     </VStack>
//   );
// };

// export default NewPostPage;
