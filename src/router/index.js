import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/pro',
  },
  {
    path: '/pro',
    name: 'Pro',
    component: () => import(/* webpackChunkName: "Pro" */ '../views/Trade/index.vue'),
  },
  {
    path: '/classic',
    name: 'Classic',
    component: () => import(/* webpackChunkName: "Classic" */ '../views/Classic/index.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
