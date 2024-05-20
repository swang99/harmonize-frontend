import axios from 'axios';

const createProfileSlice = (set, get) => ({
  currentProfile: null, // Initialize to null to indicate no profile is loaded yet

  fetchProfile: async (userID) => {
    try {
      console.log(`Fetching profile for userID: ${userID}`);
      const response = await axios.get(`https://harmonize-api-r808.onrender.com/api/users/${userID}`);
      set((state) => ({
        profileSlice: { ...state.profileSlice, currentProfile: response.data },
      }), false, 'users/fetchProfile');
      console.log('Profile fetched successfully:', response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error.message);
      get().errorSlice.newError(error.message);
    }
  },

  updateProfile: async (userID, profile) => {
    try {
      console.log(`Updating profile for userID: ${userID}`);
      const response = await axios.put(`https://harmonize-api-r808.onrender.com/api/users/${userID}`, profile);
      set((state) => ({
        profileSlice: { ...state.profileSlice, currentProfile: response.data },
      }), false, 'users/updateProfile');
      console.log('Profile updated successfully:', response.data);
    } catch (error) {
      console.error('Failed to update profile:', error.message);
      get().errorSlice.newError(error.message);
    }
  },

  createProfile: async (profile) => {
    try {
      console.log('Creating new profile:', profile);
      const response = await axios.post('https://harmonize-api-r808.onrender.com/api/users', profile);
      set((state) => ({
        profileSlice: { ...state.profileSlice, currentProfile: response.data },
      }), false, 'users/createProfile');
      console.log('Profile created successfully:', response.data);
    } catch (error) {
      console.error('Failed to create profile:', error.message);
      get().errorSlice.newError(error.message);
    }
  },

  deleteProfile: async (userID) => {
    try {
      console.log(`Deleting profile for userID: ${userID}`);
      await axios.delete(`https://harmonize-api-r808.onrender.com/api/users/${userID}`);
      set((state) => ({
        profileSlice: { ...state.profileSlice, currentProfile: null },
      }), false, 'users/deleteProfile');
      console.log('Profile deleted successfully');
    } catch (error) {
      console.error('Failed to delete profile:', error.message);
      get().errorSlice.newError(error.message);
    }
  },

  handleLogin: async (userID, profile, tracks, artists, playlists) => {
    try {
      await get().profileSlice.fetchProfile(userID);
      const existingProfile = get().profileSlice.currentProfile;

      if (!existingProfile || existingProfile.userID !== userID) {
        console.log('Creating new profile during login');
        const newProfile = {
          userID,
          name: profile.display_name,
          email: profile.email,
          followers: [],
          following: [],
          highlights: [],
          topTracks: tracks.items.map((item) => item.id),
          topArtists: artists.items.map((item) => item.id),
          playlists: playlists.items.map((item) => item.id),
          posts: [],
        };
        await get().profileSlice.createProfile(newProfile);
      } else {
        console.log('Updating existing profile during login');
        const updatedProfile = {
          ...existingProfile,
          topTracks: tracks.items.map((item) => item.id),
          topArtists: artists.items.map((item) => item.id),
          playlists: playlists.items.map((item) => item.id),
        };
        await get().profileSlice.updateProfile(userID, updatedProfile);
      }

      await get().profileSlice.fetchProfile(userID);
    } catch (error) {
      console.error('Failed to handle login:', error.message);
      get().errorSlice.newError(error.message);
    }
  },
});

export default createProfileSlice;
