<script setup lang="ts">
import { reactive, watch } from 'vue'
import * as z from 'zod'

const emit = defineEmits<{
  submit: [payload: any]
}>()

const props = defineProps<{
  initialData?: any
  isEdit?: boolean
}>()

const schema = z.object({
  first_name: z.string().min(1, 'El nombre es obligatorio'),
  last_name: z.string().min(1, 'El apellido es obligatorio'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres').optional().or(z.literal('')),
  phone: z.string().optional().nullable(),
  whatsapp_number: z.string().optional().nullable(),
  profile_photo_url: z.string().optional().nullable(),
  birth_date: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  role: z.string().min(1),
  status: z.string().min(1),
  is_active: z.boolean()
})

const state = reactive({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  phone: '',
  whatsapp_number: '',
  profile_photo_url: '',
  birth_date: '',
  gender: '',
  role: 'CLIENT',
  status: 'ACTIVE',
  is_active: true
})

watch(
  () => props.initialData,
  (value) => {
    if (!value) return

    Object.assign(state, {
      first_name: value.first_name ?? '',
      last_name: value.last_name ?? '',
      email: value.email ?? '',
      password: '',
      phone: value.phone ?? '',
      whatsapp_number: value.whatsapp_number ?? '',
      profile_photo_url: value.profile_photo_url ?? '',
      birth_date: value.birth_date ? String(value.birth_date).slice(0, 10) : '',
      gender: value.gender ?? '',
      role: value.role ?? 'CLIENT',
      status: value.status ?? 'ACTIVE',
      is_active: value.is_active ?? true
    })
  },
  { immediate: true }
)

function onSubmit() {
  const basePayload = {
    first_name: state.first_name,
    last_name: state.last_name,
    email: state.email,
    phone: state.phone || null,
    whatsapp_number: state.whatsapp_number || null,
    profile_photo_url: state.profile_photo_url || null,
    birth_date: state.birth_date || null,
    gender: state.gender || null,
    role: state.role,
    status: state.status,
    is_active: state.is_active
  }

  const payload = props.isEdit
    ? {
        ...basePayload,
        ...(state.password ? { password: state.password } : {})
      }
    : {
        ...basePayload,
        password: state.password
      }

  emit('submit', payload)
}
</script>

<template>
  <section class="rounded-2xl border border-default bg-(--ui-bg-elevated) shadow-sm">
    <div class="border-b border-default px-6 py-5">
      <h2 class="text-lg font-semibold text-highlighted">
        {{ props.isEdit ? 'Actualizar usuario' : 'Registrar usuario' }}
      </h2>
      <p class="mt-1 text-sm text-muted">
        Completa la información general del usuario.
      </p>
    </div>

    <UForm :schema="schema" :state="state" class="space-y-6 p-6" @submit="onSubmit">
      <div class="grid gap-5 md:grid-cols-2">
        <UFormField label="Nombre" name="first_name">
          <UInput v-model="state.first_name" size="xl" />
        </UFormField>

        <UFormField label="Apellido" name="last_name">
          <UInput v-model="state.last_name" size="xl" />
        </UFormField>

        <UFormField label="Email" name="email">
          <UInput v-model="state.email" type="email" size="xl" />
        </UFormField>

        <UFormField :label="props.isEdit ? 'Contraseña nueva (opcional)' : 'Contraseña'" name="password">
          <UInput v-model="state.password" type="password" size="xl" />
        </UFormField>

        <UFormField label="Teléfono" name="phone">
          <UInput v-model="state.phone" size="xl" />
        </UFormField>

        <UFormField label="WhatsApp" name="whatsapp_number">
          <UInput v-model="state.whatsapp_number" size="xl" />
        </UFormField>

        <UFormField label="Foto de perfil" name="profile_photo_url" class="md:col-span-2">
          <UInput v-model="state.profile_photo_url" size="xl" />
        </UFormField>

        <UFormField label="Fecha de nacimiento" name="birth_date">
          <UInput v-model="state.birth_date" type="date" size="xl" />
        </UFormField>

        <UFormField label="Género" name="gender">
          <UInput v-model="state.gender" size="xl" />
        </UFormField>

        <UFormField label="Rol" name="role">
          <UInput v-model="state.role" size="xl" />
        </UFormField>

        <UFormField label="Estado" name="status">
          <UInput v-model="state.status" size="xl" />
        </UFormField>

        <div class="flex items-center rounded-xl border border-default bg-(--ui-bg-muted) px-4 py-3">
          <UCheckbox v-model="state.is_active" />
          <span class="ml-3 text-sm font-medium text-highlighted">
            Usuario activo
          </span>
        </div>
      </div>

      <div class="flex flex-col gap-3 border-t border-default pt-6 sm:flex-row sm:justify-end">
        <UButton
          color="neutral"
          variant="soft"
          icon="i-lucide-arrow-left"
          to="/users"
        >
          Cancelar
        </UButton>

        <UButton
          type="submit"
          color="primary"
          icon="i-lucide-save"
        >
          {{ props.isEdit ? 'Guardar cambios' : 'Crear usuario' }}
        </UButton>
      </div>
    </UForm>
  </section>
</template>