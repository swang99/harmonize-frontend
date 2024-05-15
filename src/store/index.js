import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import createPostSlice from './post-slice';
import createProfileSlice from './profile-slice';

const useStore = create(
  persist(devtools(immer((...args) => ({
    postSlice: createPostSlice(...args),
    profileSlice: createProfileSlice(...args),
  }))), {
    name: 'user-storage',
  }),
);

export default useStore;
