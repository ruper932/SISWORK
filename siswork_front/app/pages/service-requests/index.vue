<script setup lang="ts">
import type { ServiceRequest } from '~/types/service-request'

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

useHead({
  title: 'Solicitudes'
})

const serviceRequestsApi = useServiceRequestsApi()

const loading = ref(false)
const errorMessage = ref('')
const search = ref('')
const requests = ref<ServiceRequest[]>([])

async function loadRequests() {
  loading.value = true
  errorMessage.value = ''

  try {
    requests.value = await serviceRequestsApi.list()
  } catch (error: any) {
    errorMessage.value =
      error?.data?.detail ||
      error?.data?.message ||
      error?.message ||
      'No se pudo cargar la lista de solicitudes.'
  } finally {
    loading.value = false
  }
}

const filteredRequests = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return requests.value

  return requests.value.filter((item) =>
    [
      item.title,
      item.description,
      item.department,
      item.city,
      item.zone,
      item.status,
      item.contactchannel
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(term))
  )
})

function formatBudget(value?: number | null) {
  if (value === null || value === undefined) return 'No definido'

  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    maximumFractionDigits: 2
  }).format(value)
}

onMounted(loadRequests)
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm text-muted">Operaciones</p>
        <h1 class="text-2xl font-bold text-highlighted">Solicitudes de servicio</h1>
        <p class="text-sm text-muted">
          Seguimiento de publicaciones creadas por clientes.
        </p>
      </div>

      <div class="w-full lg:max-w-sm">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Buscar por título, zona o estado"
        />
      </div>
    </div>

    <UAlert
      v-if="errorMessage"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      title="No se pudo cargar la información"
      :description="errorMessage"
    />

    <div v-if="loading" class="space-y-3">
      <USkeleton v-for="n in 4" :key="n" class="h-44 rounded-xl" />
    </div>

    <div v-else-if="filteredRequests.length" class="space-y-4">
      <UPageCard
        v-for="item in filteredRequests"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        icon="i-lucide-file-text"
        variant="subtle"
      >
        <div class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <UBadge color="primary" variant="soft">{{ item.status }}</UBadge>
            <UBadge :color="item.isactive ? 'success' : 'neutral'" variant="soft">
              {{ item.isactive ? 'Activa' : 'Inactiva' }}
            </UBadge>
            <UBadge color="neutral" variant="soft">{{ item.contactchannel }}</UBadge>
          </div>

          <div class="grid grid-cols-1 gap-3 text-sm md:grid-cols-2 xl:grid-cols-4">
            <div>
              <p class="text-muted">Departamento</p>
              <p class="font-medium text-highlighted">{{ item.department }}</p>
            </div>
            <div>
              <p class="text-muted">Ciudad</p>
              <p class="font-medium text-highlighted">{{ item.city }}</p>
            </div>
            <div>
              <p class="text-muted">Zona</p>
              <p class="font-medium text-highlighted">{{ item.zone }}</p>
            </div>
            <div>
              <p class="text-muted">Fecha preferida</p>
              <p class="font-medium text-highlighted">{{ item.preferreddate || 'No definida' }}</p>
            </div>
            <div>
              <p class="text-muted">Presupuesto mínimo</p>
              <p class="font-medium text-highlighted">{{ formatBudget(item.minimumbudget) }}</p>
            </div>
            <div>
              <p class="text-muted">Presupuesto máximo</p>
              <p class="font-medium text-highlighted">{{ formatBudget(item.maximumbudget) }}</p>
            </div>
            <div>
              <p class="text-muted">Hora inicio</p>
              <p class="font-medium text-highlighted">{{ item.preferredstarttime || 'No definida' }}</p>
            </div>
            <div>
              <p class="text-muted">Hora fin</p>
              <p class="font-medium text-highlighted">{{ item.preferredendtime || 'No definida' }}</p>
            </div>
          </div>
        </div>
      </UPageCard>
    </div>

    <UPageCard
      v-else
      title="Sin resultados"
      description="No se encontraron solicitudes de servicio."
      icon="i-lucide-inbox"
      variant="subtle"
    />
  </div>
</template>