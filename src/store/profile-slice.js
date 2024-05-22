import axios from 'axios';

const ROOT_URL = 'https://project-api-spotify-sharing.onrender.com/api/';
// const ROOT_URL = 'http://localhost:9090/api/';

const createProfileSlice = (set, get) => ({
  currentProfile: null, // Initialize to null to indicate no profile is loaded yet

  fetchAllProfiles: async () => {
    try {
      console.log('Fetching all profiles');
      const response = await axios.get(`${ROOT_URL}users`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profiles:', error.message);
      get().errorSlice.newError(error.message);
      return [];
    }
  },

  fetchProfile: async (userID) => {
    try {
      const response = await axios.get(`${ROOT_URL}users/${userID}`);
      await set((state) => ({
        profileSlice: { ...state.profileSlice, currentProfile: response.data },
      }), false, 'users/fetchProfile');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile:', error.message);
      get().errorSlice.newError(error.message);
      return null;
    }
  },

  fetchOtherProfile: async (userID) => {
    try {
      const response = await axios.get(`${ROOT_URL}users/${userID}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile:', error.message);
      return get().errorSlice.newError(error.message);
    }
  },

  updateProfile: async (userID, profile) => {
    try {
      const response = await axios.put(`${ROOT_URL}users/${userID}`, profile);
      set((state) => ({
        profileSlice: { ...state.profileSlice, currentProfile: response.data },
      }), false, 'users/updateProfile');
    } catch (error) {
      console.error('Failed to update profile:', error.message);
      get().errorSlice.newError(error.message);
    }
  },

  createProfile: async (profile) => {
    try {
      const response = await axios.post(`${ROOT_URL}/users`, profile);
      set((state) => ({
        profileSlice: { ...state.profileSlice, currentProfile: response.data },
      }), false, 'users/createProfile');
    } catch (error) {
      console.error('Failed to create profile:', error.message);
      get().errorSlice.newError(error.message);
    }
  },

  deleteProfile: async (userID) => {
    try {
      await axios.delete(`${ROOT_URL}users/${userID}`);
      set((state) => ({
        profileSlice: { ...state.profileSlice, currentProfile: null },
      }), false, 'users/deleteProfile');
    } catch (error) {
      console.error('Failed to delete profile:', error.message);
      get().errorSlice.newError(error.message);
    }
  },

  handleLogin: async (profile, tracks, artists, playlists) => {
    try {
      await get().profileSlice.fetchProfile(profile.id);
      const existingProfile = get().profileSlice.currentProfile;

      if (!existingProfile || existingProfile.userID !== profile.id) {
        const newProfile = {
          userID: profile.id,
          name: profile.display_name,
          email: profile.email,
          followers: [],
          following: [],
          photo: profile.images && profile.images.length > 1 ? profile.images[1].url : '',
          highlights: [],
          topTracks: tracks.items.map((item) => item.id),
          topArtists: artists.items.map((item) => item.id),
          playlists: playlists.items.map((item) => item.id),
          posts: [],
        };
        await get().profileSlice.createProfile(newProfile);
      } else {
        const updatedProfile = {
          ...existingProfile,
          name: profile.display_name,
          photo: profile.images && profile.images.length > 1 ? profile.images[1].url : '',
          email: profile.email,
          topTracks: tracks.items.map((item) => item.id),
          topArtists: artists.items.map((item) => item.id),
          playlists: playlists.items.map((item) => item.id),
        };
        await get().profileSlice.updateProfile(profile.id, updatedProfile);
      }

      await get().profileSlice.fetchProfile(profile.id);
    } catch (error) {
      console.error('Failed to handle login:', error.message);
      get().errorSlice.newError(error.message);
    }
  },
});

export default createProfileSlice;
