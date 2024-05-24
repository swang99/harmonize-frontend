import React, { useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, HStack,
  ModalBody, ModalFooter, List, ListItem, Button, Text,
} from '@chakra-ui/react';
import { addTrackToPlaylist, getCurrentUserPlaylists } from '../utils/spotify-api';

/**
 *
 * @param {*} trackID trackID of the track to add to playlist
 * @param {*} userProfile userProfile object
 * @returns
 */
export default function AddTrackToPlaylistModal(props) {
  const { trackID, playlists, isOpen, onClose } = props;

  useEffect(() => {
    async function fetchPlaylists() {
      const userPlaylists = await getCurrentUserPlaylists();
      props.setPlaylists(userPlaylists);
    }
    if (!playlists) {
      fetchPlaylists();
    }
  }, []);

  const handleAddTrackToPlaylist = async (playlistID) => {
    try {
      await addTrackToPlaylist(playlistID, trackID);
      onClose();
    } catch (error) {
      console.error('Failed to add track to playlist:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Friend</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Select a playlist to add the track to:</Text>
          <List mt={4} spacing={2}>
            {playlists.map((playlist) => (
              <ListItem key={playlist.id}>
                <HStack>
                  <Text>{playlist.name}</Text>
                  <Button onClick={() => handleAddTrackToPlaylist(playlist.id)}>Add</Button>
                </HStack>
              </ListItem>
            ))}
          </List>
        </ModalBody>
        <ModalFooter>
          <Button onClick={props.onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
