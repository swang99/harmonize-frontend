import axios from 'axios';

const ROOT_URL = 'https://project-api-spotify-sharing.onrender.com/api/';
// const ROOT_URL = 'http://localhost:9090/api/';

async function updateHelper(userID, updatedProfile) {
  const response = await axios.put(`${ROOT_URL}users/${userID}`, updatedProfile);
  return response.data;
}

const createProfileSlice = (set, get) => ({
  initialFetch: false,
  currentProfile: null,

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
      set((state) => ({
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
      get().errorSlice.newError(error.message);
      return null;
    }
  },

  updateProfile: async (userID, profile) => {
    try {
      await updateHelper(userID, profile);
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
      const fetchProfileResponse = await axios.get(`${ROOT_URL}users/${profile.id}`);
      set((state) => ({
        profileSlice: { ...state.profileSlice, currentProfile: fetchProfileResponse.data },
      }), false, 'users/fetchProfileOnLogin');
      const existingProfile = await get().profileSlice.currentProfile;

      if (!existingProfile || existingProfile.userID !== profile.id) {
        const newProfile = {
          userID: profile.id,
          name: profile.display_name,
          email: profile.email,
          followers: [],
          following: [],
          photo: profile.images && profile.images.length > 1 ? profile.images[1].url : '',
          highlights: [],
          topTracks: tracks,
          topArtists: artists.items.map((item) => item.id),
          playlists: playlists.items,
          posts: [],
        };
        const response = await axios.post(`${ROOT_URL}/users`, newProfile);
        set((state) => ({
          profileSlice: { ...state.profileSlice, currentProfile: response.data },
        }), false, 'users/createProfileOnLogin');
      } else {
        const updatedProfile = {
          ...existingProfile,
          name: profile.display_name,
          photo: profile.images && profile.images.length > 1 ? profile.images[1].url : '',
          email: profile.email,
          topTracks: tracks.items,
          topArtists: artists.items.map((item) => item.id),
          playlists: playlists.items,
        };
        await updateHelper(profile.id, updatedProfile);
        set((state) => ({
          profileSlice: { ...state.profileSlice, currentProfile: updatedProfile },
        }), false, 'users/updateProfileOnLogin');
      }
    } catch (error) {
      console.error('Failed to handle login:', error.message);
    }
  },

  followProfile: async (followerProfile, followingProfile) => {
    try {
      if (!followerProfile.following.includes(followingProfile.userID)) {
        const updatedFollowerProfile = {
          ...followerProfile,
          following: [...followerProfile.following, followingProfile.userID],
        };
        const response = await updateHelper(followerProfile.userID, updatedFollowerProfile);
        set((state) => ({
          profileSlice: { ...state.profileSlice, currentProfile: response.data },
        }), false, 'users/updateFollowerProfile');
      }

      if (!followingProfile.followers.includes(followerProfile.userID)) {
        const updatedFollowingProfile = {
          ...followingProfile,
          followers: [...followingProfile.followers, followerProfile.userID],
        };
        const response = await updateHelper(followingProfile.userID, updatedFollowingProfile);
        set((state) => ({
          profileSlice: { ...state.profileSlice, currentProfile: response.data },
        }), false, 'users/updateFollowingProfile');
      }
    } catch (error) {
      console.error('Failed to follow profile:', error.message);
      get().errorSlice.newError(error.message);
    }
  },

  unfollowProfile: async (followerProfile, followingProfile) => {
    try {
      if (followerProfile.following.includes(followingProfile.userID)) {
        const updatedFollowerProfile = {
          ...followerProfile,
          following: followerProfile.following.filter((id) => id !== followingProfile.userID),
        };
        const response = await updateHelper(followerProfile.userID, updatedFollowerProfile);
        set((state) => ({
          profileSlice: { ...state.profileSlice, currentProfile: response.data },
        }), false, 'users/updateFollowerProfile');
      }

      if (followingProfile.followers.includes(followerProfile.userID)) {
        const updatedFollowingProfile = {
          ...followingProfile,
          followers: followingProfile.followers.filter((id) => id !== followerProfile.userID),
        };
        const response = await updateHelper(followingProfile.userID, updatedFollowingProfile);
        set((state) => ({
          profileSlice: { ...state.profileSlice, currentProfile: response.data },
        }), false, 'users/updateFollowingProfile');
      }
    } catch (error) {
      console.error('Failed to unfollow profile:', error.message);
      get().errorSlice.newError(error.message);
    }
  },

  filterProfiles: async (filter) => {
    try {
      const response = await axios.get(`${ROOT_URL}users?filter=${filter}`);
      return response.data;
    } catch (error) {
      console.error('Failed to filter profiles:', error.message);
      get().errorSlice.newError(error.message);
      return [];
    }
  },

  filterFollowing: async (userID) => {
    try {
      const response = await axios.get(`${ROOT_URL}users`);
      const users = response.data;
      const following = users.filter((user) => user.followers.includes(userID));
      return following;
    } catch (error) {
      console.error('Failed to filter profiles:', error.message);
      get().errorSlice.newError(error.message);
      return [];
    }
  },

  filterFollowers: async (userID) => {
    try {
      const response = await axios.get(`${ROOT_URL}users`);
      const users = response.data;
      const followers = users.filter((user) => user.following.includes(userID));
      return followers;
    } catch (error) {
      console.error('Failed to filter profiles:', error.message);
      get().errorSlice.newError(error.message);
      return [];
    }
  },

  loadFeed: async (userID) => {
    try {
      const response = await axios.get(`${ROOT_URL}users/${userID}/feed`);
      return response.data;
    } catch (error) {
      console.error('Failed to load feed:', error.message);
      return [];
    }
  },

  getLikedPosts: async (userID) => {
    try {
      const response = await axios.get(`${ROOT_URL}users/${userID}/liked`);
      return response.data;
    } catch (error) {
      console.error('Failed to get liked posts:', error.message);
      return [];
    }
  },
});

export default createProfileSlice;
