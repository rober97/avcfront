import { defineStore } from 'pinia';
//"http://localhost:3000"
//'https://avc-1dbca99a8369.herokuapp.com'
export const useGlobal = defineStore('counter', {
  state: () => ({
    url_api: "http://localhost:3000",
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
