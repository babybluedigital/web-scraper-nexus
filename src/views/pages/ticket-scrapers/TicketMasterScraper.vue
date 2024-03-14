<script setup>
import {
  accountDataLocal,
  errorMessage,
  eventData,
  saveScrape,
  scrapeData,
  searchPerformed,
  showErrorAlert,
  showSuccessAlert
} from '@/scrapers/TicketMasterScraper.js';
import { computed, ref } from 'vue';

// Computed property to check if all required fields are filled
const isFormValid = computed(() => {
  return accountDataLocal.value.keyword && 
  accountDataLocal.value.startDate && 
  accountDataLocal.value.endDate;
});

// Define your data properties
const priceRange = ref([25, 1000]);

// References for the date picker dialogs
const startDateDialog = ref(false);
const endDateDialog = ref(false);

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

// Make Artist Name Required
const required = value => !!value || 'Required.';
// Make date fields required
const dateRequired = value => value || 'Required.';

// Function to open URL in a new tab
const openUrl = (url) => {
  window.open(url, '_blank');
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
          
          <!-- Card to hold scraper input form and actions -->
          <v-card variant="tonal" color="grey" class="mt-2 mb-7 px-3 py-5">
            <VRow class="pt-0">

              <!-- Keyword Field -->
              <VCol cols="12" md="4" >
                <VTextField
                v-model="accountDataLocal.keyword"
                placeholder="Enter Artist Name"
                label="Enter Artist Name"
                :rules="[required]"
                />
              </VCol>
              
              <!-- Country Field -->
              <VCol cols="12" md="4">
                <VSelect
                v-model="accountDataLocal.country"
                label="Select Country"
                :items="['GB']"
                placeholder="Select Country"
                />
              </VCol>
              
              <!-- Max Price Entry Field -->
              <VCol cols="12" md="4">
                <VSelect
                v-model="accountDataLocal.maxPrice"
                label="Set Max Price"
                :items="['25', '50', '100', '200', '500', '1000']"
                placeholder="Set Max Price"
                />
              </VCol>
              
              <!-- Start Date Picker -->
              <VCol cols="12" md="12">
                
                <v-dialog width="500" v-model="startDateDialog">
                  <template v-slot:activator="{ props }">
                    <v-row align="center">
                      <v-col cols="12" md="4">
                        <v-btn
                        color="primary"
                        prepend-icon="mdi-calendar"
                        v-bind="props"
                        variant="tonal"
                        style="width: 100%;"
                        >Select Start Date
                        <v-tooltip
                        activator="parent"
                        location="top"
                        >Select the start date for this scraper</v-tooltip>
                      </v-btn>
                    </v-col>
                    <v-col cols="12" md="8" class="d-flex justify-end flex-wrap">
                      <v-chip v-if="startDateLabel" class="ml-2" color="default" text-color="white" style="width: 100%; justify-content: center;">
                        {{ startDateLabel }}
                      </v-chip>
                    </v-col>
                  </v-row>
                </template>
                
                <template v-slot:default="dialogScope">
                  <v-card>
                    <v-card-title>Select Start Date</v-card-title>
                    <v-card-text>
                      <v-date-picker v-model="accountDataLocal.startDate" :rules="[dateRequired]" @input="dialogScope.isActive = false"></v-date-picker>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog> 
              
            </VCol>
            
            <!-- End Date Picker -->
            <VCol cols="12" md="12">
              
              <v-dialog ref="endDialog" width="500" v-model="endDateDialog">
                <template v-slot:activator="{ props }">
                  <v-row align="center">
                    <v-col cols="12" md="4">
                      <v-btn
                      color="primary"
                      prepend-icon="mdi-calendar"
                      v-bind="props"
                      variant="tonal"
                      style="width: 100%;"
                      >Select End Date
                      <v-tooltip
                      activator="parent"
                      location="bottom"
                      >Select the end date for this scraper</v-tooltip>
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="8" class="d-flex justify-end flex-wrap">
                    <v-chip v-if="endDateLabel" class="ml-2" color="default" text-color="white" style="width: 100%; justify-content: center;">
                      {{ endDateLabel }}
                    </v-chip>
                  </v-col>
                </v-row>
              </template>
              
              <template v-slot:default="dialogScope">
                <v-card>
                  <v-card-title>Select End Date</v-card-title>
                  <v-card-text>
                    <v-date-picker v-model="accountDataLocal.endDate" :rules="[dateRequired]" @input="dialogScope.isActive = false"></v-date-picker>
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
        
      </v-card>
      
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
        <VBtn 
        size="large" 
        append-icon="mdi-content-save-check-outline" 
        color="warning" 
        variant="tonal" 
        type="button"
        @click.prevent="saveScrape"
        :disabled="!isFormValid"
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
        Your Test Results
      </v-chip>
      <VTable v-if="eventData.length > 0" fixed-header>
        <thead>
          <tr>
            <th><strong>Event Name</strong></th>
            <th><strong>Sales Start Date</strong></th>
            <th><strong>Ticket Price</strong></th>
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
