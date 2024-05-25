import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router';

function ViewFollowers(props) {
  const navigate = useNavigate();
  // const [filteredProfiles, setFilteredProfiles] = useState([]);

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
            console.log(user);
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
