import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import React, { useRef } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import PostCard from './post-card';

export default function FullPostModal(props) {
  const { postModalContent, isOpen, onClose } = props;
  const initialFocusRef = useRef();
  const finalFocusRef = useRef();

  const renderPostCard = () => {
    if (!postModalContent) return <Text>No Post Content</Text>;
    return (
      <PostCard
        use="feed"
        post={postModalContent.post}
        name={postModalContent.name}
        authorID={postModalContent.authorID}
        photo={postModalContent.photo}
        onPlaylistModalOpen={props.onPlaylistModalOpen}
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
      <ModalContent maxW="80vw" maxH="90vh">
        <ModalHeader>Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto">
          {renderPostCard()}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
