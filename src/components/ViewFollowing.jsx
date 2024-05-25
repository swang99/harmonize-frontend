import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, Text, List, ListItem, HStack, Avatar,
} from '@chakra-ui/react';
import useStore from '../store/profile-slice';

function ViewFollowing(props) {
  const navigate = useNavigate();
  const { filterFollowing } = useStore((store) => store.profileSlice);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        if (!props.profile.userID) {
          setFollowing([]);
          return;
        }
        setFollowing(await filterFollowing(props.profile.userID));
      } catch (error) {
        console.error('Failed to fetch following:', error);
      }
    };
    fetchFollowers();
  }, []);

  const handleNavigateUser = (friendId) => {
    navigate(`/users/${friendId}`);
    props.onClose();
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> Following </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {following.length > 0 && (
          <List mt={4} spacing={2}>
            {following.map((p) => (
              <ListItem key={p.userID}
                onClick={() => handleNavigateUser(p.userID)}
                cursor="pointer"
                _hover={{ bg: 'gray.200' }}
              >
                <HStack>
                  <Avatar size="sm" name={p.name} src={p.photo} />
                  <Text>{p.name}</Text>
                </HStack>
              </ListItem>
            ))}
          </List>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={props.onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ViewFollowing;
