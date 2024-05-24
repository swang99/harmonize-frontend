import React, { useEffect, useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, HStack,
  ModalBody, ModalFooter, List, ListItem, Button, Text, Image,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addTrackToPlaylist, getCurrentUserPlaylists } from '../utils/spotify-api';

/**
 *
 * @param {*} trackID trackID of the track to add to playlist
 * @param {*} userProfile userProfile object
 * @returns
 */
export default function AddTrackToPlaylistModal(props) {
  const { trackID, playlists, isOpen, onClose } = props;
  const [playlistsToRender, setPlaylistsToRender] = useState([]);

  useEffect(() => {
    async function fetchPlaylists() {
      const userPlaylists = await getCurrentUserPlaylists();
      setPlaylistsToRender(userPlaylists);
    }
    if (!playlists) {
      fetchPlaylists();
    } else {
      setPlaylistsToRender(playlists);
    }
  }, []);

  const handleAddTrackToPlaylist = async (playlistID) => {
    try {
      console.log('Track ID:', trackID, 'Playlist ID:', playlistID);
      await addTrackToPlaylist(playlistID, trackID);
      toast.success('Track added to playlist');
    } catch (error) {
      toast.error('Failed to add track to playlist');
    } finally {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add to Playlist</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <List mt={4} spacing={2}>
            {playlistsToRender.items && playlistsToRender.items.map((playlist) => (
              <ListItem
                key={playlist.id}
                cursor="pointer"
                _hover={{ bg: 'gray.200' }}
                onClick={() => handleAddTrackToPlaylist(playlist.id)}
              >
                <HStack>
                  <Image src={playlist.images[0].url} h={10} />
                  <Text>{playlist.name}</Text>
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
