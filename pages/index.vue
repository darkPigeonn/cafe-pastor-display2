<template>
  <div class="dashboard">
     <div class="page-header">
      <h3>Cafe Pastor</h3>
    </div>
    <div class="page-body">
      <NuxtLink to="/content/input" class="btn btn-primary mb-3">+ Tambah</NuxtLink>
      <div class="title-page">
        <h3>Daftar Tayang</h3>
      </div>
      <div class="content-page">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>No.</th>
              <th>Tanggal</th>
              <th>Jumlah Gambar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(content, index) in contents" :key="content.id">
              <td>{{ index + 1 }}</td>
              <td>{{ formatDate(content.datePublish) }}</td>
              <td>{{ content.images.length }}</td>
              <td>
                <NuxtLink :to="`content/`+content.id" class="btn btn-primary">Lihat</NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNuxtApp } from 'nuxt/app'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import moment from 'moment'

const { $firebaseFirestore } = useNuxtApp()
const loading = ref(true)
const contents = ref([])

const fetchContent = async () => {
  try {
    const q = query(collection($firebaseFirestore, 'contents'), orderBy('datePublish', 'desc'))
    const querySnapshot = await getDocs(q)
    contents.value = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        datePublish: data.datePublish.toDate() // Convert Firebase Timestamp to Date
      }
    })
    loading.value = false
  } catch (error) {
    console.error('Error fetching content:', error)
    loading.value = false
  }
}

const formatDate = (date) => {
  return moment(date).format('DD-MMMM-YYYY')
}

onMounted(fetchContent)
</script>
