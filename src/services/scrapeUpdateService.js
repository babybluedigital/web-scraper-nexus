import axios from 'axios';

const API_BASE_URL = 'https://wordpressmu-878924-4140720.cloudwaysapps.com/wp-json/wp/v2';
const encodedCredentials = 'bHVrZS5tY2ZhcmxhbmRAYmFieWJsdWUuaW5mbzp5ZlUyIE9hWmcgdEhyVyBkOHhyIEF5dlggWWZOWg==';

const updateScrapeStatus = async (scrapeId, newStatus) => {
  try {
    const payload = {
      acf: {
        status: newStatus,
      },
    };

    const response = await axios.put(`${API_BASE_URL}/scrape/${scrapeId}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedCredentials}`,
      },
    });

    if (response.status === 200) {
      // Update was successful
      return true;
    } else {
      console.error('Failed to update the status:', response);
      // Handle the error as needed
      return false;
    }
  } catch (error) {
    console.error('Error updating the status:', error);
    // Handle the error as needed
    return false;
  }
};

export { updateScrapeStatus };
