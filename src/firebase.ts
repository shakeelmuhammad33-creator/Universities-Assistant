import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, query, where, getDoc } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';

let db: any = null;
let auth: any = null;

try {
  // We'll try to dynamically import the config if it exists
  // In this environment, it might be generated later
  const configPromise = import('./firebase-applet-config.json' as any);
  
  configPromise.then(config => {
    if (!getApps().length) {
      const app = initializeApp(config.default);
      db = getFirestore(app);
      auth = getAuth(app);
    }
  }).catch(() => {
    console.warn('Firebase config not found. Running in local mode.');
  });
} catch (e) {
  console.warn('Firebase setup failed. Running in local mode.');
}

export { db, auth };

export async function signIn() {
  if (!auth) return null;
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export function onAuth(callback: (user: User | null) => void) {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
}
