/* eslint-disable camelcase */
// store/spotifySlice.js
import { updateToken } from '../utils/SpotifyAuth';

export default function createSpotifySlice(set, get) {
  return {
    token: null,
    player: null,
    activated: false,

    getToken: () => get().token,

    setToken: async () => {
      console.log('Setting token');
      try {
        const newToken = await updateToken();
        if (newToken && newToken !== get().token) {
          set((state) => ({ spotifySlice: { ...state.spotifySlice, token: newToken } }));
        } else {
          console.log('Token already set');
        }
      } catch (error) {
        console.error('Failed to update token:', error);
      }
    },

    initializePlayer: () => {
      const { token, setPlayer, refreshToken } = get();
      if (token) {
        const script = document.createElement('script');
        script.src = `https://sdk.scdn.co/spotify-player.js?v=${Date.now()}`; // Prevent caching
        script.async = true;
        document.head.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
          const spotifyPlayer = new window.Spotify.Player({
            name: 'Harmonize Web Player',
            getOAuthToken: (cb) => { refreshToken(cb); },
            volume: 0.5,
          });

          // set the player in the storke
          set({ player: spotifyPlayer });

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
          const state = get();
          if (state.player) {
            state.player.disconnect();
          }
          document.head.removeChild(script);
        };
      } else {
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
