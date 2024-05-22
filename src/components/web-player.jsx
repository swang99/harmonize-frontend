/* eslint-disable camelcase */
import { Box, Button, Text } from '@chakra-ui/react';
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
    <Box
      as="footer"
      position="fixed"
      bottom="0"
      width="100%"
      height="10vh"
      bg="gray.100"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="1000"
    >
      <Text textColor="black">Spotify Player</Text>
      {playerSlice && playerSlice.active && (
      <Button onClick={null} ml={4}>
        Play/Pause
      </Button>
      )}
    </Box>
    )
  );
};

export default SpotifyPlayer;
