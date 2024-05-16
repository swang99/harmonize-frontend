// import axios from 'axios';

export default function createProfileSlice(set, get) {
  // const ROOT_URL = 'https://platform-api-b-sheldon.onrender.com/api';
  // const ROOT_URL = 'http://localhost:9090/api';
  // const ROOT_URL = 'https://platform.cs52.me/api';

  return {
    name: '',
    userID: '',
    posts: [],
    following: [],
    followers: [],
    topTracks: [],
    topArtists: [],
    playlists: [],
    loginTime: 0,
  };
}
