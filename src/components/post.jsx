import { Card, GridItem } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getItemData } from '../utils/spotify-api';

const Post = (props) => {
  const [postData, setPostData] = useState(null);
  const [postFetched, setPostFetched] = useState(false);
  console.log('Props: ', props);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const itemData = await getItemData(props.id, props.type);
        setPostData(itemData);
        setPostFetched(true);
      } catch (error) {
        console.error('Failed to fetch post data:', error);
      }
    };
    fetchPostData();
  }, []);

  useEffect(() => {
    if (postFetched) {
      console.log('PostFetched:', postFetched, 'Post data:', postData);
    }
  }, [postFetched]);

  return (
    <GridItem colSpan={1}><Card>{props.comment}</Card></GridItem>
  );
};

export default Post;
