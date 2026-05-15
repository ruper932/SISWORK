<script setup lang="ts">
import type { ServiceRequest } from '~/types/service-request'

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

useHead({
  title: 'Detalle de solicitud'
})

const route = useRoute()
const serviceRequestsApi = useServiceRequestsApi()

const loading = ref(false)
const errorMessage = ref('')
const requestItem = ref<ServiceRequest | null>(null)

async function loadRequest() {
  loading.value = true
  errorMessage.value = ''

  try {
    requestItem.value = await serviceRequestsApi.getById(String(route.params.id))
  } catch (error: any) {
    errorMessage.value =
      error?.data?.detail ||
      error?.data?.message ||
      error?.message ||
      'No se pudo cargar la solicitud.'
  } finally {
    loading.value = false
  }
}

function formatBudget(value?: number | null) {
  if (value === null || value === undefined) return 'No definido'

  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    maximumFractionDigits: 2
  }).format(value)
}

onMounted(loadRequest)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-sm text-muted">Solicitudes</p>
        <h1 class="text-2xl font-bold text-highlighted">Detalle de solicitud</h1>
      </div>

      <UButton to="/service-requests" color="neutral" variant="outline" icon="i-lucide-arrow-left">
        Volver
      </UButton>
    </div>

    <UAlert
      v-if="errorMessage"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      title="No se pudo cargar la información"
      :description="errorMessage"
    />

    <USkeleton v-if="loading" class="h-80 rounded-xl" />

    <UPageCard
      v-else-if="requestItem"
      :title="requestItem.title"
      :description="requestItem.description"
      icon="i-lucide-file-text"
      variant="subtle"
    >
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <p class="text-sm text-muted">Estado</p>
          <p class="font-medium text-highlighted">{{ requestItem.status }}</p>
        </div>
        <div>
          <p class="text-sm text-muted">Canal de contacto</p>
          <p class="font-medium text-highlighted">{{ requestItem.contactchannel }}</p>
        </div>
        <div>
          <p class="text-sm text-muted">Activa</p>
          <p class="font-medium text-highlighted">{{ requestItem.isactive ? 'Sí' : 'No' }}</p>
        </div>
        <div>
          <p class="text-sm text-muted">Departamento</p>
          <p class="font-medium text-highlighted">{{ requestItem.department }}</p>
        </div>
        <div>
          <p class="text-sm text-muted">Ciudad</p>
          <p class="font-medium text-highlighted">{{ requestItem.city }}</p>
        </div>
        <div>
          <p class="text-sm text-muted">Zona</p>
          <p class="font-medium text-highlighted">{{ requestItem.zone }}</p>
        </div>
        <div>
          <p class="text-sm text-muted">Presupuesto mínimo</p>
          <p class="font-medium text-highlighted">{{ formatBudget(requestItem.minimumbudget) }}</p>
        </div>
        <div>
          <p class="text-sm text-muted">Presupuesto máximo</p>
          <p class="font-medium text-highlighted">{{ formatBudget(requestItem.maximumbudget) }}</p>
        </div>
        <div>
          <p class="text-sm text-muted">Fecha preferida</p>
          <p class="font-medium text-highlighted">{{ requestItem.preferreddate || 'No definida' }}</p>
        </div>
        <div>
          <p class="text-sm text-muted">Hora inicio</p>
          <p class="font-medium text-highlighted">{{ requestItem.preferredstarttime || 'No definida' }}</p>
        </div>
        <div>
          <p class="text-sm text-muted">Hora fin</p>
          <p class="font-medium text-highlighted">{{ requestItem.preferredendtime || 'No definida' }}</p>
        </div>
        <div>
          <p class="text-sm text-muted">Cerrada en</p>
          <p class="font-medium text-highlighted">{{ requestItem.closedat || 'Aún no cerrada' }}</p>
        </div>
      </div>

      <div class="mt-4">
        <p class="mb-1 text-sm text-muted">Dirección</p>
        <p class="text-highlighted">{{ requestItem.address || 'No registrada' }}</p>
      </div>

      <div class="mt-4">
        <p class="mb-1 text-sm text-muted">Referencia</p>
        <p class="text-highlighted">{{ requestItem.reference || 'Sin referencia' }}</p>
      </div>
    </UPageCard>
  </div>
</template>