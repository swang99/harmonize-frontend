import React, { useEffect, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Textarea, Image, VStack, Text, useDisclosure } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import useStore from '../store';
import 'react-toastify/dist/ReactToastify.css';

export default function NewPostModal() {
  const [description, setDescription] = useState('');
  const createPost = useStore((store) => store.postSlice.createPost);
  const userProfile = useStore((store) => store.profileSlice.currentProfile);

  // modal shit
  const { isOpen, trackData } = useStore((state) => state.modalSlice.newPostModal);
  const { closeModal } = useStore((state) => state.modalSlice.newPostModal);
  const newPostModalDisc = useDisclosure();

  useEffect(() => {
    if (isOpen) {
      newPostModalDisc.onOpen();
    } else {
      newPostModalDisc.onClose();
    }
  }, [isOpen, trackData]);

  const onClose = async () => {
    closeModal();
    newPostModalDisc.onClose();
  };

  const handleSubmit = async () => {
    const newPost = {
      id: trackData.id,
      type: 'track',
      description,
      comments: [],
      likes: [],
      createdAt: new Date().toISOString(),
      songName: trackData.songName,
      artists: trackData.artists,
      imageURL: trackData.imageURL,
    };
    try {
      await createPost(userProfile.userID, newPost);
      toast.success('Post created successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to create post.');
    }
  };

  if (!trackData) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Image src={trackData.imageURL} alt={trackData.songName} boxSize="150px" />
            <Text fontWeight="bold">{trackData.name}</Text>
            <Text>{trackData.artists}</Text>
            <Textarea
              placeholder="Add a caption..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Create Post
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
