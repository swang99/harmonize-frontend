// import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useToast } from '@chakra-ui/react';
// import React, { useState } from 'react';
// import useStore from '../store';

// const NewPostModal = ({ isOpen, onClose, track }) => {
//   const [description, setDescription] = useState('');
//   const toast = useToast();
//   const createPost = useStore((store) => store.postSlice.createPost);
//   const userProfile = useStore((store) => store.profileSlice.currentProfile);

//   const handleCreatePost = async () => {
//     try {
//       await createPost(userProfile.userID, {
//         id: track.id,
//         type: 'track',
//         description,
//         comments: [],
//         likes: [],
//         createdAt: new Date().toISOString(),
//       });
//       toast.success('Post created successfully!');
//       onClose();
//     } catch (error) {
//       toast.error('Failed to create post.');
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose}>
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader>Create New Post</ModalHeader>
//         <ModalCloseButton />
//         <ModalBody>
//           <Box>
//             <Text fontWeight="bold">{track.name}</Text>
//             <Text>{track.artists[0].name}</Text>
//             <Textarea
//               mt={4}
//               placeholder="Add a description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </Box>
//         </ModalBody>
//         <ModalFooter>
//           <Button colorScheme="blue" mr={3} onClick={handleCreatePost}>
//             Create Post
//           </Button>
//           <Button variant="ghost" onClick={onClose}>Cancel</Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default NewPostModal;

import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Textarea, Image, VStack, Text } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import useStore from '../store';
import 'react-toastify/dist/ReactToastify.css';

const NewPostModal = ({ isOpen, onClose, trackData }) => {
  const [description, setDescription] = useState('');
  const createPost = useStore((store) => store.postSlice.createPost);
  const userProfile = useStore((store) => store.profileSlice.currentProfile);

  const handleSubmit = async () => {
    const newPost = {
      id: trackData.id,
      type: 'track',
      description,
      comments: [],
      likes: [],
      createdAt: new Date().toISOString(),
    };
    try {
      await createPost(userProfile.userID, newPost);
      toast.success('Post created successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to create post.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Image src={trackData.album.images[0].url} alt={trackData.name} boxSize="150px" />
            <Text fontWeight="bold">{trackData.name}</Text>
            <Text>{trackData.artists.map((artist) => artist.name).join(', ')}</Text>
            <Textarea
              placeholder="Add a comment"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Create Post
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewPostModal;
