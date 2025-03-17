<script setup>
import HelloWorld from './components/HelloWorld.vue'
import PWABadge from './components/PWABadge.vue'
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/favicon.svg" class="logo" alt="pwa logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="pwa" />
  <PWABadge />
</template>

