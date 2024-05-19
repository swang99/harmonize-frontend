import axios from 'axios';

const clientId = '28aa68c6ae6243589d5733382d57d5c2';
// const clientSecret = '2ab36ec92e4046bfbf86ffa669d02fc7';
const redirectUri = 'http://localhost:5173/home';
const scope = 'user-read-private user-read-email user-top-read';
const authUrl = new URL('https://accounts.spotify.com/authorize');

/* Utility functions for generating the code challenge */
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};

const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
};

const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

/* Redirects the user to the Spotify authentication page */
const redirectToSpotifyAuth = async () => {
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  // Store the code verifier in local storage to use later during the token exchange
  window.localStorage.setItem('code_verifier', codeVerifier);

  const params = {
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
};

/* Fetches a new token using the code from the URL */
const getNewToken = async () => {
  // stored in the previous step
  const codeVerifier = localStorage.getItem('code_verifier');
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const url = 'https://accounts.spotify.com/api/token';

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  };

  const body = await fetch(url, payload);
  const response = await body.json();
  console.log(response);

  console.log('setting tokens', response.access_token, response.refresh_token);
  // store the access and refresh tokens in local storage
  localStorage.setItem('access_token', response.access_token);
  localStorage.setItem('refresh_token', response.refresh_token);

  // store the expiration time in local storage
  const expiresAt = new Date().getTime() + response.expires_in * 1000; // Convert expiresIn to milliseconds and add to current time
  localStorage.setItem('expires_at', expiresAt);
  window.history.replaceState({}, document.title, window.location.pathname);
};

/* fetches a new access token using the existing refresh token */
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const url = 'https://accounts.spotify.com/api/token';
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
      }),
    };

    const body = await fetch(url, payload);
    if (!body.ok) {
      throw new Error('Failed to refresh access token');
    }

    const response = await body.json();
    console.log(response);

    console.log('setting tokens', response.access_token, response.refresh_token);
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);

    // store the expiration time in local storage
    const expiresAt = new Date().getTime() + response.expires_in * 1000; // Convert expiresIn to milliseconds and add to current time
    localStorage.setItem('expires_at', expiresAt);
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error; // Optionally rethrow the error if you want to handle it further up the call stack
  }
};

/* checks if a token is still valid using expiration time */
const isTokenValid = () => {
  const expiresAt = localStorage.getItem('expires_at');
  return new Date().getTime() < expiresAt;
};

/* Checks if a refresh token exists and redirects to Spotify auth if not */
const checkForRefreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  console.log('Checking for refresh token: ', refreshToken);
  if (!refreshToken || refreshToken === 'undefined') {
    console.log('Undefined Refresh Token: Redirecting to auth');
    await redirectToSpotifyAuth();
    return false;
  }
  return true;
};

/* Checks if a token is valid and fetches a new one if not */
const updateToken = async () => {
  // check if we have a code in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (code) {
    console.log('Code found in URL - getting new token');
    await getNewToken();
  } else if (checkForRefreshToken()) {
    console.log('Refresh Token exists');
    // if current token expired, get a new one
    if (!isTokenValid()) {
      console.log('Access Token expired - refreshing');
      await refreshAccessToken();
    } else {
      console.log('Token still valid - no need to refresh');
    }
  }
};

// !!! create new Profile right after auth but right before loading homepage
const createProfile = async () => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    console.log('No access token found, please authenticate');
    throw new Error('No access token found, please authenticate');
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = response.data;
    console.log(userData);
    return userData;
  } catch (error) {
    console.error('Failed to fetch user data:', error.message);
    throw new Error('Failed to fetch user data');
  }
};

export { refreshAccessToken, checkForRefreshToken, isTokenValid, updateToken, redirectToSpotifyAuth, getNewToken, createProfile };
