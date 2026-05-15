<script setup lang="ts">
import type { ProfessionalProfilePublic } from '~/types/professional'

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

useHead({
  title: 'Profesionales'
})

const professionalsApi = useProfessionalProfilesApi()

const loading = ref(false)
const errorMessage = ref('')
const search = ref('')
const professionals = ref<ProfessionalProfilePublic[]>([])

async function loadProfessionals() {
  loading.value = true
  errorMessage.value = ''

  try {
    professionals.value = await professionalsApi.list()
  } catch (error: any) {
    errorMessage.value =
      error?.data?.detail ||
      error?.data?.message ||
      error?.message ||
      'No se pudo cargar la lista de profesionales.'
  } finally {
    loading.value = false
  }
}

const filteredProfessionals = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return professionals.value

  return professionals.value.filter((item) =>
    [
      item.fullname,
      item.bio,
      item.mainzone,
      item.specialties,
      item.phone,
      item.whatsappnumber,
      item.verificationstatus
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(term))
  )
})

onMounted(loadProfessionals)
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm text-muted">Catálogo</p>
        <h1 class="text-2xl font-bold text-highlighted">Profesionales</h1>
        <p class="text-sm text-muted">
          Lista basada en perfiles públicos aprobados y visibles.
        </p>
      </div>

      <div class="w-full lg:max-w-sm">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Buscar por nombre, zona o especialidad"
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

    <div v-if="loading" class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <USkeleton v-for="n in 4" :key="n" class="h-56 rounded-xl" />
    </div>

    <div v-else-if="filteredProfessionals.length" class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <UPageCard
        v-for="item in filteredProfessionals"
        :key="item.professionalprofileid"
        :title="item.fullname"
        :description="item.bio || 'Sin biografía registrada.'"
        icon="i-lucide-briefcase-business"
        variant="subtle"
      >
        <div class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <UBadge :color="item.availablenow ? 'success' : 'neutral'" variant="soft">
              {{ item.availablenow ? 'Disponible ahora' : 'No disponible ahora' }}
            </UBadge>

            <UBadge color="primary" variant="soft">
              {{ item.verificationstatus }}
            </UBadge>
          </div>

          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p class="text-muted">Zona principal</p>
              <p class="font-medium text-highlighted">{{ item.mainzone }}</p>
            </div>
            <div>
              <p class="text-muted">Experiencia</p>
              <p class="font-medium text-highlighted">{{ item.yearsexperience }} años</p>
            </div>
            <div>
              <p class="text-muted">Rating</p>
              <p class="font-medium text-highlighted">
                {{ Number(item.averagerating || 0).toFixed(2) }}
              </p>
            </div>
            <div>
              <p class="text-muted">Calificaciones</p>
              <p class="font-medium text-highlighted">{{ item.ratingscount }}</p>
            </div>
            <div>
              <p class="text-muted">Servicios completados</p>
              <p class="font-medium text-highlighted">{{ item.completedservicescount }}</p>
            </div>
            <div>
              <p class="text-muted">WhatsApp</p>
              <p class="font-medium text-highlighted">{{ item.whatsappnumber || 'No registrado' }}</p>
            </div>
          </div>

          <div>
            <p class="mb-1 text-sm text-muted">Especialidades</p>
            <p class="text-sm text-highlighted">{{ item.specialties || 'Sin especialidades' }}</p>
          </div>
        </div>
      </UPageCard>
    </div>

    <UPageCard
      v-else
      title="Sin resultados"
      description="No se encontraron profesionales para el criterio actual."
      icon="i-lucide-search-x"
      variant="subtle"
    />
  </div>
</template>