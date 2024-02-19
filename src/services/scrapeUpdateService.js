import axios from 'axios';

const API_BASE_URL = 'https://nexus.headless.babyblue.info/wp-json/wp/v2';
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

// New function to update api_value
const updateScrapeApiValue = async (scrapeId, apiValue) => {
  try {
    const payload = {
      acf: {
        api_value: apiValue,
      },
    };

    const response = await axios.put(`${API_BASE_URL}/scrape/${scrapeId}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedCredentials}`,
      },
    });

    if (response.status === 200) {
      console.log('Successfully updated api_value for', scrapeId);
      return true;
    } else {
      console.error('Failed to update api_value:', response);
      return false;
    }
  } catch (error) {
    console.error('Error updating api_value:', error);
    return false;
  }
};


export { updateScrapeApiValue, updateScrapeStatus };

