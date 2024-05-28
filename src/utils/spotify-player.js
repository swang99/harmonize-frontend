/* eslint-disable camelcase */
import { toast } from 'react-toastify';
import { updateToken } from './SpotifyAuth';
import { getCurrentDevice, playTrack, switchPlaybackDevice } from './spotify-api';
import useStore from '../store';

const initializePlayer = async () => {
  // Disconnect player if already initialized
  if (window.player) {
    window.player.disconnect();
  }

  // initialize the new player
  const script = document.createElement('script');
  script.src = `https://sdk.scdn.co/spotify-player.js?v=${Date.now()}`; // Prevent caching
  script.async = true;
  document.head.appendChild(script);

  window.onSpotifyWebPlaybackSDKReady = () => {
    const spotifyPlayer = new window.Spotify.Player({
      name: 'Harmonize',
      getOAuthToken: async (cb) => {
        const updatedToken = await updateToken();
        cb(updatedToken);
      },
      volume: 0.5,
    });

    window.player = spotifyPlayer;

    spotifyPlayer.on('initialization_error', ({ message }) => {
      console.error('Failed to initialize', message);
    });

    // Ready
    spotifyPlayer.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      useStore.setState((state) => ({ playerSlice: { ...state.playerSlice, deviceId: device_id } }), false, 'updateDeviceID'); // set deviceID in zustand
    });

    // Not Ready
    spotifyPlayer.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    spotifyPlayer.addListener('autoplay_failed', () => {
      console.log('Autoplay is not allowed by the browser autoplay rules');
    });

    // Error handling
    spotifyPlayer.addListener('initialization_error', ({ message }) => { toast.error(message); });
    spotifyPlayer.addListener('authentication_error', ({ message }) => { toast.error(message); });
    spotifyPlayer.addListener('account_error', ({ message }) => { toast.error(message); });
    spotifyPlayer.addListener('playback_error', ({ message }) => { toast.error(message); });

    // Add player_state_changed listener
    spotifyPlayer.addListener('player_state_changed', (playerState) => {
      if (playerState) {
        useStore.getState().playerSlice.updatePlayerState(playerState);
      }
    });

    spotifyPlayer.connect();
  };

  return () => {
    if (window.player) {
      window.player.disconnect();
    }
    document.head.removeChild(script);
  };
};

const playTrackInApp = async (trackId) => {
  const { player } = window;

  if (!player) {
    console.error('Player is not initialized');
    return;
  }

  try {
    // Switch playback device
    if (!useStore.getState().playerSlice.deviceId) {
      toast.error('Player loading- wait a moment and try again');
      return;
    }

    const device = await getCurrentDevice();
    console.log('Current device:', device);
    if (getCurrentDevice().device_id !== useStore.getState().playerSlice.deviceId) {
      await switchPlaybackDevice(useStore.getState().playerSlice.deviceId);
    }

    // Activate player if not yet activated
    if (!useStore.getState().playerSlice.activated) {
      await player.activateElement();
    }

    player.togglePlay();
    const id = await useStore.getState().playerSlice.deviceId;
    await playTrack(id, trackId);
  } catch (error) {
    toast.error('Error playing track-- Try again.', error);
  }
};

export { initializePlayer, playTrackInApp };
