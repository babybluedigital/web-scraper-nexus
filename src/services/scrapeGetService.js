import axios from 'axios';

const API_BASE_URL = 'https://wordpressmu-878924-4140720.cloudwaysapps.com/wp-json/wp/v2';

// Use the base64 encoded credentials from your Postman example
const encodedCredentials = 'bHVrZS5tY2ZhcmxhbmRAYmFieWJsdWUuaW5mbzp5ZlUyIE9hWmcgdEhyVyBkOHhyIEF5dlggWWZOWg==';

const fetchScrapes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/scrape`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedCredentials}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching scrape data:', error);
    throw error;
  }
};

export { fetchScrapes };
