import { Box, HStack, Icon, useDisclosure, Heading, Avatar, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { CgPlayListAdd } from 'react-icons/cg';
import { FaComment } from 'react-icons/fa';
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
 * @param {string} props.id - The ID of the post.
 * @param {string} props.type - The type of the post.
 * @param {string} props.description - The description associated with the post.
 * @param {[String]} props.comments -The comments associated with the post.
 * @param {string} props.use - The use of the PostCard component (feed, profile, etc.).
 * @returns {JSX.Element} The rendered Post component.
 */
const PostCard = (props) => {
  // Destructure props, store postData
  const { post, use } = props;
  const [postItemData, setPostItemData] = useState(null);
  const { id, type } = post;
  console.log(id, type);
  const addTrackToPlaylistDisc = useDisclosure();
  const addCommentDisc = useDisclosure();
  const { playlists } = useStore((store) => store.profileSlice);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        console.log('Fetching post data with id:', id, 'and type:', type); // Debugging log
        const data = await getItemData(id, type);
        setPostItemData(data);
      } catch (error) {
        console.error('Failed to fetch post data:', error);
      }
    };
    fetchPostData();
  }, []);

  useEffect(() => {
    console.log('Post item data: ', postItemData);
  }, [postItemData]);

  const renderTrackPost = () => {
    const { name } = postItemData;
    const imageURL = postItemData.album.images[0].url;
    const artists = postItemData.artists[0].name;

    if (use === 'feed') {
      const username = post.name;
      const userPhoto = post.photo;
      return (
        <HStack>
          <TrackItem key={id} id={id} name={name} artist={artists} imageURL={imageURL} w="50%" />
          <Box p={3}>
            <VStack>
              <HStack>
                <Avatar size="sm" src={userPhoto} />
                <Heading>{username}</Heading>
              </HStack>
            </VStack>
            <Icon
              as={CgPlayListAdd}
              w={7}
              h={7}
              cursor="pointer"
              color="teal.900"
              _hover={{ color: 'teal.500', transform: 'scale(1.1)' }}
              onClick={addTrackToPlaylistDisc.onOpen}
            />
          </Box>
          <AddTrackToPlaylistModal isOpen={addTrackToPlaylistDisc.isOpen} onClose={addTrackToPlaylistDisc.onClose} trackID={postItemData.id} playlists={playlists} />
        </HStack>
      );
    }
    return (
      <HStack>
        <TrackItem key={id} id={id} name={name} artist={artists} imageURL={imageURL} />
        <Box p={3}>
          <Icon
            as={CgPlayListAdd}
            w={7}
            h={7}
            cursor="pointer"
            color="teal.900"
            _hover={{ color: 'teal.500', transform: 'scale(1.1)' }}
            onClick={addTrackToPlaylistDisc.onOpen}
          >
            Add to Playlist
          </Icon>
          <Icon
            as={FaComment}
            w={7}
            h={7}
            cursor="pointer"
            color="teal.900"
            _hover={{ color: 'teal.500', transform: 'scale(1.1)' }}
            onClick={addCommentDisc.onOpen}
          >
            Add to Playlist
          </Icon>
        </Box>
        <AddTrackToPlaylistModal isOpen={addTrackToPlaylistDisc.isOpen} onClose={addTrackToPlaylistDisc.onClose} trackID={postItemData.id} playlists={playlists} />
        <AddCommentModal isOpen={addCommentDisc.isOpen}
          onClose={addCommentDisc.onClose}
          postData={post}
          profile={props.profile}
        />
      </HStack>
    );
  };

  // function to render an album post
  const renderAlbumPost = (postData) => {
    return (
      null
    );
  };
  // function to render an artist post
  const renderArtistPost = (postData) => {
    return (
      null
    );
  };

  // function to render a playlist post
  const renderPlaylistPost = (postData) => {
    return (
      null
    );
  };

  // renders the post correctly according to what type of content it contains
  const renderPost = () => {
    if (!postItemData) {
      return null;
    } else if (type === 'track') {
      return renderTrackPost(postItemData);
    } else if (type === 'album') {
      return renderAlbumPost(postItemData);
    } else if (type === 'playlist') {
      return renderArtistPost(postItemData);
    } else if (type === 'artist') {
      return renderPlaylistPost(postItemData);
    }
    return null;
  };

  return renderPost();
};

export default PostCard;
