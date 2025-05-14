import { createStore } from 'vuex';
import auth from './auth';
import payment from './payment';

export default createStore({
  modules: {
    auth,
    payment
  }
}); 