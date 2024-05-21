/* eslint-disable camelcase */
// store/spotifySlice.js
import { updateToken } from '../utils/SpotifyAuth';

export default function createPlayerSlice(set, get) {
  return {
    player: null,
    activated: false,

    initializePlayer: () => {
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
          set({ player: spotifyPlayer });

          spotifyPlayer.on('initialization_error', ({ message }) => {
            console.error('Failed to initialize', message);
          });

          // Ready
          spotifyPlayer.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            set((state) => ({ ...state, player: spotifyPlayer }));
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

    playSong: (uri) => {
      const state = get();
      if (state.player && uri) {
        state.player._options.getOAuthToken((accessToken) => {
          fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            body: JSON.stringify({ uris: [uri] }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });
        });
      }
    },
  };
}
