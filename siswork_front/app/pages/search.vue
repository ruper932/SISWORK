<template>
  <div class="flex h-screen bg-gray-50 text-slate-900">
    <aside class="w-72 bg-white p-6 border-r border-slate-200 hidden md:block overflow-y-auto">
      <h3 class="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">🔍 Filtros</h3>
      
      <div class="mb-8 p-1 bg-slate-100 rounded-xl flex">
        <button 
          @click="searchType = 'usuarios'"
          :class="searchType === 'usuarios' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'"
          class="flex-1 py-2 text-xs font-bold rounded-lg transition-all"
        >
          USUARIOS
        </button>
        <button 
          @click="searchType = 'publicaciones'"
          :class="searchType === 'publicaciones' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'"
          class="flex-1 py-2 text-xs font-bold rounded-lg transition-all"
        >
          SERVICIOS
        </button>
      </div>

      <div class="mb-6">
        <label class="text-xs font-bold text-slate-400 uppercase block mb-3">Especialidad</label>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="oficio in oficios" :key="oficio.id"
            @click="selectedOficio = oficio.nombre"
            :class="selectedOficio === oficio.nombre ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200'"
            class="px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all"
          >
            {{ oficio.nombre }}
          </button>
        </div>
      </div>

      <div class="mb-6">
        <label class="text-xs font-bold text-slate-400 uppercase block mb-3">Zona (La Paz)</label>
        <select v-model="selectedZona" class="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white">
          <option value="">Todas las zonas</option>
          <option v-for="zona in zonas" :key="zona" :value="zona">{{ zona }}</option>
        </select>
      </div>

      <button @click="handleSearch" class="w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-200">
        Aplicar filtros
      </button>
    </aside>

    <main class="flex-1 p-6 overflow-y-auto">
      <div class="max-w-5xl mx-auto">
        <div class="flex gap-3 mb-8">
          <div class="relative flex-1 text-black">
            <span class="absolute left-4 top-3 text-slate-400">🔍</span>
            <input 
              v-model="searchQuery"
              type="text" 
              :placeholder="searchType === 'usuarios' ? 'Buscar profesional por nombre...' : 'Buscar solicitudes de trabajo...'" 
              class="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              @keyup.enter="handleSearch"
            />
          </div>
          <button @click="handleSearch" :disabled="pending" class="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-slate-400">
            {{ pending ? 'Buscando...' : 'Buscar' }}
          </button>
        </div>

        <div class="flex justify-between items-center mb-6">
          <h2 class="font-bold text-slate-800 uppercase text-sm tracking-widest">
            {{ searchType === 'usuarios' ? 'Profesionales Verificados' : 'Solicitudes Abiertas' }}
          </h2>
          <span class="text-sm text-slate-500 font-medium">{{ results.length }} resultados</span>
        </div>

        <div v-if="results.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="res in results" :key="res.id" 
            class="bg-white p-5 rounded-2xl border-2 border-transparent hover:border-blue-500 hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden"
          >
            <div v-if="searchType === 'usuarios'">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-inner">
                  {{ (res.nombres || res.name || 'U').charAt(0) }}
                </div>
                <div>
                  <h4 class="font-bold text-slate-800">{{ res.nombres || res.name }} {{ res.apellidos || '' }}</h4>
                  <p class="text-xs text-slate-400">{{ res.anos_experiencia || res.exp || 0 }} años de exp.</p>
                </div>
              </div>
              <div class="mb-4">
                <span class="inline-block px-2 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 uppercase">
                  {{ res.especialidades || res.oficio || 'General' }}
                </span>
              </div>
              <div class="flex items-center gap-2 mb-4 text-sm">
                <span class="text-amber-400 text-lg">★</span>
                <span class="font-bold">{{ res.calificacion_promedio || res.rating || '0.0' }}</span>
                <span class="text-slate-400">({{ res.cantidad_calificaciones || res.reviews || 0 }})</span>
              </div>
            </div>

            <div v-else>
              <div class="mb-3 flex justify-between items-start">
                <span class="text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 px-2 py-1 rounded">Presupuesto</span>
              </div>
              <h4 class="font-bold text-slate-800 text-lg leading-tight mb-2">{{ res.titulo }}</h4>
              <p class="text-xs text-slate-500 line-clamp-2 mb-4">{{ res.descripcion }}</p>
              <div class="text-slate-900 font-black text-xl mb-3">
                Bs. {{ res.presupuesto_maximo || res.monto || 0 }}
              </div>
            </div>

            <div class="flex items-center justify-between text-xs font-semibold border-t pt-4 border-slate-50">
              <span class="bg-slate-100 px-2 py-1 rounded text-slate-600">📍 {{ res.zona_principal || res.zona || 'La Paz' }}</span>
              <button class="text-blue-600 font-bold hover:underline">Ver más</button>
            </div>
          </div>
        </div>

        <div v-else class="py-20 text-center">
          <div class="text-4xl mb-4 text-slate-300 italic font-serif">"Sin resultados"</div>
          <p class="text-slate-400">Prueba con otros términos o cambia el tipo de búsqueda.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { apiAuth } = useApiAuth();

// Interface ajustada al SQL (Tablas: usuarios, perfiles_profesionales, solicitudes_servicio)
interface SearchItem {
  id?: string | number;
  // Campos de Usuario/Profesional
  nombres?: string;
  apellidos?: string;
  name?: string; // fallback mockup
  especialidades?: string; 
  zona_principal?: string;
  calificacion_promedio?: number;
  cantidad_calificaciones?: number;
  anos_experiencia?: number;
  // Campos de Solicitud (Joel)
  titulo?: string;
  descripcion?: string;
  presupuesto_maximo?: number;
  zona?: string;
  // Extras mockup
  oficio?: string;
  rating?: number;
  reviews?: number;
  exp?: string;
  monto?: number;
}

// Estados reactivos
const searchQuery = ref('');
const searchType = ref<'usuarios' | 'publicaciones'>('usuarios');
const selectedOficio = ref('Todos');
const selectedZona = ref('');
const results = ref<SearchItem[]>([]);
const pending = ref(false);

// Datos oficiales extraídos del SQL de Limber (Especialidades)
const oficios = [
  { id: 0, nombre: 'Todos' },
  { id: 1, nombre: 'Plomería' },
  { id: 2, nombre: 'Electricidad' },
  { id: 3, nombre: 'Carpintería' },
  { id: 4, nombre: 'Albañilería' },
  { id: 5, nombre: 'Mecánica automotriz' },
  { id: 6, nombre: 'Limpieza' },
  { id: 7, nombre: 'Pintura' },
  { id: 8, nombre: 'Jardinería' }
];

const zonas = ['Miraflores', 'Sopocachi', 'San Pedro', 'Obrajes', 'Calacoto', 'Zona Sur', 'El Alto', 'Centro'];

// Mock Data para cuando el backend no esté corriendo
const mockData: SearchItem[] = [
  { id: 1, name: "Pedro Mamani", oficio: "Plomería", zona: "Miraflores", rating: 4.9, reviews: 47, exp: "8 años", zona_principal: "Miraflores" },
  { id: 2, name: "Luisa Quispe", oficio: "Limpieza", zona: "Sopocachi", rating: 4.8, reviews: 63, exp: "5 años", zona_principal: "Sopocachi" },
  { id: 3, titulo: "Arreglar grifo cocina", descripcion: "Busco plomero urgente para mañana", presupuesto_maximo: 150, zona: "San Pedro" },
  { id: 4, titulo: "Pintado de fachada", descripcion: "Casa de dos pisos en la zona sur", presupuesto_maximo: 1200, zona: "Calacoto" }
];

const handleSearch = async () => {
  pending.value = true;
  
  try {
    // Endpoints según la lógica de Limber
    const endpoint = searchType.value === 'usuarios' ? '/perfiles-publicos' : '/solicitudes';
    
    const data = await apiAuth<any>(endpoint, {
      method: 'GET',
      params: { 
        search: searchQuery.value,
        zona: selectedZona.value,
        especialidad: selectedOficio.value !== 'Todos' ? selectedOficio.value : null
      }
    });
    
    if (data) {
      // Laravel suele devolver data en .data o el array directo
      results.value = data.data || data;
    } else {
      throw new Error("No data");
    }

  } catch (error) {
    console.log("Modo offline: Filtrando mockup de David");
    // Lógica de filtrado inteligente para el mockup
    results.value = mockData.filter(item => {
      const matchesType = searchType.value === 'usuarios' ? !!item.name : !!item.titulo;
      const text = (item.name || item.titulo || "").toLowerCase();
      const matchesQuery = text.includes(searchQuery.value.toLowerCase());
      const itemZona = item.zona_principal || item.zona || "";
      const matchesZona = !selectedZona.value || itemZona === selectedZona.value;
      
      return matchesType && matchesQuery && matchesZona;
    });
  } finally {
    pending.value = false;
  }
};

onMounted(() => {
  handleSearch();
});
</script>