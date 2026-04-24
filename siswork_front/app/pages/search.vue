<template>
  <div class="flex h-screen bg-gray-50 text-slate-900">
    <aside class="w-72 bg-white p-6 border-r border-slate-200 hidden md:block overflow-y-auto">
      <h3 class="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">🔍 Filtros</h3>
      
      <div class="mb-6">
        <label class="text-xs font-bold text-slate-400 uppercase block mb-3">Oficio</label>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="oficio in oficios" 
            :key="oficio"
            @click="selectedOficio = oficio"
            :class="selectedOficio === oficio ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 border-slate-200'"
            class="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
          >
            {{ oficio }}
          </button>
        </div>
      </div>

      <div class="mb-6">
        <label class="text-xs font-bold text-slate-400 uppercase block mb-3">Zona (La Paz)</label>
        <select v-model="selectedZona" class="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500">
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
          <div class="relative flex-1">
            <span class="absolute left-4 top-3 text-slate-400">🔍</span>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Busca por nombre, oficio o zona..." 
              class="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
          <button @click="handleSearch" class="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
            Buscar
          </button>
        </div>

        <div class="flex justify-between items-center mb-6">
          <h2 class="font-bold text-slate-800">Proveedores disponibles</h2>
          <span class="text-sm text-slate-500 font-medium">{{ results.length }} resultados encontrados</span>
        </div>

        <div v-if="results.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="p in results" 
            :key="p.name" 
            class="bg-white p-5 rounded-2xl border-2 border-transparent hover:border-blue-500 hover:shadow-xl transition-all group cursor-pointer"
          >
            <div class="flex items-center gap-4 mb-4">
              <div :style="{ backgroundColor: p.color }" class="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xl shadow-inner">
                {{ p.name.charAt(0) }}
              </div>
              <div>
                <h4 class="font-bold text-slate-800 group-hover:text-blue-600 transition">{{ p.name }}</h4>
                <p class="text-xs text-slate-400">{{ p.exp }} de experiencia</p>
                <span class="inline-block px-2 py-1 rounded-md text-[10px] font-bold mt-1" :style="{ backgroundColor: p.color + '15', color: p.color }">
                  {{ p.icon }} {{ p.oficio }}
                </span>
              </div>
            </div>
            
            <div class="flex items-center gap-2 mb-4">
              <span class="text-amber-400">★</span>
              <span class="text-sm font-bold text-slate-700">{{ p.rating }}</span>
              <span class="text-xs text-slate-400">({{ p.reviews }} reseñas)</span>
            </div>

            <div class="flex items-center justify-between text-xs font-semibold border-t pt-4 border-slate-50">
              <span class="bg-slate-100 px-2 py-1 rounded text-slate-600">📍 {{ p.zona }}</span>
              <span :class="p.disp ? 'text-green-500' : 'text-red-400'" class="flex items-center">
                <span :class="p.disp ? 'bg-green-500' : 'bg-red-400'" class="w-2 h-2 rounded-full mr-1.5"></span>
                {{ p.disp ? 'Disponible' : 'Ocupado' }}
              </span>
            </div>
          </div>
        </div>

        <div v-else class="py-20 text-center">
          <p class="text-slate-400 font-medium">😔 No se encontraron resultados para tu búsqueda.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// David, aquí usamos la lógica del mockup pero con TypeScript
interface Provider {
  name: string;
  oficio: string;
  zona: string;
  rating: number;
  reviews: number;
  icon: string;
  color: string;
  disp: boolean;
  exp: string;
}

const { apiAuth } = useApiAuth(); // Preparado para cuando Limber suba su parte

const searchQuery = ref('');
const selectedOficio = ref('Todos');
const selectedZona = ref('');
const results = ref<Provider[]>([]);

const oficios = ['Todos', '🔧 Plomería', '⚡ Electricidad', '🪵 Carpintería', '🧱 Albañilería', '🧹 Limpieza', '🎨 Pintura'];
const zonas = ['Miraflores', 'Sopocachi', 'San Pedro', 'Obrajes', 'Calacoto', 'Zona Sur', 'El Alto'];

// Datos locales (extraídos de tu mockup)
const providers: Provider[] = [
  {name:"Pedro Mamani",oficio:"Plomería",zona:"Miraflores",rating:4.9,reviews:47,icon:"🔧",color:"#2563eb",disp:true,exp:"8 años"},
  {name:"Luisa Quispe",oficio:"Limpieza",zona:"Sopocachi",rating:4.8,reviews:63,icon:"🧹",color:"#22c55e",disp:true,exp:"5 años"},
  {name:"Carlos Torrez",oficio:"Electricidad",zona:"San Pedro",rating:4.7,reviews:31,icon:"⚡",color:"#f59e0b",disp:false,exp:"12 años"},
  {name:"Ana Flores",oficio:"Limpieza",zona:"Obrajes",rating:4.9,reviews:89,icon:"🧹",color:"#22c55e",disp:true,exp:"3 años"}
];

const handleSearch = () => {
  // Filtro lógico local para mostrar progreso
  results.value = providers.filter(p => {
    const matchQuery = p.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchOficio = selectedOficio.value === 'Todos' || p.oficio === selectedOficio.value.split(' ')[1];
    const matchZona = !selectedZona.value || p.zona === selectedZona.value;
    return matchQuery && matchOficio && matchZona;
  });
};

// Cargar datos iniciales
onMounted(() => {
  results.value = providers;
});
</script>