<template>
    <v-card class="pa-4">
        <v-form @submit.prevent="submitCar" ref="form">
            <v-text-field
                v-model="car.make"
                label="Make"
                required         
            ></v-text-field>

            <v-text-field
                v-model="car.model"
                label="Model"
                required
            ></v-text-field>

            <v-text-field
                v-model="car.year"
                label="Year"
                type="number"
                required
            ></v-text-field>

            <v-text-field
                v-model="car.vinCode"
                label="VIN Code"
                maxlength="17"
                required
                :rules="vinRules"
                @input="validateVin"
                hint="VIN must be 17 characters long"
                persistent-hint
            ></v-text-field>

            <v-text-field
                v-model="car.price"
                label="Price"
                type="number"
                required
            ></v-text-field>

            <v-textarea
                v-model="car.description"
                label="Description"
                required
            ></v-textarea>

            <v-text-field
                v-model="car.mileage"
                label="Mileage"
                type="number"
                required
            ></v-text-field>

            <v-file-input
                v-model="images"
                label="Car Images"
                multiple
                accept="image/*"
                :rules="imageRules"
                required
            ></v-file-input>

            <v-btn type="submit" color="primary" block>
                Create Listing
            </v-btn>
        </v-form>
    </v-card>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
        car: {
            make: '',
            model: '',
            year: new Date().getFullYear(),
            vinCode: '',
            price: '',
            description: '',
            mileage: ''
        },
        images: [],
        imageRules: [
            v => !v || v.length <= 5 || 'Max 5 images allowed',
            v => !v || v.every(file => file.size < 2000000) || 'Each image must be less than 2MB'
        ],
        vinRules: [
            v => !!v || 'VIN is required',
            v => v.length === 17 || 'VIN must be 17 characters long',
            v => /^\d{17}$/.test(v) || 'VIN must contain only numbers'
        ]
    }
  },
  methods: {
    validateVin(event) {
        this.car.vinCode = this.car.vinCode.replace(/\D/g, '').slice(0, 17);
    },
    async submitCar() {
        const isValid = await this.$refs.form.validate();
        
        if (!isValid) return;

        try {
            const formData = new FormData();
            Object.keys(this.car).forEach(key => {
                formData.append(key, this.car[key]);
            });
            this.images.forEach(image => {
                formData.append('images', image);
            });
            
            const response = await axios.post('http://localhost:3000/api/cars', formData, {
                headers: {
                    'Authorization': `Bearer ${this.$store.getters.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                alert('Listing created successfully');
                this.$router.push('/dashboard');
            }
        } catch (error) {
            console.error('Error creating a listing:', error);
        }
    }
  }
}
</script>
