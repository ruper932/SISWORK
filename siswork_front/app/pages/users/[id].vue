<script setup lang="ts">
import UserForm from '~/components/users/UserForm.vue'

const route = useRoute()
const router = useRouter()
const { getUser, updateUser } = useUsersApi()

const userId = computed(() => String(route.params.id))

const { data: user, pending, error } = await useAsyncData(
  () => `user-${userId.value}`,
  () => getUser(userId.value)
)

async function onSubmit(payload: any) {
  await updateUser(userId.value, payload)
  await router.push('/users')
}
</script>
<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Editar usuario</h1>
      <NuxtLink to="/users" class="text-sm underline">
        Volver
      </NuxtLink>
    </div>
    <div v-if="pending">Cargando usuario...</div>
    <div v-else-if="error">Error al cargar el usuario</div>
    
    <UserForm
        v-else
        :initial-data="user"
        :is-edit="true"
        @submit="onSubmit"
    />
  </div>
</template>