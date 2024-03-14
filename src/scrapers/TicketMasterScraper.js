import { postScrapeConfig } from '@/services/scrapePostService';
import axios from '@axios';
import { ref } from 'vue';

// Initialize data and reactive variables
console.log('Initializing data...');
export const accountData = {
  keyword: '',
  country: 'GB',
  startDate: null,
  endDate: null,
  maxPrice: null, // Add maxPrice with a default value
};

export const accountDataLocal = ref(structuredClone(accountData));
export const eventData = ref([]); // Stores the event data from the API
export const errorMessage = ref(''); // Stores error messages
export const searchPerformed = ref(false); // Tracks if a search has been executed
export const showSuccessAlert = ref(false);
export const showErrorAlert = ref(false);

// Function to format dates to ISO string
export const formatDateToISO = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}T${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}:${String(d.getUTCSeconds()).padStart(2, '0')}Z`;
};

// Function to save the scrape
export const saveScrape = async () => {
  try {
    // Validate the Artist Name field
    if (!accountDataLocal.value.keyword) {
      showErrorAlert.value = true; // Show error alert
      showSuccessAlert.value = false; // Hide success alert
      errorMessage.value = 'Artist Name is required.'; // Set error message
      return; // Exit the function
    }

    // Helper function to format date
    const formatTicketMasterDateToACF = (dateString) => {
      if (!dateString) return 'No Date Selected';

      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    const formattedStartDate = formatTicketMasterDateToACF(accountDataLocal.value.startDate);
    const formattedEndDate = formatTicketMasterDateToACF(accountDataLocal.value.endDate);

    // Create a dynamic title
    const dynamicTitle = `${accountDataLocal.value.keyword} - ${accountDataLocal.value.country} - ${formattedStartDate}`;
    // Construct the TicketMaster API URL
    const apiUrl = `https://app.ticketmaster.com/discovery/v2/events?apikey=PF6iGSTrUmYAJ0JnAYA6pKlpEOOkyGA3&keyword=${encodeURIComponent(accountDataLocal.value.keyword)}&locale=*&countryCode=${accountDataLocal.value.country}&startDateTime=${formatDateToISO(accountDataLocal.value.startDate)}&endDateTime=${formatDateToISO(accountDataLocal.value.endDate)}`;

    const scrapeData = {
      title: dynamicTitle,
      status: "publish",
      acf: {
        artist_name: accountDataLocal.value.keyword,
        country: accountDataLocal.value.country,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        max_price: accountDataLocal.value.maxPrice || "Not specified", // Include the max price here
        api_value: apiUrl, // Include the API URL here
        status: "Active", // Update the status here
      }
    };

    const result = await postScrapeConfig(scrapeData);
    console.log('Data posted successfully:', result);

    showSuccessAlert.value = true; // Show success alert
    showErrorAlert.value = false; // Hide error alert
    errorMessage.value = ''; // Clear error message
  } catch (error) {
    console.error('Error saving scrape:', error);

    showErrorAlert.value = true; // Show error alert
    showSuccessAlert.value = false; // Hide success alert
    errorMessage.value = 'Error saving scrape. Please try again.'; // Set error message
  }
};

// Function to scrape data using the Ticketmaster API
export const scrapeData = async () => {
  console.log('Scraping data...');
  errorMessage.value = ''; // Reset error message before making a new request
  eventData.value = []; // Clear previous event data
  searchPerformed.value = false; // Reset search performed flag

  const apiKey = 'PF6iGSTrUmYAJ0JnAYA6pKlpEOOkyGA3';
  const keyword = accountDataLocal.value.keyword;
  const country = accountDataLocal.value.country;
  const startDate = formatDateToISO(accountDataLocal.value.startDate);
  const endDate = formatDateToISO(accountDataLocal.value.endDate);
  
  const apiUrl = `https://app.ticketmaster.com/discovery/v2/events?apikey=${apiKey}&keyword=${keyword}&locale=*&countryCode=${country}&startDateTime=${startDate}&endDateTime=${endDate}`;
  
  console.log('TicketMaster API URL:', apiUrl); // Log the API URL

  try {
    const response = await axios.get(apiUrl);
    console.log('API response received:', response);
    
    if (response.data._embedded && response.data._embedded.events.length > 0) {
      eventData.value = response.data._embedded.events.map(event => ({
        name: event.name,
        url: event.url,
        venue: event._embedded.venues[0].name, // Extracting venue name
        eventStartDate: event.dates.start.localDate, // Extracting event start date
        salesStartDateTime: event.sales.public.startDateTime,
        minPrice: event.priceRanges ? event.priceRanges[0].min : 'N/A',
        maxPrice: event.priceRanges ? event.priceRanges[0].max : 'N/A',
      }));
    } else {
      console.log('No events found for the given criteria');
      // No need to set errorMessage here as it's not an error
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    errorMessage.value = 'An error occurred while fetching the data.';
  }
  
  searchPerformed.value = true; // Indicate that a search has been performed
};

export const scrapeAndPostData = async () => {
  // Step 2: Fetch data from TicketMaster API
  const ticketMasterResponse = await scrapeData(); // Assumes scrapeData fetches and returns TicketMaster API response

  // Check if you need to modify or use the response directly
  const modifiedScrapeData = {
    ...ticketMasterResponse,
    // Add any additional modifications or enrichments here
  };

  // Step 3 & 4: Post to Nexus endpoint
  try {
    const postResponse = await postScrapeConfig(modifiedScrapeData);
    console.log('Data posted successfully:', postResponse);
    // Handle success scenario
  } catch (error) {
    console.error('Error posting to Nexus:', error);
    // Handle error scenario
  }
};

