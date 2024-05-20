/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { updateToken } from '../utils/SpotifyAuth';

const SpotifyPlayer = () => {
  const [player, setPlayer] = useState(null);
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
      const script = document.createElement('script');
      script.src = `https://sdk.scdn.co/spotify-player.js?v=${Date.now()}`; // Prevent caching
      script.async = true;

      script.onload = () => {
        window.onSpotifyWebPlaybackSDKReady = () => {
          const token = localStorage.getItem('access_token');
          const spotifyPlayer = new window.Spotify.Player({
            name: 'Web Playback SDK Player',
            getOAuthToken: (cb) => { cb(token); },
            volume: 0.5,
          });

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
      };

      document.head.appendChild(script);

      return () => {
        if (player) {
          player.disconnect();
        }
        document.head.removeChild(script);
      };
    } else {
      console.error('Failed to update token');
      return () => {};
    }
  }, [tokenUpdated, player]);

  return <div>Spotify Player</div>;
};

export default SpotifyPlayer;
