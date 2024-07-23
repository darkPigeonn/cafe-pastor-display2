<template>
  <div class="container mt-5">
    <div v-if="loading" class="loading">
      Memuat...
    </div>
    <div v-else>
      <div class="page-header">
        <h3>Form Edit Content</h3>
      </div>
      <div class="page-body">
        <div class="form-group my-2">
          <label class="my-2">Tanggal Tayang</label>
          <input type="date" class="form-control" v-model="datePublish" />
        </div>
        <div class="form-group my-2">
          <label class="my-2">Pilih Gambar</label>
          <input type="file" class="form-control" multiple @change="previewImages" />
          <div class="preview-images my-3 d-flex flex-wrap">
            <div v-for="(image, index) in imagePreviews" :key="index" class="image-preview position-relative">
              <img :src="image.url ?? image" class="img-thumbnail m-2" style="width: 100px; height: 100px; object-fit: cover;" />
              <button class="btn btn-danger position-absolute top-0 end-0 m-2" @click="removeImage(index)">X</button>
            </div>
          </div>
        </div>
  
        <button class="btn btn-primary" @click="uploadFiles">Upload</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDownloadURL, ref as storageRef, uploadBytes, deleteObject } from 'firebase/storage'
import { collection, addDoc, serverTimestamp, setDoc, doc, query, where, getDocs, updateDoc, getDoc } from 'firebase/firestore'
import { useRoute } from 'vue-router'

const nuxtApp = useNuxtApp()
const storage = nuxtApp.$firebaseStorage
const firestore = nuxtApp.$firebaseFirestore

const datePublish = ref('')
const imagePreviews = ref([])
const selectedImages = ref([])
const imageOrders = ref([])
const route = useRoute()
const content = ref({})
const loading = ref(true)

const removeImage = async (index) => {
const image = imagePreviews.value[index]
// Hapus gambar dari array di client
imagePreviews.value.splice(index, 1)
selectedImages.value.splice(index, 1)
imageOrders.value.splice(index, 1)

// Hapus gambar dari Firebase Storage jika ada
if (image.url) {
  const imageRef = storageRef(storage, `images/${image.name}`)
  await deleteObject(imageRef)
}

// Update Firestore dengan menghapus gambar dari dokumen
const docId = route.params.id
const docRef = doc(firestore, 'contents', docId)
const docSnap = await getDoc(docRef)
if (docSnap.exists()) {
  const data = docSnap.data()
  const existingImages = data.images || []
  const updatedImages = existingImages.filter(img => img.url !== image.url)
  await updateDoc(docRef, { images: updatedImages })
}
}

const previewImages = (event) => {
const files = event.target.files
for (let i = 0; i < files.length; i++) {
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreviews.value.push({ url: e.target.result, name: files[i].name })
  }
  reader.readAsDataURL(files[i])
  selectedImages.value.push(files[i])
  imageOrders.value.push(imageOrders.value.length + 1) // Atur urutan gambar
}
}

const uploadFiles = async () => {
try {
  const newImages = []
  const musics = []

  // Upload Images
  for (let i = 0; i < selectedImages.value.length; i++) {
    const file = selectedImages.value[i]
    const storageReference = storageRef(storage, `images/${file.name}`)
    await uploadBytes(storageReference, file)
    const downloadURL = await getDownloadURL(storageReference)
    newImages.push({ name: file.name, url: downloadURL, order: imageOrders.value[i] })
  }

  // Save to Firestore
  const datePublishValue = datePublish.value ? new Date(datePublish.value) : null

  if (datePublishValue) {
    const q = query(collection(firestore, 'contents'), where('datePublish', '==', datePublishValue))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id
      const docRef = doc(firestore, 'contents', docId)
      const docSnap = await getDoc(docRef)
      const existingData = docSnap.data()
      const existingImages = existingData.images || []

      // Gabungkan gambar yang ada dengan gambar baru
      const allImages = [...existingImages, ...newImages]

      await updateDoc(docRef, {
        datePublish: datePublishValue,
        updatedAt: serverTimestamp(),
        status: true,
        images: allImages,
        musics
      })
      alert('Document updated successfully!')
    } else {
      await addDoc(collection(firestore, 'contents'), {
        datePublish: datePublishValue,
        createdAt: serverTimestamp(),
        status: true,
        images: newImages,
        musics
      })
      alert('Files uploaded successfully!')
    }
  } else {
    await addDoc(collection(firestore, 'contents'), {
      datePublish: datePublishValue,
      createdAt: serverTimestamp(),
      status: true,
      images: newImages,
      musics
    })
    alert('Files uploaded successfully!')
  }
} catch (error) {
  console.error('Error uploading files:', error)
  alert('Error uploading files. Please try again.')
}
}

const sendControl = async (command) => {
try {
  await setDoc(doc(firestore, 'controls', 'playback'), { command })
  alert(command)
} catch (error) {
  console.error("Error sending control:", error)
}
}

const fetchContentDetail = async () => {
try {
  const docRef = doc(firestore, 'contents', route.params.id)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const data = docSnap.data()
    const datePublishFormatted = data.datePublish.toDate().toISOString().split('T')[0]
    content.value = {
      id: docSnap.id,
      ...data,
      datePublish: datePublishFormatted
    }
    imagePreviews.value = data.images
    datePublish.value = datePublishFormatted
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

onMounted(fetchContentDetail)
</script>


<style scoped>
.preview-images img {
  margin-right: 10px;
}
.preview-music audio {
  display: block;
  margin-bottom: 10px;
}
.preview-youtube-music iframe {
  width: 100%;
  max-width: 560px;
  height: 315px;
}
.image-preview,
.music-preview {
  margin-right: 10px;
}
</style>
