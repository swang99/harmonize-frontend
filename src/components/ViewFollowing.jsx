import React from 'react';
import { useNavigate } from 'react-router';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, Text,
} from '@chakra-ui/react';
// import useStore from '../store/profile-slice';

function ViewFollowing(props) {
  const navigate = useNavigate();

  const handleNavigateUser = (friendId) => {
    navigate(`/users/${friendId}`);
    props.onClose();
  };
  console.log(props.following);

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> Following </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {props.following.map((user) => {
            return (
              <Text key={user} onClick={() => handleNavigateUser(user)} cursor="pointer">
                {user}
              </Text>
            );
          })}
        </ModalBody>
        <ModalFooter>
          <Button onClick={props.onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ViewFollowing;
