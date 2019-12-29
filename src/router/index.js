import Vue from 'vue';
import VueRouter from 'vue-router';
import App from '../App.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: App
  },
  {
    path: '/blizzardquotes',
    name: 'blizzard-quotes',
    beforeEnter() {
      location.href = 'http://blizzardquotes.com';
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
