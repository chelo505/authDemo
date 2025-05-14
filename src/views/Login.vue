<template>
  <div>
    <h1 class="text-h4 text-center mb-6">Welcome Back</h1>
    <LoginForm />
    
    <v-card class="mx-auto mt-6" max-width="400" flat>
      <v-card-text class="text-center">
        Don't have an account?
        <router-link to="/register">Register here</router-link>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import LoginForm from '../components/LoginForm.vue';

export default {
  name: 'Login',
  components: {
    LoginForm
  }
};
</script> 