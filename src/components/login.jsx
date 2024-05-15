import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import React from 'react';

const Login = () => {
  return (
    <Box bg="gray.800" minH="100vh" py="20" px="4">
      <Flex direction="column" maxW="md" mx="auto" p="8" bg="gray.700" borderRadius="md">
        <Heading mb="6" color="white" textAlign="center">
          Login
        </Heading>
        <Button colorScheme="teal" size="lg" mb="4">Login with Spotify</Button>
        <Button colorScheme="gray" size="lg">
          Sign Up
        </Button>
      </Flex>
    </Box>
  );
};

export default Login;
