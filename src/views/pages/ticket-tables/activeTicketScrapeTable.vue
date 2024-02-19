<template>
  <VRow>
    <VCol cols="12">
      <VCard class="pt-5 px-5 pb-5">
        <VCardTitle class="ps-0 pt-0 text-success">
          Active Scrapes
        </VCardTitle>
        <div v-if="loading">Loading data...</div>
        <VTable v-else fixed-header>
          <thead>
            <tr>
              <th><strong>Artist Name</strong></th>
              <th><strong>Country</strong></th>
              <th><strong>Scrape Start Date</strong></th>
              <th><strong>Scrape End Date</strong></th>
              <th><strong>Results</strong></th>
              <th><strong>Manage</strong></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="scrape in scrapes" :key="scrape.id">
              <td>{{ scrape.acf.artist_name }}</td>
              <td>{{ scrape.acf.country }}</td>
              <td>{{ scrape.acf.start_date }}</td>
              <td>{{ scrape.acf.end_date }}</td>
              <td>
                <v-chip
                clickable
                color="success"
                @click="openSidePanel(scrape)"
                >
                View Results
              </v-chip>
            </td>
            <td>
              <v-chip
              clickable
              color="warning"
              @click="archiveScrape(scrape.id)"
              >
              Archive Scrape
            </v-chip>
          </td>
        </tr>
      </tbody>
    </VTable>
    <VAlert
    v-if="searchPerformed && scrapes.length === 0"
    type="info"
    dense
    >
    No events to display. Adjust search criteria and try again.
  </VAlert>
</VCard>
</VCol>
</VRow>

<!-- Side Panel -->
<v-navigation-drawer v-model="sidePanelOpen" temporary location="right" :width="1000">
  <v-card color="grey-lighten-4" flat rounded="0" height="100vh">
    <v-toolbar density="comfortable">
      <!-- Bind the title to the postTitle property -->
      <v-toolbar-title>{{ postTitle }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-chip color="red-lighten-4" variant="tonal" class="ma-2">
        {{expiryDate}}
      </v-chip>
      <v-btn icon color="warning" @click="toggleSidePanel">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <!-- Content for the side panel goes here -->
    <VRow>
      <VCol cols="12">
        <VCard class="pt-5 px-5 pb-5" variant="flat">
          <VTable v-if="eventData && eventData._embedded.events.length > 0" fixed-header>
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
              <tr v-for="event in eventData._embedded.events" :key="event.id">
                <td>{{ event.name }}</td>
                <td>{{ event.sales.public.startDateTime }}</td>
                <td>
                  {{ event.priceRanges ? event.priceRanges[0].max + ' ' + event.priceRanges[0].currency : 'N/A' }}
                </td>
                <td>{{ event._embedded.venues[0].name }}</td>
                <td>{{ event.dates.start.dateTime }}</td>
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
        v-if="!eventData || eventData._embedded.events.length === 0"
        type="info"
        dense
        >
        No events to display. Adjust search criteria and try again.
      </VAlert>
    </VCard>
  </VCol>
</VRow>
</v-card>
</v-navigation-drawer>
</template>

<script>
import { fetchScrapes } from '@/services/scrapeGetService';
import { updateScrapeApiValue, updateScrapeStatus } from '@/services/scrapeUpdateService';

export default {
  name: 'ActiveTicketScrapeTable',
  data() {
    return {
      scrapes: [],
      loading: false,
      searchPerformed: false,
      sidePanelOpen: false,
      postTitle: '',
      deletingScrapeId: null,
      eventData: null, // Add this line to store the fetched event data
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const data = await fetchScrapes();
        this.scrapes = data.filter(scrape => scrape.acf.status === 'Active');
        this.searchPerformed = true;
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        this.loading = false;
      }
    },
    async archiveScrape(scrapeId) {
      try {
        const success = await updateScrapeStatus(scrapeId, 'Archived');
        if (success) {
          this.loadData();
        } else {
          console.error('Failed to archive the post');
        }
      } catch (error) {
        console.error('Error archiving the post:', error);
      }
    },
    openSidePanel(scrape) {
      this.sidePanelOpen = true;
      this.postTitle = `${scrape.acf.artist_name} : ${scrape.acf.start_date} (${scrape.acf.country})`;
      this.expiryDate = `Scrape Expires - ${scrape.acf.end_date}`;
      
      // Call fetchEventData to fetch event data and update api_value
      this.fetchEventData(scrape);
    },
    toggleSidePanel() {
      this.sidePanelOpen = !this.sidePanelOpen;
    },
    async fetchEventData(scrape) {
      // Extract necessary data from the 'scrape' object
      const { artist_name, country, start_date, end_date } = scrape.acf;
      
      const apiKey = 'PF6iGSTrUmYAJ0JnAYA6pKlpEOOkyGA3';
      
      // Correctly format the date from 'dd/mm/yyyy' to 'YYYY-MM-DDTHH:mm:ssZ'
      const convertDate = (date, isStart) => {
        const parts = date.split('/');
        // Ensure parts are correctly ordered for 'YYYY-MM-DD' format
        const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        return isStart ? `${formattedDate}T14:00:00Z` : `${formattedDate}T23:59:59Z`;
      };
      
      const formattedStartDate = convertDate(start_date, true);
      const formattedEndDate = convertDate(end_date, false);
      
      let url = `https://app.ticketmaster.com/discovery/v2/events?apikey=${apiKey}&keyword=${encodeURIComponent(artist_name)}&locale=*&countryCode=${country}&startDateTime=${formattedStartDate}&endDateTime=${formattedEndDate}`;
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        this.eventData = data; // Store the fetched data
        
        // Update api_value with the constructed URL
        const updateSuccess = await updateScrapeApiValue(scrape.id, url); // Assuming 'scrape.id' is accessible
        if (updateSuccess) {
          console.log('Successfully updated api_value with the URL:', url);
        } else {
          console.error('Failed to update api_value with the URL');
        }
      } catch (error) {
        console.error('Error fetching event data or updating api_value:', error);
      }
    },
    openUrl(url) {
      window.open(url, '_blank');
    },
  },
};
</script>


<style>
.v-table {
  max-block-size: 85vh;
  overflow-y: auto;
}

.v-table th {
  text-align: start !important;
}
</style>
