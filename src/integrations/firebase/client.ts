// Firebase configuration for the application
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCm1C_xqfjDV3hk20WQM14FOEBlmev3tXU",
  authDomain: "scrapwrk.firebaseapp.com",
  projectId: "scrapwrk",
  storageBucket: "scrapwrk.firebasestorage.app", // Updated to correct bucket name
  messagingSenderId: "69387562853",
  appId: "1:69387562853:web:8c431801529a517c853b8c",
  measurementId: "G-V4N98TECB5"
};

// Manually construct a storage URL for direct access
export const constructStorageUrl = (objectPath: string) => {
  const encodedPath = encodeURIComponent(objectPath);
  return `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${encodedPath}?alt=media`;
};

// Get public URLs without using the SDK (for CORS workaround)
export const getDirectImageUrl = (imageName: string, useCacheBusting = false) => {
  const encodedImageName = encodeURIComponent(imageName);
  const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${encodedImageName}?alt=media`;
  
  // Add cache busting only if requested
  return useCacheBusting ? `${baseUrl}&t=${Date.now()}` : baseUrl;
};

// Initialize Firebase
let app;
let db;
let storage;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Firestore
  db = getFirestore(app);
  
  // Initialize Storage
  storage = getStorage(app);
} catch (error) {
  console.error("[FIREBASE] Error initializing Firebase:", error);
  
  // Create fallback objects so the app doesn't crash
  app = {} as any;
  db = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false, data: () => ({}) }),
        set: () => Promise.resolve()
      }),
      where: () => ({
        get: () => Promise.resolve({ empty: true, docs: [] })
      }),
      add: () => Promise.resolve({ id: 'dummy-id' }),
      get: () => Promise.resolve({ empty: true, docs: [] })
    })
  } as any;
  
  storage = {
    ref: () => ({
      put: () => Promise.resolve(),
      getDownloadURL: () => Promise.resolve('/placeholder.svg')
    })
  } as any;
}

// Export the variables
export { app, db, storage }; 