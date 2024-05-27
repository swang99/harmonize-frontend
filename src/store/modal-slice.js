export default function createModalSlice(set, get) {
  return {
    playlistModal: {
      isOpen: false,
      trackId: null,
      openModal: (trackId) => set((state) => ({
        modalSlice: {
          playlistModal: {
            ...state.modalSlice.playlistModal,
            isOpen: true,
            trackId,
          },
        },
      })),
      closeModal: () => set((state) => ({
        modalSlice: {
          playlistModal: {
            ...state.modalSlice.playlistModal,
            isOpen: false,
            trackId: null,
          },
        },
      })),
    },
  };
}
