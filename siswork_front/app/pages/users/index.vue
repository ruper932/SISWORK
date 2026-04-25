<script setup lang="ts">
definePageMeta({
  title: 'Usuarios'
})

import type { UserListItem } from '~/types/user'

const { getUsers, deleteUser } = useUsersApi()

const { data: users, pending, error, refresh } = await useAsyncData<UserListItem[]>(
  'users-list',
  () => getUsers(),
  {
    default: () => []
  }
)

async function onDelete(id: string) {
  if (!confirm('¿Eliminar usuario?')) return
  await deleteUser(id)
  await refresh()
}
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-2xl border border-default bg-(--ui-bg-elevated) p-6 shadow-sm">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-sm text-muted">Gestión de usuarios</p>
          <h1 class="text-2xl font-semibold text-highlighted">
            Usuarios registrados
          </h1>
          <p class="mt-1 text-sm text-muted">
            Administra cuentas, estados y roles del sistema.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <UButton
            color="neutral"
            variant="soft"
            icon="i-lucide-arrow-left"
            to="/dashboard"
          >
            Volver
          </UButton>

          <UButton
            color="primary"
            icon="i-lucide-user-plus"
            to="/users/create"
          >
            Nuevo usuario
          </UButton>
        </div>
      </div>
    </section>

    <section class="rounded-2xl border border-default bg-(--ui-bg-elevated) shadow-sm overflow-hidden">
      <div v-if="pending" class="p-6 text-sm text-muted">
        Cargando usuarios...
      </div>

      <div v-else-if="error" class="p-6 text-sm text-error">
        Error al cargar usuarios.
      </div>

      <div v-else-if="!users.length" class="p-6 text-sm text-muted">
        No hay usuarios registrados todavía.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-default">
          <thead class="bg-(--ui-bg-muted)">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Nombre</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Email</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Rol</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Estado</th>
              <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Acciones</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-default">
            <tr
              v-for="user in users"
              :key="user.id"
              class="transition hover:bg-(--ui-bg-muted)"
            >
              <td class="px-4 py-4">
                <div class="font-medium text-highlighted">
                  {{ user.first_name }} {{ user.last_name }}
                </div>
              </td>

              <td class="px-4 py-4 text-sm text-muted">
                {{ user.email }}
              </td>

              <td class="px-4 py-4 text-sm text-muted">
                {{ user.role }}
              </td>

              <td class="px-4 py-4">
                <UBadge
                  :color="user.status === 'ACTIVE' ? 'success' : 'neutral'"
                  variant="soft"
                >
                  {{ user.status }}
                </UBadge>
              </td>

              <td class="px-4 py-4">
                <div class="flex justify-end gap-2">
                  <UButton
                    color="neutral"
                    variant="soft"
                    size="sm"
                    icon="i-lucide-pencil"
                    :to="`/users/${user.id}`"
                  >
                    Editar
                  </UButton>

                  <UButton
                    color="error"
                    variant="soft"
                    size="sm"
                    icon="i-lucide-trash-2"
                    @click="onDelete(user.id)"
                  >
                    Eliminar
                  </UButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>