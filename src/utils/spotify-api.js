import axios from 'axios';

/* Get Embed URL from Spotify Track ID */
export default async function getEmbedUrl(trackId) {
  const accessToken = localStorage.getItem('access_token');
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
  const accessToken = localStorage.getItem('access_token');
  console.log(`Access Token: ${accessToken}`);
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
  console.log('Access Token:', accessToken);
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

    console.log(response.data); // You can handle the data in any way you need, such as rendering it in your UI
    return response.data;
  } catch (error) {
    console.error('Error retrieving top tracks:', error);
    throw new Error('Error retrieving top tracks');
  }
}
