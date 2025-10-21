<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { BarcodeDetectorPolyfill } from '@undecaf/barcode-detector-polyfill'

declare global {
  interface Window {
    BarcodeDetector: typeof BarcodeDetectorPolyfill
  }
}

try {
  window.BarcodeDetector.getSupportedFormats()
} catch {
  window.BarcodeDetector = BarcodeDetectorPolyfill
}

const emit = defineEmits<{
  loaded: [playing: boolean]
  scan: [barcode: string]
  error: [error: Error]
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const stream = ref<MediaStream | null>(null)
const error = ref<string | null>(null)

let animationFrameId: number | null = null

async function startCamera() {
  try {
    error.value = null
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    })

    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
      await videoRef.value.play()
      emit('loaded', true)

      await startScanning()
    }
  } catch (err) {
    error.value = 'Failed to access camera'
    emit('error', err as Error)
  }
}

function stopCamera() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop())
    stream.value = null
  }

  if (videoRef.value) {
    videoRef.value.srcObject = null
  }
}

const startScanning = async () => {
  if (!videoRef.value || !canvasRef.value) return

  const video = videoRef.value
  const canvas = canvasRef.value
  const context = canvas.getContext('2d')

  if (!context) return

  const detector = new window.BarcodeDetector({ formats: ['ean_13'] })

  async function scan() {
    if (
      !context ||
      !video.readyState ||
      video.readyState !== video.HAVE_ENOUGH_DATA
    ) {
      animationFrameId = requestAnimationFrame(scan)
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    try {
      const barcodes = await detector.detect(canvas)

      if (barcodes.length > 0) {
        const barcode = barcodes[0].rawValue
        emit('scan', barcode)
        // stopCamera()
        // return
      }
    } catch (err) {
      error.value = 'Barcode detection error'
      emit('error', err as Error)
    }

    animationFrameId = requestAnimationFrame(scan)
  }

  animationFrameId = requestAnimationFrame(scan)
}

onMounted(() => {
  startCamera()
})

onUnmounted(() => {
  stopCamera()
})
</script>

<template>
  <div class="relative w-full h-full">
    <div v-if="error" class="p-4 bg-red-50 text-red-600 rounded-lg mb-4">
      {{ error }}
    </div>

    <div class="relative w-full h-full overflow-hidden bg-black">
      <video ref="videoRef" class="w-full h-full object-cover" autoplay playsinline muted></video>
      <canvas ref="canvasRef" class="hidden"></canvas>

      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          class="w-64 h-64 border-2 border-white rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
        ></div>
      </div>
    </div>
  </div>
</template>
