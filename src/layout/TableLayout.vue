<template>
  <div class="overflow-x-auto">
    <table class="table-auto text-left text-gray-700 w-full min-w-[400px]">
      <thead class="text-xs uppercase bg-gray-50">
        <slot name="thead"></slot>
      </thead>
      <tbody>
        <slot name="tbody"></slot>
      </tbody>
    </table>
  </div>
</template>
