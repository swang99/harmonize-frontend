/* eslint-disable camelcase */
import { Button, HStack, Image, Spacer, Text, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import useStore from '../store';

const SpotifyPlayer = () => {
  const playerSlice = useStore((store) => store.playerSlice);
  const initializePlayer = useStore((store) => store.playerSlice.initializePlayer);

  useEffect(() => {
    const initialize = async () => {
      await initializePlayer();
    };
    initialize();
  }, []);

  useEffect(() => {
    console.log('Player slice:', playerSlice);
  }, [playerSlice]);

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
      <Image src={playerSlice.currentTrack && playerSlice.currentTrack.album.images[0].url} alt="Album cover" boxSize="50px" />
      <VStack align="left" ml={5}>
        <Text textColor="black" fontWeight="bold">{playerSlice.currentTrack.name && playerSlice.currentTrack.name}</Text>
        <Text textColor="gray.500">{playerSlice.currentTrack.artists && playerSlice.currentTrack.artists[0].name}</Text>
      </VStack>
      <Spacer />
        {playerSlice && playerSlice.active && (
        <Button onClick={null} ml={4}>
          Play/Pause
        </Button>
        )}
    </HStack>
    )
  );
};

export default SpotifyPlayer;
