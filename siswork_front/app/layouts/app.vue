<script setup lang="ts">
const route = useRoute()

const navigation = [
  { label: 'Dashboard', to: '/dashboard', icon: 'i-lucide-layout-dashboard' },
  { label: 'Usuarios', to: '/users', icon: 'i-lucide-users' },
  { label: 'Profesionales', to: '/professionals', icon: 'i-lucide-briefcase-business' },
  { label: 'Solicitudes', to: '/service-requests', icon: 'i-lucide-file-text' },
  { label: 'Especialidades', to: '/specialties', icon: 'i-lucide-wrench' },
  { label: 'Perfil', to: '/profile', icon: 'i-lucide-user-round' },
  { label: 'Seguridad', to: '/security', icon: 'i-lucide-shield-check' }
]

async function logout(): Promise<void> {
  if (import.meta.client) {
    localStorage.removeItem('access_token')
  }

  await navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-default">
    <div class="flex min-h-screen">
      <aside class="hidden w-72 shrink-0 border-r border-default bg-elevated lg:flex lg:flex-col">
        <div class="border-b border-default px-6 py-5">
          <p class="text-xs font-medium uppercase tracking-wider text-muted">
            SISWORK
          </p>
          <h1 class="mt-1 text-lg font-semibold text-highlighted">
            Panel de control
          </h1>
        </div>

        <nav class="flex-1 space-y-2 p-4">
          <NuxtLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition"
            :class="route.path === item.to
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-muted hover:bg-muted hover:text-highlighted'"
          >
            <UIcon :name="item.icon" class="h-5 w-5" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>

        <div class="border-t border-default p-4">
          <UButton
            block
            color="error"
            variant="soft"
            icon="i-lucide-log-out"
            @click="logout"
          >
            Cerrar sesión
          </UButton>
        </div>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <header class="border-b border-default bg-(--ui-bg)/80 px-4 py-4 backdrop-blur md:px-6">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-sm text-muted">Área autenticada</p>
              <h2 class="text-lg font-semibold text-highlighted">
                {{ route.meta.title || 'SISWORK' }}
              </h2>
            </div>

            <div class="flex items-center gap-2">
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-bell"
              />
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-user-circle-2"
                to="/profile"
              />
            </div>
          </div>
        </header>

        <main class="flex-1 p-4 md:p-6">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>