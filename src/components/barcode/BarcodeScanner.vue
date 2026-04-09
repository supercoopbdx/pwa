<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { BarcodeFormat, DecodeHintType, NotFoundException } from '@zxing/library'

const props = defineProps<{ debug?: boolean }>()

const emit = defineEmits<{
  loaded: [playing: boolean]
  scan: [barcode: string]
  error: [error: Error]
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const error = ref<string | null>(null)

// --- Debug info ---
type DecoderType = 'native (BarcodeDetector)' | 'zxing (JS)'
const decoderType = ref<DecoderType | null>(null)
const nativeSupported = typeof (window as any).BarcodeDetector !== 'undefined'
const scanCount = ref(0)
const lastBarcode = ref<string | null>(null)

// --- Native BarcodeDetector path ---
let nativeAnimFrame: number | null = null

async function startNative() {
  const BarcodeDetector = (window as any).BarcodeDetector
  const detector = new BarcodeDetector({ formats: ['ean_13', 'ean_8'] })
  decoderType.value = 'native (BarcodeDetector)'

  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
  if (!videoRef.value) return
  videoRef.value.srcObject = stream
  await videoRef.value.play()
  emit('loaded', true)

  const detect = async () => {
    if (!videoRef.value) return
    try {
      const barcodes = await detector.detect(videoRef.value)
      if (barcodes.length > 0) {
        const code = barcodes[0].rawValue as string
        scanCount.value++
        lastBarcode.value = code
        emit('scan', code)
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

// --- ZXing path ---
const hints = new Map()
hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13])
const reader = new BrowserMultiFormatReader(hints)
let zxingControls: { stop: () => void } | null = null

async function startZxing() {
  if (!videoRef.value) return
  decoderType.value = 'zxing (JS)'
  zxingControls = await reader.decodeFromVideoDevice(undefined, videoRef.value, (result, err) => {
    if (result) {
      scanCount.value++
      lastBarcode.value = result.getText()
      emit('scan', result.getText())
      stopCamera()
    }
    if (err && !(err instanceof NotFoundException)) {
      emit('error', err as Error)
    }
  })
  emit('loaded', true)
}

function stopZxing() {
  zxingControls?.stop()
  zxingControls = null
}

// --- Dispatch ---
async function startCamera() {
  try {
    if (nativeSupported) {
      await startNative()
    } else {
      await startZxing()
    }
  } catch (err) {
    // Si la tentative native échoue (ex: format non supporté), on bascule sur ZXing
    if (nativeSupported && zxingControls === null) {
      try {
        stopNative()
        await startZxing()
      } catch (e) {
        error.value = 'Failed to access camera'
        emit('error', e as Error)
      }
    } else {
      error.value = 'Failed to access camera'
      emit('error', err as Error)
    }
  }
}

function stopCamera() {
  stopNative()
  stopZxing()
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
      <video ref="videoRef" class="w-full h-full object-cover"></video>

      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          class="w-95 h-64 border-2 border-white rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
        ></div>
      </div>

      <!-- Debug overlay -->
      <div
        v-if="props.debug"
        class="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs font-mono rounded p-2 pointer-events-none space-y-0.5"
      >
        <div>BarcodeDetector natif : <span :class="nativeSupported ? 'text-green-400' : 'text-red-400'">{{ nativeSupported ? 'supporté' : 'non supporté' }}</span></div>
        <div>Décodeur actif : <span class="text-yellow-300">{{ decoderType ?? '…' }}</span></div>
        <div>Scans : {{ scanCount }}</div>
        <div v-if="lastBarcode">Dernier : {{ lastBarcode }}</div>
      </div>
    </div>
  </div>
</template>
