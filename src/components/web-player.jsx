/* eslint-disable camelcase */
import { Box, Button, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { updateToken } from '../utils/SpotifyAuth';

const SpotifyPlayer = () => {
  const [player, setPlayer] = useState(null);
  const [tokenUpdated, setTokenUpdated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return;
    }
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
      const script = document.createElement('script');
      script.src = `https://sdk.scdn.co/spotify-player.js?v=${Date.now()}`; // Prevent caching
      script.async = true;
      document.head.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const token = localStorage.getItem('access_token');
        const spotifyPlayer = new window.Spotify.Player({
          name: 'Harmonize Web Player',
          getOAuthToken: (cb) => { cb(token); },
          volume: 0.5,
        });

        setPlayer(spotifyPlayer);

        spotifyPlayer.on('initialization_error', ({ message }) => {
          console.error('Failed to initialize', message);
        });

        // Ready
        spotifyPlayer.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setPlayer(spotifyPlayer);
        });

        // Not Ready
        spotifyPlayer.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
        });

        // Error handling
        spotifyPlayer.addListener('initialization_error', ({ message }) => { console.error(message); });
        spotifyPlayer.addListener('authentication_error', ({ message }) => { console.error(message); });
        spotifyPlayer.addListener('account_error', ({ message }) => { console.error(message); });
        spotifyPlayer.addListener('playback_error', ({ message }) => { console.error(message); });

        spotifyPlayer.connect();
      };

      return () => {
        if (player) {
          player.disconnect();
        }
        document.head.removeChild(script);
      };
    } else {
      return () => {};
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
      bg="gray.800"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="1000"
    >
      <Text>Spotify Player</Text>
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
