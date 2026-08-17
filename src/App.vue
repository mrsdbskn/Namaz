<template>
  <div :class="['min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased', themeClasses.selection]">
    <div class="max-w-md mx-auto px-4 py-6 space-y-6 pb-28">
      
      <!-- Toast Notification -->
      <transition 
        enter-active-class="transition duration-300 ease-out" 
        enter-from-class="opacity-0 -translate-y-4 scale-95" 
        enter-to-class="opacity-100 translate-y-0 scale-100" 
        leave-active-class="transition duration-200 ease-in" 
        leave-from-class="opacity-100 translate-y-0 scale-100" 
        leave-to-class="opacity-0 -translate-y-4 scale-95"
      >
        <div 
          v-if="toastMessage" 
          :class="['fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[92%] bg-neutral-900/95 border text-xs px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center justify-between gap-3', themeClasses.border, themeClasses.shadow]"
        >
          <div class="flex items-center gap-2.5">
            <span :class="['w-2 h-2 rounded-full animate-ping', themeClasses.bgDot]"></span>
            <span class="font-medium text-neutral-100 leading-snug">{{ toastMessage }}</span>
          </div>
          <button @click="toastMessage = ''" class="text-neutral-400 hover:text-white text-sm px-1 py-0.5">✕</button>
        </div>
      </transition>

      <!-- Confirmation Modal for Safe Resets -->
      <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="confirmDialog.show" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-lg font-bold">
                ⚠️
              </div>
              <div>
                <h3 class="font-semibold text-sm text-neutral-100">{{ confirmDialog.title }}</h3>
                <p class="text-xs text-neutral-400 mt-0.5">{{ confirmDialog.message }}</p>
              </div>
            </div>

            <div class="flex gap-2.5 pt-2">
              <button 
                @click="confirmDialog.show = false" 
                class="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-xl transition-colors"
              >
                {{ t('confirmCancelBtn') }}
              </button>
              <button 
                @click="executeConfirmedAction" 
                class="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-rose-950 transition-colors"
              >
                {{ t('confirmExecuteBtn') }}
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Top Navigation & Actions -->
      <header class="flex items-center justify-between border-b border-neutral-800/80 pb-4">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-bold tracking-tight bg-gradient-to-r from-neutral-100 to-neutral-400 bg-clip-text text-transparent">
              {{ t('appTitle') }}
            </h1>
            <!-- Streak Badge -->
            <div 
              v-if="streakInfo.current > 0" 
              class="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold flex items-center gap-1 animate-pulse"
              :title="t('streakTitle', { n: streakInfo.best })"
            >
              <span>{{ t('streakBadge', { n: streakInfo.current }) }}</span>
            </div>
          </div>
          <p class="text-xs text-neutral-400 mt-0.5">{{ t('appSubtitle') }}</p>
        </div>

        <div class="flex items-center gap-1.5">
          <!-- Language Selector Quick Button -->
          <div class="relative">
            <select 
              v-model="currentLang" 
              class="appearance-none bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-xs py-2 pl-2 pr-5 rounded-xl focus:outline-none focus:border-cyan-500 cursor-pointer transition-colors"
            >
              <option v-for="l in availableLanguages" :key="l.code" :value="l.code">
                {{ l.flag }} {{ l.code.toUpperCase() }}
              </option>
            </select>
            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5 text-neutral-500 text-[7px]">▼</span>
          </div>

          <!-- Qibla Compass Button -->
          <button 
            @click="openQiblaModal"
            class="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all duration-200 active:scale-95 text-neutral-300"
            :title="t('qiblaTitle')"
          >
            <span class="text-base">🧭</span>
          </button>

          <!-- Range Batch Tool Toggle -->
          <button 
            @click="showRangeModal = true"
            class="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all duration-200 active:scale-95 text-neutral-300"
            :title="t('rangeModalTitle')"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>

          <!-- Settings Button -->
          <button 
            @click="showSettings = !showSettings"
            class="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all duration-200 active:scale-95 text-neutral-300"
            :title="t('settingsTitle')"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Prayer Times Banner Card with Live Kerahat Status -->
      <section class="p-4 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-md space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-base">🕌</span>
            <div>
              <span class="text-xs font-semibold text-neutral-200">{{ t('todaysPrayerTimes') }}</span>
              <div class="flex items-center gap-1.5 mt-0.5">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span :class="['text-[11px] font-medium', themeClasses.text]">
                  {{ t('nextPrayerRemaining', { name: nextPrayerInfo.nextPrayer.name, time: nextPrayerInfo.remainingStr }) }}
                </span>
              </div>
            </div>
          </div>

          <!-- City Selector -->
          <div class="relative">
            <select 
              v-model="selectedCity" 
              class="appearance-none bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs py-1 pl-2.5 pr-6 rounded-xl focus:outline-none focus:border-cyan-500 cursor-pointer transition-colors"
            >
              <option v-for="c in cityList" :key="c.name" :value="c.name">{{ c.name }}</option>
            </select>
            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-500 text-[8px]">▼</span>
          </div>
        </div>

        <!-- Prayer Times Strip -->
        <div class="grid grid-cols-6 gap-1 pt-1 text-center">
          <div 
            v-for="p in prayerTimeItems" 
            :key="p.id"
            :class="[
              'p-2 rounded-xl transition-all flex flex-col items-center justify-center',
              p.isNext 
                ? `${themeClasses.bgSoft} border ${themeClasses.border} ${themeClasses.text} font-bold shadow-sm` 
                : 'bg-neutral-950/60 border border-neutral-800/40 text-neutral-400'
            ]"
          >
            <span class="text-[10px] uppercase font-medium">{{ p.label }}</span>
            <span class="text-xs mt-0.5 tracking-tight font-semibold">{{ p.time }}</span>
          </div>
        </div>

        <!-- Kerahat Vakti Live Alert / Reassurance Banner -->
        <div class="pt-1">
          <!-- Active Kerahat Alert -->
          <div 
            v-if="kerahatInfo.isKerahat" 
            @click="showKerahatModal = true"
            class="px-3 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between gap-2 cursor-pointer hover:bg-amber-500/20 transition-all"
          >
            <div class="flex items-center gap-2">
              <span class="text-sm animate-bounce">⚠️</span>
              <div>
                <span class="font-bold">{{ t('kerahatWarningTitle', { name: getLocalizedKerahatName(kerahatInfo.currentWindow.id) }) }}</span>
                <p class="text-[10px] text-amber-200/80 mt-0.5">
                  {{ t('kerahatWarningDesc', { start: kerahatInfo.currentWindow.startStr, end: kerahatInfo.currentWindow.endStr, min: kerahatInfo.remainingMinutes }) }}
                </p>
              </div>
            </div>
            <span class="text-[10px] underline text-amber-300/80">{{ t('kerahatDetailLink') }}</span>
          </div>

          <!-- Outside Kerahat (Safe Time) Reassurance -->
          <div 
            v-else 
            @click="showKerahatModal = true"
            class="px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center justify-between cursor-pointer hover:bg-emerald-500/15 transition-all"
          >
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span class="font-medium">{{ t('kerahatSafeTime') }}</span>
              <span class="text-[10px] text-emerald-400/70">
                ({{ t('kerahatNext', { name: getLocalizedKerahatShort(kerahatInfo.nextWindow.id), time: kerahatInfo.nextWindow.startStr }) }})
              </span>
            </div>
            <span class="text-[10px] text-emerald-300/70">{{ t('kerahatInfoBtn') }}</span>
          </div>
        </div>
      </section>

      <!-- Qibla Compass Modal -->
      <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="showQiblaModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div class="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-5 space-y-4 shadow-2xl text-center my-auto max-h-[92vh] overflow-y-auto">
            <div class="flex justify-between items-center pb-2 border-b border-neutral-800">
              <div class="text-left">
                <h4 class="font-semibold text-sm text-neutral-100">{{ t('qiblaTitle') }}</h4>
                <p class="text-xs text-neutral-400">{{ t('qiblaSubtitle', { city: selectedCity }) }}</p>
              </div>
              <button @click="closeQiblaModal" class="text-neutral-400 hover:text-white p-1">✕</button>
            </div>

            <!-- Qibla Angle & Alignment Badge -->
            <div class="space-y-1">
              <div class="text-2xl font-bold text-neutral-100 tracking-tight flex items-center justify-center gap-2">
                <span>{{ cityQiblaAngle }}°</span>
                <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {{ getCompassDirectionLabel(cityQiblaAngle) }}
                </span>
              </div>
              <p :class="['text-xs font-semibold transition-colors duration-200', isQiblaAligned ? 'text-emerald-400 animate-pulse' : 'text-neutral-400']">
                {{ isQiblaAligned ? t('qiblaAligned') : t('qiblaNotAligned') }}
              </p>
            </div>

            <!-- Interactive Compass Rose Container -->
            <div class="relative w-56 h-56 mx-auto flex items-center justify-center">
              <!-- Outer Glowing Ring -->
              <div 
                :class="[
                  'absolute inset-0 rounded-full border-2 transition-all duration-300',
                  isQiblaAligned ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.5)]' : 'border-neutral-800'
                ]"
              ></div>

              <!-- Rotating Compass Dial -->
              <div 
                class="w-48 h-48 rounded-full bg-neutral-950 border border-neutral-800/80 relative flex items-center justify-center transition-transform duration-150 ease-out shadow-inner select-none"
                :style="{ transform: `rotate(${-effectiveHeading}deg)` }"
              >
                <!-- Cardinal Points -->
                <div class="absolute top-1.5 flex flex-col items-center">
                  <span class="text-[11px] font-bold text-rose-500 tracking-wider">{{ t('compassNorth') }}</span>
                  <div class="w-1.5 h-1.5 border-l border-t border-rose-500 rotate-45 -mt-0.5"></div>
                </div>
                <span class="absolute bottom-2 text-[11px] font-semibold text-neutral-500">{{ t('compassSouth') }}</span>
                <span class="absolute right-2 text-[11px] font-semibold text-neutral-500">{{ t('compassEast') }}</span>
                <span class="absolute left-2 text-[11px] font-semibold text-neutral-500">{{ t('compassWest') }}</span>

                <!-- Fixed Crosshair Lines -->
                <div class="absolute w-full h-[1px] bg-neutral-900/90"></div>
                <div class="absolute h-full w-[1px] bg-neutral-900/90"></div>

                <!-- Sun Position Marker on Dial (☀️) -->
                <div 
                  class="absolute w-full h-full flex items-start justify-center pointer-events-none"
                  :style="{ transform: `rotate(${solarPosition.azimuth}deg)` }"
                  :title="`${t('qiblaSunAzimuthLabel')}: ${solarPosition.azimuth}°`"
                >
                  <div class="flex flex-col items-center -mt-2.5">
                    <span :class="['text-sm transition-transform duration-300', solarPosition.isDay ? 'filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse' : 'opacity-40 grayscale']">
                      ☀️
                    </span>
                    <span class="w-1 h-3 bg-gradient-to-t from-transparent to-amber-400/80 rounded-full"></span>
                  </div>
                </div>

                <!-- Qibla Marker Arrow & Kaaba Icon on Compass Ring -->
                <div 
                  class="absolute w-full h-full flex items-start justify-center pointer-events-none"
                  :style="{ transform: `rotate(${cityQiblaAngle}deg)` }"
                >
                  <div class="flex flex-col items-center -mt-3.5">
                    <span class="text-lg animate-bounce drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]">🕋</span>
                    <span class="w-1.5 h-6 bg-gradient-to-t from-transparent to-emerald-400 rounded-full"></span>
                  </div>
                </div>
              </div>

              <!-- Center Needle Pivot -->
              <div class="absolute w-4 h-4 rounded-full bg-neutral-800 border-2 border-neutral-600 shadow-md"></div>
              <div class="absolute -top-2 w-1.5 h-3.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
            </div>

            <!-- Heading & Calibration Status Bar -->
            <div class="flex items-center justify-between px-3 py-1.5 bg-neutral-950/70 border border-neutral-800/80 rounded-xl text-xs">
              <div class="flex items-center gap-1.5">
                <span class="text-neutral-500">{{ t('qiblaCurrentHeading') }}:</span>
                <span class="font-mono font-semibold text-neutral-200">{{ Math.round(effectiveHeading) }}°</span>
                <span class="text-[11px] text-neutral-400">({{ getCompassDirectionLabel(effectiveHeading) }})</span>
              </div>
              <div class="flex items-center gap-1">
                <span v-if="compassOffset !== 0" class="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                  {{ compassOffset > 0 ? '+' : '' }}{{ compassOffset }}°
                </span>
                <span v-else class="text-[10px] text-neutral-500 font-mono">0°</span>
              </div>
            </div>

            <!-- Quick Calibration Action -->
            <button 
              @click="calibrateFacingAsNorth"
              class="w-full py-2 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 border border-neutral-700/70 text-neutral-200 text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              {{ t('qiblaSetNorthBtn') }}
            </button>

            <!-- Collapsible Calibration & Tools Section -->
            <div class="border border-neutral-800 rounded-2xl bg-neutral-950/50 overflow-hidden text-left">
              <button 
                @click="showCalibrationPanel = !showCalibrationPanel"
                class="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-medium text-neutral-300 hover:text-white transition-colors"
              >
                <span class="flex items-center gap-1.5">
                  <span>⚙️</span>
                  <span>{{ t('qiblaCalibrateToggle') }}</span>
                </span>
                <span class="text-neutral-500 transform transition-transform duration-200" :class="{ 'rotate-180': showCalibrationPanel }">▼</span>
              </button>

              <div v-show="showCalibrationPanel" class="px-3.5 pb-3.5 pt-1 border-t border-neutral-800/80 space-y-3">
                <!-- Manual Offset Steppers -->
                <div>
                  <div class="flex justify-between items-center text-[11px] text-neutral-400 mb-1.5">
                    <span>{{ t('qiblaOffsetLabel') }}</span>
                    <span class="font-mono text-cyan-400">{{ compassOffset > 0 ? '+' : '' }}{{ compassOffset }}°</span>
                  </div>
                  
                  <div class="grid grid-cols-5 gap-1">
                    <button @click="adjustCompassOffset(-5)" class="py-1 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs font-mono text-neutral-300 border border-neutral-700/60">-5°</button>
                    <button @click="adjustCompassOffset(-1)" class="py-1 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs font-mono text-neutral-300 border border-neutral-700/60">-1°</button>
                    <button @click="resetCompassOffset" class="py-1 bg-neutral-800/80 hover:bg-rose-900/40 text-neutral-400 hover:text-rose-300 rounded-lg text-[10px] border border-neutral-700/60 flex items-center justify-center" :title="t('qiblaResetOffsetBtn')">0°</button>
                    <button @click="adjustCompassOffset(1)" class="py-1 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs font-mono text-neutral-300 border border-neutral-700/60">+1°</button>
                    <button @click="adjustCompassOffset(5)" class="py-1 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs font-mono text-neutral-300 border border-neutral-700/60">+5°</button>
                  </div>

                  <!-- Slider -->
                  <div class="mt-2 flex items-center gap-2">
                    <span class="text-[10px] text-neutral-500 font-mono">-180°</span>
                    <input 
                      type="range" 
                      min="-180" 
                      max="180" 
                      step="1" 
                      :value="compassOffset" 
                      @input="setCompassOffset($event.target.value)"
                      class="w-full accent-cyan-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                    <span class="text-[10px] text-neutral-500 font-mono">+180°</span>
                  </div>
                </div>

                <!-- Sun Position / Azimuth Info Card -->
                <div class="p-2.5 bg-neutral-900/80 border border-amber-500/20 rounded-xl space-y-1">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-medium text-amber-300 flex items-center gap-1">
                      <span>☀️</span> {{ t('qiblaSunAzimuthLabel') }}:
                    </span>
                    <span class="font-mono text-amber-200 font-semibold">{{ solarPosition.azimuth }}°</span>
                  </div>
                  <div class="flex items-center justify-between text-[11px] text-neutral-400">
                    <span>{{ solarPosition.isDay ? `☀️ ${t('qiblaSunDaytime')} (${solarPosition.altitude}°)` : `🌙 ${t('qiblaSunNighttime')}` }}</span>
                    <span>{{ getCompassDirectionLabel(solarPosition.azimuth) }}</span>
                  </div>
                  <p class="text-[10px] text-neutral-400 leading-tight pt-1 border-t border-neutral-800/80">
                    {{ t('qiblaSunGuideText') }}
                  </p>
                </div>

                <!-- Figure-8 Guide Trigger Button -->
                <button 
                  @click="showFigure8Modal = true"
                  class="w-full py-2 px-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/70 rounded-xl text-xs text-neutral-300 flex items-center justify-between transition-colors"
                >
                  <span class="flex items-center gap-1.5">
                    <span>🧲</span>
                    <span>{{ t('qiblaFigure8Btn') }}</span>
                  </span>
                  <span class="text-neutral-500 text-[11px]">→</span>
                </button>
              </div>
            </div>

            <!-- Compass Sensor Status / Fallback Notice -->
            <div class="pt-1 text-xs text-neutral-400">
              <button 
                v-if="!compassActive" 
                @click="requestCompassPermission"
                :class="['w-full py-2.5 text-white font-medium rounded-xl text-xs transition-all shadow-md', themeClasses.gradientBtn]"
              >
                {{ t('qiblaStartBtn') }}
              </button>
              <p v-else class="text-[11px] text-neutral-500">
                {{ t('qiblaActiveInfo') }}
              </p>
            </div>
          </div>
        </div>
      </transition>

      <!-- Sensor Calibration (Figure-8) Help Modal -->
      <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="showFigure8Modal" class="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div class="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-2xl text-center">
            <div class="flex justify-between items-center pb-2 border-b border-neutral-800">
              <div class="text-left">
                <h4 class="font-semibold text-sm text-neutral-100 flex items-center gap-1.5">
                  <span>🧲</span> {{ t('qiblaFigure8ModalTitle') }}
                </h4>
                <p class="text-xs text-neutral-400">{{ t('qiblaFigure8ModalSubtitle') }}</p>
              </div>
              <button @click="showFigure8Modal = false" class="text-neutral-400 hover:text-white p-1">✕</button>
            </div>

            <!-- Animated Figure-8 SVG Graphic -->
            <div class="relative w-48 h-28 mx-auto flex items-center justify-center bg-neutral-950/80 border border-neutral-800/80 rounded-2xl p-2 overflow-hidden shadow-inner">
              <svg viewBox="0 0 200 100" class="w-full h-full">
                <!-- Infinity Track Background -->
                <path 
                  d="M 50 50 C 50 20, 10 20, 10 50 C 10 80, 50 80, 100 50 C 150 20, 190 20, 190 50 C 190 80, 150 80, 100 50 Z" 
                  fill="none" 
                  stroke="rgba(255, 255, 255, 0.15)" 
                  stroke-width="6" 
                  stroke-linecap="round"
                />
                <!-- Animated Glowing Infinity Stroke -->
                <path 
                  d="M 50 50 C 50 20, 10 20, 10 50 C 10 80, 50 80, 100 50 C 150 20, 190 20, 190 50 C 190 80, 150 80, 100 50 Z" 
                  fill="none" 
                  stroke="url(#figure8Glow)" 
                  stroke-width="3" 
                  stroke-dasharray="25 175" 
                  stroke-linecap="round"
                >
                  <animate attributeName="stroke-dashoffset" from="0" to="-200" dur="3s" repeatCount="indefinite" />
                </path>
                <defs>
                  <linearGradient id="figure8Glow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#06b6d4" />
                    <stop offset="50%" stop-color="#10b981" />
                    <stop offset="100%" stop-color="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
              <!-- Center Phone / Gesture Badge -->
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span class="text-2xl animate-bounce">📱</span>
              </div>
            </div>

            <!-- Steps List -->
            <div class="space-y-2.5 text-left text-xs">
              <div class="flex items-start gap-2.5 p-2 bg-neutral-950/60 rounded-xl border border-neutral-800/60">
                <span class="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
                <p class="text-neutral-300 leading-tight">{{ t('qiblaFigure8Step1') }}</p>
              </div>
              <div class="flex items-start gap-2.5 p-2 bg-neutral-950/60 rounded-xl border border-neutral-800/60">
                <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
                <p class="text-neutral-300 leading-tight">{{ t('qiblaFigure8Step2') }}</p>
              </div>
              <div class="flex items-start gap-2.5 p-2 bg-neutral-950/60 rounded-xl border border-neutral-800/60">
                <span class="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
                <p class="text-neutral-300 leading-tight">{{ t('qiblaFigure8Step3') }}</p>
              </div>
            </div>

            <button 
              @click="showFigure8Modal = false"
              :class="['w-full py-2.5 text-white font-medium rounded-xl text-xs transition-all shadow-md', themeClasses.gradientBtn]"
            >
              {{ t('qiblaFigure8DoneBtn') }}
            </button>
          </div>
        </div>
      </transition>

      <!-- Kerahat Vakitleri Detail Modal -->
      <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="showKerahatModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div class="flex justify-between items-center pb-2 border-b border-neutral-800">
              <div>
                <h4 class="font-semibold text-sm text-neutral-100">{{ t('kerahatGuideTitle') }}</h4>
                <p class="text-xs text-neutral-400">{{ t('kerahatGuideSubtitle') }}</p>
              </div>
              <button @click="showKerahatModal = false" class="text-neutral-400 hover:text-white p-1">✕</button>
            </div>

            <div class="space-y-3 text-xs">
              <div 
                v-for="win in kerahatInfo.allWindows" 
                :key="win.id"
                class="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1"
              >
                <div class="flex items-center justify-between font-semibold">
                  <span class="text-neutral-200">{{ getLocalizedKerahatName(win.id) }}</span>
                  <span class="text-amber-400 font-mono">{{ win.startStr }} - {{ win.endStr }}</span>
                </div>
                <p class="text-[11px] text-neutral-400 leading-relaxed">{{ getLocalizedKerahatDesc(win.id) }}</p>
              </div>
            </div>

            <div class="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 text-[11px] text-neutral-400 leading-relaxed">
              {{ t('kerahatFiqhNote') }}
            </div>
          </div>
        </div>
      </transition>

      <!-- Calculator / Settings Modal -->
      <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
        <section v-if="showSettings" class="p-5 rounded-3xl bg-neutral-900/95 border border-neutral-800 shadow-2xl space-y-5">
          <div class="flex items-center justify-between border-b border-neutral-800/70 pb-3">
            <h2 class="text-sm font-semibold tracking-wide uppercase text-neutral-200">{{ t('settingsTitle') }}</h2>
            <button @click="showSettings = false" class="text-neutral-400 hover:text-white text-xs p-1">✕</button>
          </div>

          <!-- Language Selection -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold text-neutral-300">{{ t('languageLabel') }}</label>
            <div class="grid grid-cols-3 gap-2">
              <button 
                v-for="l in availableLanguages" 
                :key="l.code"
                @click="currentLang = l.code"
                :class="[
                  'py-2.5 px-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all active:scale-95',
                  currentLang === l.code 
                    ? 'border-cyan-500/60 bg-neutral-800 text-white shadow-md' 
                    : 'border-neutral-800/80 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                ]"
              >
                <span>{{ l.flag }}</span>
                <span>{{ l.name }}</span>
              </button>
            </div>
          </div>

          <!-- Color Theme Selection -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold text-neutral-300">{{ t('themeLabel') }}</label>
            <div class="grid grid-cols-5 gap-2">
              <button 
                v-for="th in availableThemes" 
                :key="th.id"
                @click="currentTheme = th.id"
                :class="[
                  'py-2 px-1 rounded-xl border text-[11px] font-medium flex flex-col items-center gap-1.5 transition-all active:scale-95',
                  currentTheme === th.id 
                    ? 'border-neutral-200 bg-neutral-800 text-white shadow-md' 
                    : 'border-neutral-800/80 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                ]"
              >
                <span class="w-4 h-4 rounded-full" :style="{ backgroundColor: th.color }"></span>
                <span>{{ th.name }}</span>
              </button>
            </div>
          </div>
          
          <!-- Parameters -->
          <div class="space-y-3.5 text-xs pt-1 border-t border-neutral-800/70">
            <h3 class="font-semibold text-neutral-300 text-xs">{{ t('paramsTitle') }}</h3>

            <div>
              <label class="block text-neutral-400 mb-1">{{ t('dobLabel') }}</label>
              <input type="date" v-model="profile.dob" @change="autoSetBulug" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200 focus:border-cyan-500 focus:outline-none transition-colors" />
            </div>
            
            <div>
              <label class="block text-neutral-400 mb-1">{{ t('bulugLabel') }}</label>
              <input type="date" v-model="profile.bulugDate" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200 focus:border-cyan-500 focus:outline-none transition-colors" />
            </div>

            <div>
              <label class="block text-neutral-400 mb-1">{{ t('regularStartLabel') }}</label>
              <div class="flex gap-2">
                <input 
                  type="date" 
                  v-model="profile.startDate" 
                  class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200 focus:border-cyan-500 focus:outline-none transition-colors" 
                />
                <button
                  type="button"
                  @click="handleManualAutoComplete"
                  :disabled="!profile.startDate"
                  :class="['whitespace-nowrap px-3 py-2 border font-medium rounded-xl text-xs transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed', themeClasses.bgSoft, themeClasses.text, themeClasses.border]"
                  :title="t('quickFillBtnTitle')"
                >
                  <span>{{ t('quickFillBtn') }}</span>
                </button>
              </div>
              <p class="text-[11px] text-neutral-500 mt-1">
                {{ t('regularStartHint') }}
              </p>
            </div>

            <button 
              @click="calculateInitialDebts"
              :class="['w-full py-2.5 text-white font-medium rounded-xl transition-all duration-200 shadow-lg active:scale-98', themeClasses.gradientBtn, themeClasses.shadow]"
            >
              {{ t('calcSaveBtn') }}
            </button>
          </div>

          <!-- Backup & Restore Section -->
          <div class="space-y-2.5 pt-3 border-t border-neutral-800/70 text-xs">
            <h3 class="font-semibold text-neutral-300">{{ t('backupTitle') }}</h3>
            <p class="text-[11px] text-neutral-500">{{ t('backupSubtitle') }}</p>
            <div class="grid grid-cols-2 gap-2">
              <button 
                @click="exportDataBackup" 
                class="py-2.5 px-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-neutral-200 font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>{{ t('exportBackupBtn') }}</span>
              </button>
              <label class="py-2.5 px-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-neutral-200 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center">
                <span>{{ t('importBackupBtn') }}</span>
                <input type="file" accept=".json" @change="importDataBackup" class="hidden" />
              </label>
            </div>
          </div>

          <!-- Individual Reset Section (Danger Zone) -->
          <div class="space-y-2 pt-3 border-t border-rose-900/40 text-xs">
            <h3 class="font-semibold text-rose-400 flex items-center gap-1.5">
              <span>⚠️</span> {{ t('dangerZoneTitle') }}
            </h3>
            <div class="grid grid-cols-2 gap-2">
              <button 
                @click="promptReset('calendar')"
                class="py-2 px-2.5 bg-neutral-950 hover:bg-rose-950/30 border border-neutral-800 hover:border-rose-800/50 text-neutral-300 hover:text-rose-300 rounded-xl text-[11px] font-medium transition-colors"
              >
                {{ t('resetCalendarBtn') }}
              </button>
              <button 
                @click="promptReset('counters')"
                class="py-2 px-2.5 bg-neutral-950 hover:bg-rose-950/30 border border-neutral-800 hover:border-rose-800/50 text-neutral-300 hover:text-rose-300 rounded-xl text-[11px] font-medium transition-colors"
              >
                {{ t('resetCountersBtn') }}
              </button>
              <button 
                @click="promptReset('profile')"
                class="py-2 px-2.5 bg-neutral-950 hover:bg-rose-950/30 border border-neutral-800 hover:border-rose-800/50 text-neutral-300 hover:text-rose-300 rounded-xl text-[11px] font-medium transition-colors"
              >
                {{ t('resetParamsBtn') }}
              </button>
              <button 
                @click="promptReset('all')"
                class="py-2 px-2.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 rounded-xl text-[11px] font-semibold transition-colors"
              >
                {{ t('resetAllBtn') }}
              </button>
            </div>
          </div>
        </section>
      </transition>

      <!-- Date Range Batch Modal -->
      <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="showRangeModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div class="flex justify-between items-center pb-2 border-b border-neutral-800">
              <div>
                <h4 class="font-semibold text-sm text-neutral-100">{{ t('rangeModalTitle') }}</h4>
                <p class="text-xs text-neutral-400">{{ t('rangeModalSubtitle') }}</p>
              </div>
              <button @click="showRangeModal = false" class="text-neutral-400 hover:text-white p-1">✕</button>
            </div>

            <div class="space-y-3 text-xs">
              <div>
                <label class="block text-neutral-400 mb-1">{{ t('startDateLabel') }}</label>
                <input type="date" v-model="rangeForm.start" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200 focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label class="block text-neutral-400 mb-1">{{ t('endDateLabel') }}</label>
                <input type="date" v-model="rangeForm.end" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200 focus:border-cyan-500 focus:outline-none" />
              </div>
            </div>

            <div class="space-y-2 pt-2">
              <button 
                @click="applyRangeAction('fill')"
                :class="['w-full py-2.5 text-white font-medium rounded-xl text-xs transition-all shadow-md active:scale-98', themeClasses.gradientBtn]"
              >
                {{ t('rangeFillBtn') }}
              </button>
              <button 
                @click="applyRangeAction('clear')"
                class="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium rounded-xl text-xs transition-colors"
              >
                {{ t('rangeClearBtn') }}
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Overview Cards -->
      <section class="grid grid-cols-3 gap-2.5">
        <div class="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/60 backdrop-blur-sm">
          <p class="text-[11px] text-neutral-400 uppercase tracking-wider">{{ t('remainingDays') }}</p>
          <p class="text-xl font-bold text-neutral-100 mt-1">{{ totalEstimatedDaysRemaining }}</p>
        </div>
        <div class="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/60 backdrop-blur-sm">
          <p class="text-[11px] text-neutral-400 uppercase tracking-wider">{{ t('completedPrayers') }}</p>
          <p :class="['text-xl font-bold mt-1', themeClasses.text]">{{ totalCompletedCount }}</p>
        </div>
        <div class="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/60 backdrop-blur-sm">
          <p class="text-[11px] text-neutral-400 uppercase tracking-wider">{{ t('remainingPrayers') }}</p>
          <p class="text-xl font-bold text-rose-400 mt-1">{{ totalRemainingCount }}</p>
        </div>
      </section>

      <!-- Overall Completion Progress Bar Strip -->
      <section class="p-3.5 rounded-2xl bg-neutral-900/40 border border-neutral-800/60 backdrop-blur-sm space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="text-neutral-400 font-medium">{{ t('overallProgress') }}</span>
          <span :class="['font-bold', themeClasses.text]">{{ t('overallCompleted', { rate: overallCompletionRate }) }}</span>
        </div>
        <div class="w-full bg-neutral-950 rounded-full h-2 overflow-hidden border border-neutral-800/50">
          <div 
            :class="['h-full transition-all duration-500 rounded-full', themeClasses.gradientBtn]" 
            :style="{ width: overallCompletionRate + '%' }"
          ></div>
        </div>
      </section>

      <!-- Minimalist Trend Chart Section (Pure SVG) -->
      <section class="p-5 rounded-3xl bg-neutral-900/40 border border-neutral-800/60 backdrop-blur-md space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider">{{ t('trendChartTitle') }}</h3>
            <p class="text-[11px] text-neutral-500 mt-0.5">
              {{ chartPeriod === 'weekly' ? t('weeklyPerformance') : t('monthlyPerformance') }}
            </p>
          </div>

          <!-- View Toggle -->
          <div class="flex p-1 bg-neutral-950/80 border border-neutral-800 rounded-xl">
            <button 
              @click="chartPeriod = 'weekly'"
              :class="[
                'px-2.5 py-1 text-[10px] font-medium rounded-lg transition-all duration-200',
                chartPeriod === 'weekly' ? `${themeClasses.bgSoft} ${themeClasses.text} shadow-sm font-semibold` : 'text-neutral-400 hover:text-neutral-200'
              ]"
            >
              {{ t('weekly') }}
            </button>
            <button 
              @click="chartPeriod = 'monthly'"
              :class="[
                'px-2.5 py-1 text-[10px] font-medium rounded-lg transition-all duration-200',
                chartPeriod === 'monthly' ? `${themeClasses.bgSoft} ${themeClasses.text} shadow-sm font-semibold` : 'text-neutral-400 hover:text-neutral-200'
              ]"
            >
              {{ t('monthly') }}
            </button>
          </div>
        </div>

        <!-- Metric Stat Strip -->
        <div class="flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-950/50 border border-neutral-800/40 text-xs">
          <div class="flex items-center gap-2">
            <span :class="['w-2 h-2 rounded-full animate-pulse', themeClasses.bgDot]"></span>
            <span class="text-neutral-400">{{ t('total') }}</span>
            <span class="font-semibold text-neutral-200">{{ periodStats.total }} {{ t('vakitUnit') }}</span>
          </div>
          <div class="text-neutral-400">
            {{ t('successRate') }} <span :class="['font-semibold', themeClasses.text]">{{ periodStats.rate }}%</span>
          </div>
        </div>

        <!-- SVG Visual Chart Container -->
        <div class="pt-2">
          <svg class="w-full h-36 overflow-visible" viewBox="0 0 320 120">
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" :stop-color="themeHexColor" stop-opacity="0.9" />
                <stop offset="100%" :stop-color="themeHexColor" stop-opacity="0.25" />
              </linearGradient>
              <linearGradient id="barGradientFull" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="1" />
                <stop offset="100%" stop-color="#0284c7" stop-opacity="0.5" />
              </linearGradient>
            </defs>

            <!-- Guide Grid Lines (0, 3, 6 prayers) -->
            <line x1="0" y1="10" x2="320" y2="10" stroke="#262626" stroke-dasharray="3 3" stroke-width="1" />
            <line x1="0" y1="55" x2="320" y2="55" stroke="#262626" stroke-dasharray="3 3" stroke-width="1" />
            <line x1="0" y1="100" x2="320" y2="100" stroke="#333333" stroke-width="1" />

            <!-- Y-Axis Labels -->
            <text x="318" y="14" fill="#525252" font-size="8" text-anchor="end">6</text>
            <text x="318" y="59" fill="#525252" font-size="8" text-anchor="end">3</text>
            <text x="318" y="98" fill="#525252" font-size="8" text-anchor="end">0</text>

            <!-- Dynamic Bars -->
            <g v-for="(item, idx) in chartData" :key="idx">
              <!-- Background Slot Bar -->
              <rect 
                :x="item.x" 
                y="10" 
                :width="item.width" 
                height="90" 
                rx="3" 
                fill="#171717" 
                class="transition-colors duration-200 hover:fill-neutral-800"
              />
              
              <!-- Value Bar with Height Animation -->
              <rect 
                :x="item.x" 
                :y="100 - item.barHeight" 
                :width="item.width" 
                :height="Math.max(item.barHeight, item.count > 0 ? 4 : 0)" 
                rx="3" 
                :fill="item.count === 6 ? 'url(#barGradientFull)' : 'url(#barGradient)'"
                class="transition-all duration-300 ease-out cursor-pointer hover:brightness-125"
                @click="openDayModal(item.dateStr)"
              />

              <!-- X-Axis Labels (Weekly: all days; Monthly: periodic) -->
              <text 
                v-if="item.showLabel" 
                :x="item.x + (item.width / 2)" 
                y="114" 
                fill="#737373" 
                font-size="8.5" 
                font-weight="500" 
                text-anchor="middle"
              >
                {{ item.label }}
              </text>
            </g>
          </svg>
        </div>
      </section>

      <!-- Calendar View with Fast Navigation -->
      <section class="p-5 rounded-3xl bg-neutral-900/40 border border-neutral-800/60 backdrop-blur-md space-y-4">
        
        <!-- Fast Header Navigation Bar -->
        <div class="flex items-center justify-between gap-1">
          <!-- Step Left: Year and Month -->
          <div class="flex items-center gap-0.5">
            <button 
              @click="prevYear" 
              class="p-1.5 px-2 rounded-xl bg-neutral-950/60 border border-neutral-800/70 hover:border-neutral-700 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all active:scale-90 text-xs font-bold"
              :title="t('prevYear')"
            >
              «
            </button>
            <button 
              @click="prevMonth" 
              class="p-1.5 px-2 rounded-xl bg-neutral-950/60 border border-neutral-800/70 hover:border-neutral-700 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all active:scale-90"
              :title="t('prevMonth')"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          <!-- Quick Selectors: Month & Year Dropdowns + Today Button -->
          <div class="flex items-center gap-1.5">
            <!-- Month Dropdown -->
            <div class="relative">
              <select 
                v-model="selectedMonthIndex" 
                class="appearance-none bg-neutral-950/90 border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-xs font-semibold py-1.5 pl-2.5 pr-6 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
              >
                <option v-for="(name, idx) in monthNames" :key="idx" :value="idx">
                  {{ name }}
                </option>
              </select>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-500 text-[8px]">▼</span>
            </div>

            <!-- Year Dropdown -->
            <div class="relative">
              <select 
                v-model="selectedYear" 
                class="appearance-none bg-neutral-950/90 border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-xs font-semibold py-1.5 pl-2.5 pr-6 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
              >
                <option v-for="y in selectableYears" :key="y" :value="y">
                  {{ y }}
                </option>
              </select>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-500 text-[8px]">▼</span>
            </div>

            <!-- Return to Today Button -->
            <button 
              v-if="!isCurrentMonthAndYear" 
              @click="goToToday" 
              :class="['px-2 py-1.5 border rounded-xl text-[10px] font-semibold tracking-wide transition-all active:scale-95', themeClasses.bgSoft, themeClasses.text, themeClasses.border]"
              :title="t('calendarTodayBtn')"
            >
              {{ t('calendarTodayBtn') }}
            </button>
          </div>

          <!-- Step Right: Month and Year -->
          <div class="flex items-center gap-0.5">
            <button 
              @click="nextMonth" 
              class="p-1.5 px-2 rounded-xl bg-neutral-950/60 border border-neutral-800/70 hover:border-neutral-700 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all active:scale-90"
              :title="t('nextMonth')"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button 
              @click="nextYear" 
              class="p-1.5 px-2 rounded-xl bg-neutral-950/60 border border-neutral-800/70 hover:border-neutral-700 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all active:scale-90 text-xs font-bold"
              :title="t('nextYear')"
            >
              »
            </button>
          </div>
        </div>

        <!-- Day Names -->
        <div class="grid grid-cols-7 text-center text-[10px] font-medium text-neutral-500 uppercase tracking-wider">
          <span v-for="(dayName, dIdx) in daysShort" :key="dIdx">{{ dayName }}</span>
        </div>

        <!-- Calendar Days Grid -->
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
            <span class="z-10">{{ item.day }}</span>
            <!-- Kaza indicator badge/dot -->
            <span 
              v-if="item.date && hasDayKaza(item.date)" 
              class="w-1.5 h-1.5 rounded-full bg-purple-400 absolute top-1.5 right-1.5 shadow-[0_0_6px_rgba(168,85,247,0.8)]"
              :title="t('legendKaza')"
            ></span>
            <!-- Today indicator -->
            <span v-if="item.date && isToday(item.date)" :class="['w-1 h-1 rounded-full absolute bottom-1.5', themeClasses.bgDot]"></span>
          </div>
        </div>

        <!-- Legend -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] text-neutral-400">
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></span> {{ t('legendMissing') }}</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span> {{ t('legendPartial') }}</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-cyan-500/80 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></span> {{ t('legendComplete') }}</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-purple-500/90 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></span> {{ t('legendKaza') }}</span>
        </div>
      </section>

      <!-- Quick Batch Day Kaza Action Bar with Kerahat Badge -->
      <section class="p-4 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-md space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-xs font-semibold text-neutral-200">{{ t('batchTitle') }}</h3>
              <span v-if="kerahatInfo.isKerahat" class="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {{ t('kerahatBadgeActive') }}
              </span>
            </div>
            <p class="text-[11px] text-neutral-500 mt-0.5">{{ t('batchSubtitle') }}</p>
          </div>
          <span class="text-base">⚡</span>
        </div>

        <div class="grid grid-cols-2 gap-2.5">
          <button 
            @click="decrementFullDayKaza"
            class="py-2.5 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
            :title="t('minusFullDayTitle')"
          >
            <span>{{ t('minusFullDay') }}</span>
          </button>
          
          <button 
            @click="incrementFullDayKaza"
            :class="['py-2.5 px-3 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md', themeClasses.gradientBtn]"
            :title="t('plusFullDayTitle')"
          >
            <span>{{ t('plusFullDay') }}</span>
          </button>
        </div>
      </section>

      <!-- Prayer Fast Counters with Progress Bars -->
      <section class="space-y-3">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{{ t('kazaCountersTitle') }}</h3>
          <span class="text-[10px] text-neutral-500">{{ t('syncBadge') }}</span>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div 
            v-for="prayer in prayerTypes" 
            :key="prayer.id"
            class="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800/70 hover:border-neutral-700/80 transition-all flex flex-col justify-between"
          >
            <div class="flex justify-between items-start">
              <span class="text-sm font-medium text-neutral-300">{{ prayer.name }}</span>
              <span 
                :class="['text-[11px] px-2 py-0.5 rounded-full bg-neutral-800 font-medium', themeClasses.text]"
                :title="t('completedBadgeTitle')"
              >
                +{{ getCompletedForPrayer(prayer.id) }}
              </span>
            </div>

            <div class="mt-3 flex items-baseline justify-between">
              <div>
                <span class="text-2xl font-bold tracking-tight text-neutral-100">
                  {{ getRemainingForPrayer(prayer.id) }}
                </span>
                <span class="text-[10px] text-neutral-500 ml-1">{{ t('kalanLabel') }}</span>
              </div>
              <div class="flex gap-1.5">
                <button 
                  @click="decrementKaza(prayer.id)" 
                  class="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 active:scale-90 text-neutral-300 flex items-center justify-center font-bold text-sm transition-all"
                  :title="t('decKazaTitle')"
                >-</button>
                <button 
                  @click="incrementKaza(prayer.id)" 
                  :class="['w-8 h-8 rounded-lg border active:scale-90 flex items-center justify-center font-bold text-sm transition-all', themeClasses.bgSoft, themeClasses.text, themeClasses.border]"
                  :title="t('incKazaTitle')"
                >+</button>
              </div>
            </div>

            <!-- Prayer Progress Bar -->
            <div class="mt-3 pt-2 border-t border-neutral-800/40">
              <div class="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                <span>{{ t('progressLabel') }}</span>
                <span :class="['font-medium', themeClasses.text]">%{{ getPrayerProgressPercent(prayer.id) }}</span>
              </div>
              <div class="w-full bg-neutral-950 rounded-full h-1.5 overflow-hidden">
                <div 
                  :class="['h-full transition-all duration-300 rounded-full', themeClasses.gradientBtn]" 
                  :style="{ width: getPrayerProgressPercent(prayer.id) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Day Logging Modal with Direct Kaza Option -->
      <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="selectedDate" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div class="flex justify-between items-center pb-2 border-b border-neutral-800">
              <div>
                <h4 class="font-semibold text-sm text-neutral-100">{{ selectedDate }}</h4>
                <p class="text-xs text-neutral-400">{{ t('dayModalSubtitle') }}</p>
              </div>
              <button @click="selectedDate = null" class="text-neutral-400 hover:text-white p-1">✕</button>
            </div>

            <!-- Prayer List with Status Badges and Kaza / On-Time Actions -->
            <div class="space-y-2">
              <div 
                v-for="p in prayerTypes" 
                :key="p.id"
                class="p-2.5 px-3 rounded-2xl bg-neutral-950 border border-neutral-800/90 flex items-center justify-between gap-2 transition-all hover:border-neutral-700"
              >
                <!-- Prayer Name & Status Badge -->
                <div class="flex items-center gap-2">
                  <div>
                    <span class="text-xs font-semibold text-neutral-200 block">{{ p.name }}</span>
                    <!-- Status Badge -->
                    <span 
                      v-if="getPrayerStatusOnDate(selectedDate, p.id) === 'kaza'" 
                      class="inline-flex items-center gap-1 text-[10px] font-bold text-purple-400 bg-purple-500/15 px-1.5 py-0.5 rounded-md border border-purple-500/30"
                    >
                      🟣 {{ t('statusKaza') }}
                    </span>
                    <span 
                      v-else-if="getPrayerStatusOnDate(selectedDate, p.id) === 'regular'" 
                      class="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 bg-cyan-500/15 px-1.5 py-0.5 rounded-md border border-cyan-500/30"
                    >
                      ✓ {{ t('statusRegular') }}
                    </span>
                    <span 
                      v-else 
                      class="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded-md border border-rose-500/20"
                    >
                      ✕ {{ t('statusMissing') }}
                    </span>
                  </div>
                </div>

                <!-- Action Buttons: Kaza, On-Time, Reset -->
                <div class="flex items-center gap-1.5">
                  <!-- Button: Mark as Kaza -->
                  <button 
                    @click="setPrayerStatus(selectedDate, p.id, 'kaza')"
                    :class="[
                      'px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95 flex items-center gap-1',
                      getPrayerStatusOnDate(selectedDate, p.id) === 'kaza'
                        ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-950 border border-purple-400/60'
                        : 'bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border border-purple-800/50'
                    ]"
                    :title="t('btnMarkKaza')"
                  >
                    <span>🟣</span>
                    <span>{{ t('statusKaza') }}</span>
                  </button>

                  <!-- Button: Mark as Regular (Vaktinde) -->
                  <button 
                    @click="setPrayerStatus(selectedDate, p.id, 'regular')"
                    :class="[
                      'px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95 flex items-center gap-1',
                      getPrayerStatusOnDate(selectedDate, p.id) === 'regular'
                        ? `${themeClasses.bgSoft} ${themeClasses.border} ${themeClasses.text} font-semibold border shadow-sm`
                        : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800'
                    ]"
                    :title="t('btnMarkRegular')"
                  >
                    <span>✓</span>
                  </button>

                  <!-- Button: Reset / Clear -->
                  <button 
                    v-if="getPrayerStatusOnDate(selectedDate, p.id) !== 'missing'"
                    @click="setPrayerStatus(selectedDate, p.id, 'missing')"
                    class="p-1 px-2 rounded-xl bg-neutral-900 hover:bg-rose-950/40 text-neutral-500 hover:text-rose-300 border border-neutral-800 hover:border-rose-800/40 text-xs transition-all"
                    :title="t('btnClearPrayer')"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <!-- Batch Actions in Modal -->
            <div class="space-y-2 pt-2">
              <button 
                @click="markAllDayMissingAsKaza(selectedDate)"
                class="w-full py-2.5 bg-gradient-to-r from-purple-900/70 to-indigo-900/70 hover:from-purple-800 hover:to-indigo-800 border border-purple-700/50 text-purple-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-98 shadow-md"
              >
                <span>🟣</span>
                <span>{{ t('btnMarkDayMissingAsKaza') }}</span>
              </button>

              <button 
                @click="toggleAllForDay"
                class="w-full py-2 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-medium transition-colors"
              >
                {{ t('toggleAllDayBtn') }}
              </button>
            </div>
          </div>
        </div>
      </transition>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  calculatePrayerTimes, 
  getNextPrayerInfo, 
  calculateQiblaAngle, 
  calculateSolarPosition,
  getKerahatInfo, 
  TURKISH_CITIES 
} from './utils/prayerTimes.js'
import { 
  LANGUAGES, 
  translations, 
  translate 
} from './utils/i18n.js'

const showSettings = ref(false)
const showRangeModal = ref(false)
const showQiblaModal = ref(false)
const showKerahatModal = ref(false)
const selectedDate = ref(null)
const chartPeriod = ref('weekly')
const toastMessage = ref('')
let toastTimer = null

// Internationalization (i18n)
const currentLang = ref('tr')
const availableLanguages = LANGUAGES

const t = (key, params = {}) => {
  return translate(currentLang.value, key, params)
}

const showToast = (msg) => {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 4000)
}

// Themes Configuration
const currentTheme = ref('cyan')
const availableThemes = [
  { id: 'cyan', name: 'Camgöbeği', color: '#06b6d4' },
  { id: 'emerald', name: 'Zümrüt', color: '#10b981' },
  { id: 'blue', name: 'Safir', color: '#3b82f6' },
  { id: 'amber', name: 'Altın', color: '#f59e0b' },
  { id: 'purple', name: 'Ametist', color: '#a855f7' }
]

const themeClasses = computed(() => {
  const tId = currentTheme.value
  if (tId === 'emerald') {
    return {
      text: 'text-emerald-400',
      border: 'border-emerald-500/40',
      bgSoft: 'bg-emerald-500/15',
      bgDot: 'bg-emerald-400',
      gradientBtn: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500',
      shadow: 'shadow-emerald-950/50',
      selection: 'selection:bg-emerald-500/30'
    }
  }
  if (tId === 'blue') {
    return {
      text: 'text-blue-400',
      border: 'border-blue-500/40',
      bgSoft: 'bg-blue-500/15',
      bgDot: 'bg-blue-400',
      gradientBtn: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500',
      shadow: 'shadow-blue-950/50',
      selection: 'selection:bg-blue-500/30'
    }
  }
  if (tId === 'amber') {
    return {
      text: 'text-amber-400',
      border: 'border-amber-500/40',
      bgSoft: 'bg-amber-500/15',
      bgDot: 'bg-amber-400',
      gradientBtn: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500',
      shadow: 'shadow-amber-950/50',
      selection: 'selection:bg-amber-500/30'
    }
  }
  if (tId === 'purple') {
    return {
      text: 'text-purple-400',
      border: 'border-purple-500/40',
      bgSoft: 'bg-purple-500/15',
      bgDot: 'bg-purple-400',
      gradientBtn: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500',
      shadow: 'shadow-purple-950/50',
      selection: 'selection:bg-purple-500/30'
    }
  }
  // Default cyan
  return {
    text: 'text-cyan-400',
    border: 'border-cyan-500/40',
    bgSoft: 'bg-cyan-500/15',
    bgDot: 'bg-cyan-400',
    gradientBtn: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500',
    shadow: 'shadow-cyan-950/50',
    selection: 'selection:bg-cyan-500/30'
  }
})

const themeHexColor = computed(() => {
  const found = availableThemes.find(th => th.id === currentTheme.value)
  return found ? found.color : '#06b6d4'
})

// City, Prayer Times & Kerahat Info
const cityList = TURKISH_CITIES
const selectedCity = ref('İstanbul')
const nowTimer = ref(new Date())
let clockInterval = null

const activeCityObj = computed(() => {
  return cityList.find(c => c.name === selectedCity.value) || cityList[0]
})

const currentPrayerTimes = computed(() => {
  const city = activeCityObj.value
  return calculatePrayerTimes(nowTimer.value, city.lat, city.lng)
})

const nextPrayerInfo = computed(() => {
  return getNextPrayerInfo(currentPrayerTimes.value, nowTimer.value)
})

const kerahatInfo = computed(() => {
  return getKerahatInfo(currentPrayerTimes.value, nowTimer.value)
})

const getLocalizedKerahatName = (id) => {
  if (id === 'tulu') return t('tuluName')
  if (id === 'istiva') return t('istivaName')
  if (id === 'gurub') return t('gurubName')
  return id
}

const getLocalizedKerahatShort = (id) => {
  if (id === 'tulu') return t('tuluShort')
  if (id === 'istiva') return t('istivaShort')
  if (id === 'gurub') return t('gurubShort')
  return id
}

const getLocalizedKerahatDesc = (id) => {
  if (id === 'tulu') return t('tuluDesc')
  if (id === 'istiva') return t('istivaDesc')
  if (id === 'gurub') return t('gurubDesc')
  return ''
}

const prayerTimeItems = computed(() => {
  const times = currentPrayerTimes.value
  const nextId = nextPrayerInfo.value.nextPrayer.id
  return [
    { id: 'fajr', label: t('imsak'), time: times.fajr, isNext: nextId === 'fajr' },
    { id: 'sunrise', label: t('sunrise'), time: times.sunrise, isNext: nextId === 'sunrise' },
    { id: 'dhuhr', label: t('dhuhr'), time: times.dhuhr, isNext: nextId === 'dhuhr' },
    { id: 'asr', label: t('asr'), time: times.asr, isNext: nextId === 'asr' },
    { id: 'maghrib', label: t('maghrib'), time: times.maghrib, isNext: nextId === 'maghrib' },
    { id: 'isha', label: t('isha'), time: times.isha, isNext: nextId === 'isha' }
  ]
})

// Qibla Compass State & Logic
const cityQiblaAngle = computed(() => {
  const city = activeCityObj.value
  return calculateQiblaAngle(city.lat, city.lng)
})

const rawDeviceHeading = ref(0)
const compassOffset = ref(Number(localStorage.getItem('namaz_compass_offset') || 0))
const compassActive = ref(false)
const showCalibrationPanel = ref(false)
const showFigure8Modal = ref(false)
let orientationHandler = null
let absoluteOrientationSupported = false

const effectiveHeading = computed(() => {
  return (rawDeviceHeading.value + compassOffset.value + 360) % 360
})

const solarPosition = computed(() => {
  const city = activeCityObj.value
  return calculateSolarPosition(nowTimer.value, city.lat, city.lng)
})

const getCompassDirectionLabel = (angle) => {
  const norm = ((angle % 360) + 360) % 360
  if (norm >= 337.5 || norm < 22.5) return t('dirNorth')
  if (norm >= 22.5 && norm < 67.5) return t('dirNorthEast')
  if (norm >= 67.5 && norm < 112.5) return t('dirEast')
  if (norm >= 112.5 && norm < 157.5) return t('dirSouthEast')
  if (norm >= 157.5 && norm < 202.5) return t('dirSouth')
  if (norm >= 202.5 && norm < 247.5) return t('dirSouthWest')
  if (norm >= 247.5 && norm < 292.5) return t('dirWest')
  return t('dirNorthWest')
}

const isQiblaAligned = computed(() => {
  const diff = Math.abs((effectiveHeading.value - cityQiblaAngle.value + 360) % 360)
  return diff <= 5 || diff >= 355
})

const setCompassOffset = (val) => {
  let normalized = Math.round(Number(val))
  while (normalized > 180) normalized -= 360
  while (normalized < -180) normalized += 360
  compassOffset.value = normalized
  localStorage.setItem('namaz_compass_offset', String(normalized))
}

const adjustCompassOffset = (delta) => {
  setCompassOffset(compassOffset.value + delta)
}

const calibrateFacingAsNorth = () => {
  // If rawDeviceHeading is H, we want effectiveHeading = 0 => (H + offset) % 360 = 0 => offset = -H
  let offset = -rawDeviceHeading.value
  while (offset < -180) offset += 360
  while (offset > 180) offset -= 360
  setCompassOffset(offset)
  showToast(t('toastCalibratedNorth'))
}

const resetCompassOffset = () => {
  setCompassOffset(0)
  showToast(t('toastOffsetReset'))
}

const handleOrientation = (e) => {
  let heading = 0
  if (e.webkitCompassHeading !== undefined) {
    heading = e.webkitCompassHeading
  } else if (e.alpha !== null) {
    heading = (360 - e.alpha) % 360
  }
  rawDeviceHeading.value = Math.round(heading)
  if (compassActive.value && isQiblaAligned.value && navigator.vibrate) {
    navigator.vibrate(30)
  }
}

const requestCompassPermission = async () => {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const response = await DeviceOrientationEvent.requestPermission()
      if (response === 'granted') {
        startCompassListener()
      } else {
        showToast(t('toastCompassDenied'))
      }
    } catch (err) {
      console.error(err)
      startCompassListener()
    }
  } else {
    startCompassListener()
  }
}

const startCompassListener = () => {
  orientationHandler = handleOrientation
  if ('ondeviceorientationabsolute' in window) {
    window.addEventListener('deviceorientationabsolute', orientationHandler, true)
    absoluteOrientationSupported = true
    compassActive.value = true
    showToast(t('toastCompassActive'))
  } else if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', orientationHandler, true)
    compassActive.value = true
    showToast(t('toastCompassActive'))
  } else {
    showToast(t('toastCompassNoSensor'))
  }
}

const openQiblaModal = () => {
  showQiblaModal.value = true
  requestCompassPermission()
}

const closeQiblaModal = () => {
  showQiblaModal.value = false
  if (orientationHandler) {
    if (absoluteOrientationSupported) {
      window.removeEventListener('deviceorientationabsolute', orientationHandler, true)
    }
    window.removeEventListener('deviceorientation', orientationHandler, true)
    compassActive.value = false
  }
}

// Prayer Types (Localized)
const prayerTypes = computed(() => [
  { id: 'fajr', name: t('prayerFajr') },
  { id: 'dhuhr', name: t('prayerDhuhr') },
  { id: 'asr', name: t('prayerAsr') },
  { id: 'maghrib', name: t('prayerMaghrib') },
  { id: 'isha', name: t('prayerIsha') },
  { id: 'witr', name: t('prayerWitr') }
])

const monthNames = computed(() => {
  const dict = translations[currentLang.value] || translations.tr
  return dict.monthNames
})

const daysShort = computed(() => {
  const dict = translations[currentLang.value] || translations.tr
  return dict.daysShort
})

const profile = ref({
  dob: '',
  bulugDate: '',
  startDate: ''
})

const extraKaza = ref({
  fajr: 0,
  dhuhr: 0,
  asr: 0,
  maghrib: 0,
  isha: 0,
  witr: 0
})

const baseDebts = ref({
  fajr: 0,
  dhuhr: 0,
  asr: 0,
  maghrib: 0,
  isha: 0,
  witr: 0
})

const dayLogs = ref({})
const kazaDayLogs = ref({})
const viewDate = ref(new Date())

// Local date string helper
const formatDateToYMD = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Prayer helper for localized names
const getPrayerName = (prayerId) => {
  const p = prayerTypes.value.find(item => item.id === prayerId)
  return p ? p.name : prayerId
}

// Status helpers for date prayers
const getPrayerStatusOnDate = (dateStr, prayerId) => {
  if (!dateStr) return 'missing'
  if ((kazaDayLogs.value[dateStr] || []).includes(prayerId)) return 'kaza'
  if ((dayLogs.value[dateStr] || []).includes(prayerId)) return 'regular'
  return 'missing'
}

const hasDayKaza = (dateStr) => {
  if (!dateStr) return false
  return (kazaDayLogs.value[dateStr] || []).length > 0
}

const getDayCompletedPrayersCount = (dateStr) => {
  if (!dateStr) return 0
  const reg = dayLogs.value[dateStr] || []
  const kz = kazaDayLogs.value[dateStr] || []
  const set = new Set([...reg, ...kz])
  return set.size
}

// Streak Calculation
const streakInfo = computed(() => {
  const todayStr = formatDateToYMD(new Date())
  const d = new Date()
  let currentStreak = 0

  const todayLogged = getDayCompletedPrayersCount(todayStr) === 6
  if (todayLogged) {
    currentStreak++
  }
  
  d.setDate(d.getDate() - 1)
  while (true) {
    const dateStr = formatDateToYMD(d)
    const count = getDayCompletedPrayersCount(dateStr)
    if (count === 6) {
      currentStreak++
      d.setDate(d.getDate() - 1)
    } else {
      break
    }
  }

  const allDateKeys = Array.from(new Set([...Object.keys(dayLogs.value), ...Object.keys(kazaDayLogs.value)]))
  const allCompletedDates = allDateKeys.filter(k => getDayCompletedPrayersCount(k) === 6).sort()
  let best = 0
  let tempStreak = 0
  let prevDate = null

  for (const ds of allCompletedDates) {
    const [y, m, day] = ds.split('-').map(Number)
    const curDate = new Date(y, m - 1, day)
    
    if (prevDate) {
      const diffDays = Math.round((curDate - prevDate) / (1000 * 60 * 60 * 24))
      if (diffDays === 1) {
        tempStreak++
      } else {
        tempStreak = 1
      }
    } else {
      tempStreak = 1
    }
    if (tempStreak > best) best = tempStreak
    prevDate = curDate
  }

  return {
    current: currentStreak,
    best: Math.max(best, currentStreak)
  }
})

// Calendar Navigation State & Getters/Setters
const selectedMonthIndex = computed({
  get: () => viewDate.value.getMonth(),
  set: (val) => {
    const y = viewDate.value.getFullYear()
    viewDate.value = new Date(y, parseInt(val, 10), 1)
  }
})

const selectedYear = computed({
  get: () => viewDate.value.getFullYear(),
  set: (val) => {
    const m = viewDate.value.getMonth()
    viewDate.value = new Date(parseInt(val, 10), m, 1)
  }
})

const selectableYears = computed(() => {
  const currentY = new Date().getFullYear()
  const startY = profile.value.dob ? new Date(profile.value.dob).getFullYear() : currentY - 50
  const minYear = Math.min(startY, currentY - 40)
  const maxYear = currentY + 10
  const list = []
  for (let y = maxYear; y >= minYear; y--) {
    list.push(y)
  }
  return list
})

const isCurrentMonthAndYear = computed(() => {
  const now = new Date()
  return (
    viewDate.value.getFullYear() === now.getFullYear() &&
    viewDate.value.getMonth() === now.getMonth()
  )
})

const prevMonth = () => {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1)
}

const prevYear = () => {
  viewDate.value = new Date(viewDate.value.getFullYear() - 1, viewDate.value.getMonth(), 1)
}

const nextYear = () => {
  viewDate.value = new Date(viewDate.value.getFullYear() + 1, viewDate.value.getMonth(), 1)
}

const goToToday = () => {
  const now = new Date()
  viewDate.value = new Date(now.getFullYear(), now.getMonth(), 1)
}

const autoSetBulug = () => {
  if (profile.value.dob) {
    const parts = profile.value.dob.split('-').map(Number)
    if (parts.length === 3) {
      const [y, m, d] = parts
      const bulugDate = new Date(y + 13, m - 1, d)
      profile.value.bulugDate = formatDateToYMD(bulugDate)
    }
  }
}

// Auto-complete days from startDate up to yesterday
const autoCompleteDaysUntilYesterday = (startDateStr, showFeedback = true) => {
  if (!startDateStr) {
    if (showFeedback) showToast(t('toastValidDate'))
    return 0
  }

  const parts = startDateStr.split('-').map(Number)
  if (parts.length !== 3) return 0
  const [sy, sm, sd] = parts
  const start = new Date(sy, sm - 1, sd)
  start.setHours(0, 0, 0, 0)

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)

  if (start > yesterday) {
    if (showFeedback) {
      showToast(t('toastDateFuture'))
    }
    return 0
  }

  const allPrayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'witr']
  let count = 0
  const cur = new Date(start)

  while (cur <= yesterday) {
    const dateStr = formatDateToYMD(cur)
    dayLogs.value[dateStr] = [...allPrayers]
    if (kazaDayLogs.value[dateStr]) {
      delete kazaDayLogs.value[dateStr]
    }
    count++
    cur.setDate(cur.getDate() + 1)
  }

  saveToStorage()
  if (showFeedback) {
    showToast(t('toastAutoCompleted', { n: count, start: startDateStr, end: formatDateToYMD(yesterday) }))
  }
  return count
}

const handleManualAutoComplete = () => {
  autoCompleteDaysUntilYesterday(profile.value.startDate, true)
}

// Earliest missing date finder for specific prayer
const getEarliestMissingDateForPrayer = (prayerId) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let start = null
  if (profile.value.bulugDate) {
    const parts = profile.value.bulugDate.split('-').map(Number)
    if (parts.length === 3) {
      start = new Date(parts[0], parts[1] - 1, parts[2])
    }
  }
  if (!start && profile.value.startDate) {
    const parts = profile.value.startDate.split('-').map(Number)
    if (parts.length === 3) {
      start = new Date(parts[0], parts[1] - 1, parts[2])
    }
  }
  if (!start) {
    start = new Date()
    start.setFullYear(start.getFullYear() - 1)
  }
  start.setHours(0, 0, 0, 0)

  const cur = new Date(start)
  while (cur <= today) {
    const ds = formatDateToYMD(cur)
    const reg = dayLogs.value[ds] || []
    const kz = kazaDayLogs.value[ds] || []
    if (!reg.includes(prayerId) && !kz.includes(prayerId)) {
      return ds
    }
    cur.setDate(cur.getDate() + 1)
  }
  return null
}

// Latest date where a prayer was marked as kaza
const getLatestKazaDateForPrayer = (prayerId) => {
  const dates = Object.keys(kazaDayLogs.value)
    .filter(ds => (kazaDayLogs.value[ds] || []).includes(prayerId))
    .sort()
  if (dates.length > 0) {
    return dates[dates.length - 1]
  }
  return null
}

// Prayer calculations synchronized across Calendar and Counters
const getCalendarCompletedForPrayer = (prayerId) => {
  let count = 0
  const allDates = new Set([...Object.keys(dayLogs.value), ...Object.keys(kazaDayLogs.value)])
  for (const dateStr of allDates) {
    const reg = (dayLogs.value[dateStr] || []).includes(prayerId)
    const kz = (kazaDayLogs.value[dateStr] || []).includes(prayerId)
    if (reg || kz) {
      count++
    }
  }
  return count
}

const getCompletedForPrayer = (prayerId) => {
  return getCalendarCompletedForPrayer(prayerId) + (extraKaza.value[prayerId] || 0)
}

const getTotalObligatedForPrayer = (prayerId) => {
  if (profile.value.bulugDate) {
    const parts = profile.value.bulugDate.split('-').map(Number)
    if (parts.length === 3) {
      const [by, bm, bd] = parts
      const bulug = new Date(by, bm - 1, bd)
      bulug.setHours(0, 0, 0, 0)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const diffTime = today - bulug
      const days = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1)
      return days
    }
  }
  return baseDebts.value[prayerId] || 0
}

const getRemainingForPrayer = (prayerId) => {
  const total = getTotalObligatedForPrayer(prayerId)
  const completed = getCompletedForPrayer(prayerId)
  return Math.max(0, total - completed)
}

const getPrayerProgressPercent = (prayerId) => {
  const total = getTotalObligatedForPrayer(prayerId)
  const completed = getCompletedForPrayer(prayerId)
  if (!total || total <= 0) return completed > 0 ? 100 : 0
  return Math.min(100, Math.round((completed / total) * 100))
}

const totalRemainingCount = computed(() => {
  return prayerTypes.value.reduce((acc, p) => acc + getRemainingForPrayer(p.id), 0)
})

const totalCompletedCount = computed(() => {
  return prayerTypes.value.reduce((acc, p) => acc + getCompletedForPrayer(p.id), 0)
})

const totalEstimatedDaysRemaining = computed(() => {
  return Math.max(...prayerTypes.value.map(p => getRemainingForPrayer(p.id)), 0)
})

const overallCompletionRate = computed(() => {
  const totalObligated = prayerTypes.value.reduce((acc, p) => acc + getTotalObligatedForPrayer(p.id), 0)
  if (!totalObligated || totalObligated <= 0) return 0
  return Math.min(100, Math.round((totalCompletedCount.value / totalObligated) * 100))
})

// Synchronized Kaza Increment & Decrement
const incrementKaza = (prayerId) => {
  const earliestMissingDate = getEarliestMissingDateForPrayer(prayerId)
  if (earliestMissingDate) {
    const current = kazaDayLogs.value[earliestMissingDate] || []
    if (!current.includes(prayerId)) {
      kazaDayLogs.value[earliestMissingDate] = [...current, prayerId]
    }
    if (dayLogs.value[earliestMissingDate]?.includes(prayerId)) {
      dayLogs.value[earliestMissingDate] = dayLogs.value[earliestMissingDate].filter(p => p !== prayerId)
    }
    saveToStorage()
    showToast(t('toastKazaDayMarked', { date: earliestMissingDate, prayer: getPrayerName(prayerId) }))
  } else {
    extraKaza.value[prayerId] = (extraKaza.value[prayerId] || 0) + 1
    saveToStorage()
    showToast(`✓ +1 ${getPrayerName(prayerId)} kaza`)
  }
}

const decrementKaza = (prayerId) => {
  if ((extraKaza.value[prayerId] || 0) > 0) {
    extraKaza.value[prayerId] -= 1
    saveToStorage()
    showToast(`-1 ${getPrayerName(prayerId)} kaza`)
    return
  }
  
  const latestDate = getLatestKazaDateForPrayer(prayerId)
  if (latestDate) {
    const current = kazaDayLogs.value[latestDate] || []
    const updated = current.filter(p => p !== prayerId)
    if (updated.length > 0) {
      kazaDayLogs.value[latestDate] = updated
    } else {
      delete kazaDayLogs.value[latestDate]
    }
    saveToStorage()
    showToast(t('toastKazaDayReverted', { date: latestDate, prayer: getPrayerName(prayerId) }))
  } else {
    showToast(t('toastNoKazaToDecrement'))
  }
}

// Bulk 1-Day Full Kaza (6 Prayers at once)
const incrementFullDayKaza = () => {
  const allPrayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'witr']
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let start = null
  if (profile.value.bulugDate) {
    const parts = profile.value.bulugDate.split('-').map(Number)
    if (parts.length === 3) {
      start = new Date(parts[0], parts[1] - 1, parts[2])
    }
  }
  if (!start && profile.value.startDate) {
    const parts = profile.value.startDate.split('-').map(Number)
    if (parts.length === 3) {
      start = new Date(parts[0], parts[1] - 1, parts[2])
    }
  }
  if (!start) {
    start = new Date()
    start.setFullYear(start.getFullYear() - 1)
  }
  start.setHours(0, 0, 0, 0)

  let targetDate = null
  const cur = new Date(start)
  while (cur <= today) {
    const ds = formatDateToYMD(cur)
    const reg = dayLogs.value[ds] || []
    const kz = kazaDayLogs.value[ds] || []
    const missing = allPrayers.filter(p => !reg.includes(p) && !kz.includes(p))
    if (missing.length > 0) {
      targetDate = ds
      break
    }
    cur.setDate(cur.getDate() + 1)
  }

  if (targetDate) {
    const existingKz = kazaDayLogs.value[targetDate] || []
    const existingReg = dayLogs.value[targetDate] || []
    const missing = allPrayers.filter(p => !existingReg.includes(p))
    kazaDayLogs.value[targetDate] = Array.from(new Set([...existingKz, ...missing]))
    saveToStorage()
    showToast(t('toastFullDayKazaMarked', { date: targetDate }))
  } else {
    allPrayers.forEach(pid => {
      extraKaza.value[pid] = (extraKaza.value[pid] || 0) + 1
    })
    saveToStorage()
    showToast(t('toastFullDayAdded'))
  }
}

const decrementFullDayKaza = () => {
  const allPrayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'witr']
  const canDecExtra = allPrayers.every(pid => (extraKaza.value[pid] || 0) > 0)
  if (canDecExtra) {
    allPrayers.forEach(pid => {
      extraKaza.value[pid] -= 1
    })
    saveToStorage()
    showToast(t('toastFullDayRemoved'))
    return
  }

  const kazaDates = Object.keys(kazaDayLogs.value).filter(ds => (kazaDayLogs.value[ds] || []).length > 0).sort()
  if (kazaDates.length > 0) {
    const latestDate = kazaDates[kazaDates.length - 1]
    delete kazaDayLogs.value[latestDate]
    saveToStorage()
    showToast(t('toastFullDayRemoved') + ` (${latestDate})`)
  } else {
    showToast(t('toastNoKazaToDecrement'))
  }
}

const calculateInitialDebts = () => {
  if (!profile.value.bulugDate || !profile.value.startDate) return
  const bParts = profile.value.bulugDate.split('-').map(Number)
  const sParts = profile.value.startDate.split('-').map(Number)
  const b = new Date(bParts[0], bParts[1] - 1, bParts[2])
  const s = new Date(sParts[0], sParts[1] - 1, sParts[2])
  const diffDays = Math.max(0, Math.floor((s - b) / (1000 * 60 * 60 * 24)))

  prayerTypes.value.forEach(p => {
    baseDebts.value[p.id] = diffDays
  })

  const completedCount = autoCompleteDaysUntilYesterday(profile.value.startDate, false)

  saveToStorage()
  showSettings.value = false

  if (completedCount > 0) {
    showToast(t('toastDebtCalculated', { n: completedCount }))
  } else {
    showToast(t('toastDebtSaved'))
  }
}

// Date Range Batch Actions
const rangeForm = ref({
  start: '',
  end: ''
})

const applyRangeAction = (action) => {
  if (!rangeForm.value.start || !rangeForm.value.end) {
    showToast(t('toastRangeInvalid'))
    return
  }

  const [sy, sm, sd] = rangeForm.value.start.split('-').map(Number)
  const [ey, em, ed] = rangeForm.value.end.split('-').map(Number)
  const start = new Date(sy, sm - 1, sd)
  const end = new Date(ey, em - 1, ed)

  if (start > end) {
    showToast(t('toastRangeOrder'))
    return
  }

  let count = 0
  const cur = new Date(start)
  const allPrayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'witr']

  while (cur <= end) {
    const ds = formatDateToYMD(cur)
    if (action === 'fill') {
      dayLogs.value[ds] = [...allPrayers]
      if (kazaDayLogs.value[ds]) delete kazaDayLogs.value[ds]
    } else {
      delete dayLogs.value[ds]
      delete kazaDayLogs.value[ds]
    }
    count++
    cur.setDate(cur.getDate() + 1)
  }

  saveToStorage()
  showRangeModal.value = false
  if (action === 'fill') {
    showToast(t('toastRangeFilled', { n: count }))
  } else {
    showToast(t('toastRangeCleared', { n: count }))
  }
}

// Backup & Restore
const exportDataBackup = () => {
  const backupData = {
    profile: profile.value,
    dayLogs: dayLogs.value,
    kazaDayLogs: kazaDayLogs.value,
    extraKaza: extraKaza.value,
    baseDebts: baseDebts.value,
    theme: currentTheme.value,
    city: selectedCity.value,
    lang: currentLang.value,
    version: '1.2',
    exportDate: new Date().toISOString()
  }

  const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `kaza_tracker_backup_${formatDateToYMD(new Date())}.json`
  a.click()
  URL.revokeObjectURL(url)
  showToast(t('toastBackupExported'))
}

const importDataBackup = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      if (data.profile) profile.value = data.profile
      if (data.dayLogs) dayLogs.value = data.dayLogs
      if (data.kazaDayLogs) kazaDayLogs.value = data.kazaDayLogs
      if (data.extraKaza) extraKaza.value = data.extraKaza
      if (data.baseDebts) baseDebts.value = data.baseDebts
      if (data.theme) currentTheme.value = data.theme
      if (data.city) selectedCity.value = data.city
      if (data.lang) currentLang.value = data.lang
      saveToStorage()
      showSettings.value = false
      showToast(t('toastBackupImported'))
    } catch (err) {
      showToast(t('toastBackupInvalid'))
    }
  }
  reader.readAsText(file)
}

// Confirmation Dialog for Safe Resets
const confirmDialog = ref({
  show: false,
  type: '',
  title: '',
  message: ''
})

const promptReset = (type) => {
  confirmDialog.value.type = type
  if (type === 'calendar') {
    confirmDialog.value.title = t('resetCalendarTitle')
    confirmDialog.value.message = t('resetCalendarMsg')
  } else if (type === 'counters') {
    confirmDialog.value.title = t('resetCountersTitle')
    confirmDialog.value.message = t('resetCountersMsg')
  } else if (type === 'profile') {
    confirmDialog.value.title = t('resetParamsTitle')
    confirmDialog.value.message = t('resetParamsMsg')
  } else if (type === 'all') {
    confirmDialog.value.title = t('resetAllTitle')
    confirmDialog.value.message = t('resetAllMsg')
  }
  confirmDialog.value.show = true
}

const executeConfirmedAction = () => {
  const type = confirmDialog.value.type
  if (type === 'calendar') {
    dayLogs.value = {}
    kazaDayLogs.value = {}
    saveToStorage()
    showToast(t('toastCalendarReset'))
  } else if (type === 'counters') {
    extraKaza.value = { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0, witr: 0 }
    saveToStorage()
    showToast(t('toastCountersReset'))
  } else if (type === 'profile') {
    profile.value = { dob: '', bulugDate: '', startDate: '' }
    baseDebts.value = { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0, witr: 0 }
    saveToStorage()
    showToast(t('toastParamsReset'))
  } else if (type === 'all') {
    localStorage.clear()
    profile.value = { dob: '', bulugDate: '', startDate: '' }
    extraKaza.value = { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0, witr: 0 }
    baseDebts.value = { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0, witr: 0 }
    dayLogs.value = {}
    kazaDayLogs.value = {}
    showToast(t('toastAllReset'))
  }
  confirmDialog.value.show = false
  showSettings.value = false
}

// SVG Visual Chart Computed Data
const chartData = computed(() => {
  const totalDays = chartPeriod.value === 'weekly' ? 7 : 30
  const maxPrayersPerDay = 6
  const chartWidth = 300
  const paddingLeft = 5
  
  const slotWidth = chartWidth / totalDays
  const barWidth = chartPeriod.value === 'weekly' ? Math.min(slotWidth * 0.55, 24) : Math.max(slotWidth * 0.65, 4.5)
  const gapOffset = (slotWidth - barWidth) / 2

  const list = []
  const today = new Date()

  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(today.getDate() - i)
    const dateStr = formatDateToYMD(d)
    
    const count = getDayCompletedPrayersCount(dateStr)
    const barHeight = (count / maxPrayersPerDay) * 90
    const x = paddingLeft + (totalDays - 1 - i) * slotWidth + gapOffset

    let label = ''
    let showLabel = false

    if (chartPeriod.value === 'weekly') {
      const locale = currentLang.value === 'de' ? 'de-DE' : currentLang.value === 'en' ? 'en-US' : 'tr-TR'
      label = d.toLocaleDateString(locale, { weekday: 'short' }).slice(0, 2)
      showLabel = true
    } else {
      const dayNum = d.getDate()
      if (i % 6 === 0 || i === 0) {
        label = `${dayNum}`
        showLabel = true
      }
    }

    list.push({
      dateStr,
      count,
      barHeight,
      x,
      width: barWidth,
      label,
      showLabel
    })
  }

  return list
})

const periodStats = computed(() => {
  const data = chartData.value
  const total = data.reduce((acc, item) => acc + item.count, 0)
  const maxPossible = data.length * 6
  const rate = maxPossible > 0 ? Math.round((total / maxPossible) * 100) : 0
  return { total, rate }
})

// Calendar Logic
const calendarDays = computed(() => {
  const y = viewDate.value.getFullYear()
  const m = viewDate.value.getMonth()
  const firstDayIndex = (new Date(y, m, 1).getDay() + 6) % 7
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

const isToday = (dateStr) => {
  return dateStr === formatDateToYMD(new Date())
}

const getDayStatusClasses = (dateStr) => {
  if (!dateStr) return ''
  const reg = dayLogs.value[dateStr] || []
  const kz = kazaDayLogs.value[dateStr] || []
  const total = new Set([...reg, ...kz]).size
  const isKazaPresent = kz.length > 0

  if (total === 6) {
    if (isKazaPresent) {
      return 'bg-purple-500/25 text-purple-200 border border-purple-500/60 shadow-[inset_0_0_14px_rgba(168,85,247,0.3)] hover:brightness-110'
    }
    return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[inset_0_0_12px_rgba(6,182,212,0.15)] hover:brightness-110'
  }
  if (total > 0 && total < 6) {
    if (isKazaPresent) {
      return 'bg-amber-500/15 text-amber-200 border border-purple-400/50 shadow-[inset_0_0_10px_rgba(168,85,247,0.15)] hover:brightness-110'
    }
    return 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[inset_0_0_12px_rgba(245,158,11,0.15)] hover:brightness-110'
  }
  return 'bg-neutral-900/60 text-neutral-400 border border-rose-500/30 hover:border-neutral-700'
}

const openDayModal = (dateStr) => {
  selectedDate.value = dateStr
}

// Day Modal Actions
const setPrayerStatus = (dateStr, prayerId, status) => {
  if (!dateStr) return
  const reg = dayLogs.value[dateStr] || []
  const kz = kazaDayLogs.value[dateStr] || []

  if (status === 'kaza') {
    if (!kz.includes(prayerId)) {
      kazaDayLogs.value[dateStr] = [...kz, prayerId]
    }
    if (reg.includes(prayerId)) {
      dayLogs.value[dateStr] = reg.filter(p => p !== prayerId)
    }
  } else if (status === 'regular') {
    if (!reg.includes(prayerId)) {
      dayLogs.value[dateStr] = [...reg, prayerId]
    }
    if (kz.includes(prayerId)) {
      const updated = kz.filter(p => p !== prayerId)
      if (updated.length > 0) {
        kazaDayLogs.value[dateStr] = updated
      } else {
        delete kazaDayLogs.value[dateStr]
      }
    }
  } else if (status === 'missing') {
    if (reg.includes(prayerId)) {
      const updatedReg = reg.filter(p => p !== prayerId)
      if (updatedReg.length > 0) dayLogs.value[dateStr] = updatedReg
      else delete dayLogs.value[dateStr]
    }
    if (kz.includes(prayerId)) {
      const updatedKz = kz.filter(p => p !== prayerId)
      if (updatedKz.length > 0) kazaDayLogs.value[dateStr] = updatedKz
      else delete kazaDayLogs.value[dateStr]
    }
  }
  saveToStorage()
}

const markAllDayMissingAsKaza = (dateStr) => {
  if (!dateStr) return
  const allPrayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'witr']
  const reg = dayLogs.value[dateStr] || []
  const kz = kazaDayLogs.value[dateStr] || []
  const missing = allPrayers.filter(p => !reg.includes(p) && !kz.includes(p))
  
  if (missing.length === 0) {
    showToast(t('toastNoKazaToDecrement'))
    return
  }
  
  kazaDayLogs.value[dateStr] = Array.from(new Set([...kz, ...missing]))
  saveToStorage()
  showToast(t('toastFullDayKazaMarked', { date: dateStr }))
}

const toggleAllForDay = () => {
  if (!selectedDate.value) return
  const currentCount = getDayCompletedPrayersCount(selectedDate.value)
  if (currentCount === 6) {
    delete dayLogs.value[selectedDate.value]
    delete kazaDayLogs.value[selectedDate.value]
  } else {
    dayLogs.value[selectedDate.value] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'witr']
    delete kazaDayLogs.value[selectedDate.value]
  }
  saveToStorage()
}

const saveToStorage = () => {
  localStorage.setItem('kaza_profile', JSON.stringify(profile.value))
  localStorage.setItem('kaza_daylogs', JSON.stringify(dayLogs.value))
  localStorage.setItem('kaza_daykaza', JSON.stringify(kazaDayLogs.value))
  localStorage.setItem('kaza_extra', JSON.stringify(extraKaza.value))
  localStorage.setItem('kaza_theme', currentTheme.value)
  localStorage.setItem('kaza_city', selectedCity.value)
  localStorage.setItem('kaza_lang', currentLang.value)
  localStorage.setItem('kaza_debts', JSON.stringify(
    ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'witr'].reduce((acc, pid) => {
      acc[pid] = {
        total: getTotalObligatedForPrayer(pid),
        completed: getCompletedForPrayer(pid)
      }
      return acc
    }, {})
  ))
}

onMounted(() => {
  const p = localStorage.getItem('kaza_profile')
  const d = localStorage.getItem('kaza_debts')
  const l = localStorage.getItem('kaza_daylogs')
  const kz = localStorage.getItem('kaza_daykaza')
  const e = localStorage.getItem('kaza_extra')
  const th = localStorage.getItem('kaza_theme')
  const c = localStorage.getItem('kaza_city')
  const lang = localStorage.getItem('kaza_lang')

  if (p) profile.value = JSON.parse(p)
  if (l) dayLogs.value = JSON.parse(l)
  if (kz) {
    try {
      kazaDayLogs.value = JSON.parse(kz)
    } catch (err) {
      console.error(err)
    }
  }
  if (th) currentTheme.value = th
  if (c) selectedCity.value = c
  if (lang && ['tr', 'en', 'de'].includes(lang)) {
    currentLang.value = lang
  } else {
    // Auto-detect browser language
    const navLang = navigator.language?.slice(0, 2)
    if (navLang === 'de') currentLang.value = 'de'
    else if (navLang === 'en') currentLang.value = 'en'
    else currentLang.value = 'tr'
  }

  if (e) {
    extraKaza.value = JSON.parse(e)
  } else if (d) {
    try {
      const parsedD = JSON.parse(d)
      ;['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'witr'].forEach(pid => {
        if (parsedD[pid]?.completed) {
          extraKaza.value[pid] = parsedD[pid].completed
        }
        if (parsedD[pid]?.total) {
          baseDebts.value[pid] = parsedD[pid].total
        }
      })
    } catch (err) {
      console.error(err)
    }
  }

  // Live timer for prayer times countdown & Kerahat calculation
  clockInterval = setInterval(() => {
    nowTimer.value = new Date()
  }, 30000)

  if (!p) showSettings.value = true
})

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval)
  if (orientationHandler) {
    window.removeEventListener('deviceorientation', orientationHandler, true)
  }
})
</script>