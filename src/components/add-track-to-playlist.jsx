import {
  Box,
  Button,
  Grid,
  GridItem,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { faMusic, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
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
    console.log(playlistsToRender);
  }, [playlistsToRender]);

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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="80vw" maxH="90vh">
        <ModalHeader>Add to Playlist</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto">
          <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={4} w="100%">
            {playlistsToRender.items && playlistsToRender.items.map((playlist) => (
              <GridItem key={playlist.id} w="100%" bg="gray.800" borderRadius="md" overflow="hidden" position="relative" onClick={() => handleAddTrackToPlaylist(playlist.id)}>
                {playlist.images && playlist.images.length > 0 ? (
                  <Image src={playlist.images[0].url} alt={playlist.name} objectFit="cover" h="150px" w="100%" />
                ) : (
                  <Box h="150px" w="100%" bg="gray.700" display="flex" alignItems="center" justifyContent="center">
                    <FontAwesomeIcon icon={faMusic} size="2x" color="gray.400" />
                  </Box>
                )}
                <Box p={2}>
                  <Text fontSize="md" fontWeight="bold" color="white" isTruncated>{playlist.name}</Text>
                </Box>
                <Button
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  colorScheme="green"
                  borderRadius="full"
                  width="50px"
                  height="50px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  onClick={null}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </GridItem>
            ))}
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
