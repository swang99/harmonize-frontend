/* eslint-disable camelcase */
import { Box, Button, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useStore from '../store';
import { updateToken } from '../utils/SpotifyAuth';

const SpotifyPlayer = () => {
  const playerSlice = useStore((store) => store.playerSlice);
  const initializePlayer = useStore((store) => store.playerSlice.initializePlayer);
  const [tokenUpdated, setTokenUpdated] = useState(false);
  const play = useStore((store) => store.playerSlice.playTrackInApp);
  const paused = useStore((store) => store.playerSlice.paused);

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
    const initialize = async () => {
      if (tokenUpdated) {
        await initializePlayer();
      }
    };
    initialize();
  }, [tokenUpdated]);

  return (
    !paused && (
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
      {playerSlice && (
      <Button onClick={() => play('7tWsRN4De6t361FzF74Mtc')} ml={4}>
        Play/Pause
      </Button>
      )}
    </Box>
    )
  );
};

export default SpotifyPlayer;
