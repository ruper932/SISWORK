<script setup lang="ts">
definePageMeta({
  layout: false,
  title: 'Inicio | SISWORK'
})

const features = [
  {
    title: 'Perfiles Certificados',
    description: 'Destaca tu experiencia con perfiles profesionales validados que incluyen certificaciones y especialidades técnicas.',
    icon: 'i-lucide-award'
  },
  {
    title: 'Reputación Verificada',
    description: 'Construye confianza mediante un sistema de calificaciones reales basado en el cumplimiento y calidad del servicio.',
    icon: 'i-lucide-star'
  },
  {
    title: 'Validación Inteligente',
    description: 'Procesos de aprobación optimizados mediante modelos operativos para reducir tiempos de espera en el alta de técnicos.',
    icon: 'i-lucide-zap'
  }
]

const steps = [
  {
    step: '01',
    title: 'Crea tu Perfil',
    description: 'Regístrate como profesional técnico o cliente en una plataforma diseñada para la realidad laboral boliviana.'
  },
  {
    step: '02',
    title: 'Valida tu Experiencia',
    description: 'Sube tus documentos y certificaciones para obtener el sello de verificación y destacar frente a la oferta informal.'
  },
  {
    step: '03',
    title: 'Conecta y Formaliza',
    description: 'Gestiona solicitudes de servicio, realiza seguimiento de trabajos y consolida tu historial laboral digital.'
  }
]

const stats = [
  { label: 'Informalidad actual', value: '68%' },
  { label: 'Sello de confianza', value: '100% Verificado' },
  { label: 'Especialidades', value: '+10 áreas' }
]
</script>

<template>
  <div class="min-h-screen bg-default">
    <header class="border-b border-default bg-default/90 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UIcon name="i-lucide-briefcase-business" class="h-5 w-5" />
          </div>
          <div>
            <p class="text-sm font-semibold text-highlighted uppercase tracking-wider">SISWORK</p>
            <p class="text-xs text-muted">Intermediación Laboral</p>
          </div>
        </NuxtLink>

        <nav class="flex items-center gap-3">
          <UButton
            to="/login"
            color="neutral"
            variant="ghost"
          >
            Iniciar sesión
          </UButton>

          <UButton
            to="/register"
            color="primary"
            variant="solid"
            icon="i-lucide-user-plus"
          >
            Unirse a SISWORK
          </UButton>
        </nav>
      </div>
    </header>

    <main>
      <section class="border-b border-default">
        <div class="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div class="flex flex-col justify-center space-y-8">
            <div class="space-y-4">
              <UBadge color="primary" variant="subtle" class="w-fit">
                Formalización del Trabajo Independiente
              </UBadge>

              <h1 class="max-w-3xl text-4xl font-bold tracking-tight text-highlighted sm:text-5xl">
                Conecta talento técnico con oportunidades seguras en Bolivia
              </h1>

              <p class="max-w-2xl text-base leading-7 text-muted sm:text-lg">
                Sustituye la incertidumbre de los canales informales por una plataforma digital transparente. 
                SISWORK impulsa la formalización de plomeros, electricistas y técnicos especialistas.
              </p>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row">
              <UButton
                to="/register"
                color="primary"
                size="xl"
                icon="i-lucide-shield-check"
              >
                Soy profesional técnico
              </UButton>

              <UButton
                to="/login"
                color="neutral"
                variant="soft"
                size="xl"
                icon="i-lucide-search"
              >
                Busco un servicio
              </UButton>
            </div>

            <div class="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div
                v-for="item in stats"
                :key="item.label"
                class="rounded-2xl border border-default bg-muted/30 p-4"
              >
                <p class="text-xl font-bold text-highlighted">
                  {{ item.value }}
                </p>
                <p class="text-sm text-muted">
                  {{ item.label }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex items-center">
            <div class="w-full rounded-3xl border border-default bg-muted/30 p-4 shadow-sm sm:p-6">
              <div class="rounded-2xl border border-default bg-default p-4 sm:p-6">
                <div class="flex items-center justify-between border-b border-default pb-4">
                  <div>
                    <p class="text-sm font-semibold text-highlighted">Panel de Control</p>
                    <p class="text-xs text-muted">Estado de validaciones</p>
                  </div>
                  <UBadge color="success" variant="subtle">
                    Sistema Activo
                  </UBadge>
                </div>

                <div class="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
                  <div class="rounded-2xl border border-default bg-muted/30 p-4">
                    <p class="text-sm text-muted">Técnicos Activos</p>
                    <p class="pt-1 text-2xl font-bold text-highlighted">850k+</p>
                  </div>

                  <div class="rounded-2xl border border-default bg-muted/30 p-4">
                    <p class="text-sm text-muted">Solicitudes Hoy</p>
                    <p class="pt-1 text-2xl font-bold text-highlighted">42</p>
                  </div>

                  <div class="rounded-2xl border border-default bg-muted/30 p-4">
                    <p class="text-sm text-muted">Eficiencia Validación</p>
                    <p class="pt-1 text-2xl font-bold text-highlighted">98%</p>
                  </div>

                  <div class="rounded-2xl border border-default bg-muted/30 p-4">
                    <p class="text-sm text-muted">Conflictos Resueltos</p>
                    <p class="pt-1 text-2xl font-bold text-highlighted">100%</p>
                  </div>
                </div>

                <div class="mt-4 rounded-2xl border border-default bg-primary/5 p-4">
                  <p class="text-sm font-medium text-highlighted">
                    Reduciendo la brecha entre la oferta técnica especializada y la demanda nacional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="border-b border-default">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div class="max-w-2xl space-y-3">
            <p class="text-sm font-medium text-primary">
              Nuestra Propuesta de Valor
            </p>
            <h2 class="text-3xl font-bold tracking-tight text-highlighted">
              Un ecosistema digital para servicios de confianza
            </h2>
            <p class="text-base leading-7 text-muted">
              SISWORK integra herramientas modernas para profesionalizar el sector de servicios técnicos, 
              proveyendo trazabilidad y seguridad para ambas partes.
            </p>
          </div>

          <div class="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr_1fr]">
            <div
              v-for="feature in features"
              :key="feature.title"
              class="rounded-3xl border border-default bg-default p-6 shadow-sm"
            >
              <div class="space-y-4">
                <UIcon :name="feature.icon" class="h-6 w-6 text-primary" />
                <div class="space-y-2">
                  <h3 class="text-lg font-semibold text-highlighted">
                    {{ feature.title }}
                  </h3>
                  <p class="text-sm leading-6 text-muted">
                    {{ feature.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="border-b border-default">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div class="space-y-3">
              <p class="text-sm font-medium text-primary">
                Metodología de Trabajo
              </p>
              <h2 class="text-3xl font-bold tracking-tight text-highlighted">
                Hacia la formalización laboral
              </h2>
              <p class="text-base leading-7 text-muted">
                Entendemos los desafíos del mercado local y hemos diseñado un flujo que facilita la transición hacia el empleo digital formal.
              </p>
            </div>

            <div class="space-y-4">
              <div
                v-for="item in steps"
                :key="item.step"
                class="rounded-3xl border border-default bg-default p-6 shadow-sm"
              >
                <div class="grid gap-3 sm:grid-cols-[72px_1fr]">
                  <div class="text-sm font-semibold text-primary">
                    Paso {{ item.step }}
                  </div>

                  <div class="space-y-2">
                    <h3 class="text-lg font-semibold text-highlighted">
                      {{ item.title }}
                    </h3>
                    <p class="text-sm leading-6 text-muted">
                      {{ item.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div class="rounded-3xl border border-default bg-muted/30 p-8 sm:p-10 lg:p-12">
            <div class="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div class="space-y-3">
                <p class="text-sm font-medium text-primary">
                  Únete al cambio
                </p>
                <h2 class="text-3xl font-bold tracking-tight text-highlighted">
                  Dignifica tu oficio y expande tus oportunidades hoy mismo
                </h2>
                <p class="max-w-2xl text-base leading-7 text-muted">
                  Forma parte del primer sistema web dedicado exclusivamente a la intermediación de servicios técnicos profesionales en Bolivia.
                </p>
              </div>

              <div class="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <UButton
                  to="/register"
                  color="primary"
                  size="xl"
                  icon="i-lucide-user-plus"
                >
                  Registrarme ahora
                </UButton>

                <UButton
                  to="/login"
                  color="neutral"
                  variant="soft"
                  size="xl"
                  icon="i-lucide-arrow-right"
                >
                  Acceso clientes
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>