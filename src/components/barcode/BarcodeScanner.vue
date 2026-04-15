<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { BarcodeFormat, DecodeHintType, NotFoundException } from '@zxing/library'
import { BoltIcon, BoltSlashIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits<{
  loaded: [playing: boolean]
  scan: [barcode: string]
  error: [error: Error]
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const error = ref<string | null>(null)

const nativeSupported = typeof (window as any).BarcodeDetector !== 'undefined'

// --- Torch ---
const torchSupported = ref(false)
const torchOn = ref(false)
let videoTrack: MediaStreamTrack | null = null

async function toggleTorch() {
  if (!videoTrack || !torchSupported.value) return
  torchOn.value = !torchOn.value
  await videoTrack.applyConstraints({ advanced: [{ torch: torchOn.value } as any] })
}

async function setupTrack(stream: MediaStream) {
  videoTrack = stream.getVideoTracks()[0]
  const capabilities = videoTrack.getCapabilities() as any
  torchSupported.value = !!capabilities.torch

  const advanced: Record<string, string>[] = []
  if (capabilities.focusMode?.includes('continuous')) {
    advanced.push({ focusMode: 'continuous' })
  }
  if (capabilities.exposureMode?.includes('continuous')) {
    advanced.push({ exposureMode: 'continuous' })
  }
  if (advanced.length > 0) {
    await videoTrack.applyConstraints({ advanced } as any)
  }
}

// --- Native BarcodeDetector path ---
let nativeAnimFrame: number | null = null

async function startNative() {
  const BarcodeDetector = (window as any).BarcodeDetector
  const detector = new BarcodeDetector({ formats: ['ean_13', 'ean_8'] })

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'environment',
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
  })
  setupTrack(stream)
  if (!videoRef.value) return
  videoRef.value.srcObject = stream
  await videoRef.value.play()
  emit('loaded', true)

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

// --- ZXing path ---
const hints = new Map()
hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13])
const reader = new BrowserMultiFormatReader(hints)
let zxingControls: { stop: () => void } | null = null

async function startZxing() {
  if (!videoRef.value) return
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'environment',
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
  })
  setupTrack(stream)
  videoRef.value.srcObject = stream
  zxingControls = await reader.decodeFromVideoDevice(undefined, videoRef.value, (result, err) => {
    if (result) {
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
