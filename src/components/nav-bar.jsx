import { Flex, Button, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const linkHoverColor = useColorModeValue('teal.700', 'pink.500');
  const navBg = useColorModeValue('gray.100', 'gray.800');
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log('Logged out');
  };

  const links = [
    { to: '/home', label: 'Home' },
    { to: '/users/test1', label: 'Profile' },
    { to: '/search', label: 'Search' },
  ];

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
        onClick={handleLogout}
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
