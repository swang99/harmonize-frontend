/* eslint-disable react/jsx-no-bind */
import { Box, Button, HStack, Image, Text } from '@chakra-ui/react';
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

  return (
    <Box key={id} bg="gray.800" borderRadius="md">
      <HStack>
        <Image src={imageURL} alt={name} h={300} flex="0 0 auto" position="relative">
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
        </Image>
        <Box p={3} flex="1">
          <Text fontSize="lg" fontWeight="bold" color="white" isTruncated>{name}</Text>
          <Text fontSize="md" color="gray.400" isTruncated>{artist}</Text>
        </Box>
      </HStack>
    </Box>
  );
}

export default TrackItem;
