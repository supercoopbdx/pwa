<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { BarcodeFormat, DecodeHintType, NotFoundException } from '@zxing/library'

const emit = defineEmits<{
  loaded: [playing: boolean]
  scan: [barcode: string]
  error: [error: Error]
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const error = ref<string | null>(null)

const hints = new Map()
hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13])

const reader = new BrowserMultiFormatReader(hints)
let controls: { stop: () => void } | null = null

async function startCamera() {
  if (!videoRef.value) return
  try {
    controls = await reader.decodeFromVideoDevice(undefined, videoRef.value, (result, err) => {
      if (result) {
        emit('scan', result.getText())
        stopCamera()
      }
      if (err && !(err instanceof NotFoundException)) {
        emit('error', err as Error)
      }
    })
    emit('loaded', true)
  } catch (err) {
    error.value = 'Failed to access camera'
    emit('error', err as Error)
  }
}

function stopCamera() {
  controls?.stop()
  controls = null
}

onMounted(() => {
  startCamera()
})

onUnmounted(() => {
  stopCamera()
})
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
    </div>
  </div>
</template>
