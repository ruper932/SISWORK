<script setup lang="ts">
definePageMeta({
  layout: 'app',
  middleware: 'auth',
  title: 'Preferencias'
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <p class="text-sm text-muted">Cuenta</p>
      <h1 class="text-2xl font-bold text-highlighted">Preferencias</h1>
      <p class="text-sm text-muted">
        Aquí podrás configurar opciones generales de la experiencia de usuario.
      </p>
    </div>

    <UPageCard
      title="Preferencias generales"
      description="Sección base para futuras configuraciones del sistema."
      icon="i-lucide-settings"
      variant="subtle"
    />
  </div>
</template>