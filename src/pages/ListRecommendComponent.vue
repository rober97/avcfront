<template>
  <q-page padding>
    <q-card class="custom-card">
      <q-card-section>
        <div class="header">Listado de Recomendaciones de Compra</div>
      </q-card-section>

      <q-card-section>
        <q-btn
          @click="obtenerRecomendaciones"
          label="Obtener Recomendaciones"
          color="primary"
        />
        <q-btn
          @click="irAIngresarCompras"
          label="Ingresar Compras"
          color="secondary"
          class="q-ml-sm"
        />

      </q-card-section>

      <q-card-section>
        <q-select
          filled
          v-model="citySelected"
          :options="citiesOptions"
          label="Seleccionar Ciudad"
          clearable
        />
      </q-card-section>

      <q-card-section>
        <q-table :rows="recomendaciones" :columns="columnas" row-key="_id" />
      </q-card-section>
    </q-card>
  </q-page>
</template>


<script>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useMarketStore } from "../stores/marketStore";

export default {
  setup() {
    const marketStore = useMarketStore();
    const router = useRouter();
    const recomendaciones = ref([]);
    const citySelected = computed({
      get: () => marketStore.selectedCity,
      set: (val) => marketStore.setSelectCity(val),
    });
    const columnas = [
      {
        name: "nombre",
        required: true,
        label: "Nombre del Producto",
        align: "left",
        field: (row) => row.nombre,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "supermercado",
        required: true,
        label: "Supermercado",
        align: "left",
        field: (row) => row.supermercado,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "precioUnitario",
        align: "center",
        label: "Precio Unitario",
        field: "precioUnitario",
        sortable: true,
      },
    ];

    const citiesOptions = computed(() => marketStore.allCities.map(city => city.nombre));

    const obtenerRecomendaciones = async () => {
      await marketStore.getRecommendations();
      recomendaciones.value = marketStore.recommendations;
    };

    const irAIngresarCompras = () => {
      router.push("/market");
    };

    const agregarCiudadesPrueba = async () => {
      await marketStore.addCity("Calama");
      await marketStore.addCity("La Serena");
      await marketStore.getCities();
    };

    onMounted(async () => {
      await marketStore.getCities();
      await obtenerRecomendaciones();
    });

    return {
      recomendaciones,
      columnas,
      obtenerRecomendaciones,
      irAIngresarCompras,
      citiesOptions,
      citySelected,
      agregarCiudadesPrueba
    };
  },
};
</script>


<style scoped>
.custom-card {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.header {
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.q-ml-sm {
  margin-left: 8px;
}
</style>

