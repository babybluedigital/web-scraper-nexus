<script setup>
import logo from '@images/logo.svg?raw';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const form = ref({
  email: '',
  password: '',
  remember: false,
});

const isPasswordVisible = ref(false);
const loginFailure = ref(false);
const router = useRouter();

console.log('Login page loaded');

const login = () => {
  console.log('Attempting login with Email:', form.value.email, 'Password:', form.value.password);
  if (form.value.email === 'luke@babyblue.info' && form.value.password === 'Password1') {
    console.log('Login successful');
    const now = new Date();
    const expiryTime = now.getTime() + 24 * 60 * 60 * 1000; // 24 hours from now
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('expiry', expiryTime.toString());
    loginFailure.value = false;
    router.push('/'); // Redirect to dashboard on successful login
  } else {
    console.log('Login failed');
    loginFailure.value = true;
    // Stay on login page, no redirection on failure
  }
};

onMounted(() => {
  console.log('Checking session status');
  const expiry = localStorage.getItem('expiry');
  if (expiry && new Date().getTime() > parseInt(expiry)) {
    console.log('Session expired, clearing data');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('expiry');
    console.log('Redirecting to login page');
    router.push('/login'); // Uncomment to enable redirection
  } else {
    console.log('Session active or no session exists');
  }
});
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard class="auth-card pa-4 pt-7" max-width="448">
    <VCardItem class="justify-center">
      <template #prepend>
        <div class="d-flex">
          <div class="d-flex text-primary" v-html="logo"/>
        </div>
      </template>
      
      <VCardTitle class="text-2xl font-weight-bold">
        Nexus
      </VCardTitle>
    </VCardItem>
    
    <VCardText class="pt-2">
      <h5 class="text-h5 mb-1">
        Welcome to Nexus! 👋🏻
      </h5>
      <p class="mb-0">
        Please sign-in to your account and start the adventure
      </p>
    </VCardText>
    
    <VCardText>
      <VForm @submit.prevent="login">
        <VRow>
          <!-- email -->
          <VCol cols="12">
            <VTextField v-model="form.email" autofocus placeholder="johndoe@email.com" label="Email" type="email"/>
          </VCol>
          
          <!-- password -->
          <VCol cols="12">
            <VTextField v-model="form.password" label="Password" placeholder="············" 
            :type="isPasswordVisible ? 'text' : 'password'"
            :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
            @click:append-inner="isPasswordVisible = !isPasswordVisible"/>
            
            <!-- remember me checkbox -->
            <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">

            </div>
            
            <!-- login button -->
            <VBtn
            block
            type="submit"
            @click="login"
            >
            Login
          </VBtn>
          
        </VCol>
        <VCol cols="12">
          <VCardText v-if="loginFailure" class="error-message">
            Invalid email or password. Please try again.
          </VCardText>
        </VCol>
        
      </VRow>
    </VForm>
  </VCardText>
</VCard>
</div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
