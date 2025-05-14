import axios from 'axios';

export const auth = {
  namespaced: true,
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  },
  
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },
  
  actions: {
    async login({ commit }, credentials) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await axios.post('/api/auth/login', credentials);
        
        commit('SET_USER', response.data.user);
        commit('SET_TOKEN', response.data.token);
        
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Login failed');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async register({ commit }, userData) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await axios.post('/api/auth/register', userData);
        
        commit('SET_USER', response.data.user);
        commit('SET_TOKEN', response.data.token);
        
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Registration failed');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    logout({ commit }) {
      commit('SET_USER', null);
      commit('SET_TOKEN', null);
    }
  },
  
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    authError: state => state.error,
    isLoading: state => state.loading
  }
};

export default auth; 