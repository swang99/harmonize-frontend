import { ChakraProvider } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AnimatedRoutes from './animated-routes';
import NavBar from './nav-bar';
import SpotifyPlayer from './web-player';
import useStore from '../store';

const App = () => {
  const [initialFetch, setInitialFetch] = useState(false);
  const { currentProfile, fetchProfile } = useStore((store) => store.profileSlice);
  useEffect(() => {
    if (currentProfile && currentProfile.userID && !initialFetch) {
      fetchProfile(currentProfile.userID);
      setInitialFetch(true);
    }
    // Refresh profile every 5 minutes
    const interval = setInterval(() => {
      fetchProfile(currentProfile.userID);
    }, 300000);
    return () => clearInterval(interval);
  }, [currentProfile]);
  return (
    <ChakraProvider>
      <BrowserRouter>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="w-screen h-screen overflow-hidden bg-green-light">
          <NavBar />
          <AnimatedRoutes />
          <SpotifyPlayer />
        </div>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
