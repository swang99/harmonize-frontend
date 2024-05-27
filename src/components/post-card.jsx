import { Avatar, Box, HStack, Icon, Text, VStack, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { CgPlayListAdd } from 'react-icons/cg';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { MdOutlineComment } from 'react-icons/md';
import { RepeatIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useStore from '../store';
import { getItemData } from '../utils/spotify-api';
import AddCommentModal from './AddComment';
import AddTrackToPlaylistModal from './add-track-to-playlist';
import TrackItem from './track-item';
import NewPostModal from './NewPostModal';

const PostCard = (props) => {
  const { post, use, onPostModalOpen } = props;
  const [postItemData, setPostItemData] = useState(null);
  const { id, type } = post;
  const addCommentDisc = useDisclosure();
  const addTrackToPlaylistDisc = useDisclosure();
  const newPostModalDisc = useDisclosure();
  const { fetchOtherProfile, playlists } = useStore((store) => store.profileSlice);
  const userProfile = useStore((store) => store.profileSlice.currentProfile);
  const updatePost = useStore((store) => store.postSlice.updatePost);
  const [liked, setLiked] = useState(props.post.likes.includes(userProfile.userID));
  const [likes, setLikes] = useState(props.post.likes.length);
  const [comments, setComments] = useState(props.post.comments);
  const openPlaylistModal = props.onPlaylistModalOpen;

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const data = await getItemData(id, 'track');
        setPostItemData(data);
      } catch (error) {
        toast.error('Failed to fetch post data:', error);
      }
    };
    fetchPostData();
  }, [id]);

  const handlePostModalOpen = () => {
    const postModalContent = props.name ? {
      post: props.post,
      name: props.name,
      photo: props.photo,
      authorID: props.authorID,
    } : {
      post: props.post,
      name: userProfile.name,
      photo: userProfile.photo,
      authorID: userProfile.userID,
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
      _id: props.post._id,
      id: props.post.id,
      type: props.post.type,
      description: props.post.description,
      comments: props.post.comments,
      likes: newLikes,
      createdAt: props.post.createdAt,
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

  const handleAddToPlaylistOpen = (event) => {
    event.stopPropagation();
    openPlaylistModal();
  };

  const handleNewPostOpen = (event) => {
    event.stopPropagation();
    newPostModalDisc.onOpen();
  };

  const renderLikes = () => {
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

  const renderTrackPost = () => {
    const { name } = postItemData;
    const imageURL = postItemData.album.images[0].url;
    const artists = postItemData.artists[0].name;

    if (use === 'feed') {
      const username = props.name;
      const userPhoto = props.photo;
      return (
        <HStack w="100%" h={350} gap="4">
          <TrackItem
            key={id}
            id={id}
            name={name}
            artist={artists}
            imageURL={imageURL}
            onPlaylistModalOpen={() => openPlaylistModal()}
            use="feed"
            flex="1"
          />
          <Box w={1} h="100%" bg="gray.800" rounded="xl" />
          <VStack w="100%" h="100%" flex="1" spacing="0">
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
                <HStack gap="3">
                  <Icon
                    as={MdOutlineComment}
                    w={6}
                    h={6}
                    cursor="pointer"
                    color="teal.900"
                    _hover={{ color: 'teal.500', transform: 'scale(1.1)' }}
                    onClick={handleAddCommentOpen}
                  />
                  <Icon
                    as={CgPlayListAdd}
                    w={6}
                    h={6}
                    cursor="pointer"
                    color="teal.900"
                    _hover={{ color: 'teal.500', transform: 'scale(1.1)' }}
                    onClick={handleAddToPlaylistOpen}
                  />
                  <Icon
                    as={RepeatIcon}
                    w={6}
                    h={6}
                    cursor="pointer"
                    color="teal.900"
                    _hover={{ color: 'teal.500', transform: 'scale(1.1)' }}
                    onClick={handleNewPostOpen}
                  />
                </HStack>
              </Box>
            </VStack>
          </VStack>
          <AddTrackToPlaylistModal isOpen={addTrackToPlaylistDisc.isOpen} onClose={addTrackToPlaylistDisc.onClose} trackID={postItemData.id} playlists={playlists} />
          <AddCommentModal isOpen={addCommentDisc.isOpen}
            onClose={addCommentDisc.onClose}
            post={props.post}
            postAuthorID={props.authorID}
            commentAuthorID={userProfile.userID}
            setComments={setComments}
          />
          <NewPostModal isOpen={newPostModalDisc.isOpen} onClose={newPostModalDisc.onClose} trackData={postItemData} /> {/* New Post Modal */}
        </HStack>
      );
    } else if (use === 'profile') {
      return (
        <Box onClick={handlePostModalOpen} cursor="pointer" _hover={{ borderColor: 'teal.500', borderWidth: '3px' }}>
          <TrackItem key={id} id={id} name={name} artist={artists} imageURL={imageURL} onPlaylistModalOpen={props.onPlaylistModalOpen} />
          <AddTrackToPlaylistModal isOpen={addTrackToPlaylistDisc.isOpen} onClose={addTrackToPlaylistDisc.onClose} trackID={postItemData.id} playlists={playlists} />
          <AddCommentModal isOpen={addCommentDisc.isOpen} onClose={addCommentDisc.onClose} post={props.post} postAuthorID={props.authorID} commentAuthorID={userProfile.userID} />
          <NewPostModal isOpen={newPostModalDisc.isOpen} onClose={newPostModalDisc.onClose} trackData={postItemData} /> {/* New Post Modal */}
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
          onPlaylistModalOpen={() => openPlaylistModal()}
        />
      </HStack>
    );
  };

  const renderPost = () => {
    if (!postItemData) {
      return null;
    } else if (type === 'track') {
      return renderTrackPost(postItemData);
    }
    return null;
  };

  return renderPost();
};

export default PostCard;
