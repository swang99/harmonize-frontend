/* eslint-disable no-unused-vars */
import { Box, Button, VStack, Image, Text, Heading, HStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { keyframes } from '@emotion/react';
import { Fade, Slide } from 'react-awesome-reveal';
import { redirectToSpotifyAuth } from '../utils/SpotifyAuth';

import logoWhite from '../img/logoWhite.png';
import profilecards from '../img/profile-cards.png';
import feedCards from '../img/feed-cards.png';
import addToPlaylist from '../img/add-to-playlist.png';
import webPlayer from '../img/web-player.png';
import searchBar from '../img/search-bar.png';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const fadeInDown = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      navigate('/home');
    }
  }, []);

  return (
    <Box
      w="100vw"
      height="100vh"
      pb="5vh"
      bgGradient="linear(45deg, #ff6b6b, #556270, #4ecdc4, #c7f464)"
      backgroundSize="800% 800%"
      animation={`${gradientAnimation} 15s ease infinite`}
      overflowY="auto" // Enable vertical scrolling
    >
      {/* Navbar with logo */}
      <Image
        src={logoWhite}
        alt="logo"
        width="75px"
        height="auto"
        position="absolute"
        top="20px"
        left="20px"
      />
      {/* Main content */}
      <Box
        w="100%"
        minH="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        pt="100px" // Add padding to prevent content from going under the navbar
        textAlign="center"
      >
        <Box
          position="relative"
          textAlign="center"
          animation={`${fadeInDown} 1s ease-out`}
          px="10%"
        >
          <Text
            fontSize="54px"
            color="white"
            fontWeight="bold"
            mt={10}
            animation={`${fadeInUp} 1s ease-out`}
          >
            Spotify sharing made easy - new music always at your fingertips.
          </Text>
        </Box>
        <VStack px="5%" pb="10%" w="90%" align="center" justify="center" spacing={5}>
          <Button
            colorScheme="teal"
            color="white"
            _hover={{ transform: 'scale(1.05)' }}
            fontSize="24px"
            borderRadius="xl"
            w="300px"
            h="50px"
            variant="outline"
            mt={8}
            onClick={redirectToSpotifyAuth}
          >
            Login with Spotify
          </Button>
        </VStack>
        <Box w="90%" mt="12" textAlign="center">
          <HStack
            bg="white"
            borderRadius="xl"
            boxShadow="md"
            mb="6"
            animation="fadeIn 1s ease-out"
            height="80vh"
          >
            <VStack textAlign="left" spacing={5} p={10} h="100%" maxW="50%" justify="center" bg="white" borderRadius="lg" align="flex-start">
              <Slide direction="up" triggerOnce>
                <Text fontSize="36px" fontWeight="bold">Post your favorite songs, with just one click.</Text>
                <Text color="gray.400" textAlign="left" fontSize="24px" fontWeight="bold" mb={20}>Share songs for all of your followers to view.</Text>
              </Slide>
            </VStack>
            <Box w="50%" m={10}>
              <Fade delay={1300} triggerOnce>
                <Image src={profilecards} alt="Discover New Music" />
              </Fade>
            </Box>
          </HStack>
        </Box>
        <Box w="90%" mt="12" textAlign="center">
          <HStack
            bg="white"
            borderRadius="xl"
            boxShadow="md"
            p={10}
            mb="6"
            animation="fadeIn 1s ease-out"
            height="80vh"
          >
            <Box w="50%" m={10}>
              <Fade delay={1300} triggerOnce>
                <Image src={feedCards} alt="Discover New Music" />
              </Fade>
            </Box>
            <VStack textAlign="left" spacing={5} p={10} h="100%" maxW="50%" justify="center" bg="white" borderRadius="lg" align="flex-start">
              <Slide direction="up" triggerOnce>
                <Text textAlign="left" fontSize="36px" fontWeight="bold">A feed tailored just for you.</Text>
                <Text color="gray.400" textAlign="left" fontSize="24px" fontWeight="bold" mb={20}>{'See friends\' posts activity with personalized recommendations in your feed.'}</Text>
              </Slide>
            </VStack>
          </HStack>
        </Box>
        <Box w="90%" mt="12" textAlign="center">
          <VStack
            bg="white"
            borderRadius="xl"
            boxShadow="md"
            p={10}
            mb="6"
            animation="fadeIn 1s ease-out"
            height="80vh"
          >
            <VStack textAlign="center" spacing={5} p={10} h="100%" maxW="50%" justify="center" bg="white" borderRadius="lg" align="center">
              <Slide direction="up" triggerOnce>
                <Text fontSize="36px" fontWeight="bold">Test songs in the app with the built in player.</Text>
                <Text color="gray.400" fontSize="24px" fontWeight="bold" mb={20}>Yes, you can skip to the middle if you want.</Text>
              </Slide>
            </VStack>
            <Box w="100%" h="50%" display="flex" alignItems="center" justifyContent="center" overflow="hidden" borderRadius="xl">
              <Fade delay={1300} triggerOnce style={{ width: '100%', height: '100%' }}>
                <Image
                  src={webPlayer}
                  alt="Discover New Music"
                  maxH="100%"
                  maxW="100%"
                  objectFit="contain"
                  width="100%"
                  height="100%"
                />
              </Fade>
            </Box>
          </VStack>
        </Box>
        <Box w="90%" mt="12" textAlign="center">
          <HStack
            bg="white"
            borderRadius="xl"
            boxShadow="md"
            p={10}
            mb="6"
            animation="fadeIn 1s ease-out"
            height="80vh"
          >
            <VStack textAlign="left" spacing={5} p={10} h="100%" maxW="50%" justify="center" bg="white" borderRadius="lg" align="flex-start">
              <Slide direction="up" triggerOnce>
                <Text fontSize="36px" fontWeight="bold">Find something you like?</Text>
                <Text color="gray.400" textAlign="left" fontSize="24px" fontWeight="bold" mb={20}>Repost or add it to your Spotify library instantly with one click.</Text>
              </Slide>
            </VStack>
            <Box w="50%" h="100%" display="flex" alignItems="center" justifyContent="center" overflow="hidden">
              <Fade delay={1300} triggerOnce style={{ width: '100%', height: '100%' }}>
                <Image
                  src={addToPlaylist}
                  alt="Discover New Music"
                  maxH="100%"
                  maxW="100%"
                  objectFit="contain"
                  width="100%"
                  height="100%"
                />
              </Fade>
            </Box>
          </HStack>
        </Box>
        <Box w="90%" mt="12" textAlign="center">
          <HStack
            bg="white"
            borderRadius="xl"
            boxShadow="md"
            p={10}
            mb="6"
            animation="fadeIn 1s ease-out"
            height="80vh"
          >
            <VStack textAlign="left" spacing={5} p={10} h="100%" maxW="50%" justify="center" bg="white" borderRadius="lg" align="flex-start">
              <Slide direction="up" triggerOnce>
                <Text fontSize="36px" fontWeight="bold">Search fast, share fast.</Text>
                <Text color="gray.400" textAlign="left" fontSize="24px" fontWeight="bold" mb={20}>Pick something from your recents, or search Spotify within the app.</Text>
              </Slide>
            </VStack>
            <Box w="50%" h="100%" display="flex" alignItems="center" justifyContent="center" overflow="hidden">
              <Fade delay={1300} triggerOnce style={{ width: '100%', height: '100%' }}>
                <Image
                  src={searchBar}
                  alt="Discover New Music"
                  maxH="100%"
                  maxW="100%"
                  objectFit="contain"
                  width="100%"
                  height="100%"
                />
              </Fade>
            </Box>
          </HStack>
        </Box>
      </Box>
      <Box
        position="relative"
        textAlign="center"
        animation={`${fadeInDown} 1s ease-out`}
        px="10%"
        mb="10vh"
      >
        <Text
          fontSize="54px"
          color="white"
          fontWeight="bold"
          mt={10}
          animation={`${fadeInUp} 1s ease-out`}
        >
          Ready to begin?
        </Text>
        <Button
          colorScheme="teal"
          color="white"
          _hover={{ transform: 'scale(1.05)' }}
          fontSize="24px"
          borderRadius="xl"
          w="300px"
          h="50px"
          variant="outline"
          mt={8}
          onClick={redirectToSpotifyAuth}
        >
          Login with Spotify
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
