/* eslint-disable react/jsx-no-bind */
import { Box, Button, VStack, HStack, Image, Text } from '@chakra-ui/react';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { playTrackInApp } from '../utils/spotify-player';

/**
 * Renders a track item component.
 *
 * @param {Object} props - The component props.
 * @param {string} props.id - The ID of the track.
 * @param {string} props.name - The name of the track.
 * @param {string} props.artist - The artist of the track.
 * @param {string} props.imageURL - The URL of the track's image.
 * @returns {JSX.Element} The rendered track item component.
 */
function TrackItem(props) {
  const { id, name, artist, imageURL } = props;

  const handlePlay = async () => {
    try {
      console.log('Function called:', playTrackInApp);
      await playTrackInApp(id);
    } catch (error) {
      console.error('Failed to play track:', error);
    }
  };
  if (props.use === 'feed') {
    return (
      <Box key={id} borderRadius="md" minW={250}>
        <VStack display="flex" justifyContent="space-between">
          <Box alignSelf="flex-start" bg="gray.800" w="100%" rounded="md" p="3">
            <Text fontSize="2xl" fontWeight="bold" color="white" isTruncated>{name}</Text>
            <Text fontSize="xl" as="i" color="gray.400" isTruncated>{artist}</Text>
          </Box>
          <Box position="relative">
            <Image src={imageURL} alt={name} h={250} w={250} flex="0 0 auto" />
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
          </Box>
        </VStack>
      </Box>
    );
  }

  return (
    <Box key={id} bg="gray.800" borderRadius="md">
      <HStack>
        <Box position="relative">
          <Image src={imageURL} alt={name} h={300} flex="0 0 auto" />
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
        </Box>
        <Box p={3} flex="1">
          <Text fontSize="lg" fontWeight="bold" color="white" isTruncated>{name}</Text>
          <Text fontSize="md" color="gray.400" isTruncated>{artist}</Text>
        </Box>
      </HStack>
    </Box>
  );
}

export default TrackItem;
