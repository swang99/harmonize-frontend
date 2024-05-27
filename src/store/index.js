import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import createPlayerSlice from './player-slice';
import createPostSlice from './post-slice';
import createProfileSlice from './profile-slice';
import createModalSlice from './modal-slice';

const useStore = create(
  devtools(immer((...args) => ({
    playerSlice: createPlayerSlice(...args),
    postSlice: createPostSlice(...args),
    profileSlice: createProfileSlice(...args),
    modalSlice: createModalSlice(...args),
  }))),
);

export default useStore;
