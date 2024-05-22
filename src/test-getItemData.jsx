import { useEffect } from 'react';
import { getItemData } from './utils/spotify-api'; // Adjust the import path based on your project structure

const TestGetItemData = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getItemData('62PaSfnXSMyLshYJrlTuL3', 'track');
        console.log('Fetched data:', data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run effect only once

  return null; // You can return null or any placeholder JSX if needed
};

export default TestGetItemData;

// import { getItemData } from './utils/spotify-api'; // Adjust the import path based on your project structure

// (async () => {
//   try {
//     const data = await getItemData('62PaSfnXSMyLshYJrlTuL3', 'track');
//     console.log('Fetched data:', data);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// })();
