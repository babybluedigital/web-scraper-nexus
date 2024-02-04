import axios from 'axios';

const API_BASE_URL = 'https://nexus.headless.babyblue.info/wp-json/wp/v2';

// Use the base64 encoded credentials from your Postman example
const encodedCredentials = 'bHVrZS5tY2ZhcmxhbmRAYmFieWJsdWUuaW5mbzp5ZlUyIE9hWmcgdEhyVyBkOHhyIEF5dlggWWZOWg==';

const postScrapeConfig = async (scrapeData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/scrape`, scrapeData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedCredentials}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error posting scrape data:', error);
    throw error;
  }
};

export { postScrapeConfig };

