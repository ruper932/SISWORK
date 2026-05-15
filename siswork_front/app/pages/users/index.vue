<script setup lang="ts">
definePageMeta({
  layout: 'app',           
  middleware: 'auth',      
  title: 'Dashboard'
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
    <section class="rounded-3xl border border-default bg-elevated/70 p-6 shadow-sm ring-1 ring-default/50 lg:p-8">
      <div class="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div class="max-w-2xl space-y-2">
          <div class="inline-flex items-center gap-2 rounded-full border border-default px-3 py-1 text-xs font-medium text-muted">
            <UIcon name="i-lucide-users" class="h-4 w-4" />
            Gestión de usuarios
          </div>

          <div class="space-y-2">
            <h1 class="text-2xl font-semibold tracking-tight text-highlighted lg:text-3xl">
              Usuarios registrados
            </h1>
            <p class="max-w-xl text-sm leading-6 text-muted">
              Administra cuentas, revisa roles y controla el estado general de acceso dentro del sistema.
            </p>
          </div>
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

    <section class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div class="rounded-2xl border border-default bg-elevated p-5 shadow-sm">
        <p class="text-xs font-medium uppercase tracking-wider text-muted">
          Total usuarios
        </p>
        <div class="mt-3 flex items-end justify-between gap-3">
          <p class="text-3xl font-semibold leading-none text-highlighted">
            {{ users.length }}
          </p>
          <div class="rounded-xl bg-primary/10 p-2 text-primary">
            <UIcon name="i-lucide-users-round" class="h-5 w-5" />
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-default bg-elevated p-5 shadow-sm">
        <p class="text-xs font-medium uppercase tracking-wider text-muted">
          Usuarios activos
        </p>
        <div class="mt-3 flex items-end justify-between gap-3">
          <p class="text-3xl font-semibold leading-none text-highlighted">
            {{ users.filter(user => user.status === 'ACTIVE').length }}
          </p>
          <div class="rounded-xl bg-success/10 p-2 text-success">
            <UIcon name="i-lucide-badge-check" class="h-5 w-5" />
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-default bg-elevated p-5 shadow-sm">
        <p class="text-xs font-medium uppercase tracking-wider text-muted">
          Roles distintos
        </p>
        <div class="mt-3 flex items-end justify-between gap-3">
          <p class="text-3xl font-semibold leading-none text-highlighted">
            {{ new Set(users.map(user => user.role)).size }}
          </p>
          <div class="rounded-xl bg-warning/10 p-2 text-warning">
            <UIcon name="i-lucide-shield" class="h-5 w-5" />
          </div>
        </div>
      </div>
    </section>

    <section class="overflow-hidden rounded-3xl border border-default bg-elevated shadow-sm ring-1 ring-default/50">
      <div class="border-b border-default px-5 py-4 lg:px-6">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="text-base font-semibold text-highlighted">
              Listado de usuarios
            </h2>
            <p class="text-sm text-muted">
              Visualiza la información principal y accede a las acciones disponibles.
            </p>
          </div>

          <div class="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted">
            <span class="inline-block h-2 w-2 rounded-full bg-primary" />
            {{ users.length }} registros
          </div>
        </div>
      </div>

      <div v-if="pending" class="space-y-4 p-6">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <USkeleton class="h-24 rounded-2xl" />
          <USkeleton class="h-24 rounded-2xl" />
          <USkeleton class="h-24 rounded-2xl" />
          <USkeleton class="h-24 rounded-2xl" />
        </div>
        <USkeleton class="h-12 w-full rounded-xl" />
        <USkeleton class="h-12 w-full rounded-xl" />
        <USkeleton class="h-12 w-full rounded-xl" />
      </div>

      <div v-else-if="error" class="p-6 lg:p-10">
        <div class="flex flex-col items-center justify-center rounded-2xl border border-error/20 bg-error/5 px-6 py-10 text-center">
          <div class="mb-4 rounded-full bg-error/10 p-3 text-error">
            <UIcon name="i-lucide-circle-alert" class="h-6 w-6" />
          </div>
          <h3 class="text-base font-semibold text-highlighted">
            Error al cargar usuarios
          </h3>
          <p class="mt-2 max-w-md text-sm text-muted">
            No se pudo obtener la información del listado. Intenta refrescar la página o volver más tarde.
          </p>
          <div class="mt-5">
            <UButton
              color="neutral"
              variant="soft"
              icon="i-lucide-refresh-cw"
              @click="() => refresh()"
            >
              Reintentar
            </UButton>
          </div>
        </div>
      </div>

      <div v-else-if="!users.length" class="p-6 lg:p-10">
        <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-default px-6 py-12 text-center">
          <div class="mb-4 rounded-full bg-primary/10 p-3 text-primary">
            <UIcon name="i-lucide-user-search" class="h-6 w-6" />
          </div>
          <h3 class="text-base font-semibold text-highlighted">
            Aún no hay usuarios registrados
          </h3>
          <p class="mt-2 max-w-md text-sm leading-6 text-muted">
            Cuando existan cuentas creadas, aparecerán aquí con su rol, correo, estado y accesos de gestión.
          </p>
          <div class="mt-5">
            <UButton
              color="primary"
              icon="i-lucide-user-plus"
              to="/users/create"
            >
              Crear primer usuario
            </UButton>
          </div>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-muted/60">
            <tr class="border-b border-default">
              <th class="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted lg:px-6">
                Usuario
              </th>
              <th class="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Correo
              </th>
              <th class="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Rol
              </th>
              <th class="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Estado
              </th>
              <th class="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.12em] text-muted lg:px-6">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="user in users"
              :key="user.id"
              class="border-b border-default/80 transition-colors hover:bg-muted/40"
            >
              <td class="px-5 py-4 lg:px-6">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {{ `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() }}
                  </div>

                  <div class="min-w-0">
                    <p class="truncate font-medium text-highlighted">
                      {{ user.first_name }} {{ user.last_name }}
                    </p>
                    <p class="text-xs text-muted">
                      ID: {{ user.id }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-5 py-4 text-sm text-muted">
                <span class="break-all">{{ user.email }}</span>
              </td>

              <td class="px-5 py-4">
                <UBadge
                  color="neutral"
                  variant="subtle"
                  class="capitalize"
                >
                  {{ user.role }}
                </UBadge>
              </td>

              <td class="px-5 py-4">
                <UBadge
                  :color="user.status === 'ACTIVE' ? 'success' : 'neutral'"
                  variant="subtle"
                >
                  {{ user.status === 'ACTIVE' ? 'Activo' : user.status }}
                </UBadge>
              </td>

              <td class="px-5 py-4 lg:px-6">
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