import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import PostCard from './post-card';
import useStore from '../store';

export default function FullPostModal(props) {
  // zustand modal stuff
  const { isOpen, content } = useStore((state) => state.modalSlice.fullPostModal);
  const { closeModal } = useStore((state) => state.modalSlice.fullPostModal);

  // chakra modal stuff
  const initialFocusRef = useRef();
  const finalFocusRef = useRef();
  const fullPostModalDisc = useDisclosure();

  // current user data
  const userProfile = useStore((store) => store.profileSlice.currentProfile);

  useEffect(() => {
    if (isOpen) {
      fullPostModalDisc.onOpen();
    } else {
      fullPostModalDisc.onClose();
    }
  }, [isOpen, content]);

  const onClose = () => {
    closeModal();
    fullPostModalDisc.onClose();
  };

  const renderPostCard = () => {
    if (!content) return <Text>No Post Content</Text>;
    else if (content.authorID === userProfile.userID) {
      return (
        <PostCard
          use="feed-personal"
          post={content.post}
          name={content.name}
          authorID={content.authorID}
          photo={content.photo}
        />
      );
    }
    return (
      <PostCard
        use="feed"
        post={content.post}
        name={content.name}
        authorID={content.authorID}
        photo={content.photo}
      />
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      initialFocusRef={initialFocusRef}
      finalFocusRef={finalFocusRef}
    >
      <ModalOverlay />
      <ModalContent maxW="80vw" maxH="90vh" p={5}>
        <ModalHeader>
          <Text as="h1" size="2xl">Post</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto">
          {renderPostCard()}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
