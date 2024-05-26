/* eslint-disable camelcase */
import { Box, Button, Flex, HStack, Image, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Spacer, Text, VStack } from '@chakra-ui/react';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router';
import useStore from '../store';
import { initializePlayer } from '../utils/spotify-player';

const SpotifyPlayer = () => {
  const { position, duration, paused, currentTrack, incrementPosition, updatePosition } = useStore(
    (state) => state.playerSlice,
  );
  const player = window.player || null;
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    const initialize = async () => {
      if (location.pathname !== '/') {
        if (!player) {
          await initializePlayer();
        }
      }
    };
    initialize();
  }, [location.pathname]);

  useEffect(() => {
    if (!isDragging) {
      setProgress((position / duration) * 100);
    }
  }, [position, duration, isDragging]);

  useEffect(() => {
    let interval;
    if (!paused) {
      interval = setInterval(() => {
        incrementPosition();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [paused, incrementPosition]);

  const handlePlayPause = async () => {
    if (player) {
      player.togglePlay();
    }
  };

  const handleSeek = (newPosition) => {
    if (player) {
      player.seek(newPosition);
      updatePosition(newPosition);
    }
  };

  const handleSliderChange = (value) => {
    const newPosition = (value / 100) * duration;
    updatePosition(newPosition);
  };

  const handleSliderChangeEnd = (value) => {
    setIsDragging(false);
    const newPosition = (value / 100) * duration;
    handleSeek(newPosition);
  };

  const handleSliderClick = (e) => {
    const sliderTrack = sliderRef.current.querySelector('.chakra-slider__track');
    if (sliderTrack) {
      const { left, width } = sliderTrack.getBoundingClientRect();
      const clickPosition = e.clientX - left;
      const newProgress = (clickPosition / width) * 100;
      const newPosition = (newProgress / 100) * duration;
      handleSeek(newPosition);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    player
    && currentTrack && (
      <HStack
        as="footer"
        position="fixed"
        bottom="0"
        width="100%"
        height={90}
        bg="gray.100"
        color="white"
        justifyContent="center"
        zIndex="1000"
        padding={5}
      >
        {/* Image and Text Container */}
        <Flex position="absolute" left="0" height="100%" alignItems="center" pl={5}>
          <Image src={currentTrack.album.images[0].url} alt="Album cover" boxSize="50px" />
          <VStack align="left" ml={3} spacing={0}>
            <Text textColor="black" fontWeight="bold">
              {currentTrack.name}
            </Text>
            <Text textColor="gray.500">{currentTrack.artists[0].name}</Text>
          </VStack>
        </Flex>

        {/* Centered Play/Pause Button */}
        <Spacer />
        <VStack spacing={0}>
          <Button
            onClick={handlePlayPause}
            borderRadius="full"
            bg="gray.200"
            mx="auto"
            w="50px"
            h="50px"
          >
            <FontAwesomeIcon icon={paused ? faPlay : faPause} />
          </Button>
          <HStack spacing={5} justify="center" align="center" onClick={handleSliderClick}>
            <Text fontWeight="bold" color="gray.400">
              {formatTime(position)}
            </Text>
            <Box width="40vw" ref={sliderRef}>
              <Slider
                value={progress}
                onChange={handleSliderChange}
                onChangeEnd={handleSliderChangeEnd}
                step={1}
                min={0}
                max={100}
                width="100%"
                colorScheme="teal"
              >
                <SliderTrack bg="gray.200">
                  <SliderFilledTrack bg="teal.500" />
                </SliderTrack>
                <SliderThumb boxSize={4}>
                  <Box color="teal" />
                </SliderThumb>
              </Slider>
            </Box>
            <Text size="sm" fontWeight="bold" color="gray.400">
              {formatTime(duration)}
            </Text>
          </HStack>
        </VStack>
        <Spacer />
      </HStack>
    )
  );
};

export default SpotifyPlayer;
