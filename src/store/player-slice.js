/* eslint-disable camelcase */
// store/spotifySlice.js
import { updateToken } from '../utils/SpotifyAuth';
import { playTrack, switchPlaybackDevice } from '../utils/spotify-api';

export default function createPlayerSlice(set, get) {
  return {
    player: null,
    deviceId: '',
    activated: false,
    paused: true,
    currentTrack: {
      name: '',
      album: {
        images: [{ url: '' }],
      },
    },

    initializePlayer: async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
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

          // Set the player in the store
          set((state) => ({
            playerSlice: { ...state.playerSlice, player: spotifyPlayer },
          }));

          spotifyPlayer.on('initialization_error', ({ message }) => {
            console.error('Failed to initialize', message);
          });

          // Ready
          spotifyPlayer.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            set((state) => ({
              playerSlice: { ...state.playerSlice, deviceId: device_id },
            }));
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
          spotifyPlayer.addListener('player_state_changed', (state) => {
            console.log(state);
            if (state) {
              set(({
                playerSlice: { ...state.playerSlice,
                  paused: state.paused,
                  currentTrack: state.track_window.current_track,
                  activated: true },
              }));
            }
          });

          spotifyPlayer.connect();
        };

        return () => {
          const state = get();
          if (state.player) {
            state.player.disconnect();
          }
          document.head.removeChild(script);
        };
      } else {
        console.error('No access token found');
        return () => {};
      }
    },

    playTrackInApp: async (trackId) => {
      const { player } = get().playerSlice;

      if (!player) {
        console.error('Player is not initialized');
        return;
      }

      try {
        // Switch playback device
        await switchPlaybackDevice(get().playerSlice.deviceId);

        // Activate player if not yet activated
        if (!get().playerSlice.activated) {
          await player.activateElement();
        }

        player.togglePlay();
        const id = await get().playerSlice.deviceId;
        await playTrack(id, trackId);
      } catch (error) {
        console.error('Error in playTrackInApp:', error);
      }
    },
  };
}
