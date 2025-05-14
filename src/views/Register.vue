<template>
  <div>
    <h1 class="text-h4 text-center mb-6">Create Account</h1>
    <v-card class="mx-auto mt-6" max-width="400">
      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            required
            :error-messages="emailError"
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            required
            :error-messages="passwordError"
          ></v-text-field>

          <v-text-field
            v-model="confirmPassword"
            label="Confirm Password"
            type="password"
            required
            :error-messages="confirmPasswordError"
          ></v-text-field>

          <v-alert
            v-if="error"
            type="error"
            class="mb-4"
          >
            {{ error }}
          </v-alert>

          <v-btn
            type="submit"
            color="primary"
            block
            :loading="loading"
          >
            Register
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    
    <v-card class="mx-auto mt-6" max-width="400" flat>
      <v-card-text class="text-center">
        Already have an account?
        <router-link to="/login">Login here</router-link>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Register',
  
  setup() {
    const store = useStore();
    const router = useRouter();
    
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const emailError = ref('');
    const passwordError = ref('');
    const confirmPasswordError = ref('');
    
    const loading = computed(() => store.getters['auth/isLoading']);
    const error = computed(() => store.getters['auth/authError']);
    
    const validateForm = () => {
      let isValid = true;
      emailError.value = '';
      passwordError.value = '';
      confirmPasswordError.value = '';
      
      if (!email.value) {
        emailError.value = 'Email is required';
        isValid = false;
      }
      
      if (!password.value) {
        passwordError.value = 'Password is required';
        isValid = false;
      }
      
      if (!confirmPassword.value) {
        confirmPasswordError.value = 'Please confirm your password';
        isValid = false;
      } else if (password.value !== confirmPassword.value) {
        confirmPasswordError.value = 'Passwords do not match';
        isValid = false;
      }
      
      return isValid;
    };
    
    const handleSubmit = async () => {
      if (!validateForm()) return;
      
      try {
        await store.dispatch('auth/register', {
          email: email.value,
          password: password.value
        });
        
        router.push('/dashboard');
      } catch (error) {
        // Error is handled by the store
      }
    };
    
    return {
      email,
      password,
      confirmPassword,
      emailError,
      passwordError,
      confirmPasswordError,
      loading,
      error,
      handleSubmit
    };
  }
};
</script> 