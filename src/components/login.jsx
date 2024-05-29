/* eslint-disable no-unused-vars */
import { Box, Button, Heading, VStack, Image, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { redirectToSpotifyAuth } from '../utils/SpotifyAuth';
import SpotifyPlayer from './web-player';

import sound1 from '../img/sound1.jpeg';
import water from '../img/water.jpeg';
import logo from '../img/logo.png';
import logoWhite from '../img/logoWhite.png';
import feed from '../img/feed.png';
import feedGif from '../img/feed.gif';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      navigate('/home');
    }
  }, []);

  return (
    <div>
      {/* scrolling effect */}
      <Parallax pages={4}>
        <ParallaxLayer
          offset={0}
          speed={1}
          factor={1.5}
          style={{
            backgroundImage: `url(${water})`,
            backgroundSize: 'cover',
            backgroundPositionX: 'center',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <VStack spacing={5} align="center">
            <Image
              src={logoWhite}
              alt="logo"
              width="350px"
              height="auto"
              style={{ marginTop: '-30vh' }}
            />
            <Button
              colorScheme="teal"
              color="white"
              _hover={{ bg: 'teal.600', color: 'white' }}
              fontSize="24px"
              borderRadius="full"
              w="300px"
              h="50px"
              variant="outline"
              className="login-button"
              onClick={redirectToSpotifyAuth}
            >
              Login with Spotify
            </Button>
            <Text
              fontSize="50px"
              align="center"
              color="gray.200"
              style={{
                marginLeft: '20vh',
                marginRight: '20vh',

              }}
            >
              Spotify sharing made easy - new music always at your fingertips.
            </Text>
          </VStack>
        </ParallaxLayer>
        <ParallaxLayer
          offset={1}
          speed={0.5}
          style={{
            backgroundImage: `url(${feed})`,
            backgroundSize: '90%',
          }}
        >
          <h2>Feed Page</h2>
        </ParallaxLayer>
      </Parallax>
    </div>
  );
};

export default Login;

// /* eslint-disable no-unused-vars */
// import { Box, Button, Heading, VStack, Image, Text } from '@chakra-ui/react';
// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router';
// import { redirectToSpotifyAuth } from '../utils/SpotifyAuth';
// import SpotifyPlayer from './web-player';

// const Login = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const refreshToken = localStorage.getItem('refresh_token');
//     if (refreshToken) {
//       navigate('/home');
//     }
//   }, []);

//   return (
//     <div>
//       <Box bg="teal.800" w="100vw" h="100vh" align="center">
//         <Box bg="teal.800"
//           position="absolute"
//           top="0%" /* Adjust to set the position 20% down the screen */
//           left="50%"
//           transform="translate(-50%, -50%)"
//           w="100vw"
//         >
//           <Image
//             mt="60vh"
//             src="/src/img/logoWhite.png"
//             alt="logo"
//             width="40vw"
//             height="auto"
//           />
//         </Box>
//         <VStack p="5%" w="90%" align="center" justify="center" spacing={5} mt="50vh">
//           <Text fontSize="50px" color="gray.200">Spotify sharing made easy - new music always at your fingertips.</Text>
//           <Button
//             colorScheme="teal"
//             color="white"
//             _hover={{ bg: 'teal.600', color: 'white' }}
//             fontSize="24px"
//             borderRadius="full"
//             w="300px"
//             h="50"
//             variant="outline"
//             className="login-button"
//             mt={8}
//             onClick={redirectToSpotifyAuth}
//           >
//             Login with Spotify
//           </Button>
//         </VStack>
//       </Box>
//     </div>
//   );
// };

// export default Login;
