<script setup lang="ts">
type UserFormData = {
  id?: string
  first_name: string
  last_name: string
  email: string
  phone: string
  whatsapp_number: string
  profile_photo_url: string
  birth_date?: string
  gender: string
  role: string
  status: string
  is_active: boolean
  email_verified_at?: string
  last_login_at?: string
  created_at?: string
  updated_at?: string
  password?: string
}

const props = withDefaults(defineProps<{
  initialData?: Partial<UserFormData> | null
  isEdit?: boolean
  loading?: boolean
}>(), {
  initialData: null,
  isEdit: false,
  loading: false
})

const emit = defineEmits<{
  submit: [payload: Partial<UserFormData>]
}>()

const genderOptions = [
  { label: 'Masculino', value: 'MALE' },
  { label: 'Femenino', value: 'FEMALE' },
  { label: 'Otro', value: 'OTHER' },
  { label: 'Prefiero no decirlo', value: 'PREFER_NOT_TO_SAY' }
]

const roleOptions = [
  { label: 'Administrador', value: 'ADMIN' },
  { label: 'Usuario', value: 'USER' },
  { label: 'Profesional', value: 'PROFESSIONAL' }
]

const statusOptions = [
  { label: 'Activo', value: 'ACTIVE' },
  { label: 'Inactivo', value: 'INACTIVE' },
  { label: 'Suspendido', value: 'SUSPENDED' },
  { label: 'Pendiente', value: 'PENDING' }
]

const form = reactive<UserFormData>({
  id: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  whatsapp_number: '',
  profile_photo_url: '',
  birth_date: '',
  gender: '',
  role: '',
  status: '',
  is_active: true,
  email_verified_at: '',
  last_login_at: '',
  created_at: '',
  updated_at: '',
  password: ''
})

watch(
  () => props.initialData,
  (value) => {
    if (!value) return

    form.id = value.id ?? ''
    form.first_name = value.first_name ?? ''
    form.last_name = value.last_name ?? ''
    form.email = value.email ?? ''
    form.phone = value.phone ?? ''
    form.whatsapp_number = value.whatsapp_number ?? ''
    form.profile_photo_url = value.profile_photo_url ?? ''
    form.birth_date = value.birth_date ?? ''
    form.gender = value.gender ?? ''
    form.role = value.role ?? ''
    form.status = value.status ?? ''
    form.is_active = value.is_active ?? true
    form.email_verified_at = value.email_verified_at ?? ''
    form.last_login_at = value.last_login_at ?? ''
    form.created_at = value.created_at ?? ''
    form.updated_at = value.updated_at ?? ''
    form.password = ''
  },
  { immediate: true }
)

function formatDateTime(value?: string) {
  if (!value) return 'Sin registro'
  return new Date(value).toLocaleString('es-BO')
}

function onSubmit() {
  const payload: Partial<UserFormData> = {
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    whatsapp_number: form.whatsapp_number.trim(),
    profile_photo_url: form.profile_photo_url.trim(),
    birth_date: form.birth_date || undefined,
    gender: form.gender,
    role: form.role,
    status: form.status,
    is_active: form.is_active
  }

  if (form.password?.trim()) {
    payload.password = form.password.trim()
  }

  emit('submit', payload)
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="onSubmit">
    <UPageCard
      title="Datos personales"
      description="Información principal del usuario."
      icon="i-lucide-user-round"
      variant="subtle"
    >
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <UFormGroup label="Nombre">
          <UInput
            v-model="form.first_name"
            placeholder="Ingresa el nombre"
            icon="i-lucide-user"
          />
        </UFormGroup>

        <UFormGroup label="Apellido">
          <UInput
            v-model="form.last_name"
            placeholder="Ingresa el apellido"
            icon="i-lucide-user-round"
          />
        </UFormGroup>

        <UFormGroup label="Correo electrónico" class="md:col-span-2">
          <UInput
            v-model="form.email"
            type="email"
            placeholder="user@example.com"
            icon="i-lucide-mail"
          />
        </UFormGroup>

        <UFormGroup label="Teléfono">
          <UInput
            v-model="form.phone"
            placeholder="Ingresa el teléfono"
            icon="i-lucide-phone"
          />
        </UFormGroup>

        <UFormGroup label="WhatsApp">
          <UInput
            v-model="form.whatsapp_number"
            placeholder="Ingresa el número de WhatsApp"
            icon="i-lucide-message-circle"
          />
        </UFormGroup>

        <UFormGroup label="Foto de perfil" class="md:col-span-2">
          <UInput
            v-model="form.profile_photo_url"
            placeholder="https://..."
            icon="i-lucide-image"
          />
        </UFormGroup>

        <UFormGroup label="Fecha de nacimiento">
          <UInput
            v-model="form.birth_date"
            type="date"
            icon="i-lucide-calendar-days"
          />
        </UFormGroup>

        <UFormGroup label="Género">
          <USelect
            v-model="form.gender"
            :items="genderOptions"
            value-key="value"
            placeholder="Selecciona un género"
          />
        </UFormGroup>
      </div>
    </UPageCard>

    <UPageCard
      title="Acceso y estado"
      description="Configuración funcional del usuario dentro del sistema."
      icon="i-lucide-shield-check"
      variant="subtle"
    >
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <UFormGroup label="Rol">
          <USelect
            v-model="form.role"
            :items="roleOptions"
            value-key="value"
            placeholder="Selecciona un rol"
          />
        </UFormGroup>

        <UFormGroup label="Estado">
          <USelect
            v-model="form.status"
            :items="statusOptions"
            value-key="value"
            placeholder="Selecciona un estado"
          />
        </UFormGroup>

        <UFormGroup
          :label="props.isEdit ? 'Nueva contraseña' : 'Contraseña'"
          class="md:col-span-2"
        >
          <UInput
            v-model="form.password"
            type="password"
            :placeholder="props.isEdit ? 'Solo si deseas cambiarla' : 'Ingresa una contraseña'"
            icon="i-lucide-lock-keyhole"
          />
        </UFormGroup>

        <div class="md:col-span-2">
          <div class="flex items-center justify-between rounded-lg border border-default p-4">
            <div>
              <p class="text-sm font-medium text-highlighted">
                Usuario activo
              </p>
              <p class="text-sm text-muted">
                Define si la cuenta está habilitada en la plataforma.
              </p>
            </div>

            <USwitch v-model="form.is_active" />
          </div>
        </div>
      </div>
    </UPageCard>

    <UPageCard
      v-if="props.isEdit"
      title="Metadatos"
      description="Información de auditoría visible pero no editable."
      icon="i-lucide-info"
      variant="subtle"
    >
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <UFormGroup label="ID">
          <UInput :model-value="form.id || ''" readonly />
        </UFormGroup>

        <UFormGroup label="Correo verificado">
          <UInput :model-value="formatDateTime(form.email_verified_at)" readonly />
        </UFormGroup>

        <UFormGroup label="Último acceso">
          <UInput :model-value="formatDateTime(form.last_login_at)" readonly />
        </UFormGroup>

        <UFormGroup label="Creado en">
          <UInput :model-value="formatDateTime(form.created_at)" readonly />
        </UFormGroup>

        <UFormGroup label="Actualizado en">
          <UInput :model-value="formatDateTime(form.updated_at)" readonly />
        </UFormGroup>
      </div>
    </UPageCard>

    <div class="flex justify-end gap-3">
      <UButton
        to="/users"
        color="neutral"
        variant="soft"
      >
        Cancelar
      </UButton>

      <UButton
        type="submit"
        color="primary"
        :loading="props.loading"
        icon="i-lucide-save"
      >
        {{ props.isEdit ? 'Guardar cambios' : 'Crear usuario' }}
      </UButton>
    </div>
  </form>
</template>