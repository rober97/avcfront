import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/LoginPage.vue') },
      { path: 'register', component: () => import('src/pages/RegisterPage.vue') },
      { path: 'list-npc', component: () => import('pages/ListNpc.vue'), meta: { requiresAuth: true } },
      { path: 'main', component: () => import('src/pages/MainComponent.vue'), meta: { requiresAuth: true } },
      {
        path: 'profile/:id',
        component: () => import('src/pages/ProfileComponent.vue'),
        meta: { requiresAuth: true }
      },

      { path: 'explorer', component: () => import('src/pages/ExploreComponent.vue'), meta: { requiresAuth: true } },
      { path: 'home', component: () => import('src/pages/ExploreComponent.vue'), meta: { requiresAuth: true } },
      { path: 'shorts', component: () => import('src/pages/ShortsComponent.vue') },
      { path: 'messages/:id', component: () => import('src/pages/MessagesComponent.vue'), meta: { requiresAuth: true } },
      { path: 'messages-list', component: () => import('src/pages/MessagesComponent.vue'), meta: { requiresAuth: true } },
      { path: 'search', component: () => import('src/pages/SearchComponent.vue'), meta: { requiresAuth: true } },
      { path: 'market', component: () => import('src/pages/MarketComponent.vue'), meta: { requiresAuth: true } },
      { path: 'achievements', component: () => import('src/pages/AchievementsComponent.vue'), meta: { requiresAuth: true } },
      { path: 'store', component: () => import('src/pages/Store.vue') },
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // Si la ruta requiere autenticación y el usuario no está autenticado, redirigir al login
    next('/login');
  } else {
    next();
  }
});

export default routes;
