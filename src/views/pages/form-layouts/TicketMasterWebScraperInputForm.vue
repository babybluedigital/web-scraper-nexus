<script setup>
import axios from '@axios';
import { ref } from 'vue';

const accountData = {
  keyword: '',
  country: 'GB',
};
const accountDataLocal = ref(structuredClone(accountData));
const eventData = ref([]); // This will store the event data from the API
const errorMessage = ref(''); // Reactive variable to store error messages

const reloadPage = () => {
  window.location.reload();
};

const resetForm = () => {
  accountDataLocal.value = structuredClone(accountData);
  errorMessage.value = ''; // Clear the error message when resetting the form
};

const scrapeData = async () => {
  errorMessage.value = ''; // Clear the error message before making a new request
  const apiKey = '7elxdku9GGG5k8j0Xm8KWdANDgecHMV0'; // Replace with your actual API key
  const keyword = accountDataLocal.value.keyword;
  const country = accountDataLocal.value.country;

  const apiUrl = `https://app.ticketmaster.com/discovery/v2/events?apikey=${apiKey}&keyword=${keyword}&locale=*&countryCode=${country}`;

  try {
    const response = await axios.get(apiUrl);
    if (response.data._embedded && response.data._embedded.events.length > 0) {
      eventData.value = response.data._embedded.events.map(event => ({
        name: event.name,
        url: event.url,
        salesStartDateTime: event.sales.public.startDateTime,
        minPrice: event.priceRanges ? event.priceRanges[0].min : 'N/A',
        maxPrice: event.priceRanges ? event.priceRanges[0].max : 'N/A',
      }));
    } else {
      errorMessage.value = 'No events found for the given search criteria.';
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = 'An error occurred while fetching the data.';
  }
};
</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- Error Message -->
      <VAlert v-if="errorMessage" type="error" dense>
        {{ errorMessage }}
      </VAlert>

      <!-- Form -->
      <VForm class="mt-6">
        <VRow>
          <!-- Keyword Field -->
          <VCol md="6" cols="12">
            <VTextField
              v-model="accountDataLocal.keyword"
              placeholder="Keyword"
              label="Keyword"
            />
          </VCol>
          <!-- Country Field -->
          <VCol cols="12" md="6">
            <VSelect
              v-model="accountDataLocal.country"
              label="Country"
              :items="['US', 'GB', 'AT', 'AU', 'ZA']"
              placeholder="Select Country"
            />
          </VCol>
          <!-- Form Actions -->
          <VCol cols="12" class="d-flex flex-wrap gap-4">
            <VBtn color="primary" @click.prevent="scrapeData">
              Scrape
            </VBtn>
            <VBtn
              color="secondary"
              variant="tonal"
              type="button"
              @click.prevent="reloadPage"
            >
              Reset
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCol>
  </VRow>

  <!-- Table Section -->
  <VRow>
    <VCol cols="12">
      <VTable v-if="eventData.length > 0" height="750" fixed-header>
        <thead>
          <tr>
            <th class="freeze-column-1">Event Name</th>
            <th>Event URL</th>
            <th>Sales Start DateTime</th>
            <th>Min Price</th>
            <th>Max Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in eventData" :key="event.name">
            <td class="freeze-column-2">{{ event.name }}</td>
            <td>
              <a :href="event.url" target="_blank">{{ event.url }}</a>
            </td>
            <td>{{ event.salesStartDateTime }}</td>
            <td>{{ event.minPrice }}</td>
            <td>{{ event.maxPrice }}</td>
          </tr>
        </tbody>
      </VTable>
      <VAlert
        v-else
        type="info"
        dense
      >
        No events to display. Adjust search criteria and try again.
      </VAlert>
    </VCol>
  </VRow>
</template>

<style>
.freeze-column-1 {
  position: sticky !important;
  z-index: 100 !important;
  background-color: white !important; /* Change to match your table's background color */
  inset-inline-start: 0 !important;
}

.freeze-column-2 {
  position: sticky !important;
  z-index: 10 !important;
  background-color: white !important; /* Change to match your table's background color */
  inset-inline-start: 0 !important;
}
</style>
