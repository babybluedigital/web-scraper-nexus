<script setup>
import avatar1 from '@images/avatars/avatar-1.png';
import { useRouter } from 'vue-router';

// ... existing script setup code

const router = useRouter();

const logout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('expiry');
  router.push('/login');
};
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
    bordered
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VImg :src="avatar1" />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    color="primary"
                    variant="tonal"
                  >
                    <VImg :src="avatar1" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              Nick Brisbane
            </VListItemTitle>
            <VListItemSubtitle>Owner</VListItemSubtitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem @click="logout">
    <template #prepend>
      <VIcon
        class="me-2"
        icon="bx-log-out"
        size="22"
      />
    </template>
    <VListItemTitle>Logout</VListItemTitle>
  </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
