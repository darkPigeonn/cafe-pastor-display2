<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>


<script setup>
import { useRouter, useRoute } from 'vue-router';
import { onMounted, watch } from 'vue';
import { useNuxtApp } from '#app';

const { $auth, $db} = useNuxtApp();

const router = useRouter();
const route = useRoute();

// watch(() => route.fullPath, () => {
//   checkAuth();
// });

// const checkAuth = () => {
//   if (route.path.startsWith('/') && !$auth.currentUser) {
//     router.push('/admin/login');
//   }
// };

// onMounted(() => {
//   checkAuth();
// });
</script>
