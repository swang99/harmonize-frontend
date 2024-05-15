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

const getToken = async () => {
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

  // store the token in local storage with the expiration time
  localStorage.setItem('access_token', response.access_token);
  const expiresAt = new Date().getTime() + response.expires_in * 1000; // Convert expiresIn to milliseconds and add to current time
  localStorage.setItem('expires_at', expiresAt);
};

export { redirectToSpotifyAuth, getToken };
