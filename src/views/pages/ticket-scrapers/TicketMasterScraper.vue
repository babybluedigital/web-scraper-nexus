<script setup>
import { postScrapeConfig } from '@/services/scrapePostService';
import axios from '@axios';
import { computed, ref } from 'vue';

// Initialize data and reactive variables
console.log('Initializing data...');
const accountData = {
  keyword: '',
  country: 'GB',
  startDate: null,
  endDate: null,
};
const accountDataLocal = ref(structuredClone(accountData));
const eventData = ref([]); // Stores the event data from the API
const errorMessage = ref(''); // Stores error messages
const searchPerformed = ref(false); // Tracks if a search has been executed
const openUrl = (url) => {
  window.open(url, '_blank');
}; // Open Event Url in a new tab

// References for the date picker dialogs
const startDateDialog = ref(false);
const endDateDialog = ref(false);

// User UI States for Successfull and Error Alerts When Saving Scrapers
const showSuccessAlert = ref(false);
const showErrorAlert = ref(false);

// Computed properties for displaying formatted start and end dates
const startDateLabel = computed(() => accountDataLocal.value.startDate ? `${accountDataLocal.value.startDate}` : 'No Start Date Selected');
const endDateLabel = computed(() => accountDataLocal.value.endDate ? `${accountDataLocal.value.endDate}` : 'No End Date Selected');

// Function to reload the page
const reloadPage = () => {
  console.log('Reloading page...');
  window.location.reload();
};

// Function to reset the form
const resetForm = () => {
  console.log('Resetting form...');
  accountDataLocal.value = structuredClone(accountData);
  errorMessage.value = '';
};

// Function to format dates to ISO string
const formatDateToISO = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}T${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}:${String(d.getUTCSeconds()).padStart(2, '0')}Z`;
};


// Make Artist Name Required
const required = value => !!value || 'Required.';

// Function to save the scrape
const saveScrape = async () => {
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
    
    const scrapeData = {
      title: dynamicTitle,
      status: "publish",
      acf: {
        artist_name: accountDataLocal.value.keyword,
        country: accountDataLocal.value.country,
        start_date: formattedStartDate,
        end_date: formattedEndDate
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
const scrapeData = async () => {
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

</script>


<template>
  <VRow>
    <VCol cols="12">
      <VCard class="pa-5">
        <v-card-title class="ps-0 pt-0">TicketMaster Scraper</v-card-title>
        <!-- Error Message -->
        <VAlert v-if="errorMessage" type="error" dense>
          {{ errorMessage }}
        </VAlert>
        
        <!-- Form -->
        <VForm>
          <VRow class="pt-5">
            <!-- Keyword Field -->
            <VCol md="6" cols="12">
              <VTextField
              v-model="accountDataLocal.keyword"
              placeholder="Enter Artist Name"
              label="Enter Artist Name"
              :rules="[required]"
              />
            </VCol>
            
            <!-- Country Field -->
            <VCol cols="12" md="6">
              <VSelect
              v-model="accountDataLocal.country"
              label="Select Country"
              :items="['US', 'GB', 'AT', 'AU', 'ZA']"
              placeholder="Select Country"
              />
            </VCol>
            
            <!-- Start Date Picker -->
            <VCol cols="12" md="6">
              
              <v-dialog width="500" v-model="startDateDialog">
                <template v-slot:activator="{ props }">
                  <v-row align="center">
                    <v-col cols="auto">
                      <v-btn color="default" prepend-icon="mdi-calendar" v-bind="props" variant="tonal">Select Start Date</v-btn>
                    </v-col>
                    <v-col class="d-flex justify-end flex-wrap">
                      <v-chip v-if="startDateLabel" class="ml-2" color="primary" text-color="white">
                        {{ startDateLabel }}
                      </v-chip>
                    </v-col>
                  </v-row>
                </template>
                
                <template v-slot:default="dialogScope">
                  <v-card>
                    <v-card-title>Select Start Date</v-card-title>
                    <v-card-text>
                      <v-date-picker v-model="accountDataLocal.startDate" @input="dialogScope.isActive = false"></v-date-picker>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog> 
              
            </VCol>
            
            <!-- End Date Picker -->
            <VCol cols="12" md="6">
              
              <v-dialog ref="endDialog" width="500" v-model="endDateDialog">
                <template v-slot:activator="{ props }">
                  <v-row align="center">
                    <v-col cols="auto">
                      <v-btn color="default" prepend-icon="mdi-calendar" v-bind="props" variant="tonal">Select End Date</v-btn>
                    </v-col>
                    <v-col class="d-flex justify-end flex-wrap">
                      <v-chip v-if="endDateLabel" class="ml-2" color="primary" text-color="white">
                        {{ endDateLabel }}
                      </v-chip>
                    </v-col>
                  </v-row>
                </template>
                
                <template v-slot:default="dialogScope">
                  <v-card>
                    <v-card-title>Select End Date</v-card-title>
                    <v-card-text>
                      <v-date-picker v-model="accountDataLocal.endDate" @input="dialogScope.isActive = false"></v-date-picker>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text @click="endDateDialog = false">Close</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
              
            </VCol>
          </VRow>
          
          <VRow class="px-4 py-5">
            <!-- Divider to split the inputs and form buttons -->
            <v-divider :thickness="2"></v-divider>
          </VRow>
          
          <!-- Form Actions -->
          <VRow>
            <VCol cols="12" md="6" class="d-flex flex-wrap gap-4">
              <VBtn size="large" append-icon="mdi-arrow-right" color="primary" @click.prevent="scrapeData">
                Test Scraper
              </VBtn>
              <VBtn
              size="large"
              append-icon="mdi-reload"
              color="secondary"
              variant="tonal"
              type="button"
              @click.prevent="reloadPage"
              >
              Reset Scraper
            </VBtn>
          </VCol>
          <VCol cols="12" md="6" class="d-flex justify-end flex-wrap gap-4">
            <VBtn size="large" append-icon="mdi-content-save-check-outline" color="warning" variant="tonal" type="button"
            @click.prevent="saveScrape"
            >
            Save Scraper
          </VBtn>
        </VCol>
        <VCol>
          <!-- Success Alert -->
          <VAlert
          v-if="showSuccessAlert"
          type="success"
          dismissible
          @click:close="showSuccessAlert = false"
          >
          Your Scraper Has Been Saved Successfully
        </VAlert>
        
        <!-- Error Alert -->
        <VAlert
        v-if="showErrorAlert"
        type="error"
        dismissible
        @click:close="showErrorAlert = false"
        >
        Your Scraper Has Not Been Saved, Please Try Again Or Click the "RESET" Button
      </VAlert>
    </VCol>
  </VRow>
</VForm>
</VCard>
</VCol>
</VRow>

<!-- Table Section -->
<VRow>
  <VCol cols="12">
    <VCard class="pt-5 px-5 pb-5">
      <v-chip size="x-large" class="ma-2" color="success" variant="tonal">
        Your Results
      </v-chip>
      <VTable v-if="eventData.length > 0" fixed-header>
        <thead>
          <tr>
            <th><strong>Event Name</strong></th>
            <th><strong>Sales Start Date</strong></th>
            <th><strong>Max Price</strong></th>
            <th><strong>Venue</strong></th>
            <th><strong>Event Start Date</strong></th>
            <th><strong>Event URL</strong></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in eventData" :key="event.name">
            <td>{{ event.name }}</td>
            <td>{{ event.salesStartDateTime }}</td>
            <td>{{ event.maxPrice }}</td>
            <td>{{ event.venue }}</td>
            <td>{{ event.eventStartDate }}</td>
            <td>
              <v-chip
              clickable
              color="primary"
              @click="openUrl(event.url)"
              >
              View Event
            </v-chip>
          </td>
        </tr>
      </tbody>
    </VTable>
    <VAlert
    v-if="searchPerformed && eventData.length === 0"
    type="info"
    dense
    >
    No events to display. Adjust search criteria and try again.
  </VAlert>
  
</VCard>
</VCol>
</VRow>
</template>

<style>
.v-table th {
  text-align: start !important;
}

</style>
