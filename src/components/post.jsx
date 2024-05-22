import { Avatar, Box, Card, Flex, GridItem, Image, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
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

  const title = postData ? postData.name : '';
  const artist = postData ? postData.artists[0].name : '';
  const imageUrl = postData ? postData.album.images[0].url : '';
  const user = 'brendan';
  const genre = 'pop';
  const album = 'album';
  const release = 'release';

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

  const trackPost = () => {
    return (
      <Box
        bg="gray.200"
        p="4"
        borderRadius="lg"
        boxShadow="md"
        maxW="sm"
        mx="auto"
      >
        <Flex align="center" mb="4">
          <Avatar name={user} src={user.profilePicture} size="sm" />
          <Text ml="2" fontWeight="bold">{user.username}</Text>
        </Flex>
        <Text fontSize="xl" fontWeight="bold" mb="2">{title}</Text>
        <Text fontSize="sm" color="gray.600" mb="2">
          <Text as="span" fontWeight="bold">Performed by:</Text> {artist}
        </Text>
        <Text fontSize="sm" color="gray.600" mb="2">
          <Text as="span" fontWeight="bold">Genre:</Text> {genre}
        </Text>
        <Text fontSize="sm" color="gray.600" mb="2">
          <Text as="span" fontWeight="bold">Album:</Text> {album}
        </Text>
        <Text fontSize="sm" color="gray.600" mb="4">
          <Text as="span" fontWeight="bold">Release:</Text> {release}
        </Text>
        <Image
          src={imageUrl}
          alt={title}
          borderRadius="lg"
          mb="4"
        />
        <Text fontSize="sm" color="gray.700">
          <Text as="span" fontWeight="bold">comments:</Text> <Text as="i">{props.comment}</Text>
        </Text>
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
    } else if (props.type === 'track') {
      return trackPost();
    } else if (props.type === 'album') {
      return albumPost();
    } else if (props.type === 'artist') {
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
