<template>
  <VRow>
    <VCol cols="12">
      <VCard class="pt-5 px-5 pb-5">
        <VCardTitle class="ps-0 pt-0">
          Latest Scrapes
        </VCardTitle>
        <div v-if="loading">Loading data...</div>
        <VTable v-else fixed-header>
          <thead>
            <tr>
              <th><strong>Artist Name</strong></th>
              <th><strong>Country</strong></th>
              <th><strong>Selected Start Date</strong></th>
              <th><strong>Selected End Date</strong></th>
              <th><strong>Results</strong></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(scrape, index) in scrapes.slice(0, 5)" :key="scrape.id">
              <td>{{ scrape.acf.artist_name }}</td>
              <td>{{ scrape.acf.country }}</td>
              <td>{{ scrape.acf.start_date }}</td>
              <td>{{ scrape.acf.end_date }}</td>
              <td>
                <v-chip
                clickable
                color="success"
                to="/active-scrapes"
                >
                View Results
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
  </v-card>
</v-navigation-drawer>
</template>

<script>
import { fetchScrapes } from '@/services/scrapeGetService'; // Update the import path as needed
import { updateScrapeStatus } from '@/services/scrapeUpdateService'; // Import the updateScrapeStatus function

export default {
  name: 'ActiveTicketScrapeTable',
  data() {
    return {
      scrapes: [],
      loading: false,
      searchPerformed: false,
      sidePanelOpen: false, // Initially, the side panel is closed
      postTitle: '', // Initialize postTitle with an empty string
      deletingScrapeId: null, // Track the ID of the scrape being deleted
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
        // Filter the data to include only active scrapes
        this.scrapes = data.filter(scrape => scrape.acf.status === 'Active');
        this.searchPerformed = true;
        
        // Assuming you have retrieved the post title from your CMS data
        this.postTitle = data.postTitle; // Update 'data.postTitle' with the actual property from your CMS data
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        this.loading = false;
      }
    },
    async archiveScrape(scrapeId) {
      try {
        // Update the status of the scrape to "Archived"
        const success = await updateScrapeStatus(scrapeId, 'Archived');
        
        if (success) {
          // Reload the page or refresh the data as needed
          // window.location.reload();
          this.loadData(); // Refresh data for the current view
        } else {
          console.error('Failed to archive the post');
        }
      } catch (error) {
        console.error('Error archiving the post:', error);
      }
    },
  },
};
</script>

<style>
.v-table th {
  text-align: start !important;
}
</style>
