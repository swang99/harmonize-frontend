/* eslint-disable camelcase */
import { Button, Flex, HStack, Image, Spacer, Text, VStack } from '@chakra-ui/react';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import useStore from '../store';
import { initializePlayer } from '../utils/spotify-player';

const SpotifyPlayer = () => {
  const playerSlice = useStore((store) => store.playerSlice);
  const { currentTrack } = playerSlice;
  const player = window.player || null;
  const location = useLocation();

  useEffect(() => {
    const initialize = async () => {
      if (location.pathname !== '/') {
        await initializePlayer();
      }
    };
    initialize();

    // Cleanup function to disconnect the player when the component unmounts
    return () => {
      if (player) {
        player.disconnect();
        console.log('Spotify Web Playback SDK disconnected');
      }
    };
  }, []);

  const handlePlayPause = async () => {
    player.togglePlay();
  };

  return (
    player && (
    <HStack
      as="footer"
      position="fixed"
      bottom="0"
      width="100%"
      height={90}
      bg="gray.100"
      color="white"
      justifyContent="center"
      zIndex="1000"
      padding={5}
    >
      {/* Image and Text Container */}
      {playerSlice && playerSlice.activated ? (
        <Flex position="absolute" left="0" height="100%" alignItems="center" pl={5}>
          <Image src={currentTrack && currentTrack.album.images[0].url} alt="Album cover" boxSize="50px" />
          <VStack align="left" ml={3} spacing={0}>
            <Text textColor="black" fontWeight="bold">{currentTrack && playerSlice.currentTrack.name}</Text>
            <Text textColor="gray.500">{currentTrack && playerSlice.currentTrack.artists[0].name}</Text>
          </VStack>
        </Flex>
      ) : null}

      {/* Centered Play/Pause Button */}
      <Spacer />
      {playerSlice && playerSlice.activated ? (
        <Button
          onClick={handlePlayPause}
          borderRadius="full"
          bg="gray.200"
          mx="auto"
          w="50px"
          h="50px"
        >
          <FontAwesomeIcon icon={playerSlice.paused ? faPlay : faPause} />
        </Button>
      ) : (
        <Button>
          Choose a song to play!
        </Button>
      )}
      <Spacer />
    </HStack>
    )
  );
};

export default SpotifyPlayer;
