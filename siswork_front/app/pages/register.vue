<script setup lang="ts">
definePageMeta({
  layout: false,
  title: 'Registro'
})

type RegisterPayload = {
  first_name: string
  last_name: string
  email: string
  password: string
}

const { register } = useAuthApi()

const form = reactive<RegisterPayload>({
  first_name: '',
  last_name: '',
  email: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function onSubmit() {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await register({
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      password: form.password
    })

    successMessage.value = 'Cuenta creada correctamente.'
    await navigateTo('/login')
  } catch (error: any) {
    errorMessage.value =
      error?.data?.detail ||
      error?.data?.message ||
      'No se pudo completar el registro'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-default">
    <div class="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div class="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-default bg-default shadow-sm lg:grid-cols-2">
        <div class="hidden border-r border-default bg-muted/30 lg:flex lg:flex-col lg:justify-between lg:p-10">
          <div class="space-y-6">
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <UIcon name="i-lucide-user-plus" class="h-6 w-6" />
            </div>

            <div class="space-y-3">
              <p class="text-sm font-medium text-muted">
                SISWORK
              </p>
              <h1 class="text-3xl font-semibold tracking-tight text-highlighted">
                Crea tu cuenta y empieza a usar la plataforma
              </h1>
              <p class="max-w-md text-sm leading-6 text-muted">
                Registra tus datos para acceder al sistema, gestionar tu perfil y continuar con el flujo de trabajo de forma segura.
              </p>
            </div>
          </div>

          <div class="rounded-2xl border border-default bg-default/80 p-5">
            <div class="flex items-start gap-3">
              <div class="mt-0.5 rounded-xl bg-primary/10 p-2 text-primary">
                <UIcon name="i-lucide-shield-check" class="h-5 w-5" />
              </div>
              <div class="space-y-1">
                <p class="text-sm font-semibold text-highlighted">
                  Registro simple y directo
                </p>
                <p class="text-sm leading-6 text-muted">
                  Completa tus datos principales y luego podrás iniciar sesión con tu nueva cuenta.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-center p-4 sm:p-6 lg:p-10">
          <div class="w-full max-w-md space-y-6">
            <div class="space-y-2 text-center lg:text-left">
              <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary lg:mx-0 lg:hidden">
                <UIcon name="i-lucide-user-plus" class="h-6 w-6" />
              </div>

              <h2 class="text-2xl font-bold tracking-tight text-highlighted">
                Crear cuenta
              </h2>

              <p class="text-sm leading-6 text-muted">
                Completa el formulario para registrarte en la plataforma.
              </p>
            </div>

            <UPageCard
              title="Registro"
              description="Ingresa tu información personal y credenciales."
              icon="i-lucide-user-round-plus"
              variant="subtle"
              class="rounded-2xl"
            >
              <form class="space-y-5" @submit.prevent="onSubmit">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <UFormGroup label="Nombre">
                    <UInput
                      v-model="form.first_name"
                      size="lg"
                      placeholder="Tu nombre"
                      icon="i-lucide-user"
                    />
                  </UFormGroup>

                  <UFormGroup label="Apellido">
                    <UInput
                      v-model="form.last_name"
                      size="lg"
                      placeholder="Tu apellido"
                      icon="i-lucide-user-round"
                    />
                  </UFormGroup>
                </div>

                <UFormGroup label="Correo electrónico">
                  <UInput
                    v-model="form.email"
                    size="lg"
                    type="email"
                    placeholder="user@example.com"
                    icon="i-lucide-mail"
                  />
                </UFormGroup>

                <UFormGroup
                  label="Contraseña"
                  hint="Usa una contraseña segura."
                >
                  <UInput
                    v-model="form.password"
                    size="lg"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    icon="i-lucide-lock-keyhole"
                  />
                </UFormGroup>

                <UAlert
                  v-if="errorMessage"
                  color="error"
                  variant="subtle"
                  icon="i-lucide-circle-alert"
                  title="No se pudo registrar"
                  :description="errorMessage"
                />

                <UAlert
                  v-if="successMessage"
                  color="success"
                  variant="subtle"
                  icon="i-lucide-badge-check"
                  title="Registro exitoso"
                  :description="successMessage"
                />

                <div class="space-y-3 pt-2">
                  <UButton
                    type="submit"
                    color="primary"
                    size="lg"
                    block
                    :loading="loading"
                    icon="i-lucide-user-plus"
                  >
                    Crear cuenta
                  </UButton>

                  <div class="text-center text-sm text-muted">
                    ¿Ya tienes una cuenta?
                    <NuxtLink
                      to="/login"
                      class="font-medium text-primary hover:underline"
                    >
                      Inicia sesión
                    </NuxtLink>
                  </div>
                </div>
              </form>
            </UPageCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>