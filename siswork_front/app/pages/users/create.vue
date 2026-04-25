<script setup lang="ts">
definePageMeta({
  title: 'Crear usuario'
})

import UserForm from '~/components/users/UserForm.vue'

const router = useRouter()
const { createUser } = useUsersApi()

async function onSubmit(payload: any) {
  await createUser(payload)
  await router.push('/users')
}
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-2xl border border-default bg-(--ui-bg-elevated) p-6 shadow-sm">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-sm text-muted">Gestión de usuarios</p>
          <h1 class="text-2xl font-semibold text-highlighted">
            Crear usuario
          </h1>
          <p class="mt-1 text-sm text-muted">
            Registra una nueva cuenta dentro del sistema.
          </p>
        </div>

        <UButton
          color="neutral"
          variant="soft"
          icon="i-lucide-arrow-left"
          to="/users"
        >
          Volver al listado
        </UButton>
      </div>
    </section>

    <UserForm @submit="onSubmit" />
  </div>
</template>