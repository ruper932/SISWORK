<script setup lang="ts">
import type {
  SpecialtyCreateRequest,
  SpecialtyResponse,
  SpecialtyUpdateRequest
} from '~/types/specialty'

definePageMeta({
  layout: 'app',
  middleware: 'auth',
  title: 'Especialidades'
})

const {
  getSpecialties,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty
} = useSpecialtiesApi()

const loading = ref(true)
const saving = ref(false)
const deletingId = ref<string | null>(null)

const items = ref<SpecialtyResponse[]>([])
const errorMessage = ref('')
const successMessage = ref('')

const search = ref('')
const statusFilter = ref<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL')

const isModalOpen = ref(false)
const editingItem = ref<SpecialtyResponse | null>(null)

// ✅ Tipo propio para el formulario: sin null, sin undefined
type SpecialtyFormState = {
  code: string
  name: string
  description: string
  is_active: boolean
}

const form = reactive<SpecialtyFormState>({
  code: '',
  name: '',
  description: '',
  is_active: true
})

const filteredItems = computed(() => {
  let result = [...items.value]

  const term = search.value.trim().toLowerCase()
  if (term) {
    result = result.filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.code.toLowerCase().includes(term) ||
      (item.description || '').toLowerCase().includes(term)
    )
  }

  if (statusFilter.value === 'ACTIVE') {
    result = result.filter(item => item.is_active)
  }

  if (statusFilter.value === 'INACTIVE') {
    result = result.filter(item => !item.is_active)
  }

  return result
})

const totalItems = computed(() => items.value.length)
const activeItems = computed(() => items.value.filter(item => item.is_active).length)
const inactiveItems = computed(() => items.value.filter(item => !item.is_active).length)

function resetMessages(): void {
  errorMessage.value = ''
  successMessage.value = ''
}

function resetForm(): void {
  form.code = ''
  form.name = ''
  form.description = ''
  form.is_active = true
  editingItem.value = null
}

function openCreateModal(): void {
  resetMessages()
  resetForm()
  isModalOpen.value = true
}

function openEditModal(item: SpecialtyResponse): void {
  resetMessages()
  editingItem.value = item
  form.code = item.code
  form.name = item.name
  form.description = item.description ?? ''
  form.is_active = item.is_active
  isModalOpen.value = true
}

function closeModal(): void {
  isModalOpen.value = false
  resetForm()
}

async function loadSpecialties(): Promise<void> {
  loading.value = true
  resetMessages()

  try {
    items.value = await getSpecialties()
  } catch (error: any) {
    errorMessage.value =
      error?.data?.detail ||
      error?.data?.message ||
      error?.message ||
      'No se pudo cargar la lista de especialidades'
  } finally {
    loading.value = false
  }
}

async function submitForm(): Promise<void> {
  saving.value = true
  resetMessages()

  try {
    if (editingItem.value) {
      // ✅ Al enviar a la API sí convertimos '' a null
      const payload: SpecialtyUpdateRequest = {
        code: form.code.trim(),
        name: form.name.trim(),
        description: form.description.trim() || null,
        is_active: form.is_active
      }

      await updateSpecialty(editingItem.value.id, payload)
      successMessage.value = 'Especialidad actualizada correctamente'
    } else {
      const payload: SpecialtyCreateRequest = {
        code: form.code.trim(),
        name: form.name.trim(),
        description: form.description.trim() || null,
        is_active: form.is_active
      }

      await createSpecialty(payload)
      successMessage.value = 'Especialidad creada correctamente'
    }

    closeModal()
    await loadSpecialties()
  } catch (error: any) {
    errorMessage.value =
      error?.data?.detail ||
      error?.data?.message ||
      error?.message ||
      'No se pudo guardar la especialidad'
  } finally {
    saving.value = false
  }
}

async function toggleStatus(item: SpecialtyResponse): Promise<void> {
  resetMessages()

  try {
    await updateSpecialty(item.id, {
      is_active: !item.is_active
    })

    successMessage.value = item.is_active
      ? 'Especialidad desactivada correctamente'
      : 'Especialidad activada correctamente'

    await loadSpecialties()
  } catch (error: any) {
    errorMessage.value =
      error?.data?.detail ||
      error?.data?.message ||
      error?.message ||
      'No se pudo actualizar el estado'
  }
}

async function removeItem(item: SpecialtyResponse): Promise<void> {
  const confirmed = import.meta.client
    ? window.confirm(`¿Seguro que deseas eliminar la especialidad "${item.name}"?`)
    : false

  if (!confirmed) return

  deletingId.value = item.id
  resetMessages()

  try {
    await deleteSpecialty(item.id)
    successMessage.value = 'Especialidad eliminada correctamente'
    await loadSpecialties()
  } catch (error: any) {
    errorMessage.value =
      error?.data?.detail ||
      error?.data?.message ||
      error?.message ||
      'No se pudo eliminar la especialidad'
  } finally {
    deletingId.value = null
  }
}

onMounted(() => {
  loadSpecialties()
})
</script>
<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="text-sm text-muted">Catálogo</p>
        <h1 class="text-2xl font-bold text-highlighted">
          Especialidades
        </h1>
        <p class="text-sm text-muted">
          Administra las especialidades disponibles para solicitudes y profesionales.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <UButton
          color="neutral"
          variant="soft"
          icon="i-lucide-refresh-cw"
          :loading="loading"
          @click="loadSpecialties"
        >
          Actualizar
        </UButton>

        <UButton
          color="primary"
          icon="i-lucide-plus"
          @click="openCreateModal"
        >
          Nueva especialidad
        </UButton>
      </div>
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

    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <UPageCard
        title="Total"
        description="Especialidades registradas."
        icon="i-lucide-list"
        variant="subtle"
      >
        <p class="text-2xl font-bold text-highlighted">
          {{ totalItems }}
        </p>
      </UPageCard>

      <UPageCard
        title="Activas"
        description="Disponibles para uso."
        icon="i-lucide-circle-check-big"
        variant="subtle"
      >
        <p class="text-2xl font-bold text-highlighted">
          {{ activeItems }}
        </p>
      </UPageCard>

      <UPageCard
        title="Inactivas"
        description="Ocultas o deshabilitadas."
        icon="i-lucide-circle-off"
        variant="subtle"
      >
        <p class="text-2xl font-bold text-highlighted">
          {{ inactiveItems }}
        </p>
      </UPageCard>
    </div>

    <UPageCard
      title="Filtros"
      description="Busca y filtra el catálogo de especialidades."
      icon="i-lucide-filter"
      variant="subtle"
    >
      <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Buscar por código, nombre o descripción"
        />

        <USelect
          v-model="statusFilter"
          :items="[
            { label: 'Todas', value: 'ALL' },
            { label: 'Activas', value: 'ACTIVE' },
            { label: 'Inactivas', value: 'INACTIVE' }
          ]"
        />

        <UButton
          color="neutral"
          variant="soft"
          icon="i-lucide-x"
          @click="() => { search = ''; statusFilter = 'ALL' }"
        >
          Limpiar filtros
        </UButton>
      </div>
    </UPageCard>

    <UPageCard
      title="Listado"
      description="Resultado actual del catálogo."
      icon="i-lucide-table-properties"
      variant="subtle"
    >
      <div
        v-if="loading"
        class="space-y-3"
      >
        <USkeleton class="h-12 rounded-lg" />
        <USkeleton class="h-12 rounded-lg" />
        <USkeleton class="h-12 rounded-lg" />
      </div>

      <div
        v-else-if="!filteredItems.length"
        class="rounded-xl border border-dashed border-default p-6 text-sm text-muted"
      >
        No se encontraron especialidades con los filtros actuales.
      </div>

      <div
        v-else
        class="space-y-3"
      >
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="flex flex-col gap-4 rounded-xl border border-default p-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div class="min-w-0 space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="font-semibold text-highlighted">
                {{ item.name }}
              </p>

              <UBadge
                :color="item.is_active ? 'success' : 'neutral'"
                variant="subtle"
              >
                {{ item.is_active ? 'Activa' : 'Inactiva' }}
              </UBadge>
            </div>

            <p class="text-sm text-muted">
              Código: {{ item.code }}
            </p>

            <p class="text-sm text-muted">
              {{ item.description || 'Sin descripción registrada' }}
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <UButton
              color="primary"
              variant="soft"
              icon="i-lucide-pencil"
              @click="openEditModal(item)"
            >
              Editar
            </UButton>

            <UButton
              :color="item.is_active ? 'warning' : 'success'"
              variant="soft"
              :icon="item.is_active ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              @click="toggleStatus(item)"
            >
              {{ item.is_active ? 'Desactivar' : 'Activar' }}
            </UButton>

            <UButton
              color="error"
              variant="soft"
              icon="i-lucide-trash-2"
              :loading="deletingId === item.id"
              @click="removeItem(item)"
            >
              Eliminar
            </UButton>
          </div>
        </div>
      </div>
    </UPageCard>

    <UModal v-model:open="isModalOpen">
      <template #content>
        <div class="space-y-4 p-6">
          <div>
            <h2 class="text-lg font-semibold text-highlighted">
              {{ editingItem ? 'Editar especialidad' : 'Nueva especialidad' }}
            </h2>
            <p class="text-sm text-muted">
              Completa la información principal del catálogo.
            </p>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <UFormField label="Código" name="code">
              <UInput
                v-model="form.code"
                placeholder="Ej: plomeria"
              />
            </UFormField>

            <UFormField label="Nombre" name="name">
              <UInput
                v-model="form.name"
                placeholder="Ej: Plomería"
              />
            </UFormField>

            <UFormField label="Descripción" name="description">
              <UTextarea
                v-model="form.description"
                :rows="4"
                placeholder="Describe la especialidad"
              />
            </UFormField>

            <div class="flex items-center justify-between rounded-lg border border-default p-3">
              <div>
                <p class="text-sm font-medium text-highlighted">
                  Estado
                </p>
                <p class="text-sm text-muted">
                  Define si la especialidad estará disponible.
                </p>
              </div>

              <UToggle v-model="form.is_active" />
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <UButton
              color="neutral"
              variant="soft"
              @click="closeModal"
            >
              Cancelar
            </UButton>

            <UButton
              color="primary"
              :loading="saving"
              @click="submitForm"
            >
              {{ editingItem ? 'Guardar cambios' : 'Crear especialidad' }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>