/* Get Embed URL from Spotify Track ID */
export default async function getEmbedUrl(trackId) {
  const accessToken = localStorage.getItem('access_token');
  try {
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const data = await response.json();
    const embedUrl = `https://open.spotify.com/embed/track/${data.id}`;
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
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=5`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    const data = await response.json();
    return data.tracks.items;
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
    const urls = await searchSpotifyIDs(query);
    const embeds = await Promise.all(urls.map((url) => getEmbedUrl(url)));
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

  const url = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=20';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data); // You can handle the data in any way you need, such as rendering it in your UI
    return data;
  } catch (error) {
    console.error('Error retrieving top tracks:', error);
    throw new Error('Error retrieving top tracks');
  }
}
