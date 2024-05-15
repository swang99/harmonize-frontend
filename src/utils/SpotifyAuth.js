import axios from 'axios';

const clientId = '28aa68c6ae6243589d5733382d57d5c2';
const redirectUri = 'http://localhost:5173/home';
const scope = 'user-read-private user-read-email';
const authUrl = new URL('https://accounts.spotify.com/authorize');

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

  // store the access and refresh tokens in local storage
  localStorage.setItem('access_token', response.access_token);
  localStorage.setItem('refresh_token', response.refresh_token);

  // store the expiration time in local storage
  const expiresAt = new Date().getTime() + response.expires_in * 1000; // Convert expiresIn to milliseconds and add to current time
  localStorage.setItem('expires_at', expiresAt);
};

const isTokenValid = () => {
  const expiresAt = localStorage.getItem('expires_at');
  return new Date().getTime() < expiresAt;
};

const updateToken = async () => {
  if (!localStorage.getItem('access_token') || !localStorage.getItem('refresh_token') || !localStorage.getItem('expires_at')) {
    console.log('No token found. Redirecting to Spotify Auth...');
    redirectToSpotifyAuth();
  }

  if (!isTokenValid()) {
    console.log('Token is expired or not valid. Fetching a new token...');
    // Logic to fetch a new token and update local storage
    getNewToken();
  } else {
    console.log('Token is still valid. No need to fetch a new one.');
  }
};

// !!! create new Profile right after auth but right before loading homepage
const createProfile = async () => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    console.log('No access token found, please authenticate');
    return;
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

export { isTokenValid, updateToken, redirectToSpotifyAuth, getNewToken, createProfile };
