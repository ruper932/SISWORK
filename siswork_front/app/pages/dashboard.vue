<script setup lang="ts">
definePageMeta({
  layout: 'app',
  middleware: 'auth',
  title: 'Dashboard'
})

type MeResponse = {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
  status: string
  email_verified_at: string | null
  last_login_at: string | null
}

type UserListItemResponse = {
  id: string
  first_name?: string
  last_name?: string
  email?: string
  role?: string
  status?: string
}

type ProfessionalProfileListItemResponse = {
  id: string
  user_id?: string
  verification_status?: string
  average_rating?: number | null
  ratings_count?: number
  completed_services_count?: number
  available_now?: boolean
}

type ServiceRequestListItemResponse = {
  id: string
  title?: string
  status?: string
  is_active?: boolean
}

type ProfessionalValidationQueueResponse = {
  id: string
  professional_profile_id?: string
  status?: string
}

type SpecialtyListItemResponse = {
  id: string
  code?: string
  name?: string
  is_active?: boolean
}

const { apiAuth } = useApiAuth()

const user = ref<MeResponse | null>(null)
const loading = ref(true)
const metricsLoading = ref(false)
const errorMessage = ref('')

const users = ref<UserListItemResponse[]>([])
const professionalProfiles = ref<ProfessionalProfileListItemResponse[]>([])
const serviceRequests = ref<ServiceRequestListItemResponse[]>([])
const validationQueue = ref<ProfessionalValidationQueueResponse[]>([])
const specialties = ref<SpecialtyListItemResponse[]>([])

const fullName = computed(() => {
  if (!user.value) return ''
  return `${user.value.first_name} ${user.value.last_name}`
})

const initials = computed(() => {
  if (!user.value) return 'US'
  return `${user.value.first_name?.[0] || ''}${user.value.last_name?.[0] || ''}`.toUpperCase()
})

const emailVerified = computed(() => Boolean(user.value?.email_verified_at))

const isActive = computed(() => user.value?.status === 'ACTIVE')

const lastLoginText = computed(() => {
  if (!user.value?.last_login_at) return 'Sin registro reciente'
  return new Date(user.value.last_login_at).toLocaleString('es-BO')
})

const totalUsers = computed(() => users.value.length)

const totalProfessionals = computed(() => professionalProfiles.value.length)

const totalSpecialties = computed(() => specialties.value.length)

const totalRequests = computed(() => serviceRequests.value.length)

const openRequests = computed(() =>
  serviceRequests.value.filter(item => item.status === 'OPEN').length
)

const completedRequests = computed(() =>
  serviceRequests.value.filter(item => item.status === 'COMPLETED').length
)

const pendingValidations = computed(() =>
  validationQueue.value.filter(
    item => item.status === 'PENDING' || item.status === 'INREVIEW'
  ).length
)

const averageRating = computed(() => {
  const ratings = professionalProfiles.value
    .map(item => Number(item.average_rating ?? 0))
    .filter(value => value > 0)

  if (!ratings.length) return '0.00'

  const total = ratings.reduce((sum, value) => sum + value, 0)
  return (total / ratings.length).toFixed(2)
})

async function loadMetrics(): Promise<void> {
  metricsLoading.value = true

  try {
    const [
      usersResponse,
      profilesResponse,
      requestsResponse,
      validationQueueResponse,
      specialtiesResponse
    ] = await Promise.all([
      apiAuth<UserListItemResponse[]>('/api/v1/users').catch(() => []),
      apiAuth<ProfessionalProfileListItemResponse[]>('/api/v1/professional-profiles').catch(() => []),
      apiAuth<ServiceRequestListItemResponse[]>('/api/v1/service-requests').catch(() => []),
      apiAuth<ProfessionalValidationQueueResponse[]>('/api/v1/professional-validation-queue').catch(() => []),
      apiAuth<SpecialtyListItemResponse[]>('/api/v1/specialties').catch(() => [])
    ])

    users.value = Array.isArray(usersResponse) ? usersResponse : []
    professionalProfiles.value = Array.isArray(profilesResponse) ? profilesResponse : []
    serviceRequests.value = Array.isArray(requestsResponse) ? requestsResponse : []
    validationQueue.value = Array.isArray(validationQueueResponse) ? validationQueueResponse : []
    specialties.value = Array.isArray(specialtiesResponse) ? specialtiesResponse : []
  } finally {
    metricsLoading.value = false
  }
}

async function loadProfile(): Promise<void> {
  loading.value = true
  errorMessage.value = ''

  try {
    user.value = await apiAuth<MeResponse>('/api/v1/auth/me')
    await loadMetrics()
  } catch (error: any) {
    errorMessage.value =
      error?.data?.detail ||
      error?.data?.message ||
      'No se pudo cargar la información del usuario'

    if (import.meta.client) {
      localStorage.removeItem('access_token')
    }

    await navigateTo('/login')
  } finally {
    loading.value = false
  }
}

async function logout(): Promise<void> {
  if (import.meta.client) {
    localStorage.removeItem('access_token')
  }

  await navigateTo('/login')
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="text-sm text-muted">Panel principal</p>
        <h1 class="text-2xl font-bold text-highlighted">
          Bienvenido<span v-if="user">, {{ user.first_name }}</span>
        </h1>
        <p class="text-sm text-muted">
          Gestiona tu cuenta, revisa tu estado de seguridad y consulta el resumen general del sistema.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <UButton
          color="neutral"
          variant="soft"
          icon="i-lucide-refresh-cw"
          :loading="loading || metricsLoading"
          @click="loadProfile"
        >
          Actualizar
        </UButton>

        <UButton
          color="error"
          variant="soft"
          icon="i-lucide-log-out"
          @click="logout"
        >
          Cerrar sesión
        </UButton>
      </div>
    </div>

    <UAlert
      v-if="errorMessage"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      title="Ocurrió un problema"
      :description="errorMessage"
    />

    <div
      v-if="loading"
      class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
      <USkeleton class="h-36 rounded-xl" />
      <USkeleton class="h-36 rounded-xl" />
      <USkeleton class="h-36 rounded-xl" />
      <USkeleton class="h-36 rounded-xl" />
    </div>

    <template v-else-if="user">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <UPageCard
          title="Usuarios"
          description="Total de usuarios registrados."
          icon="i-lucide-users"
          variant="subtle"
        >
          <p class="text-2xl font-bold text-highlighted">
            {{ totalUsers }}
          </p>
        </UPageCard>

        <UPageCard
          title="Profesionales"
          description="Perfiles profesionales registrados."
          icon="i-lucide-briefcase-business"
          variant="subtle"
        >
          <p class="text-2xl font-bold text-highlighted">
            {{ totalProfessionals }}
          </p>
        </UPageCard>

        <UPageCard
          title="Solicitudes"
          description="Solicitudes de servicio registradas."
          icon="i-lucide-file-text"
          variant="subtle"
        >
          <p class="text-2xl font-bold text-highlighted">
            {{ totalRequests }}
          </p>
        </UPageCard>

        <UPageCard
          title="Validaciones"
          description="Validaciones pendientes o en revisión."
          icon="i-lucide-shield-alert"
          variant="subtle"
        >
          <p class="text-2xl font-bold text-highlighted">
            {{ pendingValidations }}
          </p>
        </UPageCard>
      </div>

      <div class="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <UPageCard
          class="xl:col-span-2"
          title="Perfil del usuario"
          description="Información principal de tu cuenta autenticada."
          icon="i-lucide-user-round"
          variant="subtle"
        >
          <div class="flex items-start gap-4">
            <div class="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              {{ initials }}
            </div>

            <div class="space-y-1">
              <p class="text-lg font-semibold text-highlighted">
                {{ fullName }}
              </p>
              <p class="text-sm text-muted">
                {{ user.email }}
              </p>
              <div class="flex flex-wrap gap-2 pt-2">
                <UBadge color="primary" variant="subtle">
                  {{ user.role }}
                </UBadge>
                <UBadge color="neutral" variant="soft">
                  {{ user.status }}
                </UBadge>
              </div>
            </div>
          </div>
        </UPageCard>

        <UPageCard
          title="Correo verificado"
          description="Estado actual del correo de la cuenta."
          icon="i-lucide-badge-check"
          variant="subtle"
        >
          <div class="flex items-center justify-between">
            <p class="text-sm text-muted">Verificación</p>
            <UBadge :color="emailVerified ? 'success' : 'warning'" variant="subtle">
              {{ emailVerified ? 'Verificado' : 'Pendiente' }}
            </UBadge>
          </div>
        </UPageCard>

        <UPageCard
          title="Último acceso"
          description="Última fecha de ingreso registrada."
          icon="i-lucide-clock-3"
          variant="subtle"
        >
          <p class="text-sm font-medium text-highlighted">
            {{ lastLoginText }}
          </p>
        </UPageCard>
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <UPageCard
          title="Seguridad"
          description="Accesos y configuración de seguridad."
          icon="i-lucide-shield-check"
          variant="subtle"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted">Autenticación en dos pasos</span>
              <UBadge color="warning" variant="subtle">
                Revisar estado
              </UBadge>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-muted">Cuenta activa</span>
              <UBadge :color="isActive ? 'success' : 'neutral'" variant="subtle">
                {{ isActive ? 'Activa' : 'Inactiva' }}
              </UBadge>
            </div>

            <div class="flex gap-2 pt-2">
              <UButton
                color="primary"
                variant="soft"
                icon="i-lucide-lock-keyhole"
                to="/security"
              >
                Configurar seguridad
              </UButton>
            </div>
          </div>
        </UPageCard>

        <UPageCard
          title="Acciones rápidas"
          description="Atajos para continuar con el flujo."
          icon="i-lucide-zap"
          variant="subtle"
        >
          <div class="grid grid-cols-1 gap-3">
            <UButton
              color="primary"
              variant="soft"
              icon="i-lucide-user"
              to="/profile"
            >
              Mi perfil
            </UButton>

            <UButton
              color="neutral"
              variant="soft"
              icon="i-lucide-shield"
              to="/security"
            >
              Ver seguridad
            </UButton>

            <UButton
              color="neutral"
              variant="soft"
              icon="i-lucide-settings"
              to="/settings"
            >
              Preferencias
            </UButton>
          </div>
        </UPageCard>

        <UPageCard
          title="Resumen"
          description="Estado general del sistema y la sesión actual."
          icon="i-lucide-layout-dashboard"
          variant="subtle"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-3">
              <span class="text-sm text-muted">ID de usuario</span>
              <span class="max-w-40 truncate text-sm font-medium text-highlighted">
                {{ user.id }}
              </span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-muted">Rol</span>
              <span class="text-sm font-medium text-highlighted">{{ user.role }}</span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-muted">Estado</span>
              <span class="text-sm font-medium text-highlighted">{{ user.status }}</span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-muted">Solicitudes abiertas</span>
              <span class="text-sm font-medium text-highlighted">{{ openRequests }}</span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-muted">Solicitudes completadas</span>
              <span class="text-sm font-medium text-highlighted">{{ completedRequests }}</span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-muted">Especialidades</span>
              <span class="text-sm font-medium text-highlighted">{{ totalSpecialties }}</span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-muted">Rating promedio</span>
              <span class="text-sm font-medium text-highlighted">{{ averageRating }}</span>
            </div>
          </div>
        </UPageCard>
      </div>
    </template>
  </div>
</template>