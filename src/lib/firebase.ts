import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

async function initFirebase() {
  try {
    const configPath = '../../firebase-applet-config.json';
    // @ts-ignore
    const firebaseConfig = await import(/* @vite-ignore */ configPath);
    
    if (firebaseConfig.default) {
      app = initializeApp(firebaseConfig.default);
      db = getFirestore(app, firebaseConfig.default.firestoreDatabaseId);
      auth = getAuth(app);
      console.log('Firebase initialized successfully');
    }
  } catch (error) {
    console.warn('Firebase configuration not found or invalid. Falling back to local storage.');
  }

  return { app, db, auth };
}

export { initFirebase, db, auth };
