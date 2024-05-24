/* eslint-disable camelcase */
// store/spotifySlice.js

export default function createPlayerSlice(set, get) {
  return {
    deviceId: '',
    activated: false,
    paused: true,
    currentTrack: null,
    position: null,
    duration: null,

    incrementPosition: () => {
      set((state) => {
        const newPosition = state.playerSlice.position + 1000; // Increment position by 1000ms
        if (newPosition > state.playerSlice.duration) {
          return { playerSlice: { ...state.playerSlice, position: state.playerSlice.duration } };
        }
        return { playerSlice: { ...state.playerSlice, position: newPosition } };
      });
    },

    updatePlayerState: (playerState) => {
      set((state) => ({
        playerSlice: {
          ...state.playerSlice,
          paused: playerState.paused,
          currentTrack: playerState.track_window.current_track,
          position: playerState.position,
          duration: playerState.duration,
          activated: true,
        },
      }));
    },
  };
}
