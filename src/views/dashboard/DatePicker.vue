<template>
    <v-date-picker v-model="date"></v-date-picker>
</template>


<script setup>
import { ref } from 'vue';
const date = ref(new Date());

</script>
