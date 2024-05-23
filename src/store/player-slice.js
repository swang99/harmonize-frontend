/* eslint-disable camelcase */
// store/spotifySlice.js

export default function createPlayerSlice(set, get) {
  return {
    deviceId: '',
    activated: false,
    paused: true,
    currentTrack: null,
  };
}
