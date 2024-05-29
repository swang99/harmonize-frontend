import { FiPlusSquare } from 'react-icons/fi';
import { Avatar, Box, HStack, Icon, Text, VStack, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { CgPlayListAdd } from 'react-icons/cg';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import { MdOutlineComment } from 'react-icons/md';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';
import { Fade } from 'react-awesome-reveal';
import useStore from '../store';
import AddCommentModal from './AddComment';
import TrackItem from './track-item';

const PostCard = (props) => {
  // post data from props
  const { post, use, profile } = props;
  const { fetchOtherProfile } = useStore((store) => store.profileSlice);
  const userProfile = useStore((store) => store.profileSlice.currentProfile);

  // outdate modal stuff
  const addCommentDisc = useDisclosure();
  const navigate = useNavigate();

  // update post stuff
  const updatePost = useStore((store) => store.postSlice.updatePost);
  const deletePost = useStore((store) => store.postSlice.deletePost);
  const [liked, setLiked] = useState(props.post ? props.post.likes.includes(userProfile.userID) : false);
  const [likes, setLikes] = useState(props.post ? props.post.likes.length : 0);
  const [comments, setComments] = useState(props.post ? props.post.comments : null);

  // current modal stuff
  const openPlaylistModal = useStore((state) => state.modalSlice.playlistModal.openModal);
  const openNewPostModal = useStore((state) => state.modalSlice.newPostModal.openModal);
  const openFullPostModal = useStore((state) => state.modalSlice.fullPostModal.openModal);
  const closeFullPostModal = useStore((state) => state.modalSlice.fullPostModal.closeModal);

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

  const handleFullPostModalOpen = (event) => {
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
    event.stopPropagation();
    openFullPostModal(postModalContent);
  };

  const handleNewPostOpen = (event) => {
    event.stopPropagation();
    if (use !== 'activity') openNewPostModal(post);
    else {
      const trackFields = {
        id: props.songID,
        songName: props.songName,
        artists: props.album.artists[0].name,
        imageURL: props.album.images[0].url,
      };
      openNewPostModal(trackFields);
    }
  };

  const handlePlaylistModalOpen = (event) => {
    event.stopPropagation();
    if (use !== 'activity') openPlaylistModal(post.id);
    else openPlaylistModal(props.authorID);
  };

  const handleNavigateUser = (friendId) => {
    navigate(`/users/${friendId}`);
  };

  const formatTimestamp = (ts) => {
    const date = new Date(ts).getTime();
    const age = new Date().getTime() - date;
    if (age < 1000 * 60) {
      return 'Just now';
    }
    const seconds = Math.floor(age / 1000);
    if (seconds < 60) {
      return `${seconds}s ago`;
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days}d ago`;
    }
    const formattedDate = new Date(ts).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return formattedDate;
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
    closeFullPostModal();
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
            onClick={handlePlaylistModalOpen}
          />
          <Icon as={FiPlusSquare} w={6} h={6} cursor="pointer" color="teal.900" _hover={{ color: 'teal.500', transform: 'scale(1.1)' }} onClick={handleNewPostOpen} />
          <Icon as={FaRegTrashCan} w={6} h={6} cursor="pointer" color="teal.900" _hover={{ color: 'teal.500', transform: 'scale(1.1)' }} onClick={handleDelete} />
        </HStack>
      );
    } else if (use === 'activity') {
      return (
        <HStack gap="3">
          <Icon as={CgPlayListAdd}
            w={6}
            h={6}
            cursor="pointer"
            color="white"
            _hover={{ color: 'teal.500', transform: 'scale(1.1)' }}
            onClick={handlePlaylistModalOpen}
          />
          <Icon as={FiPlusSquare} w={6} h={6} cursor="pointer" color="white" _hover={{ color: 'teal.500', transform: 'scale(1.1)' }} onClick={handleNewPostOpen} />
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
        <Icon as={FiPlusSquare} w={6} h={6} cursor="pointer" color="teal.900" _hover={{ color: 'teal.500', transform: 'scale(1.1)' }} onClick={handleNewPostOpen} />
      </HStack>
    );
  };

  const renderTrackPost = () => {
    if (use === 'feed' || use === 'feed-personal') {
      const name = post.songName;
      const { imageURL, artists } = post;
      const username = props.name;
      const userPhoto = props.photo;
      return (
        <Box w="100%" bg="gray.200" borderRadius="lg" p={5} boxShadow="md">
          <HStack w="100%" h={350} gap="4">
            <TrackItem
              key={post.id}
              id={post.id}
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
                    <Avatar size="sm"
                      src={userPhoto}
                      cursor="pointer"
                      onClick={() => handleNavigateUser(
                        fetchOtherProfile.userID !== props.authorID
                          ? props.authorID : userProfile.userID,
                      )}
                    />
                    <Text as="h2"
                      fontSize="md"
                      fontWeight="bold"
                      cursor="pointer"
                      onClick={() => handleNavigateUser(
                        fetchOtherProfile.userID !== props.authorID
                          ? props.authorID : userProfile.userID,
                      )}
                      _hover={{ color: 'teal.500' }}
                    >
                      {username}
                    </Text>
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
                <Box flex="1" w="calc(100% - 105px)" overflowY="auto">
                  <VStack w="100%" spacing="2">
                    {comments.map((comment) => (
                      <HStack key={`${comment.id}-${comment.author}`} w="100%">
                        <Text fontWeight="bold"
                          fontSize="sm"
                          cursor="pointer"
                          onClick={() => handleNavigateUser(comment.author)}
                        >{`${comment.name}: `}
                        </Text>
                        <Text fontSize="sm">{`${comment.comment}`}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
                <Box position="absolute" bottom={3} right={3}>
                  {renderFeedButtons()}
                </Box>
                <Text align="right">{formatTimestamp(post.createdAt)}</Text>
              </VStack>
            </VStack>
            <AddCommentModal isOpen={addCommentDisc.isOpen}
              onClose={addCommentDisc.onClose}
              post={props.post}
              postAuthorID={props.authorID}
              commentAuthorName={userProfile.name}
              commentAuthorID={userProfile.userID}
              setComments={setComments}
            />
          </HStack>
        </Box>
      );
    } else if (use === 'activity') {
      const username = props.name;
      const userPhoto = props.photo;
      const [prompt, setPrompt] = useState();

      const getRandPrompt = () => {
        const prompts = [
          ' has been listening to...',
          ' is currently enjoying...',
          ' can\'t get enough of...',
          ' is vibing to...',
          ' is grooving to...',
        ];
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        return randomPrompt;
      };

      useEffect(() => {
        setPrompt(getRandPrompt(username));
      }, []);

      return (
        <Box w="100%" bg="gray.100" borderRadius="lg" p={5} padding="5" boxShadow="md">
          <HStack w="100%" h={350} gap="4">
            <TrackItem
              key={`${username}-${props.songID}`}
              id={props.songID}
              name={props.songName}
              artist={props.album.artists[0].name}
              imageURL={props.album.images[0].url}
              use="feed"
              flex="1"
            />
            <VStack pl={4} w="100%" h="100%" flex="1" spacing="0">
              <VStack w="100%" bg="gray.700" justify="flex-start" align="flex-start" flex="1" borderRadius="lg" p={3} spacing="1" position="relative">
                <HStack>
                  <Avatar
                    size="2xl"
                    src={userPhoto}
                    cursor="pointer"
                    margin="4"
                    onClick={() => handleNavigateUser(
                      fetchOtherProfile.userID !== props.authorID
                        ? props.authorID : userProfile.userID,
                    )}
                  />
                  <Text as="h2"
                    fontSize="2xl"
                    fontWeight="bold"
                    cursor="pointer"
                    color="white"
                    marginLeft="5"
                    onClick={() => handleNavigateUser(
                      fetchOtherProfile.userID !== props.authorID
                        ? props.authorID : userProfile.userID,
                    )}
                    _hover={{ color: 'teal.500' }}
                  >
                    {username}
                  </Text>
                  <Text as="h2" fontSize="2xl" fontWeight="bold" color="white">
                    {prompt}
                  </Text>
                </HStack>
                <Text as="h1" fontSize="37" fontWeight="bold" marginLeft="5" color="white">{props.songName}</Text>
                <Text as="h2" fontSize="30" fontWeight="bold" marginLeft="5" color="gray.200">{props.album.artists[0].name}</Text>
                <Box position="absolute" bottom={3} right={3}>
                  {renderFeedButtons()}
                </Box>
              </VStack>
            </VStack>
          </HStack>
        </Box>
      );
    } else {
      const name = post.songName;
      const { imageURL, artists } = post;
      return (
        <Box onClick={handleFullPostModalOpen}
          cursor="pointer"
          w="100%"
        >
          <TrackItem key={post.id} id={post.id} name={name} artist={artists} imageURL={imageURL} />
          <AddCommentModal isOpen={addCommentDisc.isOpen} onClose={addCommentDisc.onClose} post={props.post} postAuthorID={props.authorID} commentAuthorID={userProfile.userID} />
        </Box>
      );
    }
  };

  return (
    <Fade direction="up" duration="500" triggerOnce="true">
      {renderTrackPost()}
    </Fade>
  );
};

export default PostCard;
