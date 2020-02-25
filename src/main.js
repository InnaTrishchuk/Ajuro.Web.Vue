// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbvue/build/css/mdb.css';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Symbols from './components/Symbols';
import Charts from './components/Charts';
import Alerts from './components/Alerts';
import regeneratorRuntime from 'regenerator-runtime';
import App from './App';

/*
import CoreAuth from './CoreAuth'
import coreLogin from './components/login.vue'
import coreMagicLink from './components/magicLink.vue'
import coreReset from './components/reset.vue'
import coreAvatar from './components/avatar.vue'
import coreAccountItem from './components/account/accountItem.vue'
import coreAccountChooser from './components/account/accountChooser.vue'

Vue.component('vue-tags', VueTags);
Vue.component('core-login', coreLogin)
Vue.component('core-magic-link', coreMagicLink)
Vue.component('core-reset', coreReset)
Vue.component('core-avatar', coreAvatar)
Vue.component('core-account-item', coreAccountItem)
Vue.component('core-account-chooser', coreAccountChooser)
*/

Vue.use(VueRouter);
Vue.config.productionTip = false;  
console.log(regeneratorRuntime);

const routes = [
  { path: '', name: 'Charts', component: Charts },
  { path: '/', name: 'Charts', component: Charts },
  { path: '/Charts', component: Charts },
  { path: '/Symbols', component: Symbols },
  { path: '/Alerts', component: Alerts },
  { path: '*', redirect: '/' }
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
});
// .$mount('#app');