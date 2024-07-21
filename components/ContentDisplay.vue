<template>
  <div>
    <div class="d-flex align-items-center justify-content-center">
      <div v-if="loading" class="text-center">
        <span class="spinner-border" role="status" aria-hidden="true"></span>
        <span class="sr-only">Loading...</span>
      </div>
      <div v-else>
        <div v-if="content">
          <div v-if="!hasInteracted" class="text-center">
            <button class="btn btn-primary mb-4" @click="startContent">Start Content</button>
            <div class="text-center">
            </div>
          </div>
          <div v-else>
            <Carousel2 />
            <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
              <div class="carousel-indicators">
                <button v-for="(image, index) in content.images" :key="index" type="button" :data-bs-target="'#carouselExampleIndicators'" :data-bs-slide-to="index" :class="{ active: index === 0 }" aria-current="true" aria-label="Slide {{ index + 1 }}"></button>
              </div>
              <div class="carousel-inner">
                <div v-for="(image, index) in content.images" :key="index" :class="['carousel-item', { active: index === 0 }]">
                  <img :src="image.url" class="d-block w-100" :alt="image.name">
                </div>
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
            <div class="mt-5">
              <h5>Background Music</h5>
              <div v-for="(music, index) in content.musics" :key="index">
                <div v-if="music.url.includes('youtube')">
                  <iframe class="w-100" height="315" :src="music.url" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <div v-else>
                  <audio :src="music.url" ref="audioElements" controls class="w-100 my-2" @ended="playNextAudio(index)"></audio>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No content available.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useNuxtApp } from 'nuxt/app'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'

const nuxtApp = useNuxtApp()
const firestore = nuxtApp.$firebaseFirestore

const content = ref(null)
const loading = ref(true)
const audioElements = ref([])
const hasInteracted = ref(false)

const fetchContent = async () => {
  try {
    const q = query(collection(firestore, 'contents'), orderBy('datePublish', 'desc'), limit(1))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      content.value = doc.data()
      console.log(content.value);
    })
    loading.value = false
  } catch (error) {
    console.error('Error fetching content:', error)
    loading.value = false
  }
}

const playNextAudio = (currentIndex) => {
  const nextIndex = currentIndex + 1
  if (nextIndex < audioElements.value.length) {
    audioElements.value[nextIndex].play()
  }
}

const startContent = () => {
  hasInteracted.value = true
  nextTick(() => {
    if (audioElements.value.length > 0) {
      audioElements.value[0].play()
    }
  })
}

onMounted(() => {
  fetchContent()
})
</script>

<style scoped>
.carousel-item img {
  max-height: 600px;
  object-fit: cover;
}
</style>
