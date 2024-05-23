import { Box, GridItem, HStack, Image, Text, VStack, Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useStore from '../store';
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
  const { id, type, comment } = props;
  const [postData, setPostData] = useState(null);
  const [postFetched, setPostFetched] = useState(false);
  const slice = useStore((state) => state.playerSlice);

  const title = postData ? postData.name : '';
  const imageUrl = postData ? postData.album.images[0].url : '';

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        console.log('Fetching post data with id:', id, 'and type:', type); // Debugging log
        const itemData = await getItemData(id, type);
        setPostData(itemData);
        setPostFetched(true);
      } catch (error) {
        console.error('Failed to fetch post data:', error);
      }
    };
    fetchPostData();
  }, [id, type]);

  const handlePlay = async () => {
    try {
      console.log('Function called:', playTrackInApp);
      await playTrackInApp(postData.id);
      setIsPlaying(true);
    } catch (error) {
      console.error('Failed to play track:', error);
    }
  };

  const handlePause = async () => {
    try {
      console.log('Function called:', pauseTrackInApp);
      await pauseTrackInApp();
      setIsPlaying(false);
    } catch (error) {
      console.error('Failed to pause track:', error);
    }
  };

  const renderPost = () => {
    if (!postFetched || !postData) {
      return null;
    }
    const { name, album, artists } = postData;

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
                src={album.images[0].url}
                alt={name}
                boxSize="100px"
                borderRadius="md"
                objectFit="cover"
              />
              <VStack align="start" spacing={1}>
                <Text fontSize="lg" fontWeight="bold">{name}</Text>
                <Text fontSize="sm" color="gray.600">Artist: {artists[0].name}</Text>
                <Text fontSize="sm" color="gray.600">Album: {album.name}</Text>
                <Text fontSize="sm" color="gray.600">Year: {album.release_date.split('-')[0]}</Text>
              </VStack>
            </HStack>
            <Text fontSize="sm" color="gray.800">Comment: {comment}</Text>
            {isPlaying ? (
              <Button colorScheme="teal" size="sm" onClick={handlePause}>
                Pause
              </Button>
            ) : (
              <Button colorScheme="teal" size="sm" onClick={handlePlay}>
                Play
              </Button>
            )}
          </VStack>
        </Box>
      </GridItem>
    );
  };

  return renderPost();
};

export default Post;
