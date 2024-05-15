const generateCodeVerifier = () => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const sha256 = async (buffer) => {
  return crypto.subtle.digest('SHA-256', buffer);
};

const base64urlencode = (str) => {
  const chars = Array.from(new Uint8Array(str), (byte) => String.fromCharCode(byte)).join('');
  return btoa(chars).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const generateCodeChallenge = async (codeVerifier) => {
  const buffer = new TextEncoder().encode(codeVerifier);
  const digest = await sha256(buffer);
  return base64urlencode(digest);
};

const redirectToSpotifyAuth = async () => {
  const clientId = 'YOUR_SPOTIFY_CLIENT_ID';
  const redirectUri = 'YOUR_REDIRECT_URI';
  const scope = 'SCOPE_STRING'; // Define scopes as needed
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem('spotify_code_verifier', codeVerifier);

  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
  window.location.href = authUrl;
};

export { redirectToSpotifyAuth };
