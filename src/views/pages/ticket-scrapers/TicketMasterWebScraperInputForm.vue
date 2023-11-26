<script setup>
import axios from '@axios';
import { ref } from 'vue';

// Logging setup data
console.log('Initializing data...');

const accountData = {
  keyword: '',
  country: 'GB',
  startDate: null,
  endDate: null,
};
const accountDataLocal = ref(structuredClone(accountData));
const eventData = ref([]);
const errorMessage = ref('');

const reloadPage = () => {
  console.log('Reloading page...');
  window.location.reload();
};

const resetForm = () => {
  console.log('Resetting form...');
  accountDataLocal.value = structuredClone(accountData);
  errorMessage.value = '';
};

const formatDateToISO = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}T${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}:${String(d.getUTCSeconds()).padStart(2, '0')}Z`;
};

const scrapeData = async () => {
  console.log('Scraping data...');
  errorMessage.value = '';
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
        salesStartDateTime: event.sales.public.startDateTime,
        minPrice: event.priceRanges ? event.priceRanges[0].min : 'N/A',
        maxPrice: event.priceRanges ? event.priceRanges[0].max : 'N/A',
      }));
    } else {
      console.log('No events found for the given criteria');
      errorMessage.value = 'No events found for the given search criteria.';
    }
  } catch (error) {
    console.error('Error fetching data:', error);
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
          
  <!-- Start Date Picker -->
  <VCol cols="12" md="6">
    <VDatePicker
      v-model="accountDataLocal.startDate"
      label="Start Date"
      prepend-icon="mdi-calendar"
      elevation="24"
    />
  </VCol>

  <!-- End Date Picker -->
  <VCol cols="12" md="6">
    <VDatePicker
      v-model="accountDataLocal.endDate"
      label="End Date"
      prepend-icon="mdi-calendar"
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
