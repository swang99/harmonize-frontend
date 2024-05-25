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
  List,
  ListItem,
  HStack,
  Avatar,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useStore from '../store';

function ViewFollowers(props) {
  const navigate = useNavigate();
  const { filterFollowers } = useStore((store) => store.profileSlice);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        if (!props.profile.userID) {
          setFollowers([]);
          return;
        }
        setFollowers(await filterFollowers(props.profile.userID));
      } catch (error) {
        console.error('Failed to fetch followers:', error);
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
        <ModalHeader> Followers </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {followers.length > 0 && (
          <List mt={4} spacing={2}>
            {followers.map((p) => (
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

export default ViewFollowers;
