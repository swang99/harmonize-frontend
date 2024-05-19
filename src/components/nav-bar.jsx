import { Flex, Link, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const NavBar = () => {
  // Using Chakra UI components and hooks for styling
  const linkColor = useColorModeValue('blue.500', 'blue.200');
  const linkHoverColor = useColorModeValue('blue.700', 'blue.300');
  const navBg = useColorModeValue('gray.100', 'gray.900');

  return (
    <Flex
      bg={navBg}
      p={4}
      justifyContent="space-between"
      alignItems="center"
    >
      <Flex align="center">
        <Link
          as={RouterLink}
          to="/home"
          px={2}
          py={1}
          rounded="md"
          color={linkColor}
          _hover={{
            textDecoration: 'none',
            color: linkHoverColor,
          }}
        >
          Home
        </Link>
        <Link
          as={RouterLink}
          to="/users/test1"
          px={2}
          py={1}
          rounded="md"
          color={linkColor}
          _hover={{
            textDecoration: 'none',
            color: linkHoverColor,
          }}
        >
          Profile
        </Link>
        <Link
          as={RouterLink}
          to="/search"
          px={2}
          py={1}
          rounded="md"
          color={linkColor}
          _hover={{
            textDecoration: 'none',
            color: linkHoverColor,
          }}
        >
          Search
        </Link>
      </Flex>
      <Link
        href="/"
        onClick={() => {
          // TODO: Implement logout functionality
          return null;
        }}
        px={2}
        py={1}
        rounded="md"
        color={linkColor}
        _hover={{
          textDecoration: 'none',
          color: linkHoverColor,
        }}
      >
        Logout
      </Link>
    </Flex>
  );
};

export default NavBar;
