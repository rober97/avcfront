import { defineStore } from 'pinia';
import axios from 'axios';
import { useGlobal } from './global';

export const useStoreStore = defineStore('store', {
  state: () => ({
    products: [],
    loading: false,
  }),
  actions: {
    async fetchProducts() {
      const global = useGlobal();
      this.loading = true;
      try {
        const res = await axios.get(`${global.url_api}/store/products`);
        this.products = res.data.products || [];
        return this.products;
      } catch (error) {
        console.error('Error al cargar productos:', error);
        this.products = [];
        return [];
      } finally {
        this.loading = false;
      }
    },

    async checkoutMercadoPago(productId) {
      const global = useGlobal();
      const user = JSON.parse(localStorage.getItem('user')) || {};
      try {
        const res = await axios.post(`${global.url_api}/store/checkout/mercadopago`, {
          productId,
          userId: user.id,
        });
        return res.data; // { success, init_point, orderId }
      } catch (error) {
        return error.response?.data || { success: false, message: 'Error al iniciar el pago' };
      }
    },

    async checkoutPayPal(productId) {
      const global = useGlobal();
      const user = JSON.parse(localStorage.getItem('user')) || {};
      try {
        const res = await axios.post(`${global.url_api}/store/checkout/paypal`, {
          productId,
          userId: user.id,
        });
        return res.data; // { success, approveUrl, paypalOrderId, orderId }
      } catch (error) {
        return error.response?.data || { success: false, message: 'Error al iniciar el pago' };
      }
    },

    async capturePayPal(paypalOrderId) {
      const global = useGlobal();
      try {
        const res = await axios.post(`${global.url_api}/store/paypal/capture`, { paypalOrderId });
        return res.data; // { success, status, orderId }
      } catch (error) {
        return error.response?.data || { success: false, message: 'Error al capturar el pago' };
      }
    },
  },
});
