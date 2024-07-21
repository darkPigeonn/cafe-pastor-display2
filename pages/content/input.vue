<template>
    <div class="container mt-5">
      <div class="page-header">
        <h3>Form Input Content</h3>
      </div>
      <div class="page-body">
        <div class="form-group my-5">
          <label class="my-2">Tanggal Tayang</label>
          <input type="date" class="form-control" v-model="datePublish" />
        </div>
        <div class="form-group my-5">
          <label class="my-2">Pilih Gambar</label>
          <input type="file" class="form-control" multiple @change="previewImages" />
          <div class="preview-images my-3 d-flex flex-wrap">
            <div v-for="(image, index) in imagePreviews" :key="index" class="image-preview">
              <img :src="image" class="img-thumbnail m-2" style="width: 100px; height: 100px; object-fit: cover;" />
              <input type="number" class="form-control mt-1" v-model.number="imageOrders[index]" placeholder="Order" />
            </div>
          </div>
        </div>
        <div class="form-group my-5">
          <label class="my-2">Pilih Musik</label>
          <div class="mb-3">
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="upload" value="upload" v-model="musicInputType">
              <label class="form-check-label" for="upload">Upload</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="youtube" value="youtube" v-model="musicInputType">
              <label class="form-check-label" for="youtube">YouTube Link</label>
            </div>
          </div>
          <div v-if="musicInputType === 'upload'">
            <input type="file" class="form-control" multiple @change="previewMusic" />
            <div class="preview-music my-3">
              <div v-for="(music, index) in musicPreviews" :key="index" class="music-preview">
                <audio :src="music" controls class="w-100 my-2"></audio>
                <input type="number" class="form-control mt-1" v-model.number="musicOrders[index]" placeholder="Order" />
              </div>
            </div>
          </div>
          <div v-if="musicInputType === 'youtube'">
            <input type="text" class="form-control" placeholder="Enter YouTube Link" v-model="youtubeLink" @input="previewYouTubeMusic" />
            <div class="preview-youtube-music my-3" v-if="youtubePreview">
              <iframe class="w-100" height="315" :src="youtubePreview" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              <input type="number" class="form-control mt-1" v-model.number="youtubeOrder" placeholder="Order" />
            </div>
          </div>
        </div>
        <button class="btn btn-primary" @click="uploadFiles">Upload</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage'
  import { collection, addDoc, serverTimestamp ,setDoc, doc, query, where, getDocs, updateDoc } from 'firebase/firestore'
  
  const nuxtApp = useNuxtApp()
  const storage = nuxtApp.$firebaseStorage
  const firestore = nuxtApp.$firebaseFirestore
  
  const datePublish = ref('')
  const imagePreviews = ref([])
  const musicPreviews = ref([])
  const youtubeLink = ref('')
  const youtubePreview = ref('')
  const youtubeOrder = ref(0)
  const musicInputType = ref('upload')
  const imageOrders = ref([])
  const musicOrders = ref([])
  const selectedImages = ref([])
  const selectedMusic = ref([])
  
  const previewImages = (event) => {
    const files = event.target.files
    imagePreviews.value = []
    selectedImages.value = []
    imageOrders.value = []
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader()
      reader.onload = (e) => {
        imagePreviews.value.push(e.target.result)
      }
      reader.readAsDataURL(files[i])
      selectedImages.value.push(files[i])
      imageOrders.value.push(0)
    }
    console.log(imagePreviews.value);
    console.log(selectedImages.value);
  }
  
  const previewMusic = (event) => {
    const files = event.target.files
    musicPreviews.value = []
    selectedMusic.value = []
    musicOrders.value = []
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader()
      reader.onload = (e) => {
        musicPreviews.value.push(e.target.result)
      }
      reader.readAsDataURL(files[i])
      selectedMusic.value.push(files[i])
      musicOrders.value.push(0)
    }
  }
  
  const previewYouTubeMusic = () => {
    const youtubeID = youtubeLink.value.split('v=')[1]
    const ampersandPosition = youtubeID ? youtubeID.indexOf('&') : -1
    if (ampersandPosition !== -1) {
      youtubePreview.value = `https://www.youtube.com/embed/${youtubeID.substring(0, ampersandPosition)}`
    } else {
      youtubePreview.value = `https://www.youtube.com/embed/${youtubeID}`
    }
  }
  
  const uploadFiles = async () => {
    try {
      const images = []
      const musics = []
  
      // Upload Images
      for (let i = 0; i < selectedImages.value.length; i++) {
        const file = selectedImages.value[i]
        const storageReference = storageRef(storage, `images/${file.name}`)
        await uploadBytes(storageReference, file)
        const downloadURL = await getDownloadURL(storageReference)
        images.push({ name: file.name, url: downloadURL, order: imageOrders.value[i] })
      }
  
      // Upload Music
      for (let i = 0; i < selectedMusic.value.length; i++) {
        const file = selectedMusic.value[i]
        const storageReference = storageRef(storage, `music/${file.name}`)
        await uploadBytes(storageReference, file)
        const downloadURL = await getDownloadURL(storageReference)
        musics.push({ name: file.name, url: downloadURL, order: musicOrders.value[i] })
      }
  
      if (musicInputType.value === 'youtube') {
        musics.push({
          name: 'YouTube Link',
          url: youtubePreview.value,
          order: youtubeOrder.value
        })
      }
  
      // Save to Firestore
      const datePublishValue = datePublish.value ? new Date(datePublish.value) : null;

      if (datePublishValue) {
        // Buat query untuk memeriksa apakah ada dokumen dengan datePublish yang sama
        const q = query(collection(firestore, 'contents'), where('datePublish', '==', datePublishValue));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Jika ada dokumen dengan datePublish yang sama, tampilkan alert konfirmasi
          const userConfirmed = confirm('A document with the same datePublish already exists. Do you want to overwrite it?');

          if (userConfirmed) {
            // Jika pengguna mengkonfirmasi, perbarui dokumen yang ada
            const docId = querySnapshot.docs[0].id; // Ambil ID dokumen pertama yang ditemukan
            await updateDoc(doc(firestore, 'contents', docId), {
              datePublish: datePublishValue,
              updatedAt: serverTimestamp(),
              status: true,
              images,
              musics
            });
            alert('Document updated successfully!');
          } else {
            // Jika pengguna tidak mengkonfirmasi, hentikan fungsi
            return;
          }
        } else {
          // Jika tidak ada dokumen dengan datePublish yang sama, simpan dokumen baru
          await addDoc(collection(firestore, 'contents'), {
            datePublish: datePublishValue,
            createdAt: serverTimestamp(),
            status: true,
            images,
            musics
          });
          alert('Files uploaded successfully!');
        }
      } else {
        // Jika datePublishValue tidak ada, simpan dokumen baru
        await addDoc(collection(firestore, 'contents'), {
          datePublish: datePublishValue,
          createdAt: serverTimestamp(),
          status: true,
          images,
          musics
        });
        alert('Files uploaded successfully!');
      }
      alert('Files uploaded successfully!')
    } catch (error) {
      console.error('Error uploading files:', error)
      alert('Error uploading files. Please try again.')
    }
  }


  const sendControl = async (command) => {
  try {
    await setDoc(doc(firestore, 'controls', 'playback'), { command });
    alert(command)
  } catch (error) {
    console.error("Error sending control:", error);
  }
};
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
  