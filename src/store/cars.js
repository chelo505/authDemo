import axios from 'axios';

export default {
    namespaced: true,
    state: {
        userCars: [],
        loading: false,
        error: null
    },
    mutations: {
        SET_USER_CARS(state, cars) {
            state.userCars = cars;
        },
        SET_LOADING(state, status) {
            state.loading = status;
        },
        SET_ERROR(state, error) {
            state.error = error;
        }
    },
    actions: {
        async fetchUserCars({ commit, rootState }) {
            if (!rootState.auth.user || !rootState.auth.token) {
                commit('SET_ERROR', 'Authentication required');
                return;
            }

            try {
                commit('SET_LOADING', true);
                commit('SET_ERROR', null);

                const response = await axios.get('http://localhost:3000/api/cars', {
                    headers: {
                        'Authorization': `Bearer ${rootState.auth.token}`
                    }
                });

                const userCars = response.data.filter(
                    car => car.userId === rootState.auth.user.id
                );
                
                commit('SET_USER_CARS', userCars);
            } catch (error) {
                console.error('Error fetching user cars:', error);
                commit('SET_ERROR', 'Failed to load listings');
            } finally {
                commit('SET_LOADING', false);
            }
        }
    },
    getters: {
        getUserCars: state => state.userCars,
        isLoading: state => state.loading,
        getError: state => state.error
    }
}