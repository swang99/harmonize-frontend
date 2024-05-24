import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, Text,
} from '@chakra-ui/react';

function ViewFollowers(props) {
  const navigate = useNavigate();
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  const handleNavigateUser = (friendId) => {
    navigate(`/users/${friendId}`);
    props.onClose();
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> Followers </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {props.followers.map((user) => {
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

export default ViewFollowers;
