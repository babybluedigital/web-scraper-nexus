<script setup>
import AnalyticsCongratulations from '@/views/dashboard/AnalyticsCongratulations.vue';
import TicketMasterWebScraperInputForm from '@/views/pages/form-layouts/TicketMasterWebScraperInputForm.vue';

// 👉 Images
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

    <VCol cols="12">
      <!-- 👉 Multiple Column -->
      <VCard title="TicketMaster API Scrape">
        <VCardText>
          <TicketMasterWebScraperInputForm />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
