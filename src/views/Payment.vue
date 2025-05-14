<template>
  <div>
    <h1 class="text-h4 text-center mb-6">Make a Payment</h1>
    <PaymentForm />
  </div>
</template>

<script>
import PaymentForm from '../components/PaymentForm.vue';

export default {
  name: 'Payment',
  components: {
    PaymentForm
  }
};
</script> 