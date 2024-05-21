/* eslint-disable no-unused-vars */
import { Box, Button, Heading, VStack } from '@chakra-ui/react';
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
      <VStack p="5%" w="80%" align="center" justify="center" spacing={5}>
        <Heading as="h1" fontSize="96px" color="white">Harmonize.</Heading>
        <Heading as="h2" size="xl" color="gray.200">Spotify sharing made easy-- so new music is always at your fingertips.</Heading>
        <Button colorScheme="teal" fontSize="24px" borderRadius="full" w="300px" h="50" variant="solid" className="login-button" mt={8} onClick={redirectToSpotifyAuth}>Login with Spotify</Button>
      </VStack>
    </Box>
  );
};

export default Login;
