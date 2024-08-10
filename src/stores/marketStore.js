import { defineStore } from 'pinia';
import axios from "axios";
import { useGlobal } from "./global";

export const useMarketStore = defineStore({
  id: 'market',
  state: () => ({
    items: [],
    recommendations: [],
    selectedSupermercado: "", // Nuevo estado para el supermercado seleccionado
    searchResults: [],
    cities: [],
    selectedCity: ''
  }),
  getters: {
    allItems: (state) => state.items,
    searchItems: (state) => state.searchResults,
    allCities: (state) => state.cities,
    selectCity: (state) => state.selectedCity,
  },
  actions: {
    async listItems(supermercado) {
      const global = useGlobal();
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        params: { supermercado },
        url: `${global.url_api}/list-items-by-market`,
      };

      try {
        const res = await axios.get(config.url, config);
        this.items = res.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getCities() {
      const global = useGlobal();
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        url: `${global.url_api}/all-cities`,
      };

      try {
        const res = await axios.get(config.url, config);
        this.cities = res.data;
      } catch (error) {
        console.log(error);
      }
    },

    async listMarketByCity(supermercado) {
      const global = useGlobal();
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        params: { supermercado },
        url: `${global.url_api}/list-market-by-city`,
      };

      try {
        const res = await axios.get(config.url, config);
        this.items = res.data;
      } catch (error) {
        console.log(error);
      }
    },

    async addCity(nombre) {
      const global = useGlobal();
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        url: `${global.url_api}/create-city`,
      };

      try {
        const res = await axios.post(config.url, { nombre }, config);
        if (res.data) {
          this.cities.push(res.data);
        } else {
          throw new Error("Error al agregar la ciudad");
        }
      } catch (error) {
        console.log(error);
      }
    },

    async addItem(item) {
      const global = useGlobal();
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        url: `${global.url_api}/create-item`,
      };

      try {
        if (item.cantidad > 0) {
          item.precioUnitario = item.precio / item.cantidad;
        } else {
          item.precioUnitario = 0; // O puedes manejar esto de otra manera según tu lógica
        }

        const res = await axios.post(config.url, item, config);
        if (res.data) {
          this.items.push(res.data);
        } else {
          throw new Error("Error al agregar el artículo");
        }
      } catch (error) {
        console.log(error);
      }
    },


    async deleteItem(id) {
      const global = useGlobal();
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        url: `${global.url_api}/delete-item/${id}`,
      };

      try {
        const res = await axios.delete(config.url, config);
        if (res.data.success) {
          this.items = this.items.filter(item => item._id !== id);
        } else {
          throw new Error("Error al eliminar el artículo");
        }
      } catch (error) {
        console.log(error);
      }
    },

    async searchItem(query, type) {
      const global = useGlobal();
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        params: { query, type },
        url: `${global.url_api}/search-items`,
      };

      try {
        const res = await axios.get(config.url, config);
        this.searchResults = res.data;
      } catch (error) {
        console.log(error);
      }
    },

    setSelectedSupermercado(supermercado) {
      this.selectedSupermercado = supermercado;
    },

    setSelectCity(city) {
      this.selectedCity = city;
    },
    recomendarArticulo(nombreArticulo) {
      const articulos = this.items.filter(
        item => item.nombre.toLowerCase() === nombreArticulo.toLowerCase() &&
          item.supermercado === this.selectedSupermercado
      );

      if (articulos.length === 0) {
        return null;
      }

      return articulos.reduce((mejorArticulo, articulo) =>
        articulo.precioUnitario < mejorArticulo.precioUnitario ? articulo : mejorArticulo
      );
    },

    async getRecommendations() {
      const global = useGlobal();
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        url: `${global.url_api}/recommend-items`,
      };

      try {
        const res = await axios.get(config.url, config);
        this.recommendations = res.data;
      } catch (error) {
        console.log(error);
      }
    }
  }
});
