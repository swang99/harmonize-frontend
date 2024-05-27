import React, { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, VStack, Textarea, useToast,
} from '@chakra-ui/react';
import useStore from '../store';

function AddCommentModal(props) {
  const fetchOtherProfile = useStore((store) => store.profileSlice.fetchOtherProfile);
  const [comment, setComment] = useState('');
  const toast = useToast();
  const { updatePost } = useStore((store) => store.postSlice);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };
  const handleSubmit = async () => {
    // add new comment to post
    const newCmnt = {
      author: props.commentAuthorID,
      comment,
    };
    const newComments = [...props.post.comments, newCmnt];

    // construct updated post body
    const newPost = {
      _id: props.post._id,
      id: props.post.id,
      type: props.post.type,
      description: props.post.description,
      comments: newComments,
      likes: props.post.likes,
      createdAt: props.post.createdAt,
    };
    const authorProfile = await fetchOtherProfile(props.postAuthorID);
    props.setComments(newComments);
    toast({
      title: 'Commented!',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    updatePost(authorProfile, newPost);

    setComment('');
    props.onClose();
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Comment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Textarea
              value={comment}
              onChange={handleCommentChange}
              placeholder="Enter your comment"
              size="sm"
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => handleSubmit()}>
            Submit
          </Button>
          <Button onClick={props.onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AddCommentModal;
