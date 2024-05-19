/* eslint-disable no-unused-vars */
import { Button } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { redirectToSpotifyAuth } from '../utils/SpotifyAuth';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      navigate('/home');
    }
  }, []);

  return (
    <div className="login-page">
      <img className="login-image" src="../../img/logoBlue.png" alt="Logo" />
      <Button colorScheme="blue" variant="outline" className="login-button" onClick={redirectToSpotifyAuth}>Login with Spotify</Button>
    </div>
  );
};

export default Login;
