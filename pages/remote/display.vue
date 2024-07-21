<!-- Contoh penggunaan dalam komponen Nuxt.js -->
<template>
    <div>
      <p>Current color: {{ color }}</p>
      <button @click="changeColor('blue')">Change Color</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useColor } from '@/composables/useColor';
  
  const { color, changeColor } = useColor();
  </script>
  