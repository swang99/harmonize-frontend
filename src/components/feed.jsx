import React, { useEffect } from 'react';
// import React, { useEffect, useState } from 'react';
// import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
// import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useStore from '../store';
import { getToken } from '../utils/SpotifyAuth';

function Feed() {
  const allPosts = useStore((store) => store.postSlice.all);
  const fetchAllPosts = useStore((store) => store.postSlice.fetchAllPosts);

  useEffect(() => {
    fetchAllPosts();
    getToken();
  }, []);

  const renderPosts = () => {
    return allPosts.map((post) => (
      <div key={post.id}>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </div>
    ));
  };
  return (
    <motion.div
      initial={{ x: -1000, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 1000, opacity: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 50, damping: 12 }}
    >
      Feed
      {renderPosts()}
    </motion.div>
  );
}

export default Feed;
