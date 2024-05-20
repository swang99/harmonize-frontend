import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ChakraProvider } from '@chakra-ui/react';
import AnimatedRoutes from './animated-routes';
import NavBar from './nav-bar';
import SpotifyPlayer from './web-player';

const App = () => {
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
