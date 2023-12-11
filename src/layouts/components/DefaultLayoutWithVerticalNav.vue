<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
import { useTheme } from 'vuetify'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'

const vuetifyTheme = useTheme()
</script>

<template>
  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <IconBtn
        class="ms-n3 d-lg-none"
        @click="toggleVerticalOverlayNavActive(true)"
        >
        <VIcon icon="bx-menu" />
      </IconBtn>
      
      <!-- 👉 Search -->
      <div
      class="d-flex align-center cursor-pointer"
      style="user-select: none;"
      >
      
      <span class="d-none d-md-flex align-center text-disabled">
        <span class="me-3">Welcome To Nexus Nick 🎉</span>
      </span>
    </div>
    
    <VSpacer />
    
    <IconBtn class="me-2">
      <VIcon icon="bx-bell" />
    </IconBtn>
    
    <NavbarThemeSwitcher class="me-2" />
    
    <UserProfile />
  </div>
</template>

<template #vertical-nav-content>
  <VerticalNavLink
  :item="{
    title: 'Dashboard',
    icon: 'bx-home',
    to: '/dashboard',
  }"
  />
  
  <!-- 👉 Divider -->
  <VerticalNavSectionTitle
  :item="{
    heading: 'Nexus Scrapers',
  }"
  />
  <VerticalNavLink
  :item="{
    title: 'Ticket Master',
    icon: 'bx-message-square-add',
    to: '/ticket-master-page',
  }"
  />
  <!-- 👉 Divider -->
  <VerticalNavSectionTitle
  :item="{
    heading: 'Scrape Results',
  }"
  />
  <VerticalNavLink
  :item="{
    title: 'Active Scrapes',
    icon: 'bx-table',
    to: '/active-scrapes',
  }"
  />
</template>

<!-- 👉 Pages -->
<slot />

<!-- 👉 Footer -->
<template #footer>
  <Footer />
</template>
</VerticalNavLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}
</style>
