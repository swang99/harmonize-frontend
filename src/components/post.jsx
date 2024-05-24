import { Box, Button, GridItem, HStack, Image, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getItemData } from '../utils/spotify-api';
import { playTrackInApp } from '../utils/spotify-player';

/**
 * Represents a post component.
 *
 * @component
 * @param {Object} props - The props object containing the post data.
 * @param {string} props.id - The ID of the post.
 * @param {string} props.type - The type of the post.
 * @param {string} props.comment - The comment associated with the post.
 * @returns {JSX.Element} The rendered Post component.
 */
const Post = (props) => {
  // Destructure props, store postData
  const [postItemData, setPostItemData] = useState(null);
  console.log(props);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        console.log('Fetching post data with id:', props.id, 'and type:', props.type); // Debugging log
        const data = await getItemData(props.id, props.type);
        setPostItemData(data);
      } catch (error) {
        console.error('Failed to fetch post data:', error);
      }
    };
    fetchPostData();
  }, []);

  const handlePlay = async () => {
    try {
      console.log('Function called:', playTrackInApp);
      await playTrackInApp(props.id);
    } catch (error) {
      console.error('Failed to play track:', error);
    }
  };

  const renderTrackPost = (postData) => {
    const { name } = postData;
    const imgUrl = postData.album.images[0].url;
    const artists = postData.artists[0].name;
    const date = postData.album.release_date.split('-')[0];
    const album = postData.album.name;
    return (
      <GridItem>
        <Box
          bg="gray.200"
          position="relative"
          overflow="hidden"
          p={4}
          borderRadius="md"
          _hover={{ '& .hover-content': { opacity: 1 } }}
        >
          <VStack align="start" spacing={3}>
            <HStack spacing={3}>
              <Image
                src={imgUrl}
                alt={name}
                boxSize="100px"
                borderRadius="md"
                objectFit="cover"
              />
              <VStack align="start" spacing={1}>
                <Text fontSize="lg" fontWeight="bold">{name}</Text>
                <Text fontSize="sm" color="gray.600">Artist: {artists}</Text>
                <Text fontSize="sm" color="gray.600">Album: {album}</Text>
                <Text fontSize="sm" color="gray.600">Year: {date}</Text>
              </VStack>
            </HStack>
            <Text fontSize="sm" color="gray.800">Comment: {props.description}</Text>
            <Button colorScheme="teal" size="sm" onClick={handlePlay}>
              Play
            </Button>
          </VStack>
        </Box>
      </GridItem>
    );
  };
  // function to render an album post
  const renderAlbumPost = (postData) => {
    return (
      null
    );
  };
  // function to render an album post
  const renderArtistPost = (postData) => {
    return (
      null
    );
  };

  // function to render an album post
  const renderPlaylistPost = (postData) => {
    return (
      null
    );
  };

  // renders the post correctly according to what type of content it contains
  const renderPost = () => {
    if (!postItemData) {
      return null;
    } else if (props.type === 'track') {
      return renderTrackPost(postItemData);
    } else if (props.type === 'album') {
      return renderAlbumPost(postItemData);
    } else if (props.type === 'playlist') {
      return renderArtistPost(postItemData);
    } else if (props.type === 'artist') {
      return renderPlaylistPost(postItemData);
    }
    return null;
  };

  return renderPost();
};

export default Post;
