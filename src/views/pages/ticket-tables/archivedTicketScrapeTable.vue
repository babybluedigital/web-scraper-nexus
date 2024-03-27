<template>
    <VRow>
        <VCol cols="12">
            <VCard class="pt-5 px-5 pb-5">
                <VCardTitle class="ps-0 pt-0 text-warning">
                    Archived Scrapes
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
                                color="warning"
                                @click="reactivateScrape(scrape)"
                                >
                                Re-Activate
                            </v-chip>
                        </td>
                        <td>
                            <v-chip
                            clickable
                            color="error"
                            @click="deleteScrape(scrape.id)"
                            >
                            Delete Scrape
                        </v-chip>
                    </td>
                </tr>
            </tbody>
        </VTable>
        <!-- Display the alert when deleteClicked is true -->
        <VAlert v-if="deleteClicked" type="info" dense>
            This scrape will be deleted, refresh your page to see changes.
        </VAlert>
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
</template>

<script>
import { deleteScrape } from '@/services/scrapeDeleteService'; // Import the deleteScrape function
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
            deleteClicked: false, // Track whether the delete button has been clicked
        };
    },
    mounted() {
        this.loadData();
    },
    methods: {
        async loadData() {
            this.loading = true;
            try {
                console.groupCollapsed('Fetching and filtering scrapes');
                const data = await fetchScrapes();
                console.log('Fetched data:', data);

                // Filter the data to include only active scrapes
                const filteredScrapes = data.filter(scrape => scrape.acf.status === 'Archived');
                console.log('Filtered archived scrapes:', filteredScrapes);

                this.scrapes = filteredScrapes;
                this.searchPerformed = true;
                
                // Assuming you have retrieved the post title from your CMS data
                // Note: Update 'data.postTitle' with the actual property from your CMS data
                this.postTitle = data.postTitle || 'Post title not found';
                console.log('Post title:', this.postTitle);
                console.groupEnd();
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                this.loading = false;
            }
        },
        async deleteScrape(scrapeId) {
            try {
                await deleteScrape(scrapeId);
                this.loadData();
            } catch (error) {
                console.error('Failed to delete the post:', error);
            }
        },
        async reactivateScrape(scrape) {
            try {
                const success = await updateScrapeStatus(scrape.id, 'Active');
                if (success) {
                    this.loadData();
                } else {
                    console.error('Failed to reactivate the scrape');
                }
            } catch (error) {
                console.error('Failed to reactivate the scrape:', error);
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
