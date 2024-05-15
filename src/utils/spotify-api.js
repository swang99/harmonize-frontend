import useStore from '../store';

export default async function getEmbedUrl(trackId) {
  const { accessToken } = useStore.getState();
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
    const trackUri = data.uri;
    const embedUrl = `https://open.spotify.com/embed/track/${trackUri.split(':')[2]}`;
    return embedUrl;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function searchSpotify(query) {
  const { accessToken } = useStore.getState();
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
