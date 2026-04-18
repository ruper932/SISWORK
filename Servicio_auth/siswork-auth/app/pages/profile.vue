<script setup lang="ts">
definePageMeta({
  layout: 'app',
  middleware: 'auth',
  title: 'Perfil'
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

async function loadProfile(): Promise<void> {
  loading.value = true
  errorMessage.value = ''

  try {
    user.value = await apiAuth<MeResponse>('/api/v1/auth/me')
  } catch (error: any) {
    errorMessage.value =
      error?.data?.detail ||
      error?.data?.message ||
      'No se pudo cargar el perfil'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <p class="text-sm text-muted">Cuenta</p>
      <h1 class="text-2xl font-bold text-highlighted">Perfil</h1>
      <p class="text-sm text-muted">
        Información actual de tu cuenta autenticada.
      </p>
    </div>

    <UAlert
      v-if="errorMessage"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      title="Ocurrió un problema"
      :description="errorMessage"
    />

    <USkeleton v-if="loading" class="h-48 rounded-xl" />

    <UPageCard
      v-else-if="user"
      title="Información personal"
      description="Datos obtenidos desde el backend."
      icon="i-lucide-user-round"
      variant="subtle"
    >
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm text-muted">Nombre</span>
          <span class="text-sm font-medium text-highlighted">
            {{ user.first_name }} {{ user.last_name }}
          </span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-sm text-muted">Correo</span>
          <span class="text-sm font-medium text-highlighted">{{ user.email }}</span>
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