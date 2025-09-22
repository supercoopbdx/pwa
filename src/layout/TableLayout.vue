<template>
  <!-- Conteneur scrollable -->
  <div class="overflow-x-auto">
    <table class="table-auto text-center text-gray-700 w-full min-w-[400px]">
      <thead class="text-xs uppercase bg-gray-50">
        <slot name="thead"></slot>
      </thead>
      <tbody>
        <slot name="tbody"></slot>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* Empêche les retours à la ligne et ajoute les ... en cas de dépassement */
td, th {
  @apply truncate max-w-[150px] whitespace-nowrap;
}
</style>
