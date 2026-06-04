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
  : 'https://avcback.onrender.com/api';

// URL del mapa web del servidor (Dynmap).
// Cambia esto por el subdominio/IP donde expongas Dynmap.
// IMPORTANTE: en producción debe ser HTTPS, o el navegador bloqueará el iframe (mixed content).
//   - Producción (reverse proxy con SSL):  https://map.avclatin.com
//   - Local / directo al puerto de Dynmap: http://TU_IP_SERVIDOR:8123
const url_map = 'https://map.avclatin.com';

export const useGlobal = defineStore('counter', {
  state: () => ({
    url_api: API_BASE,
    url_map,
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
