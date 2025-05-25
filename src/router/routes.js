const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('src/pages/LoginPage.vue'),
        meta: { guestOnly: true }
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('src/pages/RegisterPage.vue'),
        meta: { guestOnly: true }
      },
      {
        path: 'list-npc',
        component: () => import('pages/ListNpc.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'main',
        component: () => import('src/pages/MainComponent.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'profile/:id',
        component: () => import('src/pages/ProfileComponent.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'explorer',
        name: 'explorer',
        component: () => import('src/pages/ExploreComponent.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'home',
        component: () => import('src/pages/ExploreComponent.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'shorts',
        component: () => import('src/pages/ShortsComponent.vue')
      },
      {
        path: 'messages/:id',
        component: () => import('src/pages/MessagesComponent.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'messages-list',
        component: () => import('src/pages/MessagesComponent.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'search',
        component: () => import('src/pages/SearchComponent.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'market',
        component: () => import('src/pages/MarketComponent.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'achievements',
        component: () => import('src/pages/AchievementsComponent.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'guide',
        component: () => import('src/pages/GuideComponent.vue')
      },
      {
        path: 'store',
        component: () => import('src/pages/Store.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
