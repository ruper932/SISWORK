<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const loading = ref(false)
const errorMessage = ref('')
const config = useRuntimeConfig()
const apiBase = String(config.public.apiBase || '')

type VerifyTwoFactorResponse = {
  access_token?: string
  token_type?: string
}

const fields: AuthFormField[] = [
  {
    name: 'code',
    type: 'otp',
    label: 'Código de verificación',
    placeholder: '○',
    length: 6,
    required: true
  }
]

const schema = z.object({
  code: z
    .array(z.string())
    .length(6, 'El código debe tener 6 dígitos')
    .refine((digits) => digits.every((digit) => /^\d$/.test(digit)), {
      message: 'El código debe tener 6 dígitos'
    })
})

type Schema = z.infer<typeof schema>

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  errorMessage.value = ''

  try {
    if (!import.meta.client) return

    const code = event.data.code.join('')
    const challengeToken = localStorage.getItem('challenge_token')

    if (!challengeToken) {
      throw new Error('La sesión de verificación expiró. Inicia sesión nuevamente.')
    }

    if (!apiBase) {
      throw new Error('NUXT_PUBLIC_API_BASE no está configurado')
    }

    const response = await $fetch<VerifyTwoFactorResponse>('/api/v1/auth/login/verify-2fa', {
      baseURL: apiBase,
      method: 'POST',
      body: {
        challenge_token: challengeToken,
        code
      }
    })

    if (!response.access_token) {
      throw new Error('No se recibió el token de acceso')
    }

    localStorage.setItem('access_token', response.access_token)
    localStorage.removeItem('challenge_token')

    await navigateTo('/dashboard')
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
      'Código inválido'
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
        title="Verificación 2FA"
        description="Ingresa el código generado por tu aplicación autenticadora"
        icon="i-lucide-shield-check"
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