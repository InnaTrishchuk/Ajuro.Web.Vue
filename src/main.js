// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbvue/build/css/mdb.css';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Symbols from './components/Symbols';
import Alerts from './components/Alerts';
import App from './App';

Vue.use(VueRouter);
Vue.config.productionTip = false;

const routes = [
  { path: '/Symbols', component: Symbols },
  { path: '/Alerts', component: Alerts }
];

const router = new VueRouter({
  // short for `routes: routes`
  routes
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',  
  router
}).$mount('#app');