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

  handleLogin: async (profile, tracks, artists, playlists) => {
    try {
      await get().profileSlice.fetchProfile(profile.id);
      const existingProfile = get().profileSlice.currentProfile;

      if (!existingProfile || existingProfile.userID !== profile.id) {
        console.log('Creating new profile during login');
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
        console.log('Updating existing profile during login');
        console.log('Existing profile:', existingProfile);
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
