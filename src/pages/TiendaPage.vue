<template>
  <q-page class="tienda-page q-pa-lg">
    <h1 class="page-title font-orbitron q-mb-lg">TIENDA</h1>

    <!-- Aviso: cuenta de Minecraft no vinculada -->
    <q-banner v-if="!isLinked" class="link-banner q-mb-lg" rounded>
      <template #avatar>
        <q-icon name="link_off" color="orange" />
      </template>
      Debes vincular tu cuenta de Minecraft para poder comprar y recibir tus productos en el servidor.
      <template #action>
        <q-btn flat color="orange" label="Vincular cuenta" @click="goLink" />
      </template>
    </q-banner>

    <div class="avc-tabs q-mb-lg">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['avc-tab', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="loading" class="row justify-center q-my-xl">
      <q-spinner size="48px" color="amber" />
    </div>

    <div v-else-if="filteredProducts.length === 0" class="text-center text-grey-6 q-my-xl">
      No hay productos disponibles por ahora.
    </div>

    <div v-else class="shop-grid">
      <div class="shop-item avc-card" v-for="item in filteredProducts" :key="item._id">
        <div class="item-icon">{{ item.image || (item.category === 'rank' ? '👑' : '🗝️') }}</div>
        <div class="item-name">{{ item.name }}</div>
        <div class="item-desc text-grey-6">{{ item.description }}</div>
        <div class="item-price">
          <span class="price-clp font-orbitron">${{ formatCLP(item.priceCLP) }} CLP</span>
          <span class="price-usd">US${{ Number(item.priceUSD).toFixed(2) }}</span>
        </div>

        <button
          class="avc-btn full-width q-mt-sm pay-btn mp"
          :disabled="busyId === item._id"
          @click="buy(item, 'mercadopago')"
        >
          {{ busyId === item._id && busyProvider === 'mercadopago' ? 'Redirigiendo...' : 'Mercado Pago (CLP)' }}
        </button>
        <button
          class="avc-btn full-width q-mt-sm pay-btn pp"
          :disabled="busyId === item._id"
          @click="buy(item, 'paypal')"
        >
          {{ busyId === item._id && busyProvider === 'paypal' ? 'Redirigiendo...' : 'PayPal (USD)' }}
        </button>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useStoreStore } from '../stores/storeStore'

const $q = useQuasar()
const router = useRouter()
const storeStore = useStoreStore()

const activeTab = ref('todos')
const busyId = ref(null)
const busyProvider = ref(null)

const tabs = [
  { id: 'todos', label: 'TODOS' },
  { id: 'rank', label: 'RANGOS' },
  { id: 'key', label: 'LLAVES' },
]

const loading = computed(() => storeStore.loading)
const products = computed(() => storeStore.products)
const filteredProducts = computed(() =>
  activeTab.value === 'todos'
    ? products.value
    : products.value.filter((p) => p.category === activeTab.value)
)

const user = JSON.parse(localStorage.getItem('user')) || {}
const isLinked = computed(() => !!user.minecraftUUID)

const formatCLP = (n) => Number(n || 0).toLocaleString('es-CL')

const goLink = () => router.push('/logros')

const buy = async (item, provider) => {
  if (busyId.value) return
  busyId.value = item._id
  busyProvider.value = provider
  try {
    const data =
      provider === 'mercadopago'
        ? await storeStore.checkoutMercadoPago(item._id)
        : await storeStore.checkoutPayPal(item._id)

    if (!data.success) {
      if (data.code === 'NOT_LINKED') {
        $q.notify({ type: 'warning', message: 'Vincula tu cuenta de Minecraft antes de comprar.' })
        router.push('/logros')
      } else {
        $q.notify({ type: 'negative', message: data.message || 'No se pudo iniciar el pago.' })
      }
      return
    }

    const url = provider === 'mercadopago' ? data.init_point : data.approveUrl
    if (url) {
      window.location.href = url // redirige al checkout del proveedor
    } else {
      $q.notify({ type: 'negative', message: 'No se recibió la URL de pago.' })
    }
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Error al procesar la compra.' })
  } finally {
    busyId.value = null
    busyProvider.value = null
  }
}

onMounted(() => storeStore.fetchProducts())
</script>

<style lang="scss" scoped>
.tienda-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: 2px;
}

.link-banner {
  background: rgba(212, 168, 67, 0.08);
  border: 1px solid rgba(212, 168, 67, 0.3);
  color: var(--text-primary);
}

.shop-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.shop-item {
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(212, 168, 67, 0.1);
  }
}

.item-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.item-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.item-desc {
  font-size: 13px;
  margin-bottom: 12px;
  line-height: 1.4;
  flex-grow: 1;
}

.item-price {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
}

.price-clp {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.price-usd {
  font-size: 12px;
  color: var(--text-secondary, #9a96b0);
}

.pay-btn {
  font-size: 11px;
  padding: 8px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.pay-btn.pp {
  background: #ffc439;
  color: #111;
}

.full-width {
  width: 100%;
}
</style>
