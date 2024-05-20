export default function createPostSlice(set, get) {
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
      set((state) => ({
        profileSlice: { ...state.profileSlice, currentProfile: updatedProfile },
      }), false, 'users/createPost');
      await get().profileSlice.updateProfile(userID, updatedProfile);
    },

    updatePost: async (userID, post) => {
      const existingProfile = get().profileSlice.currentProfile;
      if (existingProfile.userID !== userID) {
        console.error('Cannot update post for different user');
        return;
      }
      const updatedPosts = existingProfile.posts.map((p) => (p.id === post.id ? post : p));
      const updatedProfile = { ...existingProfile, posts: updatedPosts };
      set((state) => ({
        profileSlice: { ...state.profileSlice, currentProfile: updatedProfile },
      }), false, 'users/updatePost');
      await get().profileSlice.updateProfile(userID, updatedProfile);
    },

    deletePost: async (userID, postID) => {
      const existingProfile = get().profileSlice.currentProfile;
      if (existingProfile.userID !== userID) {
        console.error('Cannot delete post for different user');
        return;
      }
      const updatedPosts = existingProfile.posts.filter((p) => p.id !== postID);
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

    loadFeed: async (userID) => {
      const { following } = get().profileSlice.currentProfile;
      const followeeProfiles = await Promise.all(following.map((followeeID) => get().profileSlice.fetchOtherProfile(followeeID)));
      const posts = followeeProfiles.flatMap((followeeProfile) => followeeProfile.posts);
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      set((state) => ({ postSlice: { ...state.postSlice, all: posts } }), false, 'posts/loadFeed');
      return posts;
    },
  };
}
