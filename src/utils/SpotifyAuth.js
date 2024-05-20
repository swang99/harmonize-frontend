import axios from 'axios';

const clientId = '28aa68c6ae6243589d5733382d57d5c2';
// const clientSecret = '2ab36ec92e4046bfbf86ffa669d02fc7';
const redirectUri = 'http://localhost:5173/home';
const scope = 'user-read-private user-read-email user-top-read user-read-recently-played streaming';
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
  const codeVerifier = localStorage.getItem('code_verifier');
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const url = 'https://accounts.spotify.com/api/token';

  try {
    const response = await axios.post(url, new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // store the access and refresh tokens in local storage
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);

    // store the expiration time in local storage
    const expiresAt = new Date().getTime() + response.data.expires_in * 1000; // Convert expiresIn to milliseconds and add to current time
    localStorage.setItem('expires_at', expiresAt);
    window.history.replaceState({}, document.title, window.location.pathname);
  } catch (error) {
    console.error('Failed to get new token:', error);
    throw error; // rethrow the error to handle it in the caller
  }
};

/* fetches a new access token using the existing refresh token */
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const url = 'https://accounts.spotify.com/api/token';
    const payload = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
    });

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);

    // store the expiration time in local storage
    const expiresAt = new Date().getTime() + response.data.expires_in * 1000; // Convert expiresIn to milliseconds and add to current time
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
  if (!refreshToken || refreshToken === 'undefined') {
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
    await getNewToken();
  } else if (checkForRefreshToken()) {
    // if current token expired, get a new one
    if (!isTokenValid()) {
      await refreshAccessToken();
    }
  }
  return true;
};

// logout the user
const logout = async () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('expires_at');
  localStorage.removeItem('code_verifier');

  // redirect to the home page
  window.location.href = '/';
};

export { logout, refreshAccessToken, checkForRefreshToken, isTokenValid, updateToken, redirectToSpotifyAuth, getNewToken };
