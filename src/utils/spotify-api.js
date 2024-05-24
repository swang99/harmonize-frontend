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
        limit: 20,
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
        limit: 50,
      },
    });

    return response.data.items;
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
  const accessToken = localStorage.getItem('access_token');

  const idTypeMap = {
    track: 'tracks',
    artist: 'artists',
    album: 'albums',
    playlist: 'playlists',
  };

  try {
    const response = await axios.get(`https://api.spotify.com/v1/${idTypeMap[type]}/${id}`, {
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

/**
 * Plays a specific track on Spotify.
 *
 * @param {string} trackId - The ID of the track to play.
 * @returns {Promise<void>} - A promise that resolves when the track is played.
 * @throws {Error} - If there is an error playing the track on Spotify.
 */
export async function playTrack(deviceId, trackId) {
  const accessToken = localStorage.getItem('access_token');

  if (!accessToken) {
    console.error('No access token found in localStorage');
    return;
  }

  const url = 'https://api.spotify.com/v1/me/player/play';
  const body = {
    uris: [`spotify:track:${trackId}`],
  };

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };

  if (deviceId) {
    config.params = {
      device_id: deviceId,
    };
  }

  try {
    await axios.put(url, body, config);
    console.log('Track is playing');
  } catch (error) {
    if (error.response) {
      console.error('Error Playing Track on Spotify:', error.response.data);
    } else {
      console.error('Error Playing Track on Spotify:', error.message);
    }
    throw error;
  }
}

/**
 * Switches the playback device on Spotify.
 *
 * @param {string} deviceId - The ID of the device to switch to.
 * @returns {Promise<void>} - A promise that resolves when the playback device is switched.
 * @throws {Error} - If there is an error switching the playback device on Spotify.
 */
export async function switchPlaybackDevice(deviceId) {
  const accessToken = await localStorage.getItem('access_token');
  console.log('Switching Playback Device on Spotify:', deviceId);
  try {
    const response = await axios.put(
      'https://api.spotify.com/v1/me/player',
      {
        device_ids: [deviceId],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    console.log('Switched Playback Device on Spotify:', response.data);
  } catch (error) {
    console.error('Error Switching Playback Device on Spotify', error);
    throw error;
  }
}

/**
 * Retrieves the current playback state from Spotify, including the active device.
 *
 * @returns {Promise<Object>} - A promise that resolves to the current playback state.
 * @throws {Error} - If there is an error fetching the current playback state from Spotify.
 */
export async function getCurrentDevice() {
  const accessToken = localStorage.getItem('access_token');
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error Fetching Current Playback from Spotify', error);
    throw error;
  }
}

/**
 * Adds a track to a specified user playlist
 * @param {string} playlistId - The ID of the playlist to add the track to
 * @param {string} trackId - The ID of the track to add to the playlist
 * @returns {Promise<void>} - A promise that resolves when the track is added to the playlist
 * @throws {Error} - If there is an error adding the track to the playlist
 */

export async function addTrackToPlaylist(playlistId, trackId) {
  const accessToken = localStorage.getItem('access_token');
  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      { uris: [`spotify:track:${trackId}`] },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    console.log('Added track to playlist:', response.data);
  } catch (error) {
    console.error('Error adding track to playlist:', error);
    throw error;
  }
}
