<script setup>
import axios from '@axios';
import { ref } from 'vue';

const accountData = {
  keyword: '',
  country: '',
};

const accountDataLocal = ref(structuredClone(accountData));
const eventData = ref([]); // This will store the event data from the API

const resetForm = () => {
  accountDataLocal.value = structuredClone(accountData);
};

const scrapeData = async () => {
  const apiKey = '7elxdku9GGG5k8j0Xm8KWdANDgecHMV0'; // Replace with your actual API key
  const keyword = accountDataLocal.value.keyword;
  const country = accountDataLocal.value.country;

  const apiUrl = `https://app.ticketmaster.com/discovery/v2/events?apikey=${apiKey}&keyword=${keyword}&locale=*&countryCode=${country}`;

  try {
    const response = await axios.get(apiUrl);
    eventData.value = response.data._embedded.events.map(event => ({
      name: event.name,
      url: event.url,
      salesStartDateTime: event.sales.public.startDateTime,
      salesEndDateTime: event.sales.public.endDateTime,
      minPrice: event.priceRanges ? event.priceRanges[0].min : 'N/A',
      maxPrice: event.priceRanges ? event.priceRanges[0].max : 'N/A',
      ticketLimit: event.ticketLimit ? event.ticketLimit.info : 'N/A',
    }));
  } catch (error) {
    console.error(error);
    // Handle error, potentially update UI to inform the user
  }
};
</script>

<template>
  <VRow>
    <VCol cols="12">
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
            <VBtn @click.prevent="scrapeData">
              Scrape
            </VBtn>
            <VBtn
              color="secondary"
              variant="tonal"
              type="reset"
              @click.prevent="resetForm"
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
      <VTable height="750" fixed-header>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Event URL</th>
            <th>Sales Start DateTime</th>
            <th>Sales End DateTime</th>
            <th>Min Price</th>
            <th>Max Price</th>
            <th>Ticket Limit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in eventData" :key="event.name">
            <td>{{ event.name }}</td>
            <td>
              <a :href="event.url" target="_blank">{{ event.url }}</a>
            </td>
            <td>{{ event.salesStartDateTime }}</td>
            <td>{{ event.salesEndDateTime }}</td>
            <td>{{ event.minPrice }}</td>
            <td>{{ event.maxPrice }}</td>
            <td>{{ event.ticketLimit }}</td>
          </tr>
        </tbody>
      </VTable>
    </VCol>
  </VRow>
</template>
