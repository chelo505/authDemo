<template>
  <div>
    <h1 class="text-h4 text-center mb-6">Dashboard</h1>
    <v-card class="mx-auto" max-width="600">
      <v-card-text>
        <p class="text-h6">Welcome to your dashboard!</p>
        <p class="mt-4">You can now:</p>
        <ul class="mt-2">
          <li>View your profile</li>
          <li>Make payments</li>
          <li>View transaction history</li>
        </ul>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          :to="{ name: 'Payment' }"
        >
          Make a Payment
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'Dashboard'
};
</script> 