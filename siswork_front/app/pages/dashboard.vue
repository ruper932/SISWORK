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

const { apiAuth } = useApiAuth()

const user = ref<MeResponse | null>(null)
const loading = ref(true)
const errorMessage = ref('')

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

async function loadProfile(): Promise<void> {
  loading.value = true
  errorMessage.value = ''

  try {
    user.value = await apiAuth<MeResponse>('/api/v1/auth/me')
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
          Gestiona tu cuenta, revisa tu estado de seguridad y accede a tus acciones rápidas.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <UButton
          color="neutral"
          variant="soft"
          icon="i-lucide-refresh-cw"
          :loading="loading"
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
          description="Estado general de la sesión actual."
          icon="i-lucide-layout-dashboard"
          variant="subtle"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-3">
              <span class="text-sm text-muted">ID de usuario</span>
              <span class="max-w-[160px] truncate text-sm font-medium text-highlighted">
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
          </div>
        </UPageCard>
      </div>
    </template>
  </div>
</template>