<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title>Authentication Demo</v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <template v-if="isAuthenticated">
        <v-btn
          variant="text"
          :to="{ name: 'Dashboard' }"
        >
          Dashboard
        </v-btn>

        <v-list-item
          to="/cars/new"
        > 
          MAKE A LISTING
        </v-list-item>

        <v-list-item
          to="/cars"
        >
          SEARCH
        </v-list-item>
        
        <v-list-item
          to="/my-listings"
         
        >
          MY LISTINGS
        </v-list-item>
        
        <v-btn
          variant="text"
          @click="handleLogout"
        >
          Logout
        </v-btn>
      </template>
      
      <template v-else>
        <v-list-item
          to="/cars"
        >
          SEARCH
        </v-list-item>
        
        <v-btn
          variant="text"
          :to="{ name: 'Login' }"
        >
          Login
        </v-btn>
        
        <v-btn
          variant="text"
          :to="{ name: 'Register' }"
        >
          Register
        </v-btn>

      </template>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'App',
  
  setup() {
    const store = useStore();
    const router = useRouter();
    
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
    
    const handleLogout = async () => {
      await store.dispatch('auth/logout');
      router.push('/login');
    };
    
    return {
      isAuthenticated,
      handleLogout
    };
  }
};
</script> 