/* eslint-disable no-unused-vars */
import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { redirectToSpotifyAuth } from '../../utils/SpotifyAuth';
import { useAuth } from './auth-context';
import './login.scss';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const expiresAt = localStorage.getItem('expires_at');

    if (accessToken && new Date().getTime() < expiresAt) {
      login(accessToken, expiresAt);
      navigate('/home'); // Redirect to home if the token is still valid
    }
  }, [login, navigate]);

  return (
    <div className="login-page">
      <img className="login-image" src="../../img/logoBlue.png" alt="Logo" />
      <Button colorScheme="blue" variant="outline" className="login-button" onClick={redirectToSpotifyAuth}>Login with Spotify</Button>
    </div>
  );
};

export default Login;
