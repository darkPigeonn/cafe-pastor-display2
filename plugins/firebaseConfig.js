// plugins/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

export default defineNuxtPlugin((nuxtApp) =>{
    const config = useRuntimeConfig();
    const firebaseConfig = {
        apiKey: config.public.firebaseApiKey,
        authDomain: config.public.firebaseAuthDomain,
        projectId: config.public.firebaseProjectId,
        storageBucket: config.public.firebaseStorageBucket,
        messagingSenderId: config.public.firebaseMessagingSenderId,
        appId: config.public.firebaseAppId,
        measurementId: config.public.firebaseMeasurementId,
    };
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);

    const storage = getStorage(app);
    const firestore = getFirestore(app);
  
    nuxtApp.provide('firebaseStorage', storage);
    nuxtApp.provide('firebaseFirestore', firestore);
    
    nuxtApp.provide('auth', auth);
    nuxtApp.provide('db', db);
})


