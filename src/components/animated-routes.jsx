import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Feed from './feed';
import Login from './login';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Feed />} />
        <Route path="*" element={<div>Post not found</div>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
