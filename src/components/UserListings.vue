<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2 class="text-h4 mb-4">My Listings</h2>
        <v-btn
          color="primary"
          to="/cars/new"
          class="mb-4"
        >
          Add New Listing
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert type="error">{{ error }}</v-alert>
      </v-col>
    </v-row>

    <v-row v-else-if="!userCars.length">
      <v-col cols="12" class="text-center">
        <p>You haven't created any listings yet.</p>
        <v-btn
          color="primary"
          to="/cars/new"
        >
          Create Your First Listing
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="car in userCars" :key="car._id" cols="12" sm="6" md="4">
        <v-card>
          <v-img
            v-if="car.images && car.images.length"
            :src="car.images[0]"
            height="200"
            cover
          ></v-img>

          <v-card-title>{{ car.make }} {{ car.model }}</v-card-title>

          <v-card-text>
            <div>Year: {{ car.year }}</div>
            <div>Price: ${{ car.price }}</div>
            <div>VIN: {{ car.vinCode }}</div>
            <div>Mileage: {{ car.mileage }} km</div>
            <div class="text-truncate">{{ car.description }}</div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="error"
              variant="text"
              @click="deleteListing(car._id)"
            >
              Delete
            </v-btn>
            <v-btn
              color="primary"
              variant="text"
              :to="`/cars/edit/${car._id}`"
            >
              Edit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import axios from 'axios';

export default defineComponent({
  name: 'UserListings',
  
  data() {
    return {
      userCars: [],
      loading: false,
      error: null
    }
  },

  computed: {
    ...mapState('auth', ['user', 'token'])
  },

  async created() {
    if (!this.user && localStorage.getItem('token')) {
      await this.$store.dispatch('auth/initAuth');
    }
    await this.fetchUserCars();
  },

  methods: {
    async fetchUserCars() {
      if (!this.token) {
        this.error = 'Please log in to view your listings';
        return;
      }

      try {
        this.loading = true;
        this.error = null;
        
        const response = await axios.get('/api/cars', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });

        // Add debug logging
        console.log('Current user:', this.user);
        console.log('All cars:', response.data);
        
        this.userCars = response.data.filter(car => {
          console.log('Comparing car.userId:', car.userId, 'with user.id:', this.user.id);
          return car.userId === this.user.id;
        });

        console.log('Filtered user cars:', this.userCars);
      } catch (error) {
        console.error('Error fetching user cars:', error);
        this.error = 'Failed to load your listings';
      } finally {
        this.loading = false;
      }
    },

    async deleteListing(carId) {
      if (!confirm('Are you sure you want to delete this listing?')) return;

      try {
        await axios.delete(`/api/cars/${carId}`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        await this.fetchUserCars();
      } catch (error) {
        console.error('Error deleting car:', error);
      }
    }
  }
});
</script> 