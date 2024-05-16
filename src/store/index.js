import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import createPostSlice from './post-slice';
import createProfileSlice from './profile-slice';

const useStore = create(
  devtools(immer((...args) => ({
    accessToken: '',
    postSlice: createPostSlice(...args),
    profileSlice: createProfileSlice(...args),
  }))),
);

export default useStore;
