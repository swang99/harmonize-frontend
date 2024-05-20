import { Button, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';
import { logout } from '../utils/SpotifyAuth';

const NavBar = () => {
  const navBg = useColorModeValue('gray.100', 'gray.800');
  const navigate = useNavigate();
  const profile = useStore((store) => store.profileSlice.currentProfile);
  console.log('Profile:', profile);

  const links = [
    { to: '/home', label: 'Home' },
    profile ? { to: `/users/${profile.userID}`, label: 'Profile' } : { label: 'Profile' },
    { to: '/search', label: 'Search' },
  ].filter(Boolean); // Filter out null values

  return (
    profile ? (
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
                color: 'teal.800',
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
    ) : (null)
  );
};

export default NavBar;
