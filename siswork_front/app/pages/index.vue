<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div class="min-h-screen p-6">
    <UContainer>
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-semibold">Panel principal</h1>
            <UButton color="neutral" variant="outline" to="/login">
              Cerrar sesión
            </UButton>
          </div>
        </template>

        <p>Has iniciado sesión correctamente.</p>
      </UCard>
    </UContainer>
  </div>
</template>