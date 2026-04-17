<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const loading = ref(false)
const errorMessage = ref('')

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Correo electrónico',
    placeholder: 'tucorreo@ejemplo.com',
    required: true
  },
  {
    name: 'password',
    type: 'password',
    label: 'Contraseña',
    placeholder: '********',
    required: true
  }
]

const schema = z.object({
  email: z.email('Correo inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
})

type Schema = z.output<typeof schema>

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  errorMessage.value = ''

  try {
    console.log('login payload', event.data)

    // aquí luego conectaremos FastAPI
    await navigateTo('/verify-2fa')
  } catch (error) {
    errorMessage.value = 'No se pudo iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        :fields="fields"
        title="Iniciar sesión"
        description="Ingresa tus credenciales para continuar"
        icon="i-lucide-lock"
        :loading="loading"
        @submit="onSubmit"
      >
        <template #validation>
          <UAlert
            v-if="errorMessage"
            color="error"
            variant="subtle"
            icon="i-lucide-circle-alert"
            :title="errorMessage"
          />
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>