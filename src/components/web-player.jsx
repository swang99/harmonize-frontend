/* eslint-disable camelcase */
import { Button, HStack, Image, Spacer, Text } from '@chakra-ui/react';
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
    >
      <Image src={playerSlice.currentTrac && playerSlice.currentTrack.album.images[0].url} alt="Album cover" boxSize="50px" />
      <Text textColor="black">Spotify Player</Text>
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
