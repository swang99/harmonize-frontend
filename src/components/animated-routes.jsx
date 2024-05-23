import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Feed from './feed';
import Login from './login';
import Profile from './Profile';
import SearchBar from './search-bar';
import NewPostPage from './NewPostPage';

const AnimatedRoutes = () => {
  const routeHeight = window.innerHeight - 165; // NavBar: 75px, Footer: 90px
  const location = useLocation();
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Feed height={routeHeight} />} />
        <Route path="/search" element={<SearchBar />} />
        <Route path="/users/:id" element={<Profile />} />
        <Route path="/new-post" element={<NewPostPage />} />
        <Route path="*" element={<div>Post not found</div>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
