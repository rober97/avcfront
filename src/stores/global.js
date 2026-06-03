import { defineStore } from 'pinia';
//"http://localhost:3000"
//'https://avc-1dbca99a8369.herokuapp.com'
//31b1570b

// API base automática según el entorno:
// - en local (localhost / 127.0.0.1) usa el backend local
// - en producción (avclatin.com, vercel, etc) usa el backend de Heroku
const isLocal =
  typeof window !== 'undefined' &&
  /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);

const API_BASE = isLocal
  ? 'http://localhost:3000/api'
  : 'https://avc-1dbca99a8369.herokuapp.com/api';

export const useGlobal = defineStore('counter', {
  state: () => ({
    url_api: API_BASE,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },

  actions: {
    increment() {
      this.counter++;
    },
  },
});
