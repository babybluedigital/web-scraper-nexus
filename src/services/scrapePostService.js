import axios from 'axios';

// Base URL for the WordPress API
const API_BASE_URL = 'https://wordpressmu-878924-4140720.cloudwaysapps.com/wp-json/wp/v2';

// Function to post scrape data
const postScrapeConfig = async (scrapeData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/scrape`, scrapeData, {
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary headers here, such as authentication tokens
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error posting scrape data:', error);
    throw error;
  }
};

// Export the service function
export { postScrapeConfig };
