import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Feed from './feed';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/home" element={Feed} />
        <Route path="*" element={<div>post not found </div>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
