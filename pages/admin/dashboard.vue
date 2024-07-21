<template>
    <div>
      <h1>Admin Dashboard</h1>
      <button @click="logout">Logout</button>
      
      <div>
        <h2>Create Item</h2>
        <form @submit.prevent="createItem">
          <input v-model="newItem.name" type="text" placeholder="Item Name" />
          <button type="submit">Create</button>
        </form>
      </div>
  
      <div>
        <h2>Items</h2>
        <ul>
          <li v-for="item in items" :key="item.id">
            {{ item.name }}
            <button @click="deleteItem(item.id)">Delete</button>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { signOut } from 'firebase/auth';
  import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
  import { useRouter } from 'vue-router';

  import { useNuxtApp } from '#app';
  const { $auth, $db} = useNuxtApp();
  const newItem = ref({ name: '' });
  const items = ref([]);
  const router = useRouter();
  
  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, 'items'));
    items.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };
  
  const createItem = async () => {
    try {
      await addDoc(collection(db, 'items'), newItem.value);
      newItem.value.name = '';
      fetchItems();
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };
  
  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'items', id));
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  
  const logout = async () => {
    try {
      await signOut($auth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  onMounted(() => {
    if (!$auth.currentUser) {
      router.push('/admin/login');
    } else {
      fetchItems();
    }
  });
  </script>
  