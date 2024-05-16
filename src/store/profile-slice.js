import axios from 'axios';

export default function createProfileSlice(set, get) {
  // const ROOT_URL = 'http://localhost:9090/api';
  const ROOT_URL = 'https://harmonize-api-r808.onrender.com/api';

  return {
    profile: {
      userID: '',
      name: '',
      email: '',
      followers: [],
      following: [],
      highlights: [],
      topTracks: [],
      topArtists: [],
      playlists: [],
    },

    fetchProfile: async (id) => {
    // GET: get profile by id
      try {
        const response = await axios.get(`${ROOT_URL}/users/${id}`);
        set(({ profileSlice }) => { profileSlice.profile = response.data; }, false, 'users/fetchProfile');
      } catch (error) {
        get().errorSlice.newError(error.message);
      }
    },

    updateProfile: async (id, profile) => {
    // PUT: update profile by id
      try {
        const response = await axios.put(`${ROOT_URL}/users/${id}`, profile);
        set(({ profileSlice }) => { profileSlice.profile = response.data; }, false, 'users/updateProfile');
      } catch (error) {
        get().errorSlice.newError(error.message);
      }
    },

    createProfile: async (profile) => {
    // POST: takes in new profile data (no id)
      try {
        const response = await axios.post(`${ROOT_URL}/users`, profile);
        set(({ profileSlice }) => { profileSlice.profile = response.data; }, false, 'users/createProfile');
      } catch (error) {
        get().errorSlice.newError(error.message);
      }
    },

    deleteProfile: async (id) => {
    // DELETE: takes id of the profile to delete
      try {
        await axios.delete(`${ROOT_URL}/users/${id}`);
        set(({ profileSlice }) => { profileSlice.profile = null; }, false, 'users/deleteProfile');
      } catch (error) {
        get().errorSlice.newError(error.message);
      }
    },
  };
  /* return {
    name: '',
    userID: '',
    posts: [],
    following: [],
    followers: [],
    topTracks: [],
    topArtists: [],
    playlists: [],
    loginTime: 0,
  }; */
}
