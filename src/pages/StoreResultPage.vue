<template>
  <q-page class="result-page column flex-center q-pa-lg">
    <q-spinner v-if="capturing" size="64px" color="amber" />
    <q-icon v-else :name="icon" :color="color" size="80px" />

    <h2 class="result-title q-mt-md">{{ title }}</h2>
    <p class="result-message text-center">{{ message }}</p>

    <q-btn class="avc-btn q-mt-lg" label="Volver a la tienda" @click="router.push('/tienda')" />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStoreStore } from '../stores/storeStore'

const route = useRoute()
const router = useRouter()
const storeStore = useStoreStore()

const status = ref(
  route.path.includes('exito') ? 'success' : route.path.includes('pendiente') ? 'pending' : 'error'
)
const capturing = ref(false)

const icon = computed(() =>
  status.value === 'success' ? 'check_circle' : status.value === 'pending' ? 'hourglass_top' : 'cancel'
)
const color = computed(() =>
  status.value === 'success' ? 'green' : status.value === 'pending' ? 'orange' : 'red'
)
const title = computed(() => {
  if (capturing.value) return 'Procesando tu pago...'
  if (status.value === 'success') return '¡Pago recibido!'
  if (status.value === 'pending') return 'Pago pendiente'
  return 'Pago no completado'
})
const message = computed(() => {
  if (capturing.value) return 'Estamos confirmando tu pago, espera un momento.'
  if (status.value === 'success') {
    return 'Tu compra se está entregando en el servidor. Si estás conectado, revisa tu inventario o tu rango en unos segundos.'
  }
  if (status.value === 'pending') {
    return 'Tu pago está siendo procesado. Apenas se confirme, recibirás tu producto automáticamente en el servidor.'
  }
  return 'El pago no se completó. No se realizó ningún cobro. Puedes intentarlo nuevamente.'
})

onMounted(async () => {
  // Flujo PayPal: el comprador vuelve con ?token=<paypalOrderId> y hay que capturar el pago.
  const token = route.query.token
  if (status.value === 'success' && token) {
    capturing.value = true
    try {
      const res = await storeStore.capturePayPal(token)
      status.value = res.success ? 'success' : 'error'
    } catch (e) {
      status.value = 'error'
    } finally {
      capturing.value = false
    }
  }
})
</script>

<style lang="scss" scoped>
.result-page {
  max-width: 600px;
  margin: 0 auto;
  min-height: 60vh;
}

.result-title {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.result-message {
  font-size: 15px;
  color: var(--text-secondary, #9a96b0);
  max-width: 480px;
  line-height: 1.5;
}
</style>
