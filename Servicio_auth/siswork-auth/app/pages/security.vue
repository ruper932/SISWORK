<script setup lang="ts">
definePageMeta({
  layout: 'app',
  middleware: 'auth',
  title: 'Seguridad'
})

type TwoFactorSetupResponse = {
  secret: string
  qr_code: string
  manual_entry_key?: string
}

const { apiAuth } = useApiAuth()

const loading = ref(false)
const confirming = ref(false)
const disabling = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const setupData = ref<TwoFactorSetupResponse | null>(null)
const code = ref('')
const password = ref('')

async function setupTwoFactor(): Promise<void> {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    setupData.value = await apiAuth<TwoFactorSetupResponse>('/api/v1/auth/2fa/setup', {
      method: 'POST'
    })
    successMessage.value = 'Se generó la configuración de 2FA.'
  } catch (error: any) {
    errorMessage.value =
      error?.data?.detail ||
      error?.data?.message ||
      'No se pudo iniciar la configuración de 2FA'
  } finally {
    loading.value = false
  }
}

async function confirmTwoFactor(): Promise<void> {
  confirming.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await apiAuth('/api/v1/auth/2fa/confirm', {
      method: 'POST',
      body: {
        code: code.value
      }
    })

    successMessage.value = '2FA activado correctamente.'
    code.value = ''
  } catch (error: any) {
    errorMessage.value =
      error?.data?.detail ||
      error?.data?.message ||
      'No se pudo confirmar el código 2FA'
  } finally {
    confirming.value = false
  }
}

async function disableTwoFactor(): Promise<void> {
  disabling.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await apiAuth('/api/v1/auth/2fa/disable', {
      method: 'POST',
      body: {
        password: password.value
      }
    })

    successMessage.value = '2FA desactivado correctamente.'
    setupData.value = null
    password.value = ''
  } catch (error: any) {
    errorMessage.value =
      error?.data?.detail ||
      error?.data?.message ||
      'No se pudo desactivar el 2FA'
  } finally {
    disabling.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <p class="text-sm text-muted">Cuenta</p>
      <h1 class="text-2xl font-bold text-highlighted">Seguridad</h1>
      <p class="text-sm text-muted">
        Administra autenticación en dos pasos y opciones de protección.
      </p>
    </div>

    <UAlert
      v-if="errorMessage"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      title="Ocurrió un problema"
      :description="errorMessage"
    />

    <UAlert
      v-if="successMessage"
      color="success"
      variant="subtle"
      icon="i-lucide-badge-check"
      title="Operación exitosa"
      :description="successMessage"
    />

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <UPageCard
        title="Configurar 2FA"
        description="Genera el secreto y escanéalo con tu app autenticadora."
        icon="i-lucide-shield-check"
        variant="subtle"
      >
        <div class="space-y-4">
          <UButton
            color="primary"
            variant="soft"
            :loading="loading"
            @click="setupTwoFactor"
          >
            Iniciar configuración
          </UButton>

          <div v-if="setupData" class="space-y-3">
            <p class="text-sm text-muted">Secreto generado:</p>
            <code class="block rounded-lg bg-(--ui-bg-muted) p-3 text-sm">
              {{ setupData.secret }}
            </code>

            <p class="text-sm text-muted">
              Si tu backend devuelve QR en texto/base64, aquí luego lo renderizamos.
            </p>

            <UInput
              v-model="code"
              placeholder="Ingresa el código de 6 dígitos"
            />

            <UButton
              color="primary"
              :loading="confirming"
              @click="confirmTwoFactor"
            >
              Confirmar 2FA
            </UButton>
          </div>
        </div>
      </UPageCard>

      <UPageCard
        title="Desactivar 2FA"
        description="Requiere la contraseña actual para confirmar la acción."
        icon="i-lucide-lock-open"
        variant="subtle"
      >
        <div class="space-y-4">
          <UInput
            v-model="password"
            type="password"
            placeholder="Contraseña actual"
          />

          <UButton
            color="error"
            variant="soft"
            :loading="disabling"
            @click="disableTwoFactor"
          >
            Desactivar 2FA
          </UButton>
        </div>
      </UPageCard>
    </div>
  </div>
</template>