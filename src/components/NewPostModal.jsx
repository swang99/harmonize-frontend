import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  VStack,
  Image,
  useToast,
} from '@chakra-ui/react';
import useStore from '../store';

const NewPostModal = ({ isOpen, onClose, trackId, trackImage, trackName, trackArtist }) => {
  const [comment, setComment] = useState('');
  const toast = useToast();
  const { createPost, currentProfile } = useStore((state) => ({
    createPost: state.postSlice.createPost,
    currentProfile: state.profileSlice.currentProfile,
  }));

  const handleSubmit = async () => {
    if (!currentProfile) {
      toast({
        title: 'Error',
        description: 'User profile not found',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const post = {
      id: trackId,
      type: 'track',
      description: comment,
    };

    await createPost(currentProfile.userID, post);
    toast({
      title: 'Post created.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    setComment('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Image src={trackImage} alt={trackName} boxSize="100px" />
            <Textarea
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Create Post
          </Button>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewPostModal;
