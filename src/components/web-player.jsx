/* eslint-disable camelcase */
import { Button, HStack, Image, Spacer, Text, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import useStore from '../store';
import { initializePlayer } from '../utils/spotify-player';

const SpotifyPlayer = () => {
  const playerSlice = useStore((store) => store.playerSlice);
  const { currentTrack } = playerSlice;
  const player = window.player || null;

  useEffect(() => {
    const initialize = async () => {
      await initializePlayer();
    };
    initialize();
  }, []);

  useEffect(() => {
    console.log('Player slice:', playerSlice);
  }, [playerSlice]);

  useEffect(() => {
    console.log('Player:', player);
  }, [player]);

  return (
    playerSlice && (
    <HStack
      as="footer"
      position="fixed"
      bottom="0"
      width="100%"
      height="10vh"
      bg="gray.100"
      color="white"
      justifyContent="left"
      zIndex="1000"
      padding={5}
    >
      <Image src={currentTrack && currentTrack.album.images[0].url} alt="Album cover" boxSize="50px" />
      <VStack align="left" ml={5}>
        <Text textColor="black" fontWeight="bold">{currentTrack && playerSlice.currentTrack.name}</Text>
        <Text textColor="gray.500">{currentTrack && playerSlice.currentTrack.artists[0].name}</Text>
      </VStack>
      <Spacer />
        {playerSlice && playerSlice.activated && (
        <Button onClick={null} ml={4}>
          Play/Pause
        </Button>
        )}
    </HStack>
    )
  );
};

export default SpotifyPlayer;
