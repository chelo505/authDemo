import { createStore } from 'vuex';
import auth from './auth';
import cars from './cars';

export default createStore({
  modules: {
    auth,
    cars
  }
}); 