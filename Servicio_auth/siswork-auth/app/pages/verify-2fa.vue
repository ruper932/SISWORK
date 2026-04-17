<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const loading = ref(false)
const errorMessage = ref('')

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
  code: z.string().length(6, 'El código debe tener 6 dígitos')
})

type Schema = z.output<typeof schema>

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  errorMessage.value = ''

  try {
    console.log('2fa payload', event.data)

    // aquí luego validaremos contra FastAPI
    await navigateTo('/')
  } catch (error) {
    errorMessage.value = 'Código inválido'
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