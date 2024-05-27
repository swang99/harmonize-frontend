import axios from 'axios';

const ROOT_URL = 'https://project-api-spotify-sharing.onrender.com/api/';

const createPostSlice = (set, get) => {
  return {
    all: [],
    createPost: async (userID, post) => {
      const existingProfile = get().profileSlice.currentProfile;
      if (existingProfile.userID !== userID) {
        console.error('Cannot create post for different user');
        return;
      }
      const updatedProfile = {
        ...existingProfile,
        posts: [post, ...existingProfile.posts],
      };
      console.log('These are posts: ', updatedProfile.posts);

      set((state) => ({
        profileSlice: { ...state.profileSlice, currentProfile: updatedProfile },
      }), false, 'users/createPost');
      await get().profileSlice.updateProfile(userID, updatedProfile);
    },

    updatePost: async (profile, post) => {
      try {
        const updatedPosts = profile.posts.map((p) => (p._id === post._id ? post : p));
        const updatedProfile = { ...profile, posts: updatedPosts };
        await axios.put(`${ROOT_URL}users/${profile.userID}`, updatedProfile);
        set((state) => ({
          profileSlice: { ...state.profileSlice, currentProfile: updatedProfile },
        }), false, 'users/updatePost');
      } catch (error) {
        console.error('Failed to update post:', error.message);
        get().errorSlice.newError(error.message);
      }
    },

    deletePost: async (userID, postID) => {
      const existingProfile = get().profileSlice.currentProfile;
      if (existingProfile.userID !== userID) {
        console.error('Cannot delete post for different user');
        return;
      }
      const updatedPosts = existingProfile.posts.filter((p) => p._id !== postID);
      const updatedProfile = { ...existingProfile, posts: updatedPosts };
      set((state) => ({
        profileSlice: { ...state.profileSlice, currentProfile: updatedProfile },
      }), false, 'users/deletePost');
      await get().profileSlice.updateProfile(userID, updatedProfile);
    },

    getPost: async (userID, postID) => {
      const profile = await get().profileSlice.fetchProfile(userID);
      return profile.posts.find((p) => p.id === postID);
    },
  };
};

export default createPostSlice;
