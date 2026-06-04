const routes = [
  // Public routes (no sidebar)
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'landing',
        component: () => import('pages/LandingPage.vue'),
        meta: { guestOnly: true }
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
        meta: { guestOnly: true }
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/RegisterPage.vue'),
        meta: { guestOnly: true }
      },
      {
        // Ranking público: accesible sin login
        path: 'rankings',
        name: 'rankings',
        component: () => import('pages/RankingsPage.vue'),
      },
    ]
  },

  // Authenticated routes (with GameLayout sidebar)
  {
    path: '/',
    component: () => import('layouts/GameLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('pages/DashboardPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'mi-perfil',
        name: 'mi-perfil',
        component: () => import('pages/PlayerProfilePage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'misiones',
        name: 'misiones',
        component: () => import('pages/MissionsPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'logros',
        name: 'logros',
        component: () => import('pages/AchievementsComponent.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'mapa',
        name: 'mapa',
        component: () => import('pages/MapPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'tienda',
        name: 'tienda',
        component: () => import('pages/TiendaPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'tienda/exito',
        name: 'tienda-exito',
        component: () => import('pages/StoreResultPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'tienda/pendiente',
        name: 'tienda-pendiente',
        component: () => import('pages/StoreResultPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'tienda/error',
        name: 'tienda-error',
        component: () => import('pages/StoreResultPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'eventos',
        name: 'eventos',
        component: () => import('pages/EventosPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'comunidad',
        name: 'comunidad',
        component: () => import('pages/ExploreComponent.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'profile/:id',
        component: () => import('pages/ProfileComponent.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'messages/:id',
        component: () => import('pages/MessagesComponent.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'messages-list',
        component: () => import('pages/MessagesComponent.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'search',
        component: () => import('pages/SearchComponent.vue'),
        meta: { requiresAuth: true }
      },
      // Legacy redirects
      {
        path: 'explorer',
        redirect: '/comunidad'
      },
      {
        path: 'home',
        redirect: '/dashboard'
      },
      {
        path: 'main',
        redirect: '/dashboard'
      },
      {
        path: 'achievements',
        redirect: '/logros'
      },
      {
        path: 'market',
        redirect: '/tienda'
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
