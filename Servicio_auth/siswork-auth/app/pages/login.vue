<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const loading = ref(false)
const errorMessage = ref('')
const config = useRuntimeConfig()
const apiBase = String(config.public.apiBase || '')

type LoginResponse = {
  requires_2fa?: boolean
  challenge_token?: string
  access_token?: string
  token_type?: string
}

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
    if (import.meta.client) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('challenge_token')
    }

    const response = await $fetch<LoginResponse>('/api/v1/auth/login', {
      baseURL: apiBase,
      method: 'POST',
      body: {
        email: event.data.email,
        password: event.data.password
      }
    })

    if (response.requires_2fa) {
      if (import.meta.client && response.challenge_token) {
        localStorage.setItem('challenge_token', response.challenge_token)
      }

      await navigateTo('/verify-2fa')
      return
    }

    if (response.access_token) {
      if (import.meta.client) {
        localStorage.setItem('access_token', response.access_token)
        localStorage.removeItem('challenge_token')
      }

      await navigateTo('/dashboard')
      return
    }

    throw new Error('Respuesta de autenticación inválida')
  } catch (error: unknown) {
    const apiError = error as {
      data?: {
        detail?: string
        message?: string
      }
      message?: string
    }

    errorMessage.value =
      apiError.data?.detail ??
      apiError.data?.message ??
      apiError.message ??
      'No se pudo iniciar sesión'
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