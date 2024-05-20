import axios from 'axios';

export default function createProfileSlice(set, get) {
  const ROOT_URL = 'https://harmonize-api-r808.onrender.com/api';

  return {
    currentProfile: {
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

    // currentProfile: null, // Initialize currentProfile to hold fetched profile data

    fetchProfile: async (userID) => {
      // GET: get profile by userID
      try {
        const response = await axios.get(`${ROOT_URL}/users/${userID}`);
        set((state) => {
          state.profileSlice.currentProfile = response.data; // Update currentProfile with fetched data
        }, false, 'users/fetchProfile');
      } catch (error) {
        get().errorSlice.newError(error.message);
      }
    },

    updateProfile: async (userID, profile) => {
      // PUT: update profile by id
      try {
        const response = await axios.put(`${ROOT_URL}/users/${userID}`, profile);
        set((state) => {
          state.profileSlice.currentProfile = response.data; // Update currentProfile with updated data
        }, false, 'users/updateProfile');
      } catch (error) {
        get().errorSlice.newError(error.message);
      }
    },

    createProfile: async (profile) => {
      // POST: takes in new profile data (no id)
      try {
        const response = await axios.post(`${ROOT_URL}/users`, profile);
        set((state) => {
          state.profileSlice.currentProfile = response.data; // Set currentProfile with newly created profile data
        }, false, 'users/createProfile');
      } catch (error) {
        get().errorSlice.newError(error.message);
      }
    },

    deleteProfile: async (userID) => {
      // DELETE: takes id of the profile to delete
      try {
        await axios.delete(`${ROOT_URL}/users/${userID}`);
        set((state) => {
          state.profileSlice.currentProfile = null; // Clear currentProfile
        }, false, 'users/deleteProfile');
      } catch (error) {
        get().errorSlice.newError(error.message);
      }
    },

    handleLogin: async (userID, profile, tracks, artists, playlists) => {
      try {
        // Try to fetch profile of user
        await get().profileSlice.fetchProfile(userID);
        const existingProfile = get().profileSlice.currentProfile;

        // Log the existing profile and userID for debugging
        console.log('Existing Profile: ', existingProfile, 'UserID: ', userID);

        // If profile doesn't exist, create a new profile with basic info
        if (!existingProfile || existingProfile.userID !== userID) {
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
          // If profile exists, update it with new data
          const updatedProfile = {
            ...existingProfile,
            topTracks: tracks.items.map((item) => item.id),
            topArtists: artists.items.map((item) => item.id),
            playlists: playlists.items.map((item) => item.id),
          };
          await get().profileSlice.updateProfile(userID, updatedProfile);
        }

        // Fetch the updated profile to ensure the state is in sync
        await get().profileSlice.fetchProfile(userID);
      } catch (error) {
        get().errorSlice.newError(error.message);
      }
    },
  };
}
