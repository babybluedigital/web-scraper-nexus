<script setup>
import AnalyticsCongratulations from '@/views/dashboard/AnalyticsCongratulations.vue';
import LatestTicketScrapeTable from '@/views/pages/ticket-tables/latestTicketScrapeTable.vue';

</script>

<template>
  <VRow>
    <!-- 👉 Congratulations -->
    <VCol
    cols="12"
    md="12"
    >
    <AnalyticsCongratulations />
  </VCol>

  <!-- Latest Scrapes -->
  <VCol
    cols="12"
    md="12"
    >
    <LatestTicketScrapeTable />
  </VCol>
  
</VRow>
</template>
