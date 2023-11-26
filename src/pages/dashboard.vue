<script setup>
import AnalyticsCongratulations from '@/views/dashboard/AnalyticsCongratulations.vue';
import DatePicker from '@/views/dashboard/DatePicker.vue';

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
      <VCard title="Test">
        <VCardText>
          <DatePicker />
        </VCardText>
      </VCard>
    </VCol>
</VRow>
</template>
