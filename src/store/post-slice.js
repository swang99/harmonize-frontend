import axios from 'axios';

export default function createPostSlice(set, get) {
  // const ROOT_URL = 'https://platform-api-b-sheldon.onrender.com/api';
  const ROOT_URL = 'http://localhost:9090/api';
  // const ROOT_URL = 'https://harmonize-api-r808.onrender.com/';

  return {
    all: [],
    current: {},

    fetchPost: async (id) => {
    // GET
    // takes the ID of the post to fetch from router params
      try {
        const response = await axios.get(`${ROOT_URL}/posts/${id}`);
        set(({ postSlice }) => { postSlice.current = response.data; }, false, 'posts/fetchPost');
      } catch (error) {
        get().errorSlice.newError(error.message);
      }
    },
    fetchAllPosts: async () => {
    // GET
    // would need pagination but for now we'll just get them all
      try {
        const response = await axios.get(`${ROOT_URL}/posts`);
        set(({ postSlice }) => { postSlice.all = response.data; }, false, 'posts/fetchAllPosts');
      } catch (error) {
        get().errorSlice.newError(error.message);
      }
    },
    updatePost: async (post) => {
    // PUT
    // takes in updated data (could include the ID of the post to update in the post object or add a separate parameter
      try {
        const response = await axios.put(`${ROOT_URL}/posts/${post.id}`, post);
        set(({ postSlice }) => { postSlice.current = response.data; }, false, 'posts/updatePost');
      } catch (error) {
        get().errorSlice.newError(error.message);
      }
    },
    createPost: async (post) => {
    // POST
    // takes in new post data (no id)
      try {
        const response = await axios.post(`${ROOT_URL}/posts`, post);
        set(({ postSlice }) => { postSlice.current = response.data; }, false, 'posts/createPost');
      } catch (error) {
        get().errorSlice.newError(error.message);
      }
    },
    deletePost: async (id) => {
    // DELETE
    // takes id of the post to delete
      try {
        await axios.delete(`${ROOT_URL}/posts/${id}`);
        set(({ postSlice }) => { postSlice.current = null; }, false, 'posts/deletePost');
      } catch (error) {
        get().errorSlice.newError(error.message);
      }
    },
    searchPosts: async (query) => {
    // GET
    // takes in a search query
      try {
        const response = await axios.get(`${ROOT_URL}/posts&search=${query}`);
        set(({ postSlice }) => { postSlice.all = response.data; }, false, 'posts/searchPosts');
      } catch (error) {
        get().errorSlice.newError(error.message);
      }
    },
  };
}
