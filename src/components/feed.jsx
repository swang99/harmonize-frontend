import React from 'react';
// import React, { useEffect, useState } from 'react';
// import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
// import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Feed() {
  return (
    <motion.div
      initial={{ x: -1000, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 1000, opacity: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 50, damping: 12 }}
    >
      Feed
    </motion.div>
  );
}

export default Feed;
