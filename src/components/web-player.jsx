/* eslint-disable camelcase */
import { Button, Flex, HStack, Image, Progress, Spacer, Text, VStack } from '@chakra-ui/react';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import useStore from '../store';
import { initializePlayer } from '../utils/spotify-player';

const SpotifyPlayer = () => {
  const { position, duration, paused, currentTrack, incrementPosition } = useStore((state) => state.playerSlice);
  const player = window.player || null;
  const location = useLocation();
  const [progress, setProgress] = useState(0);

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
  }, [location.pathname]);

  useEffect(() => {
    setProgress((position / duration) * 100);
  }, [position, duration]);

  useEffect(() => {
    let interval;
    if (!paused) {
      interval = setInterval(() => {
        incrementPosition();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [paused, incrementPosition]);

  const handlePlayPause = async () => {
    if (player) {
      player.togglePlay();
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    (player && currentTrack) && (
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
        <Flex position="absolute" left="0" height="100%" alignItems="center" pl={5}>
          <Image src={currentTrack.album.images[0].url} alt="Album cover" boxSize="50px" />
          <VStack align="left" ml={3} spacing={0}>
            <Text textColor="black" fontWeight="bold">{currentTrack.name}</Text>
            <Text textColor="gray.500">{currentTrack.artists[0].name}</Text>
          </VStack>
        </Flex>

        {/* Centered Play/Pause Button */}
        <Spacer />
        <VStack spacing={0}>
          <Button
            onClick={handlePlayPause}
            borderRadius="full"
            bg="gray.200"
            mx="auto"
            w="50px"
            h="50px"
          >
            <FontAwesomeIcon icon={paused ? faPlay : faPause} />
          </Button>
          <HStack spacing={5} justify="center" align="center">
            <Text fontWeight="bold" color="gray.400">{formatTime(position)}</Text>
            <Progress bg="gray.200" value={progress} colorScheme="teal" w="40vw" borderRadius="full" />
            <Text size="sm" fontWeight="bold" color="gray.400">{formatTime(duration)}</Text>
          </HStack>
        </VStack>
        <Spacer />
      </HStack>
    )
  );
};

export default SpotifyPlayer;
