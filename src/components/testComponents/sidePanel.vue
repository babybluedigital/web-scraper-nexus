<template>
    <v-card>
      <v-layout>
        <v-navigation-drawer v-model="drawer" temporary>
          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
            title="John Leider"
          ></v-list-item>
  
          <v-divider></v-divider>
          
        </v-navigation-drawer>
        <v-main style="height: 250px;">
          <div class="d-flex justify-center align-center h-100">
            <v-btn color="primary" @click.stop="drawer = !drawer"> Toggle </v-btn>
          </div>
        </v-main>
      </v-layout>
    </v-card>
  </template>
  
  <script>
    export default {
      data() {
        return {
          drawer: null,
        }
      },
    }
  </script>
  