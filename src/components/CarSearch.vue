<template>
    <v-card class="pa-4">
        <v-row>
            <v-col cols="12" sm="4">
                <v-select
                    v-model="searchType"
                    :items="searchTypes"
                    label="Search By"
                ></v-select>
            </v-col>

            <v-col cols="12" sm="8">
                <v-text-field
                    v-model="searchQuery"
                    :label="searchType === 'vin' ? 'Enter VIN Code' : 'Search Cars'"
                    @input="debounceSearch"
                ></v-text-field>
            </v-col>
        </v-row>

        <v-row>
            <v-col v-for="car in cars" :key="car._id" cols="12" sm="6" md="4">
                <v-card>
                    <v-img
                        v-if="car.images && car.images.length"
                        :src="car.images[0]"
                        height="200"
                        cover
                    ></v-img>

                    <v-card-title>{{ car.make }} {{ car.model }} ({{ car.year }})</v-card-title>

                    <v-card-text>
                        <div>Year: {{ car.year }}</div>
                        <div>Price: ${{ car.price }}</div>
                        <div>VIN: {{ car.vinCode }}</div>
                        <div>Mileage: {{ car.mileage }} km</div>
                        <div class="text-truncate">{{ car.description }}</div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
import axios from 'axios';
import { debounce } from 'lodash';

export default {
    data() {
        return {
            searchQuery: '',
            searchType: 'name',
            searchTypes: [
                { title: 'Search by name', value: 'name' },
                { title: 'Search by VIN', value: 'vin'},
            ],
            cars: []
        }
    },
    created() {
        this.debounceSearch = debounce(this.search, 300);
        this.fetchCars();
    },
    methods: {
        async fetchCars() {
            try {
                const response = await axios.get('http://localhost:3000/cars');
                this.cars = response.data;
            } catch (error) {
                console.error('Error fetching cars:', error);
            }
        },
        async search() {
            if (!this.searchQuery) {
                return this.fetchCars();
            }

            try {
                const response = await axios.get(`http://localhost:3000/api/cars/search`, {
                    params: {
                        query: this.searchQuery,
                        type: this.searchType
                    }
                });
                this.cars = response.data;
            } catch (error) {
                console.error('Error searching cars:', error);
            }
        }
    }
}
</script>
