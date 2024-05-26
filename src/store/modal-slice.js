const createModalSlice = (set, get) => {
  return {
    /**
     * postModalContent.post: The post to display in the modal
     * postModalContent.name: The name of the post author
     * postModalContent.photo: The photo of the post author
     * postModalContent.authorID: The ID of the post author
    */
    postModalContent: null,

    setPostModalContent: (content) => {
      set((state) => ({ modalSlice: { ...state.modalSlice, postModalContent: content } }), false, 'modal/setPostModalContent');
    },
    clearPostModalContent: () => {
      set((state) => ({ modalSlice: { ...state.modalSlice, postModalContent: null } }), false, 'modal/clearPostModalContent');
    },
  };
};

export default createModalSlice;
