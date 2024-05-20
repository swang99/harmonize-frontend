import { Flex, Button, useColorModeValue } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';
import { logout } from '../utils/SpotifyAuth';

const NavBar = () => {
  const linkHoverColor = useColorModeValue('teal.700', 'pink.500');
  const navBg = useColorModeValue('gray.100', 'gray.800');
  const navigate = useNavigate();
  const profile = useStore((store) => store.profileSlice.currentProfile);
  console.log('Profile:', profile);

  const links = [
    { to: '/home', label: 'Home' },
    profile ? { to: `/users/${profile.userID}`, label: 'Profile' } : null,
    { to: '/search', label: 'Search' },
  ].filter(Boolean); // Filter out null values

  useEffect(() => {
    console.log('Profile:', profile);
  }, [profile]);

  return (
    <Flex bg={navBg} p={4} justifyContent="space-between" alignItems="center">
      <Flex align="center">
        {links.map((link) => (
          <Button
            key={link.to}
            onClick={() => navigate(link.to)}
            mx={2}
            colorScheme="teal"
            variant="ghost"
            _hover={{
              color: linkHoverColor,
              variant: 'solid',
            }}
          >
            {link.label}
          </Button>
        ))}
      </Flex>
      <Button
        onClick={logout}
        px={4}
        py={2}
        rounded="md"
        colorScheme="red"
        variant="solid"
      >
        Logout
      </Button>
    </Flex>
  );
};

export default NavBar;
