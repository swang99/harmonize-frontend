import React, { useEffect, useRef } from 'react';
import { Button, VStack, Image, Text, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { redirectToSpotifyAuth } from '../utils/SpotifyAuth';
import Waves from './waves';

import water from '../img/water.jpeg';
import logoWhite from '../img/logoWhite.png';
import feed from '../img/feed.png';
import activityImage from '../img/activity.png';
import postsImage from '../img/posts.png';

function useParallax(value, distance) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

const Login = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: scrollContainerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Use the useParallax function
  const translateY = useParallax(scrollYProgress, 100);

  useEffect(() => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      navigate('/home');
    }
  }, [navigate]);

  return (
    <Box ref={scrollContainerRef} overflow="hidden">
      <Parallax pages={4}>
        <ParallaxLayer
          offset={0}
          speed={1}
          factor={1}
          style={{
            transform: translateY, // Apply the transform using useParallax
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
              style={{ marginTop: '-20vh' }}
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
          offset={0.85}
          speed={1}
          style={{ pointerEvents: 'none', zIndex: 1 }}
        >
          <Waves gradientStart="#002B5B" gradientEnd="#9AC6E5" />
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

        <ParallaxLayer
          offset={1.95}
          speed={1}
          style={{ pointerEvents: 'none', zIndex: 1 }}
        >
          <Waves gradientStart="#9AC6E5" gradientEnd="#002B5B" />
        </ParallaxLayer>

        <ParallaxLayer
          offset={2}
          speed={0.5}
          style={{
            backgroundImage: `url(${activityImage})`,
            backgroundSize: '90%',
          }}
        >
          <h2>Activity Page</h2>
        </ParallaxLayer>

        <ParallaxLayer
          offset={2.95}
          speed={1}
          style={{ pointerEvents: 'none', zIndex: 1 }}
        >
          <Waves gradientStart="#002B5B" gradientEnd="#9AC6E5" />
        </ParallaxLayer>

        <ParallaxLayer
          offset={3}
          speed={0.5}
          style={{
            backgroundImage: `url(${postsImage})`,
            backgroundSize: '90%',
          }}
        >
          <h2>Posts Page</h2>
        </ParallaxLayer>
      </Parallax>
      <motion.div className="progress" style={{ scaleX }} />
    </Box>
  );
};

export default Login;
