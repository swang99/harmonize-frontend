import { RepeatIcon } from '@chakra-ui/icons';
import { Avatar, Box, HStack, Icon, Text, VStack, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import { CgPlayListAdd } from 'react-icons/cg';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import { MdOutlineComment } from 'react-icons/md';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useStore from '../store';
import AddCommentModal from './AddComment';
import NewPostModal from './NewPostModal';
import TrackItem from './track-item';

const PostCard = (props) => {
  // post data from props
  const { post, use, onPostModalOpen, profile } = props;
  const { id, type } = post;
  const { fetchOtherProfile } = useStore((store) => store.profileSlice);
  const userProfile = useStore((store) => store.profileSlice.currentProfile);

  // outdate modal stuff
  const addCommentDisc = useDisclosure();
  const newPostModalDisc = useDisclosure();

  // update post stuff
  const updatePost = useStore((store) => store.postSlice.updatePost);
  const deletePost = useStore((store) => store.postSlice.deletePost);
  const [liked, setLiked] = useState(props.post.likes.includes(userProfile.userID));
  const [likes, setLikes] = useState(props.post.likes.length);
  const [comments, setComments] = useState(props.post.comments);

  // current modal stuff
  const openPlaylistModal = useStore((state) => state.modalSlice.playlistModal.openModal);

  const handlePostModalOpen = (event) => {
    event.stopPropagation();
    const postModalContent = props.name ? {
      post: props.post,
      name: props.name,
      photo: props.photo,
      authorID: props.authorID,
    } : {
      post: props.post,
      name: profile.name,
      photo: profile.photo,
      authorID: profile.userID,
    };
    onPostModalOpen(postModalContent);
  };

  const handleLike = async (event) => {
    event.stopPropagation();
    let newLikes = [];
    if (liked) {
      setLiked(false);
      setLikes(likes - 1);
      newLikes = props.post.likes.filter((user) => user !== userProfile.userID);
    } else {
      setLiked(true);
      setLikes(likes + 1);
      newLikes = [...props.post.likes, userProfile.userID];
    }
    newLikes = [...new Set(newLikes)];
    const newPost = {
      _id: post._id,
      id: post.id,
      type: post.type,
      description: post.description,
      comments: post.comments,
      likes: newLikes,
      createdAt: post.createdAt,
      songName: post.songName,
      artists: post.artists,
      imageURL: post.imageURL,
    };
    try {
      const authorProfile = await fetchOtherProfile(props.authorID);
      await updatePost(authorProfile, newPost);
    } catch (error) {
      toast.error('Failed to like post:', error);
    }
  };

  const handleAddCommentOpen = (event) => {
    event.stopPropagation();
    addCommentDisc.onOpen();
  };

  const handleNewPostOpen = (event) => {
    event.stopPropagation();
    newPostModalDisc.onOpen();
  };

  const handlePlaylistModalOpen = (event) => {
    event.stopPropagation();
    openPlaylistModal(id);
  };

  const renderLikes = () => {
    if (use === 'feed-personal') {
      return (
        <HStack>
          <Text fontSize="xl" as="b">{likes}</Text>
          <Icon
            as={FaRegHeart}
            w={7}
            h={7}
            color="teal.900"
          />
        </HStack>
      );
    }
    if (liked) {
      return (
        <HStack>
          <Text fontSize="xl" as="b">{likes}</Text>
          <Icon
            as={FaHeart}
            w={7}
            h={7}
            color="teal.900"
            _hover={{ color: 'teal.500', transform: 'scale(1.1)' }}
            onClick={handleLike}
          />
        </HStack>
      );
    }
    return (
      <HStack>
        <Text fontSize="xl" as="b">{likes}</Text>
        <Icon
          as={FaRegHeart}
          w={7}
          h={7}
          color="teal.900"
          _hover={{ color: 'teal.500', transform: 'scale(1.1)' }}
          onClick={handleLike}
        />
      </HStack>
    );
  };

  const handleDelete = async (event) => {
    event.stopPropagation();
    try {
      await deletePost(userProfile.userID, post._id);
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete post:', error);
    }
  };

  const renderFeedButtons = () => {
    if (use === 'feed-personal') {
      return (
        <HStack gap="3">
          <Icon as={MdOutlineComment} w={6} h={6} cursor="pointer" color="teal.900" _hover={{ color: 'teal.500', transform: 'scale(1.1)' }} onClick={handleAddCommentOpen} />
          <Icon as={CgPlayListAdd}
            w={6}
            h={6}
            cursor="pointer"
            color="teal.900"
            _hover={{ color: 'teal.500', transform: 'scale(1.1)' }}
            onClick={(event) => {
              event.stopPropagation();
              openPlaylistModal(id);
            }}
          />
          <Icon as={RepeatIcon} w={6} h={6} cursor="pointer" color="teal.900" _hover={{ color: 'teal.500', transform: 'scale(1.1)' }} onClick={handleNewPostOpen} />
          <Icon as={FaRegTrashCan} w={6} h={6} cursor="pointer" color="teal.900" _hover={{ color: 'teal.500', transform: 'scale(1.1)' }} onClick={handleDelete} />
        </HStack>
      );
    }
    return (
      <HStack gap="3">
        <Icon as={MdOutlineComment} w={6} h={6} cursor="pointer" color="teal.900" _hover={{ color: 'teal.500', transform: 'scale(1.1)' }} onClick={handleAddCommentOpen} />
        <Icon as={CgPlayListAdd}
          w={6}
          h={6}
          cursor="pointer"
          color="teal.900"
          _hover={{ color: 'teal.500', transform: 'scale(1.1)' }}
          onClick={(event) => handlePlaylistModalOpen(event)}
        />
        <Icon as={RepeatIcon} w={6} h={6} cursor="pointer" color="teal.900" _hover={{ color: 'teal.500', transform: 'scale(1.1)' }} onClick={handleNewPostOpen} />
      </HStack>
    );
  };

  const renderTrackPost = () => {
    const name = post.songName;
    const { imageURL, artists } = post;

    if (use === 'feed' || use === 'feed-personal') {
      const username = props.name;
      const userPhoto = props.photo;
      return (
        <Box w="100%" bg="gray.200" borderRadius="lg" p={5} boxShadow="md">
          <HStack w="100%" h={350} gap="4">
            <TrackItem
              key={id}
              id={id}
              name={name}
              artist={artists}
              imageURL={imageURL}
              use="feed"
              flex="1"
            />
            <VStack pl={4} w="100%" h="100%" flex="1" spacing="0">
              <VStack w="100%" bg="gray.700" justify="flex-start" align="flex-start" borderRadius="lg" p={3} spacing="1">
                <Text as="h1" fontSize="2xl" fontWeight="bold" color="white">{name}</Text>
                <Text as="h2" fontSize="lg" fontWeight="bold" color="gray.200">{artists}</Text>
              </VStack>
              <VStack w="100%" h="100%" flex="1" maxH="100%" align="flex-start" px={3} pt={3} overflow="hidden" position="relative">
                <HStack w="100%" justifyContent="space-between" alignSelf="flex-start" gap="3">
                  <HStack>
                    <Avatar size="sm" src={userPhoto} />
                    <Text as="h2" fontSize="md" fontWeight="bold">{username}</Text>
                  </HStack>
                  <Box justifySelf="flex-end">
                    {renderLikes()}
                  </Box>
                </HStack>
                <Box alignSelf="flex-start" w="100%">
                  <Text fontWeight="bold" fontSize="md" color="gray.800" w="100%" as="span" overflowY="auto">
                    {` ${post.description}`}
                  </Text>
                </Box>
                <Box w="100%" h={1} rounded="full" bg="gray.300" />
                <Box flex="1" w="85%" overflowY="auto">
                  <VStack w="100%" spacing="2">
                    {comments.map((comment) => (
                      <HStack key={`${comment.id}-${comment.author}`} w="100%">
                        <Text fontWeight="bold" fontSize="sm">{`${comment.author}: `}</Text>
                        <Text fontSize="sm">{`${comment.comment}`}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
                <Box position="absolute" bottom={3} right={3}>
                  {renderFeedButtons()}
                </Box>
              </VStack>
            </VStack>
            <AddCommentModal isOpen={addCommentDisc.isOpen}
              onClose={addCommentDisc.onClose}
              post={props.post}
              postAuthorID={props.authorID}
              commentAuthorID={userProfile.userID}
              setComments={setComments}
            />
            <NewPostModal
              isOpen={newPostModalDisc.isOpen}
              onClose={newPostModalDisc.onClose}
              trackData={{ id: post.id, songName: post.songName, artists: post.artists, imageURL: post.imageURL }}
            />
          </HStack>
        </Box>
      );
    } else if (use === 'profile') {
      return (
        <Box onClick={() => handlePostModalOpen()}
          cursor="pointer"
          transition="transform 0.1s ease-in-out"
          _hover={{
            transform: 'scale(1.03)',
          }}
          w="100%"
        >
          <TrackItem key={id} id={id} name={name} artist={artists} imageURL={imageURL} />
          <AddCommentModal isOpen={addCommentDisc.isOpen} onClose={addCommentDisc.onClose} post={props.post} postAuthorID={props.authorID} commentAuthorID={userProfile.userID} />
          <NewPostModal
            isOpen={newPostModalDisc.isOpen}
            onClose={newPostModalDisc.onClose}
            trackData={{ id: post.id, songName: post.songName, artists: post.artists, imageURL: post.imageURL }}
          />
        </Box>
      );
    }
    return (
      <HStack>
        <TrackItem
          key={id}
          id={id}
          name={name}
          artist={artists}
          imageURL={imageURL}
        />
      </HStack>
    );
  };

  const renderPost = () => {
    if (!post) {
      return null;
    } else if (type === 'track') {
      return renderTrackPost();
    }
    return null;
  };

  return renderPost();
};

export default PostCard;
