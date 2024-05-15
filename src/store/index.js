import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const useStore = create(
  persist(devtools(immer((set) => ({
    userID: '',
    token: '',
    setUserID: (userID) => set((state) => { state.userID = userID; }),
    setToken: (token) => set((state) => { state.token = token; }),
  }))), {
    name: 'user-storage',
  }),
);

export default useStore;
