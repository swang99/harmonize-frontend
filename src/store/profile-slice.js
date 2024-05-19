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
      posts: [],
      id: '',
    },

    fetchProfile: async (userID) => {
    // GET: get profile by userID
      try {
        const response = await axios.get(`${ROOT_URL}/users/${userID}`);
        set(({ profileSlice }) => { profileSlice.profile = response.data; }, false, 'users/fetchProfile');
      } catch (error) {
        get().errorSlice.newError(error.message);
      }
    },

    updateProfile: async (userID, profile) => {
    // PUT: update profile by id
      try {
        const response = await axios.put(`${ROOT_URL}/users/${userID}`, profile);
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

    deleteProfile: async (userID) => {
    // DELETE: takes id of the profile to delete
      try {
        await axios.delete(`${ROOT_URL}/users/${userID}`);
        set(({ profileSlice }) => { profileSlice.profile = null; }, false, 'users/deleteProfile');
      } catch (error) {
        get().errorSlice.newError(error.message);
      }
    },
    handleLogin: async (userID, profile, tracks, artists) => {
      try {
        // Try to fetch profile of user
        await get().profileSlice.fetchProfile(userID);
        const { existingProfile } = get().profileSlice;
        // If profile doesn't exist, create a new profile with basic info
        if (existingProfile.userID === '') {
          // If not, create a new profile:
          const newProfile = {
            userID,
            name: profile.display_name,
            email: profile.email,
            followers: [],
            following: [],
            highlights: [],
            topTracks: [tracks.items],
            topArtists: [artists.items],
            playlists: [],
            posts: [],
          };
          await get().profileSlice.createProfile(newProfile);
          await get().profileSlice.fetchProfile(userID);
        }
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
