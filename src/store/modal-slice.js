export default function createModalSlice(set, get) {
  return {
    playlistModal: {
      isOpen: false,
      trackId: null,
      openModal: (trackId) => set((state) => ({
        modalSlice: {
          ...state.modalSlice,
          playlistModal: {
            ...state.modalSlice.playlistModal,
            isOpen: true,
            trackId,
          },
        },
      })),
      closeModal: () => set((state) => ({
        modalSlice: {
          ...state.modalSlice,
          playlistModal: {
            ...state.modalSlice.playlistModal,
            isOpen: false,
            trackId: null,
          },
        },
      })),
    },
    newPostModal: {
      isOpen: false,
      trackData: null,
      openModal: (trackData) => set((state) => ({
        modalSlice: {
          ...state.modalSlice,
          newPostModal: {
            ...state.modalSlice.newPostModal,
            isOpen: true,
            trackData,
          },
        },
      })),
      closeModal: () => set((state) => ({
        modalSlice: {
          ...state.modalSlice,
          newPostModal: {
            ...state.modalSlice.newPostModal,
            isOpen: false,
            trackData: null,
          },
        },
      })),
    },
    fullPostModal: {
      isOpen: false,
      content: null,
      openModal: (content) => set((state) => ({
        modalSlice: {
          ...state.modalSlice,
          fullPostModal: {
            ...state.modalSlice.fullPostModal,
            isOpen: true,
            content,
          },
        },
      })),
      closeModal: () => set((state) => ({
        modalSlice: {
          ...state.modalSlice,
          fullPostModal: {
            ...state.modalSlice.fullPostModal,
            isOpen: false,
            content: null,
          },
        },
      })),
    },
  };
}
