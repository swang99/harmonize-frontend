/* eslint-disable camelcase */
import { updateToken } from './SpotifyAuth';
import { playTrack, switchPlaybackDevice } from './spotify-api';
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
      useStore.setState((state) => ({ playerSlice: { ...state.playerSlice, deviceId: device_id } })); // set deviceID in zustand
    });

    // Not Ready
    spotifyPlayer.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    spotifyPlayer.addListener('autoplay_failed', () => {
      console.log('Autoplay is not allowed by the browser autoplay rules');
    });

    // Error handling
    spotifyPlayer.addListener('initialization_error', ({ message }) => { console.error(message); });
    spotifyPlayer.addListener('authentication_error', ({ message }) => { console.error(message); });
    spotifyPlayer.addListener('account_error', ({ message }) => { console.error(message); });
    spotifyPlayer.addListener('playback_error', ({ message }) => { console.error(message); });

    // Add player_state_changed listener
    spotifyPlayer.addListener('player_state_changed', (playerState) => {
      console.log('State', playerState);
      if (playerState) {
        useStore.setState((state) => ({
          playerSlice: { ...state.playerSlice,
            paused: playerState.paused,
            currentTrack: playerState.track_window.current_track,
            activated: true },
        }));
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
      console.error('Device ID is not set');
      return;
    }
    await switchPlaybackDevice(useStore.getState().playerSlice.deviceId);

    // Activate player if not yet activated
    if (!useStore.getState().playerSlice.activated) {
      await player.activateElement();
    }

    player.togglePlay();
    const id = await useStore.getState().playerSlice.deviceId;
    await playTrack(id, trackId);
  } catch (error) {
    console.error('Error in playTrackInApp:', error);
  }
};

export { initializePlayer, playTrackInApp };
