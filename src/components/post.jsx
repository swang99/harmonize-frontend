import { Card, GridItem } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getItemData } from '../utils/spotify-api';
import { updateToken } from '../utils/SpotifyAuth';

/**
 * Represents a post component.
 *
 * @component
 * @param {Object} props - The props object containing the post data.
 * @param {string} props.id - The ID of the post.
 * @param {string} props.type - The type of the post.
 * @param {string} props.comment - The comment associated with the post.
 * @returns {JSX.Element} The rendered Post component.
 */
const Post = (props) => {
  const [postData, setPostData] = useState(null);
  const [postFetched, setPostFetched] = useState(false);
  const [tokenUpdated, setTokenUpdated] = useState(false);

  useEffect(() => {
    console.log('Post props:', props);
  }, []);

  useEffect(() => {
    const update = async () => {
      try {
        await updateToken();
        setTokenUpdated(true);
      } catch (error) {
        console.error('Failed to update token:', error);
      }
    };
    update();
  }, []);

  useEffect(() => {
    if (tokenUpdated) {
      console.log('Token Updated.');
    }
  }, [tokenUpdated]);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        console.log('Fetching post data with id:', props.id, 'and type:', props.type); // Debugging log
        const itemData = await getItemData(props.id, props.type);
        setPostData(itemData);
        setPostFetched(true);
      } catch (error) {
        console.error('Failed to fetch post data:', error);
      }
    };
    fetchPostData();
  }, [props.id, props.type]);

  useEffect(() => {
    if (postFetched) {
      console.log('PostFetched:', postFetched, 'Post data:', postData);
    }
  }, [postFetched]);

  const trackPost = () => {
    return (
      <Card>
        <img src={postData.album.images[0].url} alt={postData.name} />
        <p>{postData.name}</p>
        <p>{postData.artists[0].name}</p>
      </Card>
    );
  };

  const albumPost = () => {
    return (
      <Card>
        <img src={postData.images[0].url} alt={postData.name} />
        <p>{postData.name}</p>
        <p>{postData.artists[0].name}</p>
      </Card>
    );
  };

  const artistPost = () => {
    return (
      <Card>
        <img src={postData.images[0].url} alt={postData.name} />
        <p>{postData.name}</p>
      </Card>
    );
  };

  const renderPost = () => {
    if (!postFetched || !postData) {
      return null;
    } else if (props.type === 'track') {
      return trackPost();
    } else if (props.type === 'album') {
      return albumPost();
    } else if (props.type === 'artist') {
      return artistPost();
    } else {
      return null;
    }
  };

  return postFetched && postData ? <GridItem>{renderPost()}</GridItem> : null;
};

export default Post;
