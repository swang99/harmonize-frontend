import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AnimatedRoutes from './animated-routes';
import NavBar from './nav-bar';
import SpotifyPlayer from './web-player';

const theme = extendTheme({
  colors: {
    blue: {
      800: '#1565C0',
      300: '#87B1E2',
    },
  },
});
const App = () => {
  return (
    <ChakraProvider theme={theme}>
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
