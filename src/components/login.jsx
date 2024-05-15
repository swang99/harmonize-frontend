import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { redirectToSpotifyAuth } from '../utils/SpotifyAuth';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const expiresAt = localStorage.getItem('expires_at');

    if (accessToken && new Date().getTime() < expiresAt) {
      navigate('/home'); // Redirect to home if the token is still valid
    }
  }, [navigate]);

  return (
    <Box bg="gray.800" minH="100vh" py="20" px="4">
      <Flex direction="column" maxW="md" mx="auto" p="8" bg="gray.700" borderRadius="md">
        <Heading mb="6" color="white" textAlign="center">
          Login
        </Heading>
        <Button colorScheme="green" size="lg" mb="4" onClick={redirectToSpotifyAuth}>Login with Spotify</Button>
      </Flex>
    </Box>
  );
};

export default Login;
