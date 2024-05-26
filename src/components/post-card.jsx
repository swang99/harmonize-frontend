import { Avatar, Box, HStack, Icon, Text, VStack, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { CgPlayListAdd } from 'react-icons/cg';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { MdOutlineComment } from 'react-icons/md';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useStore from '../store';
import { getItemData } from '../utils/spotify-api';
import AddCommentModal from './AddComment';
import TrackItem from './track-item';

/**
 * Represents a post cardcomponent.
 *
 * @component
 * @param {Object} props - The props object containing the post data.
 * @param {string} props.post.id - The ID of the post.
 * @param {string} props.post.type - The type of the post.
 * @param {string} props.post.description - The description associated with the post.
 * @param {[String]} props.post.comments -The comments associated with the post.
 * @param {[String]} props.post.likes - The likes associated with the post.
 * @param {string} props.use - The use of the PostCard component (feed, profile, etc.).
 * @param {string} props.name - The name of the user who created the post (only for feed).
 * @param {string} props.authorID - The ID of the user who created the post.
 * @param {string} props.photo - The photo of the user who created the post (only for feed).
 * @returns {JSX.Element} The rendered Post component.
 */
const PostCard = (props) => {
  const { post, use } = props;
  const [postItemData, setPostItemData] = useState(null);
  const { id, type } = post;
  const addCommentDisc = useDisclosure();
  const { fetchOtherProfile } = useStore((store) => store.profileSlice);
  const userProfile = useStore((store) => store.profileSlice.currentProfile);
  const updatePost = useStore((store) => store.postSlice.updatePost);
  const [liked, setLiked] = useState(props.post.likes.includes(userProfile.userID));
  const [likes, setLikes] = useState(props.post.likes.length);
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
  }, []);

  const handleLike = async () => {
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
                  {post.comments.map((comment) => (
                    <HStack key={comment.id} w="100%">
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
                    onClick={addCommentDisc.onOpen}
                  />
                  <Icon
                    as={CgPlayListAdd}
                    w={6}
                    h={6}
                    cursor="pointer"
                    color="teal.900"
                    _hover={{ color: 'teal.500', transform: 'scale(1.1)' }}
                    onClick={openPlaylistModal}
                  />
                </HStack>
              </Box>
            </VStack>
          </VStack>
          <AddCommentModal isOpen={addCommentDisc.isOpen} onClose={addCommentDisc.onClose} post={props.post} postAuthorID={props.authorID} commentAuthorID={userProfile.userID} />
        </HStack>
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

  // renders the post correctly according to what type of content it contains
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
