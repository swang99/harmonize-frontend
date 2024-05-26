import { Box, HStack, Icon, useDisclosure, Heading, Avatar, VStack, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { CgPlayListAdd } from 'react-icons/cg';
import { MdOutlineComment } from 'react-icons/md';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getItemData } from '../utils/spotify-api';
import TrackItem from './track-item';
import AddTrackToPlaylistModal from './add-track-to-playlist';
import AddCommentModal from './AddComment';
import useStore from '../store';

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
  const addTrackToPlaylistDisc = useDisclosure();
  const addCommentDisc = useDisclosure();
  const { playlists, fetchOtherProfile } = useStore((store) => store.profileSlice);
  const userProfile = useStore((store) => store.profileSlice.currentProfile);
  const updatePost = useStore((store) => store.postSlice.updatePost);
  const [liked, setLiked] = useState(props.post.likes.includes(userProfile.userID));
  const [likes, setLikes] = useState(props.post.likes.length);

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
          <TrackItem height="100%" key={id} id={id} name={name} artist={artists} imageURL={imageURL} use="feed" flex="0 1 auto" />
          <Box w={1} h="100%" bg="gray.800" rounded="xl" />
          <Box flex="1" h="100%">
            <VStack w="100%" h="100%" justifyContent="space-between">
              <HStack w="100%" justifyContent="space-between" alignSelf="flex-start" gap="4">
                <HStack>
                  <Avatar size="lg" src={userPhoto} />
                  <Heading color="gray.800">{username}</Heading>
                </HStack>
                <Box justifySelf="flex-end">
                  {renderLikes()}
                </Box>
              </HStack>
              <Box w="100%" textAlign="left">
                <Text fontSize="lg" color="gray.800" w="100%" as="i">
                  Description:
                </Text>
                <Text fontSize="lg" color="gray.800" w="100%" as="span" overflowY="auto">
                  {` ${post.description}`}
                </Text>
              </Box>
              <Box fontSize="lg" color="gray.800" w="100%" overflowY="auto" textAlign="left">
                <Text as="i">Comments: </Text>
                {post.comments.map((comment) => (
                  <Text key={comment.id} textAlign="left">{`${comment.author}: ${comment.comment}`}</Text>
                ))}
              </Box>
              <HStack alignSelf="flex-end" justifySelf="flex-end" gap="4">
                <Icon
                  as={MdOutlineComment}
                  w={7}
                  h={7}
                  cursor="pointer"
                  color="teal.900"
                  _hover={{ color: 'teal.500', transform: 'scale(1.1)' }}
                  onClick={addCommentDisc.onOpen}
                />
                <Icon
                  as={CgPlayListAdd}
                  w={7}
                  h={7}
                  cursor="pointer"
                  color="teal.900"
                  _hover={{ color: 'teal.500', transform: 'scale(1.1)' }}
                  onClick={addTrackToPlaylistDisc.onOpen}
                />
              </HStack>
            </VStack>
          </Box>
          <AddTrackToPlaylistModal isOpen={addTrackToPlaylistDisc.isOpen} onClose={addTrackToPlaylistDisc.onClose} trackID={postItemData.id} playlists={playlists} />
          <AddCommentModal isOpen={addCommentDisc.isOpen} onClose={addCommentDisc.onClose} post={props.post} postAuthorID={props.authorID} commentAuthorID={userProfile.userID} />
        </HStack>
      );
    }
    return (
      <HStack>
        <TrackItem key={id} id={id} name={name} artist={artists} imageURL={imageURL} />
        <AddTrackToPlaylistModal isOpen={addTrackToPlaylistDisc.isOpen} onClose={addTrackToPlaylistDisc.onClose} trackID={postItemData.id} playlists={playlists} />
        <AddCommentModal isOpen={addCommentDisc.isOpen} onClose={addCommentDisc.onClose} post={props.post} postAuthorID={props.authorID} commentAuthorID={userProfile.userID} />
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
