<template>
    <div class="container">
      <div class="page-header">
        <h3>Detail Konten</h3>
      </div>
      <div v-if="loading" class="loading">
        Memuat...
      </div>
      <div v-else class="page-body">
        <div class="content-detail">
          <h4>Tanggal Publikasi: {{ formatDate(content.datePublish) }}</h4>
          <!-- Tambahkan detail konten lainnya di sini -->
          <div class="preview-images my-3 d-flex flex-wrap">
            <div v-for="(image, index) in imagePreviews" :key="index" class="image-preview">
              <img :src="image.url" class="img-thumbnail m-2" style="width: 400%; height: 200px; object-fit: cover;" />
            </div>
          </div>
        </div>
        <div class="d-flex gap-3">
          <NuxtLink class="btn btn-warning" :to="`/content/edit/`+ content.id">Ubah</NuxtLink>
          <button class="btn btn-outline-primary" @click="sendControl(new Date())">Tayangkan</button>
        </div>
      </div>

    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useNuxtApp, useRoute } from 'nuxt/app'
  import { doc, getDoc, setDoc } from 'firebase/firestore'
  import moment from 'moment'
  
  const { $firebaseFirestore } = useNuxtApp()
  const loading = ref(true)
  const content = ref(null)
  const imagePreviews = ref([])
  
  const route = useRoute()
  const fetchContentDetail = async () => {
    try {
      const docRef = doc($firebaseFirestore, 'contents', route.params.slug)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        content.value = {
          id: docSnap.id,
          ...docSnap.data(),
          datePublish: docSnap.data().datePublish.toDate() // Convert Firebase Timestamp to Date
        }
        imagePreviews.value = docSnap.data().images
        console.log(content.value);
        loading.value = false
      } else {
        console.log('No such document!')
        loading.value = false
      }
    } catch (error) {
      console.error('Error fetching content detail:', error)
      loading.value = false
    }
  }
  
  const formatDate = (date) => {
    return moment(date).format('DD-MM-YYYY')
  }

  const sendControl = async (command) => {
    try {
        await setDoc(doc($firebaseFirestore, 'controls', 'playback'), { command });
       
    } catch (error) {
        console.error("Error sending control:", error);
    }
};
  
  onMounted(fetchContentDetail)
  </script>
  