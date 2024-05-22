import { Avatar, Box, Card, GridItem, HStack, Image, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useStore from '../store';
import { getItemData } from '../utils/spotify-api';

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
  const [postData, setPostData] = useState(null);
  const [postFetched, setPostFetched] = useState(false);
  const playTrackInApp = useStore((state) => state.playerSlice.playTrackInApp);
  const slice = useStore((state) => state.playerSlice);

  const title = postData ? postData.name : '';
  const imageUrl = postData ? postData.album.images[0].url : '';

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const itemData = await getItemData(props.id, props.type);
        setPostData(itemData);
        setPostFetched(true);
      } catch (error) {
        console.error('Failed to fetch post data:', error);
      }
    };
    fetchPostData();
  }, []);

  useEffect(() => {
    if (postFetched) {
      console.log('PostFetched:', postFetched, 'Post data:', postData);
    }
  }, [postFetched]);

  const handlePlay = async () => {
    try {
      console.log('Function called:', playTrackInApp);
      await playTrackInApp(postData.id);
    } catch (error) {
      console.error('Failed to play track:', error);
    }
  };

  useEffect(() => {
    console.log('Slice updated', slice);
  }, [slice]);

  const trackPost = () => {
    return (
      <Box
        bg="gray.200"
        position="relative"
        overflow="hidden"
        _hover={{ '& .hover-content': { opacity: 1 } }}
        onClick={handlePlay}
      >
        <Image
          src={imageUrl}
          alt={title}
          width="100%"
        />
        <Box
          className="hover-content"
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          opacity="0"
          transition="opacity 0.1s ease-in-out"
          bg="rgba(0, 0, 0, 0.5)"
          color="white"
          p="4"
        >
          {!props.isOwnProfile && (
          <HStack align="center" mb="4">
            <Avatar name={props.profile.name} src={props.profile.photo} size="sm" opacity="1" />
            <Text ml="2" fontWeight="bold">{props.profile.name}</Text>
          </HStack>
          )}
          <Text fontSize="xl" fontWeight="bold" mb="2">{props.type}: {title}</Text>
          <Text fontSize="sm" color="gray.100" mb="2">
            <Text as="span" fontWeight="bold">Artist:</Text> {postData.artists[0].name}
          </Text>
          <Text fontSize="sm" color="gray.100" mb="2">
            <Text as="span" fontWeight="bold">Album:</Text> {postData.album.name}
          </Text>
          <Text fontSize="sm" color="gray.100" mb="4">
            <Text as="span" fontWeight="bold">Year:</Text> {postData.album.release_date.split('-')[0]}
          </Text>
          <Text fontSize="sm" color="gray.100">
            <Text as="span" fontWeight="bold">comments:</Text> <Text as="i">{props.comment}</Text>
          </Text>
        </Box>
      </Box>
    );
  };

  const albumPost = () => {
    return (
      <Card>
        <img src={postData.album.images[0].url} alt={postData.name} />
        <p>{postData.name}</p>
        <p>{postData.artists[0].name}</p>
      </Card>
    );
  };

  const artistPost = () => {
    return (
      <Card>
        <img src={postData.album.images[0].url} alt={postData.name} />
        <p>{postData.name}</p>
        <p>{postData.artists[0].name}</p>
      </Card>
    );
  };

  const renderPost = () => {
    if (!postFetched || !postData) {
      return null;
    } else if (props.type === 'Track') {
      return trackPost();
    } else if (props.type === 'Album') {
      return albumPost();
    } else if (props.type === 'Artist') {
      return artistPost();
    } else {
      return null;
    }
  };

  return (
    postFetched && postData ? (
      <GridItem>
        {renderPost()}
      </GridItem>
    ) : (null)
  );
};

export default Post;
