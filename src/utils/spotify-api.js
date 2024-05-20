import axios from 'axios';

/* Get Embed URL from Spotify Track ID */
export default async function getEmbedUrl(trackId) {
  const accessToken = await localStorage.getItem('access_token');
  try {
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const embedUrl = `https://open.spotify.com/embed/track/${response.data.id}`;
    return embedUrl;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

/* Search Spotify API for tracks */
export async function searchSpotify(query) {
  const accessToken = await localStorage.getItem('access_token');
  try {
    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: query,
        type: 'track',
        limit: 5,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.tracks.items;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

/* Get Spotify URLs from a search query */
export async function searchSpotifyIDs(query) {
  try {
    const items = await searchSpotify(query);
    return items.map((track) => track.id);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

/* Get All Embed URLs from a searchSpotifyUrls call */
export async function getEmbedFromSearch(query) {
  try {
    const ids = await searchSpotifyIDs(query);
    const embeds = await Promise.all(ids.map((id) => getEmbedUrl(id)));
    return embeds;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

/* Get a user's top tracks */
export async function getUserTopTracks() {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('Access token is missing. Please authenticate.');
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      params: {
        time_range: 'short_term',
        limit: 20,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error retrieving top tracks:', error);
    throw new Error('Error retrieving top tracks');
  }
}

/* get a user's top artists */
export async function getUserTopArtists() {
  const accessToken = await localStorage.getItem('access_token');
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        time_range: 'short_term',
        limit: 20,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error retrieving top artists:', error);
    throw error;
  }
}

// get the user's profile parameteres
export async function getUserProfile() {
  const accessToken = await localStorage.getItem('access_token');
  const url = 'https://api.spotify.com/v1/me';
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.statusText}`);
    }
    const data = await response.json();
    return data; // This will return the user profile data
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error; // Rethrow the error for further handling
  }
}

/* Function to get the current user's playlists */
export async function getCurrentUserPlaylists() {
  const accessToken = await localStorage.getItem('access_token');
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user playlists from Spotify:', error);
    throw error;
  }
}

// Function to get the current user's recently played tracks from Spotify API
export async function getRecentlyPlayedTracks() {
  const accessToken = await localStorage.getItem('access_token');
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit: 20,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching recently played tracks from Spotify:', error);
    throw error;
  }
}
