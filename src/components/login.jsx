/* eslint-disable no-unused-vars */
import { Box, Button, Heading, VStack, Image, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { redirectToSpotifyAuth } from '../utils/SpotifyAuth';
import SpotifyPlayer from './web-player';


const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      navigate('/home');
    }
  }, []);

  return (
    <Box bg="teal.800" w="100vw" h="100vh" align="center">
      <Box bg="teal.800"
        position="absolute"
        top="0%" /* Adjust to set the position 20% down the screen */
        left="50%"
        transform="translate(-50%, -50%)"
        w="100vw"
      >
        <Image
          mt="60vh"
          src="/src/img/logoWhite.png"
          alt="logo"
          width="40vw"
          height="auto"
        />
      </Box>
      <VStack p="5%" w="90%" align="center" justify="center" spacing={5} mt="50vh">
        <Text fontSize="50px" color="gray.200">Spotify sharing made easy - new music always at your fingertips.</Text>
        <Button
          colorScheme="teal"
          color="white"
          _hover={{ bg: 'teal.600', color: 'white' }}
          fontSize="24px"
          borderRadius="full"
          w="300px"
          h="50"
          variant="outline"
          className="login-button"
          mt={8}
          onClick={redirectToSpotifyAuth}
        >
          Login with Spotify
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;
