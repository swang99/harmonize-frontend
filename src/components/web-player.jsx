/* eslint-disable camelcase */
import { Box, Button, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { updateToken } from '../utils/SpotifyAuth';
import useStore from '../store';

const SpotifyPlayer = () => {
  const player = useStore((store) => store.playerSlice.player);
  const initializePlayer = useStore((store) => store.playerSlice.initializePlayer);
  const [tokenUpdated, setTokenUpdated] = useState(false);

  useEffect(() => {
    const update = async () => {
      try {
        await updateToken();
        setTokenUpdated(true);
      } catch (error) {
        console.error('Failed to update token:', error);
      }
    };
    update();
  }, []);

  useEffect(() => {
    if (tokenUpdated) {
      initializePlayer();
    }
  }, [tokenUpdated]);

  return (
    tokenUpdated && (
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
      {player && (
      <Button onClick={() => player.togglePlay()} ml={4}>
        Play/Pause
      </Button>
      )}
    </Box>
    )
  );
};

export default SpotifyPlayer;
