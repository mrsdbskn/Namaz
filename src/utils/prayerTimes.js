// Offline Astronomical Prayer Times Calculator with 81 Turkish Provinces & Qibla / Kerahat Utilities

export const TURKISH_CITIES = [
  { name: 'Adana', lat: 37.0, lng: 35.3213 },
  { name: 'Adıyaman', lat: 37.7648, lng: 38.2786 },
  { name: 'Afyonkarahisar', lat: 38.7507, lng: 30.5567 },
  { name: 'Ağrı', lat: 39.7191, lng: 43.0503 },
  { name: 'Amasya', lat: 40.6534, lng: 35.8331 },
  { name: 'Ankara', lat: 39.9334, lng: 32.8597 },
  { name: 'Antalya', lat: 36.8969, lng: 30.7133 },
  { name: 'Artvin', lat: 41.1828, lng: 41.8183 },
  { name: 'Aydın', lat: 37.856, lng: 27.8416 },
  { name: 'Balıkesir', lat: 39.6484, lng: 27.8826 },
  { name: 'Bilecik', lat: 40.1451, lng: 29.9799 },
  { name: 'Bingöl', lat: 38.8854, lng: 40.4983 },
  { name: 'Bitlis', lat: 38.4006, lng: 42.1095 },
  { name: 'Bolu', lat: 40.7392, lng: 31.6089 },
  { name: 'Burdur', lat: 37.7203, lng: 30.2908 },
  { name: 'Bursa', lat: 40.1885, lng: 29.061 },
  { name: 'Çanakkale', lat: 40.1553, lng: 26.4142 },
  { name: 'Çankırı', lat: 40.6013, lng: 33.6134 },
  { name: 'Çorum', lat: 40.5506, lng: 34.9556 },
  { name: 'Denizli', lat: 37.7765, lng: 29.0864 },
  { name: 'Diyarbakır', lat: 37.9144, lng: 40.2306 },
  { name: 'Edirne', lat: 41.6772, lng: 26.5557 },
  { name: 'Elazığ', lat: 38.681, lng: 39.2264 },
  { name: 'Erzincan', lat: 39.75, lng: 39.5 },
  { name: 'Erzurum', lat: 39.9055, lng: 41.2658 },
  { name: 'Eskişehir', lat: 39.7767, lng: 30.5206 },
  { name: 'Gaziantep', lat: 37.0662, lng: 37.3833 },
  { name: 'Giresun', lat: 40.9128, lng: 38.3895 },
  { name: 'Gümüşhane', lat: 40.4608, lng: 39.4817 },
  { name: 'Hakkari', lat: 37.5833, lng: 43.7333 },
  { name: 'Hatay', lat: 36.4018, lng: 36.3498 },
  { name: 'Isparta', lat: 37.7648, lng: 30.5566 },
  { name: 'Mersin', lat: 36.8121, lng: 34.6415 },
  { name: 'İstanbul', lat: 41.0082, lng: 28.9784 },
  { name: 'İzmir', lat: 38.4237, lng: 27.1428 },
  { name: 'Kars', lat: 40.6013, lng: 43.0975 },
  { name: 'Kastamonu', lat: 41.3887, lng: 33.7827 },
  { name: 'Kayseri', lat: 38.7312, lng: 35.4787 },
  { name: 'Kırklareli', lat: 41.7333, lng: 27.2167 },
  { name: 'Kırşehir', lat: 39.1425, lng: 34.1709 },
  { name: 'Kocaeli', lat: 40.8533, lng: 29.8815 },
  { name: 'Konya', lat: 37.8746, lng: 32.4932 },
  { name: 'Kütahya', lat: 39.4167, lng: 29.9833 },
  { name: 'Malatya', lat: 38.3552, lng: 38.3095 },
  { name: 'Manisa', lat: 38.6191, lng: 27.4289 },
  { name: 'Kahramanmaraş', lat: 37.5858, lng: 36.9371 },
  { name: 'Mardin', lat: 37.3212, lng: 40.7245 },
  { name: 'Muğla', lat: 37.2153, lng: 28.3636 },
  { name: 'Muş', lat: 38.7432, lng: 41.5064 },
  { name: 'Nevşehir', lat: 38.6244, lng: 34.7144 },
  { name: 'Niğde', lat: 37.9667, lng: 34.6833 },
  { name: 'Ordu', lat: 40.9839, lng: 37.8764 },
  { name: 'Rize', lat: 41.0201, lng: 40.5234 },
  { name: 'Sakarya', lat: 40.7569, lng: 30.3783 },
  { name: 'Samsun', lat: 41.2928, lng: 36.3313 },
  { name: 'Siirt', lat: 37.9333, lng: 41.95 },
  { name: 'Sinop', lat: 42.0231, lng: 35.1531 },
  { name: 'Sivas', lat: 39.7477, lng: 37.0179 },
  { name: 'Tekirdağ', lat: 40.9833, lng: 27.5167 },
  { name: 'Tokat', lat: 40.3167, lng: 36.55 },
  { name: 'Trabzon', lat: 41.0027, lng: 39.7168 },
  { name: 'Tunceli', lat: 39.1079, lng: 39.5401 },
  { name: 'Şanlıurfa', lat: 37.1674, lng: 38.7955 },
  { name: 'Uşak', lat: 38.6823, lng: 29.4082 },
  { name: 'Van', lat: 38.4891, lng: 43.4089 },
  { name: 'Yozgat', lat: 39.8181, lng: 34.8147 },
  { name: 'Zonguldak', lat: 41.4564, lng: 31.7987 },
  { name: 'Aksaray', lat: 38.3687, lng: 34.037 },
  { name: 'Bayburt', lat: 40.2552, lng: 40.2249 },
  { name: 'Karaman', lat: 37.1759, lng: 33.2287 },
  { name: 'Kırıkkale', lat: 39.8468, lng: 33.5153 },
  { name: 'Batman', lat: 37.8812, lng: 41.1293 },
  { name: 'Şırnak', lat: 37.5164, lng: 42.4918 },
  { name: 'Bartın', lat: 41.6344, lng: 32.3375 },
  { name: 'Ardahan', lat: 41.1105, lng: 42.7022 },
  { name: 'Iğdır', lat: 39.9196, lng: 44.045 },
  { name: 'Yalova', lat: 40.655, lng: 29.2769 },
  { name: 'Karabük', lat: 41.2061, lng: 32.6204 },
  { name: 'Kilis', lat: 36.7184, lng: 37.1212 },
  { name: 'Osmaniye', lat: 37.0742, lng: 36.2467 },
  { name: 'Düzce', lat: 40.8438, lng: 31.1565 },
  // International Travel Destinations
  { name: 'Mekke', lat: 21.4225, lng: 39.8262 },
  { name: 'Medine', lat: 24.5247, lng: 39.5692 },
  { name: 'Kudüs', lat: 31.7683, lng: 35.2137 },
  { name: 'Berlin', lat: 52.52, lng: 13.405 },
  { name: 'Londra', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522 },
  { name: 'Amsterdam', lat: 52.3676, lng: 4.9041 },
  { name: 'Viyana', lat: 48.2082, lng: 16.3738 },
  { name: 'Zürih', lat: 47.3769, lng: 8.5417 },
  { name: 'Brüksel', lat: 50.8503, lng: 4.3517 },
  { name: 'Roma', lat: 41.9028, lng: 12.4964 },
  { name: 'Madrid', lat: 40.4168, lng: -3.7038 },
  { name: 'Stockholm', lat: 59.3293, lng: 18.0686 },
  { name: 'Oslo', lat: 59.9139, lng: 10.7522 },
  { name: 'Kopenhag', lat: 55.6761, lng: 12.5683 },
  { name: 'Dublin', lat: 53.3498, lng: -6.2603 },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
  { name: 'Doha', lat: 25.2854, lng: 51.531 },
  { name: 'Riyad', lat: 24.7136, lng: 46.6753 },
  { name: 'Kahire', lat: 30.0444, lng: 31.2357 },
  { name: 'Kuveyt', lat: 29.3759, lng: 47.9774 },
  { name: 'New York', lat: 40.7128, lng: -74.006 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  { name: 'Chicago', lat: 41.8781, lng: -87.6298 },
  { name: 'Toronto', lat: 43.6532, lng: -79.3832 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Seul', lat: 37.5665, lng: 126.978 },
  { name: 'Singapur', lat: 1.3521, lng: 103.8198 },
  { name: 'Kuala Lumpur', lat: 3.139, lng: 101.6869 },
  { name: 'Cakarta', lat: -6.2088, lng: 106.8456 },
  { name: 'Sidney', lat: -33.8688, lng: 151.2093 }
]

// Trigonometric degree helpers
const d2r = (d) => (d * Math.PI) / 180.0
const r2d = (r) => (r * 180.0) / Math.PI
const sinD = (d) => Math.sin(d2r(d))
const cosD = (d) => Math.cos(d2r(d))
const tanD = (d) => Math.tan(d2r(d))
const arccosD = (x) => r2d(Math.acos(Math.max(-1, Math.min(1, x))))
const arcsinD = (x) => r2d(Math.asin(Math.max(-1, Math.min(1, x))))
const arccotD = (x) => r2d(Math.atan(1.0 / x))

// Calculate astronomical prayer times
export function calculatePrayerTimes(date, lat, lng) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  // Julian Date calculation
  let Y = year
  let M = month
  if (M <= 2) {
    Y -= 1
    M += 12
  }
  const A = Math.floor(Y / 100)
  const B = 2 - A + Math.floor(A / 4)
  const JD = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + day + B - 1524.5

  const D = JD - 2451545.0
  const g = 357.529 + 0.98560028 * D
  const q = 280.459 + 0.98564736 * D
  const L = q + 1.915 * sinD(g) + 0.02 * sinD(2 * g)
  const e = 23.439 - 0.00000036 * D
  const RA = r2d(Math.atan2(cosD(e) * sinD(L), cosD(L))) / 15.0
  const decl = arcsinD(sinD(e) * sinD(L))
  const EqT = q / 15.0 - (RA < 0 ? RA + 24 : RA)

  // Local timezone offset in hours
  const tzOffset = -date.getTimezoneOffset() / 60

  // Midday (Noon / Dhuhr)
  const noon = 12 + tzOffset - lng / 15.0 - EqT

  // Sun hour angle helper for a given altitude alpha
  const hourAngle = (alpha) => {
    const cosHA = (sinD(alpha) - sinD(lat) * sinD(decl)) / (cosD(lat) * cosD(decl))
    return arccosD(cosHA) / 15.0
  }

  // Diyanet standard angles: Fajr 18 deg, Sunrise -0.833 deg, Isha 17 deg
  const fajrHA = hourAngle(-18.0)
  const sunriseHA = hourAngle(-0.833)
  const sunsetHA = hourAngle(-0.833)
  const ishaHA = hourAngle(-17.0)

  // Asr hour angle (standard shadow factor = 1)
  const asrAlt = arccotD(1.0 + tanD(Math.abs(lat - decl)))
  const asrHA = hourAngle(asrAlt)

  const imsakTime = noon - fajrHA
  const gunesTime = noon - sunriseHA
  const ogleTime = noon
  const ikindiTime = noon + asrHA
  const aksamTime = noon + sunsetHA
  const yatsiTime = noon + ishaHA

  const formatHours = (h) => {
    let normalized = h % 24
    if (normalized < 0) normalized += 24
    const hours = Math.floor(normalized)
    const minutes = Math.floor((normalized - hours) * 60)
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }

  return {
    fajr: formatHours(imsakTime),
    sunrise: formatHours(gunesTime),
    dhuhr: formatHours(ogleTime),
    asr: formatHours(ikindiTime),
    maghrib: formatHours(aksamTime),
    isha: formatHours(yatsiTime)
  }
}

// Get next prayer and remaining time
export function getNextPrayerInfo(times, now = new Date()) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  const prayerList = [
    { id: 'fajr', name: 'İmsak', timeStr: times.fajr },
    { id: 'sunrise', name: 'Güneş', timeStr: times.sunrise },
    { id: 'dhuhr', name: 'Öğle', timeStr: times.dhuhr },
    { id: 'asr', name: 'İkindi', timeStr: times.asr },
    { id: 'maghrib', name: 'Akşam', timeStr: times.maghrib },
    { id: 'isha', name: 'Yatsı', timeStr: times.isha }
  ]

  const parseToMinutes = (str) => {
    const [h, m] = str.split(':').map(Number)
    return h * 60 + m
  }

  for (let i = 0; i < prayerList.length; i++) {
    const pMinutes = parseToMinutes(prayerList[i].timeStr)
    if (pMinutes > currentMinutes) {
      const diff = pMinutes - currentMinutes
      const h = Math.floor(diff / 60)
      const m = diff % 60
      const remainingStr = h > 0 ? `${h} sa ${m} dk` : `${m} dk`
      return {
        nextPrayer: prayerList[i],
        remainingStr,
        remainingMinutes: diff,
        currentPrayer: i > 0 ? prayerList[i - 1] : prayerList[prayerList.length - 1]
      }
    }
  }

  // If after Isha, next is tomorrow's Fajr
  const fajrMinutes = parseToMinutes(times.fajr)
  const diff = (24 * 60 - currentMinutes) + fajrMinutes
  const h = Math.floor(diff / 60)
  const m = diff % 60
  return {
    nextPrayer: prayerList[0],
    remainingStr: `${h} sa ${m} dk`,
    remainingMinutes: diff,
    currentPrayer: prayerList[prayerList.length - 1]
  }
}

// Kaaba (Mecca) Coordinates
export const KAABA_COORDS = {
  lat: 21.4225,
  lng: 39.8262,
  name: 'Kâbe-i Muazzama (Mekke)'
}

// Qibla Direction Calculator (Degrees from True North)
export function calculateQiblaAngle(lat, lng) {
  const kaabaLat = KAABA_COORDS.lat
  const kaabaLng = KAABA_COORDS.lng

  const phi1 = d2r(lat)
  const phi2 = d2r(kaabaLat)
  const deltaLambda = d2r(kaabaLng - lng)

  const y = Math.sin(deltaLambda)
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda)

  let qibla = r2d(Math.atan2(y, x))
  qibla = (qibla + 360) % 360
  return Math.round(qibla * 10) / 10
}

// Calculate distance to Kaaba in kilometers using Haversine formula
export function calculateDistanceToKaaba(lat, lng) {
  const dLat = d2r(KAABA_COORDS.lat - lat)
  const dLng = d2r(KAABA_COORDS.lng - lng)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(d2r(lat)) * Math.cos(d2r(KAABA_COORDS.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distanceKm = 6371 * c
  return Math.round(distanceKm)
}

// Kerahat (Makruh) Times Calculation
export function getKerahatInfo(times, now = new Date()) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  const parseToMinutes = (str) => {
    if (!str) return 0
    const [h, m] = str.split(':').map(Number)
    return h * 60 + m
  }

  const formatFromMinutes = (mins) => {
    let norm = (mins + 1440) % 1440
    const h = Math.floor(norm / 60)
    const m = norm % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }

  const sunriseM = parseToMinutes(times.sunrise)
  const dhuhrM = parseToMinutes(times.dhuhr)
  const maghribM = parseToMinutes(times.maghrib)

  // 1. Tulu Kerahati (Sunrise): Sunrise -> +45 min
  const tuluStart = sunriseM
  const tuluEnd = sunriseM + 45

  // 2. İstiva Kerahati (Zawal): Dhuhr - 45 min -> Dhuhr
  const istivaStart = dhuhrM - 45
  const istivaEnd = dhuhrM

  // 3. Gurub Kerahati (Sunset): Maghrib - 45 min -> Maghrib
  const gurubStart = maghribM - 45
  const gurubEnd = maghribM

  const kerahatWindows = [
    {
      id: 'tulu',
      name: 'Güneş Doğuş (Tulû) Kerahati',
      shortName: 'Güneş Doğuş Kerahati',
      startM: tuluStart,
      endM: tuluEnd,
      startStr: formatFromMinutes(tuluStart),
      endStr: formatFromMinutes(tuluEnd),
      description: 'Güneş doğduktan sonra yaklaşık 45 dakika boyunca kaza namazı kılınması mekruhtur.'
    },
    {
      id: 'istiva',
      name: 'Öğle Öncesi (İstiva/Zeval) Kerahati',
      shortName: 'Zeval Kerahati',
      startM: istivaStart,
      endM: istivaEnd,
      startStr: formatFromMinutes(istivaStart),
      endStr: formatFromMinutes(istivaEnd),
      description: 'Güneş tam tepe noktasındayken (Öğle ezanından önceki 45 dakika) kaza namazı kılınması mekruhtur.'
    },
    {
      id: 'gurub',
      name: 'Güneş Batış (Gurûb) Kerahati',
      shortName: 'Güneş Batış Kerahati',
      startM: gurubStart,
      endM: gurubEnd,
      startStr: formatFromMinutes(gurubStart),
      endStr: formatFromMinutes(gurubEnd),
      description: 'Güneş batmadan önceki 45 dakika içinde (o günün ikindisi hariç) kaza namazı kılınması mekruhtur.'
    }
  ]

  // Check if currently inside any Kerahat window
  for (const win of kerahatWindows) {
    if (currentMinutes >= win.startM && currentMinutes < win.endM) {
      const remaining = win.endM - currentMinutes
      return {
        isKerahat: true,
        currentWindow: win,
        remainingMinutes: remaining,
        allWindows: kerahatWindows
      }
    }
  }

  // Find next upcoming Kerahat window
  let nextWin = kerahatWindows.find(w => w.startM > currentMinutes)
  let startsIn = 0

  if (nextWin) {
    startsIn = nextWin.startM - currentMinutes
  } else {
    // Next is tomorrow's Tulu
    nextWin = kerahatWindows[0]
    startsIn = (1440 - currentMinutes) + kerahatWindows[0].startM
  }

  return {
    isKerahat: false,
    nextWindow: nextWin,
    startsInMinutes: startsIn,
    allWindows: kerahatWindows
  }
}

// Real-time Solar Position (Azimuth & Altitude) Calculator
export function calculateSolarPosition(date, lat, lng) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  // Julian Date calculation
  let Y = year
  let M = month
  if (M <= 2) {
    Y -= 1
    M += 12
  }
  const A = Math.floor(Y / 100)
  const B = 2 - A + Math.floor(A / 4)
  const JD = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + day + B - 1524.5

  const D = JD - 2451545.0
  const g = 357.529 + 0.98560028 * D
  const q = 280.459 + 0.98564736 * D
  const L = q + 1.915 * sinD(g) + 0.02 * sinD(2 * g)
  const e = 23.439 - 0.00000036 * D
  const RA = r2d(Math.atan2(cosD(e) * sinD(L), cosD(L))) / 15.0
  const decl = arcsinD(sinD(e) * sinD(L))
  const EqT = q / 15.0 - (RA < 0 ? RA + 24 : RA)

  const tzOffset = -date.getTimezoneOffset() / 60
  const noon = 12 + tzOffset - lng / 15.0 - EqT

  const currentHours = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600
  const H = (currentHours - noon) * 15.0 // Hour angle in degrees

  // Solar Altitude (Elevation) alpha
  const sinAlt = sinD(lat) * sinD(decl) + cosD(lat) * cosD(decl) * cosD(H)
  const altitude = arcsinD(sinAlt)

  // Solar Azimuth (degrees from North, clockwise 0 = N, 90 = E, 180 = S, 270 = W)
  const y = -sinD(H)
  const x = tanD(decl) * cosD(lat) - sinD(lat) * cosD(H)
  let azimuth = (r2d(Math.atan2(y, x)) + 360) % 360

  return {
    azimuth: Math.round(azimuth * 10) / 10,
    altitude: Math.round(altitude * 10) / 10,
    isDay: altitude > -0.833
  }
}

// Find closest city in offline database by coordinates (Haversine Formula)
export function findNearestCity(lat, lng, list = TURKISH_CITIES) {
  let minDistance = Infinity
  let nearest = list[0]

  for (const city of list) {
    const dLat = d2r(city.lat - lat)
    const dLng = d2r(city.lng - lng)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(d2r(lat)) * Math.cos(d2r(city.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distanceKm = 6371 * c
    if (distanceKm < minDistance) {
      minDistance = distanceKm
      nearest = { ...city, distanceKm: Math.round(distanceKm) }
    }
  }
  return nearest
}

// Reverse geocode coordinates to human-readable city/country name with timeout
export async function reverseGeocode(lat, lng, lang = 'tr') {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4500)
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=${lang}`,
      { signal: controller.signal }
    )
    clearTimeout(timeoutId)
    if (res.ok) {
      const data = await res.json()
      const city = data.city || data.locality || data.principalSubdivision || data.countryName || ''
      const district = data.locality || data.principalSubdivision || ''
      const country = data.countryName || ''
      let displayName = city
      if (country && country !== city) {
        displayName = `${city ? city + ', ' : ''}${country}`
      }
      return {
        name: displayName || `${Math.round(lat * 100) / 100}°, ${Math.round(lng * 100) / 100}°`,
        city: city || displayName,
        district,
        country,
        lat,
        lng
      }
    }
  } catch (err) {
    // Return null to trigger offline nearest city fallback
  }
  return null
}


