<script setup lang="ts">
import UserForm from '~/components/users/UserForm.vue'

type UpdateUserPayload = {
  first_name?: string
  last_name?: string
  email?: string
  role?: string
  status?: string
  password?: string
}

const route = useRoute()
const router = useRouter()
const { getUser, updateUser } = useUsersApi()

const userId = computed(() => String(route.params.id))

const submitLoading = ref(false)
const submitError = ref('')
const submitSuccess = ref('')

const {
  data: user,
  pending,
  error,
  refresh
} = await useAsyncData(
  () => `user-${userId.value}`,
  () => getUser(userId.value),
  {
    watch: [userId]
  }
)

async function onSubmit(payload: UpdateUserPayload) {
  if (submitLoading.value) return

  submitLoading.value = true
  submitError.value = ''
  submitSuccess.value = ''

  try {
    await updateUser(userId.value, payload)
    submitSuccess.value = 'Usuario actualizado correctamente.'
    await router.push('/users')
  } catch (err: any) {
    submitError.value =
      err?.data?.detail ||
      err?.data?.message ||
      'No se pudo actualizar el usuario'
  } finally {
    submitLoading.value = false
  }
}
</script>

<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <div class="space-y-1">
        <h1 class="text-2xl font-bold">Editar usuario</h1>
        <p class="text-sm text-muted">
          Modifica la información del usuario y guarda los cambios.
        </p>
      </div>

      <NuxtLink to="/users" class="text-sm underline">
        Volver
      </NuxtLink>
    </div>

    <UAlert
      v-if="submitError"
      class="mb-4"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      title="No se pudo guardar"
      :description="submitError"
    />

    <UAlert
      v-if="submitSuccess"
      class="mb-4"
      color="success"
      variant="subtle"
      icon="i-lucide-badge-check"
      title="Cambios guardados"
      :description="submitSuccess"
    />

    <div v-if="pending" class="space-y-3">
      <p class="text-sm text-muted">Cargando usuario...</p>
      <USkeleton class="h-10 w-48" />
      <USkeleton class="h-24 w-full" />
      <USkeleton class="h-24 w-full" />
    </div>

    <div v-else-if="error" class="space-y-3">
      <p class="text-sm text-error">
        Error al cargar el usuario.
      </p>

      <UButton
        color="neutral"
        variant="soft"
        icon="i-lucide-refresh-cw"
        @click="() => refresh()"
      >
        Reintentar
      </UButton>
    </div>

    <div v-else-if="user" class="space-y-4">
      <UserForm
        :initial-data="user"
        :is-edit="true"
        :loading="submitLoading"
        @submit="onSubmit"
      />
    </div>

    <div v-else class="space-y-3">
      <p class="text-sm text-muted">
        No se encontró información del usuario.
      </p>

      <UButton
        to="/users"
        color="neutral"
        variant="soft"
      >
        Volver al listado
      </UButton>
    </div>
  </div>
</template>