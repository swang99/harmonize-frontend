import { Box, Button, GridItem, Image, Text } from '@chakra-ui/react';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { getItemData } from '../utils/spotify-api';
import { playTrackInApp } from '../utils/spotify-player';

/**
 * Represents a post cardcomponent.
 *
 * @component
 * @param {Object} props - The props object containing the post data.
 * @param {string} props.id - The ID of the post.
 * @param {string} props.type - The type of the post.
 * @param {string} props.comment - The comment associated with the post.
 * @returns {JSX.Element} The rendered Post component.
 */
const PostCard = (props) => {
  // Destructure props, store postData
  const { post } = props;
  const [postItemData, setPostItemData] = useState(null);
  console.log(props);

  const { id, type } = post;
  console.log(id, type);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        console.log('Fetching post data with id:', id, 'and type:', type); // Debugging log
        const data = await getItemData(id, type);
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
      await playTrackInApp(id);
    } catch (error) {
      console.error('Failed to play track:', error);
    }
  };

  const renderTrackPost = () => {
    const { name } = postItemData;
    const imageURL = postItemData.album.images[0].url;
    const artists = postItemData.artists[0].name;
    return (
      <GridItem key={id} w="100%" bg="gray.800" borderRadius="md" overflow="hidden" position="relative">
        <Image src={imageURL} alt={name} />
        <Box p={3}>
          <Text fontSize="md" fontWeight="bold" color="white" isTruncated>{name}</Text>
          <Text fontSize="sm" color="gray.400" isTruncated>{artists}</Text>
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
          onClick={handlePlay}
        >
          <FontAwesomeIcon icon={faPlay} />
        </Button>
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
    } else if (type === 'Track') {
      return renderTrackPost(postItemData);
    } else if (type === 'Album') {
      return renderAlbumPost(postItemData);
    } else if (type === 'Playlist') {
      return renderArtistPost(postItemData);
    } else if (type === 'Artist') {
      return renderPlaylistPost(postItemData);
    }
    return null;
  };

  return renderPost();
};

export default PostCard;
