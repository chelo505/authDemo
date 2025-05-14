<template>
  <v-card class="mx-auto mt-6" max-width="500">
    <v-card-title class="text-center">Payment Details</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="handleSubmit">
        <v-text-field
          v-model="amount"
          label="Amount (USD)"
          type="number"
          min="1"
          required
          :error-messages="amountError"
        ></v-text-field>

        <!-- PayPal Buttons will be mounted here -->
        <div ref="paypalButtonsContainer" class="mb-4"></div>
        
        <v-alert
          v-if="error"
          type="error"
          class="mb-4"
        >
          {{ error }}
        </v-alert>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'PaymentForm',
  
  setup() {
    const store = useStore();
    const paypalButtonsContainer = ref(null);
    
    const amount = ref('');
    const amountError = ref('');
    
    const loading = computed(() => store.getters['payment/isLoading']);
    const error = computed(() => store.getters['payment/paymentError']);
    
    const validateAmount = () => {
      let isValid = true;
      amountError.value = '';
      
      if (!amount.value || amount.value <= 0) {
        amountError.value = 'Please enter a valid amount';
        isValid = false;
      }
      
      return isValid;
    };

    const initializePayPalButtons = async () => {
      try {
        const paypal = await store.dispatch('payment/initializePayPal');
        
        paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'pay'
          },
          
          createOrder: async () => {
            if (!validateAmount()) {
              throw new Error('Please enter a valid amount');
            }
            
            try {
              return await store.dispatch('payment/createOrder', {
                amount: Number(amount.value)
              });
            } catch (error) {
              throw new Error('Failed to create order');
            }
          },
          
          onApprove: async (data) => {
            try {
              await store.dispatch('payment/captureOrder', data.orderID);
              alert('Payment successful!');
              amount.value = '';
            } catch (error) {
              throw new Error('Failed to capture payment');
            }
          },
          
          onError: (err) => {
            store.commit('payment/SET_ERROR', 'Payment failed: ' + err.message);
          }
        }).render(paypalButtonsContainer.value);
        
      } catch (error) {
        store.commit('payment/SET_ERROR', error.message);
      }
    };
    
    onMounted(() => {
      initializePayPalButtons();
    });
    
    return {
      paypalButtonsContainer,
      amount,
      amountError,
      loading,
      error
    };
  }
};
</script>

<style>
.paypal-buttons {
  margin-top: 16px;
}
</style> 