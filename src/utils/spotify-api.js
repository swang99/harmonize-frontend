import axios from 'axios';

/**
 * Get the embed URL for a Spotify track.
 * @param {string} trackId - The ID of the Spotify track.
 * @returns {Promise<string>} The embed URL for the track.
 * @throws {Error} If there is an error retrieving the embed URL.
 */
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

/**
 * Searches Spotify for tracks based on the provided query.
 * @param {string} query - The search query.
 * @returns {Promise<Array>} - A promise that resolves to an array of track objects.
 * @throws {Error} - If an error occurs during the search.
 */
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

/**
 * Searches Spotify for track IDs based on the given query.
 *
 * @param {string} query - The search query.
 * @returns {Promise<string[]>} - A promise that resolves to an array of track IDs.
 * @throws {Error} - If there is an error during the search.
 */
export async function searchSpotifyIDs(query) {
  try {
    const items = await searchSpotify(query);
    return items.map((track) => track.id);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

/**
 * Retrieves the embed URLs for the search results of a given query.
 *
 * @param {string} query - The search query.
 * @returns {Promise<string[]>} - A promise that resolves to an array of embed URLs.
 * @throws {Error} - If there is an error during the retrieval process.
 */
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

/**
 * Retrieves the user's top tracks from the Spotify API.
 * @returns {Promise<Object>} A promise that resolves to the user's top tracks data.
 * @throws {Error} If the access token is missing or if there is an error retrieving the top tracks.
 */
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

/**
 * Retrieves the user's top artists from the Spotify API.
 * @returns {Promise<Object>} A promise that resolves to the response data containing the user's top artists.
 * @throws {Error} If there is an error retrieving the top artists.
 */
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

/**
 * Retrieves the user profile data from the Spotify API.
 * @returns {Promise<Object>} A promise that resolves to the user profile data.
 * @throws {Error} If there is an error fetching the user profile data.
 */
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

/**
 * Retrieves the current user's playlists from the Spotify API.
 * @returns {Promise<Object>} The response data containing the user's playlists.
 * @throws {Error} If there was an error fetching the user playlists from Spotify.
 */
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

/**
 * Retrieves the recently played tracks from the Spotify API.
 * @returns {Promise<Object>} The response data containing the recently played tracks.
 * @throws {Error} If there is an error fetching the recently played tracks.
 */
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

/**
 * Retrieves data for a specific item from the Spotify API.
 *
 * @param {string} id - The ID of the item to retrieve.
 * @param {string} type - The type of the item (track, artist, or album).
 * @returns {Promise<Object>} - A promise that resolves to the retrieved item data.
 * @throws {Error} - If there is an error fetching the item data from Spotify.
 */
export async function getItemData(id, type) {
  const accessToken = await localStorage.getItem('access_token');
  const idType = {
    track: 'tracks',
    artist: 'artists',
    album: 'albums',
  };

  try {
    const response = await axios.get(`https://api.spotify.com/v1/${idType[type]}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error Fetching Item Data from Spotify', error);
    throw error;
  }
}
