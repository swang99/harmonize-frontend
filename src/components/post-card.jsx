import { Box, Button, GridItem, HStack, Icon, Image, Text, useDisclosure, VStack } from '@chakra-ui/react';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { CgPlayListAdd } from 'react-icons/cg';
import { getItemData } from '../utils/spotify-api';
import { playTrackInApp } from '../utils/spotify-player';
import AddTrackToPlaylistModal from './add-track-to-playlist';
import useStore from '../store';

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
  const { id, type } = post;
  console.log(id, type);
  // console.log('HAHA: ', props.post.comment);
  const addTrackToPlaylistDisc = useDisclosure();
  const { playlists } = useStore((store) => store.profileSlice);

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

  useEffect(() => {
    console.log('Post item data: ', postItemData);
  }, [postItemData]);

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
        <HStack>
          <VStack>
            <Image src={imageURL} alt={name} />
            <Box p={3} alignSelf="start">
              <Text fontSize="md" fontWeight="bold" color="white" isTruncated>{name}</Text>
              <Text fontSize="sm" color="gray.400" isTruncated>{artists}</Text>
            </Box>
          </VStack>
          <Box p={3}>
            <Icon
              as={CgPlayListAdd}
              w={7}
              h={7}
              cursor="pointer"
              color="teal.100"
              _hover={{ color: 'teal.500', transform: 'scale(1.1)' }}
              onClick={addTrackToPlaylistDisc.onOpen}
            >
              Add to Playlist
            </Icon>
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
        </HStack>
        <AddTrackToPlaylistModal isOpen={addTrackToPlaylistDisc.isOpen} onClose={addTrackToPlaylistDisc.onClose} trackID={postItemData.id} playlists={playlists} />
      </GridItem>
    );
  };

  // function to render an album post
  const renderAlbumPost = (postData) => {
    return (
      null
    );
  };
  // function to render an artist post
  const renderArtistPost = (postData) => {
    return (
      null
    );
  };

  // function to render a playlist post
  const renderPlaylistPost = (postData) => {
    return (
      null
    );
  };

  // renders the post correctly according to what type of content it contains
  const renderPost = () => {
    if (!postItemData) {
      return null;
    } else if (type === 'track') {
      return renderTrackPost(postItemData);
    } else if (type === 'album') {
      return renderAlbumPost(postItemData);
    } else if (type === 'playlist') {
      return renderArtistPost(postItemData);
    } else if (type === 'artist') {
      return renderPlaylistPost(postItemData);
    }
    return null;
  };

  return renderPost();
};

export default PostCard;
