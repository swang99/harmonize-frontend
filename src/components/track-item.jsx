import { Box, Button, HStack, Icon, Image, Text, VStack } from '@chakra-ui/react';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { CgPlayListAdd } from 'react-icons/cg';
import 'react-toastify/dist/ReactToastify.css';
import { playTrackInApp } from '../utils/spotify-player';

function TrackItem(props) {
  const { id, name, artist, imageURL } = props;
  const [isNameOverflowing, setIsNameOverflowing] = useState(false);
  const [isArtistOverflowing, setIsArtistOverflowing] = useState(false);
  const nameRef = useRef(null);
  const artistRef = useRef(null);

  useEffect(() => {
    const checkOverflow = (ref, setState) => {
      if (ref.current) {
        setState(ref.current.scrollWidth > ref.current.clientWidth);
      }
    };

    checkOverflow(nameRef, setIsNameOverflowing);
    checkOverflow(artistRef, setIsArtistOverflowing);
  }, [name, artist]);

  const handlePlay = async (event) => {
    event.stopPropagation();
    try {
      await playTrackInApp(id);
    } catch (error) {
      console.error('Failed to play track:', error);
    }
  };

  const openPlaylistModal = (event) => {
    event.stopPropagation();
    props.onPlaylistModalOpen(id);
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
      <Box h="100%" position="relative" rounded="none">
        <Image
          src={imageURL}
          alt={name}
          h="100%"
          w="100%"
          objectFit="cover"
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
          onClick={handlePlay}
        >
          <FontAwesomeIcon icon={faPlay} />
        </Button>
      </Box>
    );
  }

  return (
    <Box key={id} w="100%" bg="gray.800" borderRadius="md" overflow="hidden" position="relative">
      <style>{marqueeKeyframes}</style>
      <Image src={imageURL} alt={name} />
      <HStack p={3} position="relative">
        <VStack align="flex-start" mx={2} flex="1" spacing={1} pr="40px" maxW="100%">
          <Box overflow="hidden" w="100%" textAlign="left">
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
          <Box overflow="hidden" w="100%" textAlign="left">
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
          onClick={openPlaylistModal}
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
        onClick={handlePlay}
      >
        <FontAwesomeIcon icon={faPlay} />
      </Button>
    </Box>
  );
}

export default TrackItem;
