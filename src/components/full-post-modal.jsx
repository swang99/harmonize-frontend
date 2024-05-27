import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import PostCard from './post-card';

/**
 *
 * @param {*} trackID trackID of the track to add to playlist
 * @param {*} userProfile userProfile object
 * @returns
 */
export default function FullPostModal(props) {
  const { postModalContent, isOpen, onClose } = props;
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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
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
