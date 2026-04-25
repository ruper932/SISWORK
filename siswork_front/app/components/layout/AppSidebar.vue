<template>
  <aside class="w-full lg:w-72 lg:min-h-screen bg-slate-950 text-white border-r border-white/10">
    <div class="p-6 border-b border-white/10">
      <p class="text-xs uppercase tracking-[0.2em] text-slate-400">SISWORK</p>
      <h2 class="text-xl font-semibold mt-2">Panel</h2>
      <p class="text-sm text-slate-400 mt-1">Administración</p>
    </div>

    <nav class="p-4 space-y-2">
      <NuxtLink
        to="/dashboard"
        class="flex items-center rounded-xl px-4 py-3 text-sm text-slate-200 hover:bg-white/10 transition"
      >
        Dashboard
      </NuxtLink>

      <NuxtLink
        to="/users"
        class="flex items-center rounded-xl px-4 py-3 text-sm text-slate-200 hover:bg-white/10 transition"
      >
        Usuarios
      </NuxtLink>

      <NuxtLink
        to="/users/create"
        class="flex items-center rounded-xl px-4 py-3 text-sm text-slate-200 hover:bg-white/10 transition"
      >
        Crear usuario
      </NuxtLink>
    </nav>
  </aside>
</template>