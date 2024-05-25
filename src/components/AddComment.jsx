import React, { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, VStack, Textarea, useToast,
} from '@chakra-ui/react';
import useStore from '../store/post-slice';

function AddCommentModal(props) {
  const [comment, setComment] = useState('');
  const toast = useToast();
  const { updatePost } = useStore();

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async () => {
    // add new comment to post
    const newCmnt = {
      author: props.profile.userID,
      comment,
    };
    const newComments = [...props.postData.comments, newCmnt];

    // construct updated post body
    const newPost = {
      id: props.postData.id,
      type: props.postData.type,
      description: props.postData.description,
      comments: newComments,
      likes: props.postData.likes,
      createdAt: props.postData.createdAt,
    };

    await updatePost(props.profile, newPost);
    toast({
      title: 'Commented!',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });

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
