import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, HStack,
  ModalBody, ModalFooter, Input, List, ListItem, Button, Avatar, Text,
} from '@chakra-ui/react';
import useStore from '../store/profile-slice';

export default function AddFriendModal(props) {
  const navigate = useNavigate();
  const { filterProfiles } = useStore((store) => store.profileSlice);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [friendName, setFriendName] = useState('');

  /* Filter profiles based on search input */
  async function handleFriendSearch(filter) {
    if (!filter) {
      setFilteredProfiles([]);
      setFriendName('');
      return;
    }
    setFriendName(filter);
    setFilteredProfiles(await filterProfiles(filter));
  }

  const handleNavigateUser = (friendId) => {
    navigate(`/users/${friendId}`);
    setFriendName('');
    props.onClose();
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Friend</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Enter friend's name"
            value={friendName}
            onChange={(e) => handleFriendSearch(e.target.value)}
          />
          {filteredProfiles.length > 0 && (
          <List mt={4} spacing={2}>
            {filteredProfiles.map((p) => (
              <ListItem
                key={p.userID}
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
