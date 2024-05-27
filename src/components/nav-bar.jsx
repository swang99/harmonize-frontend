import { Button, Flex } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';
import { logout } from '../utils/SpotifyAuth';

const NavBar = () => {
  const navigate = useNavigate();
  const profile = useStore((store) => store.profileSlice.currentProfile);
  const token = localStorage.getItem('access_token');

  const links = [
    { to: '/home', label: 'Home' },
    profile ? { to: `/users/${profile.userID}`, label: 'Profile' } : { label: 'Profile' },
    { to: '/search', label: 'Search' },
    { to: '/new-post', label: 'New Post' },
  ].filter(Boolean); // Filter out null values

  return (
    token && (
    <Flex bg="white" p={4} justifyContent="space-between" alignItems="center" height={75} boxShadow="sm">
      <Flex align="center">
        {links.map((link) => (
          <Button
            key={link.label}
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
        borderRadius="full"
        px={4}
        py={2}
        colorScheme="red"
        variant="solid"
      >
        Logout
      </Button>
    </Flex>
    )
  );
};

export default NavBar;
