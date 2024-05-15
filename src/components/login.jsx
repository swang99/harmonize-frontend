/* eslint-disable no-unused-vars */
import React from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react';

function Login() {
  const handleLogin = () => {
    console.log('Log in clicked!');
  };

  return (
    <Card maxW={{ base: '90%', md: 'sm', lg: 'md' }} mx="auto" borderWidth="1px" borderRadius="lg" boxShadow="lg" p={{ base: '4', md: '6' }}>
      <CardFooter>
        <Button colorScheme="blue" onClick={handleLogin} w="full">
          Log In
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Login;
