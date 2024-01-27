import { defineStore } from 'pinia';

export const useGlobal = defineStore('counter', {
  state: () => ({
    url_api: 'https://avc-1dbca99a8369.herokuapp.com',
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
