/* eslint-disable react/jsx-no-bind */
import { Box, Button, VStack, Image, Text, useDisclosure, Icon, HStack, Spacer } from '@chakra-ui/react';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FaSpotify, FaPlay } from 'react-icons/fa';
import { FaHeartCirclePlus } from 'react-icons/fa6';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { CgPlayListAdd } from 'react-icons/cg';
import useStore from '../store';
import { playTrackInApp } from '../utils/spotify-player';
import { addTrackToLikedSongs } from '../utils/spotify-api';
import AddTrackToPlaylistModal from './add-track-to-playlist';

function TrackItem(props) {
  const { id, name, artist, imageURL } = props;
  const [isHovered, setIsHovered] = useState(false);
  const { playlists } = useStore((store) => store.profileSlice);

  const addTrackToPlaylistDisc = useDisclosure();

  const handlePlay = async () => {
    try {
      console.log('Function called:', playTrackInApp);
      await playTrackInApp(id);
    } catch (error) {
      console.error('Failed to play track:', error);
    }
  };

  const handleLike = async () => {
    try {
      await addTrackToLikedSongs(id);
      toast.success('Track added to Library');
    } catch (error) {
      toast.error('Failed to add track to Library');
    }
  };

  const handleSpotify = () => {
    const url = `https://open.spotify.com/track/${props.id}`;
    window.open(url, '_blank');
  };

  const renderImage = () => {
    if (isHovered) {
      return (
        <Box
          position="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={imageURL}
            alt={name}
            h={250}
            w={250}
            flex="0 0 auto"
            filter="brightness(50%)"
            transition="filter 0.3s ease-in-out"
          />
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
            onClick={() => handlePlay()}
          >
            <Icon as={FaPlay} fontSize="xl" />
          </Button>
          <Button
            position="absolute"
            top="10px"
            right="10px"
            colorScheme="teal"
            borderRadius="full"
            width="50px"
            height="50px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={handleSpotify}
          >
            <Icon as={FaSpotify} fontSize="2xl" />
          </Button>
          <Button
            position="absolute"
            top="10px"
            right="70px"
            colorScheme="red"
            borderRadius="full"
            width="50px"
            height="50px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={handleLike}
          >
            <Icon as={FaHeartCirclePlus} fontSize="2xl" />
          </Button>
        </Box>
      );
    } else {
      return (
        <Box
          position="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={imageURL}
            alt={name}
            h={250}
            w={250}
            flex="0 0 auto"
            transition="filter 0.3s ease-in-out"
          />
        </Box>
      );
    }
  };

  if (props.use === 'feed') {
    return (
      <Box key={id} borderRadius="md" minW={250}>
        <VStack display="flex" justifyContent="space-between">
          <Box alignSelf="flex-start" bg="gray.800" w="100%" rounded="md" p="3">
            <Text fontSize="2xl" fontWeight="bold" color="white" isTruncated>{name}</Text>
            <Text fontSize="xl" as="i" color="gray.400" isTruncated>{artist}</Text>
            <Icon
              as={CgPlayListAdd}
              w={7}
              h={7}
              cursor="pointer"
              color="teal.900"
              _hover={{ color: 'teal.500', transform: 'scale(1.1)' }}
              onClick={addTrackToPlaylistDisc.onOpen}
            />
          </Box>
          {renderImage()}
        </VStack>
        <AddTrackToPlaylistModal isOpen={addTrackToPlaylistDisc.isOpen} onClose={addTrackToPlaylistDisc.onClose} trackID={id} playlists={playlists} />
      </Box>
    );
  }

  return (
    <Box key={id} w="100%" bg="gray.800" borderRadius="md" overflow="hidden" position="relative">
      <Image src={imageURL} alt={name} />
      <HStack p={3}>
        <VStack align="flex-start" mx={2}>
          <Text fontSize="md" fontWeight="bold" color="white" isTruncated>{name}</Text>
          <Text fontSize="sm" color="gray.400" isTruncated>{artist}</Text>
        </VStack>
        <Spacer />
        <Icon
          as={CgPlayListAdd}
          w={7}
          h={7}
          cursor="pointer"
          color="teal.900"
          _hover={{ color: 'teal.500', transform: 'scale(1.1)' }}
          onClick={addTrackToPlaylistDisc.onOpen}
        />
      </HStack>
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
        onClick={() => handlePlay()}
      >
        <FontAwesomeIcon icon={faPlay} />
      </Button>
      <AddTrackToPlaylistModal isOpen={addTrackToPlaylistDisc.isOpen} onClose={addTrackToPlaylistDisc.onClose} trackID={id} playlists={playlists} />
    </Box>
  );
}

export default TrackItem;
