// scrapeDeleteService.js
import axios from 'axios';

const API_BASE_URL = 'https://nexus.headless.babyblue.info/wp-json/wp/v2';
const encodedCredentials = 'bHVrZS5tY2ZhcmxhbmRAYmFieWJsdWUuaW5mbzp5ZlUyIE9hWmcgdEhyVyBkOHhyIEF5dlggWWZOWg==';

const deleteScrape = async (scrapeId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/scrape/${scrapeId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedCredentials}`,
      },
    });

    if (response.status === 204) {
      // Deletion was successful
      return true;
    } else {
      console.error('Failed to delete the post:', response);
      // Handle the error as needed
      return false;
    }
  } catch (error) {
    console.error('Error deleting the post:', error);
    // Handle the error as needed
    return false;
  }
};

export { deleteScrape };

