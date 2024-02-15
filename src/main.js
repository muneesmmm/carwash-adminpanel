// =========================================================
// * Vuetify Material Dashboard - v2.1.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vuetify-material-dashboard
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/base';
import './plugins/vee-validate';
import vuetify from './plugins/vuetify';
import axios from 'axios';
import i18n from './i18n';
import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false;

// Add Axios to the Vue prototype
Vue.prototype.$axios = axios;
axios.defaults.baseURL = 'https://carwashadmin.hexpeak.co.in';

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app');
