import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes' // ✅ este sí es un array ahora

export default route(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes, // ✅ ya es un array, funciona bien
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('isAuthenticated');
    const isAuthenticated = !!token;
    debugger
    if (to.meta.requiresAuth && !isAuthenticated) {
      next({ name: 'login' });
    } else if (to.meta.guestOnly && isAuthenticated) {
      next({ name: 'explorer' });
    } else {
      next();
    }
  })

  return Router
})
