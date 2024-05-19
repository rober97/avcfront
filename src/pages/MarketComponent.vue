<template>
  <q-page padding>
    <q-card class="custom-card">
      <q-card-section>
        <div class="header">Ingreso de compras</div>
      </q-card-section>

      <q-card-section>
        <q-btn
          @click="goToRecommendations"
          label="Obtener Recomendaciones"
          color="primary"
        />
      </q-card-section>

      <q-card-section>
        <q-select
          filled
          v-model="supermercadoSeleccionado"
          :options="supermercados"
          label="Seleccionar Supermercado"
          @update:model-value="listarItemsPorSupermercado"
          clearable
        />
      </q-card-section>

      <q-card-section>
        <q-form @submit="agregarArticulo">
          <div class="form-grid">
            <q-select
              filled
              v-model="codigoProducto"
              label="Buscar por Código"
              :options="codigos"
              use-input
              @update:model-value="seleccionarCodigo"
              @input-value="buscarCodigo"
              clearable
            />
            <q-select
              filled
              v-model="nombreArticulo"
              label="Buscar por Nombre"
              :options="nombres"
              use-input
              @update:model-value="seleccionarNombre"
              @input-value="buscarNombre"
              clearable
            />

            <q-input
              filled
              v-model="codigoProductoManual"
              label="Código del Producto"
              required
            />
            <q-input
              filled
              v-model="nombreArticuloManual"
              label="Nombre del Artículo"
              required
            />
            <q-input
              filled
              v-model="cantidad"
              label="Cantidad"
              type="number"
              required
            />
            <q-input
              filled
              v-model="precio"
              label="Precio"
              type="number"
              required
            />
          </div>
          <q-btn
            type="submit"
            label="Agregar"
            color="primary"
            class="submit-btn"
          />
        </q-form>
      </q-card-section>

      <q-card-section v-if="recomendacion">
        <div class="table-header">Mejor Opción Encontrada</div>
        <div>
          <p>Nombre: {{ recomendacion.nombre }}</p>
          <p>Supermercado: {{ recomendacion.supermercado }}</p>
          <p>Precio Unitario: {{ recomendacion.precioUnitario }}</p>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="table-header">Artículos Agregados</div>
        <q-table :rows="articulos" :columns="columnas" row-key="_id">
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn color="negative" @click="eliminarArticulo(props.row._id)"
                >Eliminar</q-btn
              >
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useMarketStore } from "../stores/marketStore";

export default {
  setup() {
    const router = useRouter();
    const marketStore = useMarketStore();
    const codigoProducto = ref("");
    const codigoProductoManual = ref("");
    const nombreArticulo = ref("");
    const nombreArticuloManual = ref("");
    const cantidad = ref(1);
    const precio = ref(0);
    const supermercadoSeleccionado = computed({
      get: () => marketStore.selectedSupermercado,
      set: (val) => marketStore.setSelectedSupermercado(val),
    });
    const supermercados = [
      "Lider",
      "Jumbo",
      "Tottus",
      "Unimarc",
      "Lider express",
      "Santa Isabel",
    ];
    const codigos = ref([]);
    const nombres = ref([]);
    const allItems = computed(() => marketStore.items);
    const searchItems = computed(() => marketStore.searchItems);
    const recomendacion = ref(null);

    const columnas = [
      {
        name: "codigo",
        required: true,
        label: "Código del Producto",
        align: "left",
        field: (row) => row.codigo,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "nombre",
        required: true,
        label: "Nombre del Artículo",
        align: "left",
        field: (row) => row.nombre,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "cantidad",
        align: "center",
        label: "Cantidad",
        field: "cantidad",
        sortable: true,
      },
      {
        name: "precio",
        align: "center",
        label: "Precio",
        field: "precio",
        sortable: true,
      },
      {
        name: "supermercado",
        align: "center",
        label: "Supermercado",
        field: "supermercado",
        sortable: true,
      },
      {
        name: "actions",
        label: "Acciones",
        align: "center",
        field: "",
        sortable: false,
      },
    ];

    const listarItemsPorSupermercado = async (supermercado) => {
      await marketStore.listItems(supermercado);
    };

    const agregarArticulo = async (e) => {
      e.preventDefault();
      const articulo = {
        codigo: codigoProductoManual.value || codigoProducto.value,
        nombre: nombreArticuloManual.value || nombreArticulo.value,
        cantidad: cantidad.value,
        precio: precio.value,
        supermercado: supermercadoSeleccionado.value,
      };
      await marketStore.addItem(articulo);
      codigoProductoManual.value = "";
      codigoProducto.value = "";
      nombreArticuloManual.value = "";
      nombreArticulo.value = "";
      cantidad.value = 0;
      precio.value = 0;
    };

    const eliminarArticulo = async (id) => {
      await marketStore.deleteItem(id);
    };

    const buscarCodigo = async (val) => {
      if (val.length > 1) {
        await marketStore.searchItem(val, "codigo");
        codigos.value = searchItems.value.map((item) => item.codigo);
      }
    };

    const buscarNombre = async (val) => {
      if (val.length > 1) {
        await marketStore.searchItem(val, "nombre");
        nombres.value = searchItems.value.map((item) => item.nombre);
      }
    };

    const seleccionarCodigo = (val) => {
      const item = allItems.value.find((item) => item.codigo === val);
      if (item) {
        codigoProductoManual.value = item.nombre;
        codigoProducto.value = item.codigo;
      }
    };

    const seleccionarNombre = (val) => {
      const item = allItems.value.find((item) => item.nombre === val);
      if (item) {
        nombreArticulo.value = item.nombre;
        nombreArticuloManual.value = item.nombre;
      }
    };

    const obtenerRecomendacion = () => {
      recomendacion.value = marketStore.recomendarArticulo(
        nombreArticulo.value
      );
    };

    onMounted(async () => {
      await marketStore.listItems(supermercadoSeleccionado.value);
    });

    // Watch searchItems to update codigos and nombres
    watch(searchItems, (newVal) => {
      codigos.value = newVal.map((item) => item.codigo);
      nombres.value = newVal.map((item) => item.nombre);
    });

    // Watch para obtener la recomendación automáticamente
    watch(
      [nombreArticulo, supermercadoSeleccionado],
      ([nuevoNombre, nuevoSupermercado]) => {
        if (nuevoNombre && nuevoSupermercado) {
          obtenerRecomendacion();
        }
      }
    );

    const actualizarSupermercado = async (val) => {
      marketStore.setSelectedSupermercado(val);
      await marketStore.listItems();
    };

    const goToRecommendations = () => {
      router.push("/market-list");
    };

    return {
      codigoProducto,
      codigoProductoManual,
      nombreArticulo,
      nombreArticuloManual,
      cantidad,
      precio,
      supermercadoSeleccionado,
      supermercados,
      codigos,
      nombres,
      columnas,
      articulos: computed(() => marketStore.items),
      agregarArticulo,
      eliminarArticulo,
      buscarCodigo,
      buscarNombre,
      seleccionarCodigo,
      seleccionarNombre,
      recomendacion,
      actualizarSupermercado,
      goToRecommendations,
      listarItemsPorSupermercado,
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.submit-btn {
  display: block;
  width: 100%;
  margin-top: 20px;
}

.table-header {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
