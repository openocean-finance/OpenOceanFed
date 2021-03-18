import { tryConnect } from '@/utils/dApp';
import { initTheme } from '@/utils/theme';
import Vue from 'vue';
import format from '@/utils/format';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/utils/resize';
import '@/styles/index.scss';

Vue.config.productionTip = false;

tryConnect();

Vue.use(format);

initTheme();

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
