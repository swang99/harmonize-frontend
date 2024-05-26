import { Box, Button, HStack, Icon, Image, Text, VStack, useDisclosure } from '@chakra-ui/react';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { CgPlayListAdd } from 'react-icons/cg';
import { FaPlay, FaSpotify } from 'react-icons/fa';
import { FaHeartCirclePlus } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useStore from '../store';
import { addTrackToLikedSongs } from '../utils/spotify-api';
import { playTrackInApp } from '../utils/spotify-player';
import AddTrackToPlaylistModal from './add-track-to-playlist';

function TrackItem(props) {
  const { id, name, artist, imageURL } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [isNameOverflowing, setIsNameOverflowing] = useState(false);
  const [isArtistOverflowing, setIsArtistOverflowing] = useState(false);
  const playlists = useStore((store) => store.profileSlice.playlists);
  const nameRef = useRef(null);
  const artistRef = useRef(null);

  const addTrackToPlaylistDisc = useDisclosure();

  useEffect(() => {
    const checkOverflow = (ref, setState) => {
      if (ref.current) {
        setState(ref.current.scrollWidth > ref.current.clientWidth);
      }
    };

    checkOverflow(nameRef, setIsNameOverflowing);
    checkOverflow(artistRef, setIsArtistOverflowing);
  }, [name, artist]);

  const handlePlay = async () => {
    try {
      await playTrackInApp(id);
    } catch (error) {
      console.error('Failed to play track:', error);
    }
  };

  const handleLike = async () => {
    try {
      await addTrackToLikedSongs(id);
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

  const scrollingTextStyle = {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    animation: 'marquee 10s linear infinite',
  };

  const marqueeKeyframes = `
    @keyframes marquee {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
  `;

  if (props.use === 'feed') {
    return (
      <Box key={id} borderRadius="md" w={250} position="relative">
        <style>{marqueeKeyframes}</style>
        <VStack display="flex" justifyContent="space-between">
          <Box alignSelf="flex-start" bg="gray.800" w="100%" rounded="md" p="3">
            <Box overflow="hidden" w="100%">
              <Text
                ref={nameRef}
                fontSize="2xl"
                fontWeight="bold"
                color="white"
                isTruncated={!isNameOverflowing}
                style={isNameOverflowing ? scrollingTextStyle : {}}
              >
                {name}
              </Text>
            </Box>
            <Box overflow="hidden" w="100%">
              <Text
                ref={artistRef}
                fontSize="xl"
                as="i"
                color="gray.400"
                isTruncated={!isArtistOverflowing}
                style={isArtistOverflowing ? scrollingTextStyle : {}}
              >
                {artist}
              </Text>
            </Box>
          </Box>
          {renderImage()}
        </VStack>
        <Icon
          as={CgPlayListAdd}
          w={7}
          h={7}
          cursor="pointer"
          color="teal.900"
          _hover={{ color: 'teal.500', transform: 'scale(1.1)' }}
          position="absolute"
          bottom="10px"
          right="10px"
          onClick={addTrackToPlaylistDisc.onOpen}
        />
        <AddTrackToPlaylistModal isOpen={addTrackToPlaylistDisc.isOpen} onClose={addTrackToPlaylistDisc.onClose} trackID={id} playlists={playlists} />
      </Box>
    );
  }

  return (
    <Box key={id} w="100%" bg="gray.800" borderRadius="md" overflow="hidden" position="relative">
      <style>{marqueeKeyframes}</style>
      <Image src={imageURL} alt={name} />
      <HStack p={3} position="relative">
        <VStack align="flex-start" mx={2} flex="1" spacing={1} pr="40px" maxW="100%">
          <Box overflow="hidden" w="100%">
            <Text
              ref={nameRef}
              fontSize="md"
              fontWeight="bold"
              color="white"
              isTruncated={!isNameOverflowing}
              style={isNameOverflowing ? scrollingTextStyle : {}}
              maxW="100%"
            >
              {name}
            </Text>
          </Box>
          <Box overflow="hidden" w="100%">
            <Text
              ref={artistRef}
              fontSize="sm"
              color="gray.400"
              isTruncated={!isArtistOverflowing}
              style={isArtistOverflowing ? scrollingTextStyle : {}}
              maxW="100%"
            >
              {artist}
            </Text>
          </Box>
        </VStack>
        <Icon
          as={CgPlayListAdd}
          w={7}
          h={7}
          cursor="pointer"
          color="gray.200"
          _hover={{ color: 'white', transform: 'scale(1.1)', top: '30%' }}
          onClick={addTrackToPlaylistDisc.onOpen}
          position="absolute"
          right="10px"
          top="50%"
          transform="translateY(-50%)"
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
