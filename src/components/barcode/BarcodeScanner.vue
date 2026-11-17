<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { BarcodeFormat, DecodeHintType, NotFoundException } from '@zxing/library'
import { BoltIcon, BoltSlashIcon } from '@heroicons/vue/24/outline'

export interface ScannerInfo {
  method: 'nouvelle' | 'ancienne'
  decoder: 'native' | 'zxing'
  camera: string
  width?: number
  height?: number
  zoom?: number
  focusMode?: string
  // Nombre de flux caméra encore ouverts (l'ancienne méthode ZXing en ouvrait deux)
  streams: number
  cameras: string[]
}

const props = withDefaults(
  defineProps<{
    // Ancienne méthode (≤ 0.7.3), conservée pour comparaison depuis la page Debug
    legacy?: boolean
    // Force ZXing même si BarcodeDetector est disponible (comparaison sur Android)
    forceZxing?: boolean
  }>(),
  { legacy: false, forceZxing: false },
)

const emit = defineEmits<{
  loaded: [playing: boolean]
  scan: [barcode: string]
  error: [error: Error]
  info: [info: ScannerInfo]
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const error = ref<string | null>(null)

const nativeSupported = typeof (window as any).BarcodeDetector !== 'undefined'
const useNative = nativeSupported && !props.forceZxing

// --- Préférences (objectif + zoom), mémorisées par nom de caméra ---
// Les deviceId Safari peuvent changer d'une session à l'autre, pas les noms.
const PREF_KEY = 'scanner-camera'
interface CameraPref {
  label?: string
  zoom?: Record<string, number>
}

function loadPref(): CameraPref {
  try {
    return JSON.parse(localStorage.getItem(PREF_KEY) || '{}') as CameraPref
  } catch {
    return {}
  }
}

function savePref(pref: CameraPref) {
  try {
    localStorage.setItem(PREF_KEY, JSON.stringify(pref))
  } catch {
    /* stockage indisponible : préférence non mémorisée */
  }
}

// --- Choix de l'objectif ---
const FRONT = /front|avant|user|facetime/i

async function listBackCameras(): Promise<MediaDeviceInfo[]> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    return devices.filter(d => d.kind === 'videoinput' && !FRONT.test(d.label))
  } catch {
    return []
  }
}

// Retourne null tant que les noms sont masqués (permission pas encore accordée)
// ou si aucune caméra préférée n'est reconnue : on garde alors facingMode.
function pickCamera(cams: MediaDeviceInfo[], savedLabel?: string): MediaDeviceInfo | null {
  if (cams.length === 0 || cams.every(c => !c.label)) return null
  if (savedLabel) {
    const saved = cams.find(c => c.label === savedLabel)
    if (saved) return saved
  }
  // iPhone Pro : la caméra virtuelle triple bascule seule sur la macro quand on
  // s'approche, contrairement au grand-angle seul.
  const triple = cams.find(c => /triple/i.test(c.label))
  if (triple) return triple
  // Autres iPhone (pas de macro sur le parc, iPhone ≤ 15) : le grand-angle seul.
  // La « double caméra grand angle » n'apporte rien et a semblé moins bonne
  // à l'essai sur iPhone 14 (test du 2026-11-17).
  const wide = cams.find(c => /^(caméra arrière|back camera)$/i.test(c.label.trim()))
  if (wide) return wide
  // Android : camera2 0 est presque toujours l'objectif principal
  const android0 = cams.find(c => /camera2 0\b/.test(c.label))
  if (android0) return android0
  return null
}

const cameras = ref<MediaDeviceInfo[]>([])
const currentDeviceId = ref<string>('')

function videoConstraints(base: MediaTrackConstraints): MediaTrackConstraints {
  // ZXing décode en JS sur l'image entière : plus de pixels = barres plus nettes.
  const res = useNative
    ? { width: { ideal: 1280 }, height: { ideal: 720 } }
    : { width: { ideal: 1920 }, height: { ideal: 1080 } }
  return { ...base, ...res }
}

async function openStream(): Promise<MediaStream> {
  const pref = loadPref()
  let cams = await listBackCameras()
  let target = pickCamera(cams, pref.label)

  let stream: MediaStream
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: videoConstraints(
        target ? { deviceId: { exact: target.deviceId } } : { facingMode: 'environment' },
      ),
    })
  } catch (e) {
    if (!target) throw e
    // Caméra mémorisée disparue ou refusée : repli sur le comportement par défaut
    target = null
    stream = await navigator.mediaDevices.getUserMedia({
      video: videoConstraints({ facingMode: 'environment' }),
    })
  }

  // Premier lancement : les noms n'étaient lisibles qu'après la permission
  if (!target) {
    cams = await listBackCameras()
    target = pickCamera(cams, pref.label)
    const openedId = stream.getVideoTracks()[0]?.getSettings().deviceId
    if (target && target.deviceId !== openedId) {
      try {
        const better = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints({ deviceId: { exact: target.deviceId } }),
        })
        stream.getTracks().forEach(t => t.stop())
        stream = better
      } catch {
        /* on garde le flux déjà ouvert */
      }
    }
  }

  cameras.value = cams
  currentDeviceId.value = stream.getVideoTracks()[0]?.getSettings().deviceId ?? ''
  return stream
}

function selectCamera(deviceId: string) {
  const cam = cameras.value.find(c => c.deviceId === deviceId)
  if (!cam) return
  savePref({ ...loadPref(), label: cam.label })
  stopCamera()
  startCamera()
}

// --- Torche, mise au point, zoom ---
const torchSupported = ref(false)
const torchOn = ref(false)
const zoomRange = ref<{ min: number; max: number; step: number } | null>(null)
const zoom = ref(1)
let videoTrack: MediaStreamTrack | null = null

async function toggleTorch() {
  if (!videoTrack || !torchSupported.value) return
  torchOn.value = !torchOn.value
  await videoTrack.applyConstraints({ advanced: [{ torch: torchOn.value } as any] })
}

async function applyZoom(value: number) {
  if (!videoTrack || !zoomRange.value) return
  zoom.value = value
  try {
    await videoTrack.applyConstraints({ advanced: [{ zoom: value } as any] })
    const pref = loadPref()
    savePref({ ...pref, zoom: { ...(pref.zoom ?? {}), [videoTrack.label]: value } })
  } catch {
    /* zoom refusé par le navigateur */
  }
}

async function setupTrack(stream: MediaStream) {
  videoTrack = stream.getVideoTracks()[0]
  torchOn.value = false
  const capabilities = (videoTrack.getCapabilities?.() ?? {}) as any
  torchSupported.value = !!capabilities.torch

  const advanced: Record<string, string>[] = []
  if (capabilities.focusMode?.includes('continuous')) {
    advanced.push({ focusMode: 'continuous' })
  }
  if (capabilities.exposureMode?.includes('continuous')) {
    advanced.push({ exposureMode: 'continuous' })
  }
  if (advanced.length > 0) {
    try {
      await videoTrack.applyConstraints({ advanced } as any)
    } catch {
      /* contraintes ignorées */
    }
  }

  zoomRange.value = null
  if (!props.legacy && capabilities.zoom && capabilities.zoom.max > capabilities.zoom.min) {
    zoomRange.value = {
      min: capabilities.zoom.min,
      max: Math.min(capabilities.zoom.max, 5),
      step: capabilities.zoom.step || 0.1,
    }
    const saved = loadPref().zoom?.[videoTrack.label]
    zoom.value = (videoTrack.getSettings() as any).zoom ?? capabilities.zoom.min
    if (saved !== undefined) await applyZoom(saved)
  }
}

// --- Infos pour la page Debug ---
function emitInfo(stream: MediaStream, decoder: 'native' | 'zxing', extraStreams: MediaStream[] = []) {
  const track = stream.getVideoTracks()[0]
  const s = (track?.getSettings() ?? {}) as any
  const live = [stream, ...extraStreams].filter(st =>
    st.getVideoTracks().some(t => t.readyState === 'live'),
  ).length
  emit('info', {
    method: props.legacy ? 'ancienne' : 'nouvelle',
    decoder,
    camera: track?.label || '(inconnue)',
    width: s.width,
    height: s.height,
    zoom: s.zoom,
    focusMode: s.focusMode,
    streams: live,
    cameras: cameras.value.map(c => c.label || '(sans nom)'),
  })
}

// --- Décodeur natif (BarcodeDetector) ---
let nativeAnimFrame: number | null = null

async function runNative(stream: MediaStream) {
  const BarcodeDetector = (window as any).BarcodeDetector
  const detector = new BarcodeDetector({ formats: ['ean_13', 'ean_8'] })

  if (!videoRef.value) return
  videoRef.value.srcObject = stream
  await videoRef.value.play()
  emit('loaded', true)
  emitInfo(stream, 'native')

  const detect = async () => {
    if (!videoRef.value) return
    try {
      const barcodes = await detector.detect(videoRef.value)
      if (barcodes.length > 0) {
        // Le BarcodeDetector natif Android retourne parfois les EAN-13 commençant
        // par 0 sous forme UPC-A (12 chiffres) — on restitue le zéro initial.
        const raw = barcodes[0].rawValue as string
        const normalized = /^\d{12}$/.test(raw) ? '0' + raw : raw
        emit('scan', normalized)
        stopCamera()
        return
      }
    } catch { /* frame non prête */ }
    nativeAnimFrame = requestAnimationFrame(detect)
  }
  nativeAnimFrame = requestAnimationFrame(detect)
}

function stopNative() {
  if (nativeAnimFrame !== null) {
    cancelAnimationFrame(nativeAnimFrame)
    nativeAnimFrame = null
  }
  if (videoRef.value?.srcObject) {
    const stream = videoRef.value.srcObject as MediaStream
    stream.getTracks().forEach(t => t.stop())
    videoRef.value.srcObject = null
  }
}

// --- Décodeur ZXing (iPhone et navigateurs sans BarcodeDetector) ---
const hints = new Map()
hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13])
const reader = new BrowserMultiFormatReader(hints, { delayBetweenScanAttempts: 150 })
let zxingControls: { stop: () => void } | null = null

function onZxingResult(result: any, err: any) {
  if (result) {
    emit('scan', result.getText())
    stopCamera()
  }
  if (err && !(err instanceof NotFoundException)) {
    emit('error', err as Error)
  }
}

async function runZxing(stream: MediaStream) {
  if (!videoRef.value) return
  // ZXing décode directement notre flux (résolution, objectif, mise au point,
  // torche réglés ci-dessus) au lieu d'en rouvrir un second.
  zxingControls = await reader.decodeFromStream(stream, videoRef.value, onZxingResult)
  emit('loaded', true)
  emitInfo(stream, 'zxing')
}

function stopZxing() {
  zxingControls?.stop()
  zxingControls = null
}

// --- Ancienne méthode (≤ 0.7.3), uniquement pour la page Debug ---
const legacyReader = new BrowserMultiFormatReader(hints)
let legacyOrphan: MediaStream | null = null

async function startLegacy() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
  })
  cameras.value = await listBackCameras()
  setupTrack(stream)
  if (!videoRef.value) return
  if (useNative) {
    await runNative(stream)
    return
  }
  // Reproduit le défaut d'origine : ZXing rouvre un second flux par défaut
  videoRef.value.srcObject = stream
  legacyOrphan = stream
  zxingControls = await legacyReader.decodeFromVideoDevice(undefined, videoRef.value, onZxingResult)
  emit('loaded', true)
  const used = videoRef.value.srcObject as MediaStream | null
  emitInfo(used ?? stream, 'zxing', used && used !== stream ? [stream] : [])
}

// --- Lancement ---
let generation = 0

async function startCamera() {
  const gen = ++generation
  error.value = null
  try {
    if (props.legacy) {
      await startLegacy()
      return
    }
    const stream = await openStream()
    if (gen !== generation) {
      stream.getTracks().forEach(t => t.stop())
      return
    }
    await setupTrack(stream)
    if (useNative) {
      try {
        await runNative(stream)
      } catch {
        // Si le natif échoue (ex: format non supporté), on bascule sur ZXing
        stopNative()
        stream.getTracks().forEach(t => t.stop())
        const fallback = await openStream()
        await setupTrack(fallback)
        await runZxing(fallback)
      }
    } else {
      await runZxing(stream)
    }
  } catch (err) {
    error.value = 'Failed to access camera'
    emit('error', err as Error)
  }
}

function stopCamera() {
  generation++
  stopNative()
  stopZxing()
  legacyOrphan?.getTracks().forEach(t => t.stop())
  legacyOrphan = null
}

onMounted(startCamera)
onUnmounted(stopCamera)
</script>

<template>
  <div class="relative w-full h-full max-h-100">
    <div v-if="error" class="p-4 bg-red-50 text-red-600 rounded-lg mb-4">
      {{ error }}
    </div>

    <div class="relative w-full h-full overflow-hidden bg-black">
      <video ref="videoRef" class="w-full h-full object-cover" playsinline muted></video>

      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          class="w-95 h-64 border-2 border-white rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
        ></div>
      </div>

      <select
        v-if="!legacy && cameras.length > 1"
        :value="currentDeviceId"
        @change="selectCamera(($event.target as HTMLSelectElement).value)"
        class="absolute top-2 left-2 right-2 text-sm rounded bg-black/60 text-white border-none"
        aria-label="Objectif"
      >
        <option v-for="cam in cameras" :key="cam.deviceId" :value="cam.deviceId">
          {{ cam.label || 'Caméra' }}
        </option>
      </select>

      <div
        v-if="zoomRange"
        class="absolute bottom-4 left-4 right-20 flex items-center gap-2 text-white text-xs"
      >
        <span>×{{ zoom.toFixed(1) }}</span>
        <input
          type="range"
          class="flex-1"
          :min="zoomRange.min"
          :max="zoomRange.max"
          :step="zoomRange.step"
          :value="zoom"
          @change="applyZoom(Number(($event.target as HTMLInputElement).value))"
          aria-label="Zoom"
        />
      </div>

      <button
        v-if="torchSupported"
        @click="toggleTorch"
        class="absolute bottom-4 right-4 p-3 rounded-full bg-black/50 text-white"
        :class="{ 'bg-yellow-400/80 text-black': torchOn }"
        aria-label="Torche"
      >
        <BoltIcon v-if="!torchOn" class="h-6 w-6" />
        <BoltSlashIcon v-else class="h-6 w-6" />
      </button>
    </div>
  </div>
</template>
