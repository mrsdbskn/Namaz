<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased selection:bg-cyan-500/30">
    <div class="max-w-md mx-auto px-4 py-6 space-y-6 pb-24">
      
      <!-- Top Navigation / Title -->
      <header class="flex items-center justify-between border-b border-neutral-800/80 pb-4">
        <div>
          <h1 class="text-xl font-bold tracking-tight bg-gradient-to-r from-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            Kaza Namazı Takibi
          </h1>
          <p class="text-xs text-neutral-400 mt-0.5">Kişisel Kaza & Günlük Namaz Defteri</p>
        </div>
        <button 
          @click="showSettings = !showSettings"
          class="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all duration-200 active:scale-95 text-neutral-300"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      <!-- Calculator / Onboarding Modal or Drawer -->
      <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
        <section v-if="showSettings" class="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-xl space-y-4">
          <h2 class="text-sm font-semibold tracking-wide uppercase text-neutral-400">Hesaplama Parametreleri</h2>
          
          <div class="space-y-3 text-xs">
            <div>
              <label class="block text-neutral-400 mb-1">Doğum Tarihi</label>
              <input type="date" v-model="profile.dob" @change="autoSetBulug" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200 focus:border-cyan-500 focus:outline-none transition-colors" />
            </div>
            
            <div>
              <label class="block text-neutral-400 mb-1">Buluğ Çağı Başlangıç Tarihi</label>
              <input type="date" v-model="profile.bulugDate" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200 focus:border-cyan-500 focus:outline-none transition-colors" />
            </div>

            <div>
              <label class="block text-neutral-400 mb-1">Düzenli Namaza Başlama Tarihi</label>
              <input type="date" v-model="profile.startDate" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200 focus:border-cyan-500 focus:outline-none transition-colors" />
            </div>

            <button 
              @click="calculateInitialDebts"
              class="w-full py-2.5 mt-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-cyan-950 active:scale-98"
            >
              Kaza Borcunu Hesapla & Kaydet
            </button>
          </div>
        </section>
      </transition>

      <!-- Overview Status Bar -->
      <section class="grid grid-cols-3 gap-2.5">
        <div class="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/60 backdrop-blur-sm">
          <p class="text-[11px] text-neutral-400 uppercase tracking-wider">Kalan Gün</p>
          <p class="text-xl font-bold text-neutral-100 mt-1">{{ totalEstimatedDaysRemaining }}</p>
        </div>
        <div class="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/60 backdrop-blur-sm">
          <p class="text-[11px] text-neutral-400 uppercase tracking-wider">Kılınan Vakit</p>
          <p class="text-xl font-bold text-cyan-400 mt-1">{{ totalCompletedCount }}</p>
        </div>
        <div class="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/60 backdrop-blur-sm">
          <p class="text-[11px] text-neutral-400 uppercase tracking-wider">Kalan Vakit</p>
          <p class="text-xl font-bold text-rose-400 mt-1">{{ totalRemainingCount }}</p>
        </div>
      </section>

      <!-- Calendar View -->
      <section class="p-5 rounded-3xl bg-neutral-900/40 border border-neutral-800/60 backdrop-blur-md space-y-4">
        <!-- Month Header -->
        <div class="flex items-center justify-between">
          <button @click="prevMonth" class="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span class="text-sm font-semibold tracking-wide">{{ currentMonthName }} {{ currentYear }}</span>
          <button @click="nextMonth" class="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <!-- Day Names -->
        <div class="grid grid-cols-7 text-center text-[10px] font-medium text-neutral-500 uppercase tracking-wider">
          <span>Pt</span><span>Sa</span><span>Ça</span><span>Pe</span><span>Cu</span><span>Ct</span><span>Pz</span>
        </div>

        <!-- Grid Days -->
        <div class="grid grid-cols-7 gap-1.5">
          <div 
            v-for="(item, idx) in calendarDays" 
            :key="idx"
            @click="item.date && openDayModal(item.date)"
            :class="[
              'h-11 rounded-xl flex flex-col items-center justify-center relative cursor-pointer transition-all duration-200 active:scale-90 text-xs font-medium',
              !item.date ? 'invisible' : '',
              getDayStatusClasses(item.date)
            ]"
          >
            <span>{{ item.day }}</span>
            <span v-if="item.date && isToday(item.date)" class="w-1 h-1 rounded-full bg-cyan-400 absolute bottom-1.5"></span>
          </div>
        </div>

        <!-- Calendar Legend -->
        <div class="flex items-center justify-center gap-4 pt-2 text-[11px] text-neutral-400">
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></span> Eksik</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span> Kısmi</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-cyan-500/80 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></span> Tamam</span>
        </div>
      </section>

      <!-- Prayer Fast Counters -->
      <section class="space-y-3">
        <h3 class="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-1">Kaza Vakit Sayaçları</h3>
        <div class="grid grid-cols-2 gap-3">
          <div 
            v-for="prayer in prayerTypes" 
            :key="prayer.id"
            class="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800/70 hover:border-neutral-700/80 transition-all flex flex-col justify-between"
          >
            <div class="flex justify-between items-start">
              <span class="text-sm font-medium text-neutral-300">{{ prayer.name }}</span>
              <span class="text-[11px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                +{{ prayerDebts[prayer.id]?.completed || 0 }}
              </span>
            </div>
            <div class="mt-3 flex items-baseline justify-between">
              <span class="text-2xl font-bold tracking-tight text-neutral-100">
                {{ getRemainingForPrayer(prayer.id) }}
              </span>
              <div class="flex gap-1.5">
                <button 
                  @click="decrementKaza(prayer.id)" 
                  class="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 active:scale-90 text-neutral-300 flex items-center justify-center font-bold text-sm transition-all"
                >-</button>
                <button 
                  @click="incrementKaza(prayer.id)" 
                  class="w-8 h-8 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 active:scale-90 flex items-center justify-center font-bold text-sm transition-all"
                >+</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Day Logging Modal -->
      <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="selectedDate" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div class="flex justify-between items-center pb-2 border-b border-neutral-800">
              <div>
                <h4 class="font-semibold text-sm text-neutral-100">{{ selectedDate }}</h4>
                <p class="text-xs text-neutral-400">Vakitleri işaretleyin</p>
              </div>
              <button @click="selectedDate = null" class="text-neutral-400 hover:text-white p-1">✕</button>
            </div>

            <div class="grid grid-cols-2 gap-2.5">
              <button 
                v-for="p in prayerTypes" 
                :key="p.id"
                @click="toggleDayPrayer(p.id)"
                :class="[
                  'py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all active:scale-95',
                  isPrayerChecked(p.id) 
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' 
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                ]"
              >
                <span>{{ p.name }}</span>
                <span>{{ isPrayerChecked(p.id) ? '✓' : '○' }}</span>
              </button>
            </div>

            <button 
              @click="toggleAllForDay"
              class="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-medium transition-colors"
            >
              Hepsini İşaretle / Temizle
            </button>
          </div>
        </div>
      </transition>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const showSettings = ref(false)
const selectedDate = ref(null)

const prayerTypes = [
  { id: 'fajr', name: 'Sabah' },
  { id: 'dhuhr', name: 'Öğle' },
  { id: 'asr', name: 'İkindi' },
  { id: 'maghrib', name: 'Akşam' },
  { id: 'isha', name: 'Yatsı' },
  { id: 'witr', name: 'Vitir' }
]

const profile = ref({
  dob: '',
  bulugDate: '',
  startDate: ''
})

const prayerDebts = ref({
  fajr: { total: 0, completed: 0 },
  dhuhr: { total: 0, completed: 0 },
  asr: { total: 0, completed: 0 },
  maghrib: { total: 0, completed: 0 },
  isha: { total: 0, completed: 0 },
  witr: { total: 0, completed: 0 }
})

// Stores key-value: { "YYYY-MM-DD": ["fajr", "dhuhr", ...] }
const dayLogs = ref({})

// Calendar Navigation State
const viewDate = ref(new Date())

const currentYear = computed(() => viewDate.value.getFullYear())
const currentMonthName = computed(() => {
  return viewDate.value.toLocaleDateString('tr-TR', { month: 'long' })
})

const autoSetBulug = () => {
  if (profile.value.dob) {
    const d = new Date(profile.value.dob)
    d.setFullYear(d.getFullYear() + 13) // Default to 13 years old
    profile.value.bulugDate = d.toISOString().split('T')[0]
  }
}

const calculateInitialDebts = () => {
  if (!profile.value.bulugDate || !profile.value.startDate) return
  const b = new Date(profile.value.bulugDate)
  const s = new Date(profile.value.startDate)
  const diffDays = Math.max(0, Math.floor((s - b) / (1000 * 60 * 60 * 24)))

  prayerTypes.forEach(p => {
    prayerDebts.value[p.id].total = diffDays
  })
  saveToStorage()
  showSettings.value = false
}

const getRemainingForPrayer = (id) => {
  const p = prayerDebts.value[id] || { total: 0, completed: 0 }
  return Math.max(0, p.total - p.completed)
}

const totalRemainingCount = computed(() => {
  return prayerTypes.reduce((acc, p) => acc + getRemainingForPrayer(p.id), 0)
})

const totalCompletedCount = computed(() => {
  return prayerTypes.reduce((acc, p) => acc + (prayerDebts.value[p.id]?.completed || 0), 0)
})

const totalEstimatedDaysRemaining = computed(() => {
  const maxMissing = Math.max(...prayerTypes.map(p => getRemainingForPrayer(p.id)), 0)
  return maxMissing
})

const incrementKaza = (id) => {
  prayerDebts.value[id].completed += 1
  saveToStorage()
}

const decrementKaza = (id) => {
  if (prayerDebts.value[id].completed > 0) {
    prayerDebts.value[id].completed -= 1
    saveToStorage()
  }
}

// Calendar Logic
const calendarDays = computed(() => {
  const y = viewDate.value.getFullYear()
  const m = viewDate.value.getMonth()
  const firstDayIndex = (new Date(y, m, 1).getDay() + 6) % 7 // Monday = 0
  const daysInMonth = new Date(y, m + 1, 0).getDate()

  const days = []
  for (let i = 0; i < firstDayIndex; i++) {
    days.push({ day: '', date: null })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const formatted = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({ day: d, date: formatted })
  }
  return days
})

const prevMonth = () => {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1)
}

const isToday = (dateStr) => {
  const today = new Date().toISOString().split('T')[0]
  return dateStr === today
}

const getDayStatusClasses = (dateStr) => {
  if (!dateStr) return ''
  const logged = dayLogs.value[dateStr] || []
  const count = logged.length

  if (count === 6) {
    return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[inset_0_0_12px_rgba(6,182,212,0.15)]'
  }
  if (count > 0 && count < 6) {
    return 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[inset_0_0_12px_rgba(245,158,11,0.15)]'
  }
  // Default / Missing Day
  return 'bg-neutral-900/60 text-neutral-400 border border-rose-500/30 hover:border-neutral-700'
}

const openDayModal = (dateStr) => {
  selectedDate.value = dateStr
}

const isPrayerChecked = (prayerId) => {
  if (!selectedDate.value) return false
  return (dayLogs.value[selectedDate.value] || []).includes(prayerId)
}

const toggleDayPrayer = (prayerId) => {
  if (!selectedDate.value) return
  const current = dayLogs.value[selectedDate.value] || []
  if (current.includes(prayerId)) {
    dayLogs.value[selectedDate.value] = current.filter(id => id !== prayerId)
  } else {
    dayLogs.value[selectedDate.value] = [...current, prayerId]
  }
  saveToStorage()
}

const toggleAllForDay = () => {
  if (!selectedDate.value) return
  const current = dayLogs.value[selectedDate.value] || []
  if (current.length === 6) {
    dayLogs.value[selectedDate.value] = []
  } else {
    dayLogs.value[selectedDate.value] = prayerTypes.map(p => p.id)
  }
  saveToStorage()
}

const saveToStorage = () => {
  localStorage.setItem('kaza_profile', JSON.stringify(profile.value))
  localStorage.setItem('kaza_debts', JSON.stringify(prayerDebts.value))
  localStorage.setItem('kaza_daylogs', JSON.stringify(dayLogs.value))
}

onMounted(() => {
  const p = localStorage.getItem('kaza_profile')
  const d = localStorage.getItem('kaza_debts')
  const l = localStorage.getItem('kaza_daylogs')
  if (p) profile.value = JSON.parse(p)
  if (d) prayerDebts.value = JSON.parse(d)
  if (l) dayLogs.value = JSON.parse(l)
  if (!p) showSettings.value = true
})
</script>