<script setup lang="ts">
import type { ProfessionalProfilePublic } from '~/types/professional'

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

useHead({
  title: 'Detalle de profesional'
})

const route = useRoute()
const professionalsApi = useProfessionalProfilesApi()

const loading = ref(false)
const errorMessage = ref('')
const professional = ref<ProfessionalProfilePublic | null>(null)

async function loadProfessional() {
  loading.value = true
  errorMessage.value = ''

  try {
    professional.value = await professionalsApi.getById(String(route.params.id))
  } catch (error: any) {
    errorMessage.value =
      error?.data?.detail ||
      error?.data?.message ||
      error?.message ||
      'No se pudo cargar el profesional.'
  } finally {
    loading.value = false
  }
}

onMounted(loadProfessional)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-sm text-muted">Profesionales</p>
        <h1 class="text-2xl font-bold text-highlighted">Detalle de profesional</h1>
      </div>

      <UButton to="/professionals" color="neutral" variant="outline" icon="i-lucide-arrow-left">
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
      v-else-if="professional"
      :title="professional.fullname"
      :description="professional.bio || 'Sin biografía registrada.'"
      icon="i-lucide-user-round-search"
      variant="subtle"
    >
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p class="text-sm text-muted">Zona principal</p>
          <p class="font-medium text-highlighted">{{ professional.mainzone }}</p>
        </div>
        <div>
          <p class="text-sm text-muted">Experiencia</p>
          <p class="font-medium text-highlighted">{{ professional.yearsexperience }} años</p>
        </div>
        <div>
          <p class="text-sm text-muted">Rating promedio</p>
          <p class="font-medium text-highlighted">{{ Number(professional.averagerating || 0).toFixed(2) }}</p>
        </div>
        <div>
          <p class="text-sm text-muted">Calificaciones</p>
          <p class="font-medium text-highlighted">{{ professional.ratingscount }}</p>
        </div>
        <div>
          <p class="text-sm text-muted">Servicios completados</p>
          <p class="font-medium text-highlighted">{{ professional.completedservicescount }}</p>
        </div>
        <div>
          <p class="text-sm text-muted">Estado de verificación</p>
          <p class="font-medium text-highlighted">{{ professional.verificationstatus }}</p>
        </div>
        <div>
          <p class="text-sm text-muted">Teléfono</p>
          <p class="font-medium text-highlighted">{{ professional.phone || 'No registrado' }}</p>
        </div>
        <div>
          <p class="text-sm text-muted">WhatsApp</p>
          <p class="font-medium text-highlighted">{{ professional.whatsappnumber || 'No registrado' }}</p>
        </div>
      </div>

      <div class="mt-4">
        <p class="mb-1 text-sm text-muted">Especialidades</p>
        <p class="text-highlighted">{{ professional.specialties || 'Sin especialidades' }}</p>
      </div>
    </UPageCard>
  </div>
</template>