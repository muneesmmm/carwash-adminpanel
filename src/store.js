import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const loadUserData = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

export default new Vuex.Store({
  state: {
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    barImage: 'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg',
    drawer: null,
    user: loadUserData(), // Load user data from localStorage
    isLoggedIn: !!loadUserData(), // Check if user is logged in
  },
  mutations: {
    SET_BAR_IMAGE (state, payload) {
      state.barImage = payload
    },
    SET_DRAWER (state, payload) {
      state.drawer = payload
    },
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user)); // Save user data to localStorage
    },
    SET_LOGGED_IN(state, value) {
      state.isLoggedIn = value;
    },
    RESET_USER_STATE(state) {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem('user'); // Remove user data from localStorage
    },

  },
  actions: {
    login({ commit }, user) {
      commit('SET_USER', user);
      commit('SET_LOGGED_IN', true);
    },
    logout({ commit }) {
      commit('RESET_USER_STATE');
    },
  },
  getters: {
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isLoggedIn,
  },
})
