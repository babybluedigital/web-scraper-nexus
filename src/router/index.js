import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/dashboard' },
    {
      path: '/',
      component: () => import('../layouts/default.vue'),
      children: [
        {
          path: 'dashboard',
          component: () => import('../pages/dashboard.vue'),
        },
        {
          path: 'ticket-master-scraper',
          component: () => import('../pages/ticket-master-scraper.vue'),
        },
        {
          path: 'event-brite-scraper',
          component: () => import('../pages/event-brite-scraper.vue'),
        },
        {
          path: 'active-scrapes',
          component: () => import('../pages/active-scrapes.vue'),
        },
      ],
    },
    {
      path: '/',
      component: () => import('../layouts/blank.vue'),
      children: [
        {
          path: 'login',
          component: () => import('../pages/login.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (to.path === '/login' && isLoggedIn) {
    // If already logged in and trying to access login page, redirect to dashboard
    next('/dashboard');
  } else if (to.path !== '/login' && !isLoggedIn) {
    // If not logged in and trying to access a protected route, redirect to login
    next('/login');
  } else {
    // Otherwise, proceed as normal
    next();
  }
});


export default router
