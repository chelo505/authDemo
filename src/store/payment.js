import axios from 'axios';
import { loadScript } from "@paypal/paypal-js";

export const payment = {
  namespaced: true,
  state: {
    loading: false,
    error: null,
    paypalInstance: null
  },

  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_PAYPAL_INSTANCE(state, instance) {
      state.paypalInstance = instance;
    }
  },

  actions: {
    async initializePayPal({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);

        const paypal = await loadScript({
          'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID,
          currency: 'USD'
        });

        commit('SET_PAYPAL_INSTANCE', paypal);
        return paypal;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to initialize PayPal');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async createOrder({ commit }, { amount }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);

        const response = await axios.post('/api/payment/create-order', {
          amount,
          currency: 'USD'
        });

        return response.data.orderId;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to create order');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async captureOrder({ commit }, orderId) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);

        const response = await axios.post(`/api/payment/capture-order/${orderId}`);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Payment capture failed');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },

  getters: {
    isLoading: state => state.loading,
    paymentError: state => state.error,
    getPayPalInstance: state => state.paypalInstance
  }
};

export default payment; 