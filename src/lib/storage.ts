import { University, Program } from '../types';
import { INITIAL_UNIVERSITIES, INITIAL_PROGRAMS } from '../data';
import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc,
  query,
  onSnapshot
} from 'firebase/firestore';

const STORAGE_KEYS = {
  UNIVERSITIES: 'urdu_uni_assistant_universities',
  PROGRAMS: 'urdu_uni_assistant_programs'
};

export class StorageService {
  private static isFirebaseReady(): boolean {
    return db !== null;
  }

  // Universities
  static async getUniversities(): Promise<University[]> {
    // 1. Try Firebase
    if (this.isFirebaseReady()) {
      try {
        const querySnapshot = await getDocs(collection(db!, 'universities'));
        if (!querySnapshot.empty) {
          return querySnapshot.docs.map(doc => doc.data() as University);
        }
      } catch (error) {
        console.error('Firestore Error (getUniversities):', error);
      }
    }

    // 2. Try LocalStorage
    const local = localStorage.getItem(STORAGE_KEYS.UNIVERSITIES);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Local Storage Parse Error:', e);
      }
    }

    // 3. Fallback to Initial Data
    return INITIAL_UNIVERSITIES;
  }

  static async saveUniversity(university: University): Promise<void> {
    // 1. Local Storage (Immediate feedback)
    const universities = await this.getUniversities();
    const index = universities.findIndex(u => u.id === university.id);
    if (index >= 0) {
      universities[index] = university;
    } else {
      universities.push(university);
    }
    localStorage.setItem(STORAGE_KEYS.UNIVERSITIES, JSON.stringify(universities));

    // 2. Firebase (Cloud)
    if (this.isFirebaseReady()) {
      try {
        await setDoc(doc(db!, 'universities', university.id), university);
      } catch (error) {
        console.error('Firestore Error (saveUniversity):', error);
      }
    }
  }

  static async deleteUniversity(id: string): Promise<void> {
    // 1. Local Storage
    const universities = (await this.getUniversities()).filter(u => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.UNIVERSITIES, JSON.stringify(universities));

    // 2. Firebase
    if (this.isFirebaseReady()) {
      try {
        await deleteDoc(doc(db!, 'universities', id));
      } catch (error) {
        console.error('Firestore Error (deleteUniversity):', error);
      }
    }
  }

  // Programs
  static async getPrograms(): Promise<Program[]> {
    if (this.isFirebaseReady()) {
      try {
        const querySnapshot = await getDocs(collection(db!, 'programs'));
        if (!querySnapshot.empty) {
          return querySnapshot.docs.map(doc => doc.data() as Program);
        }
      } catch (error) {
        console.error('Firestore Error (getPrograms):', error);
      }
    }

    const local = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Local Storage Parse Error:', e);
      }
    }

    return INITIAL_PROGRAMS;
  }

  static async saveProgram(program: Program): Promise<void> {
    const programs = await this.getPrograms();
    const index = programs.findIndex(p => p.id === program.id);
    if (index >= 0) {
      programs[index] = program;
    } else {
      programs.push(program);
    }
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));

    if (this.isFirebaseReady()) {
      try {
        await setDoc(doc(db!, 'programs', program.id), program);
      } catch (error) {
        console.error('Firestore Error (saveProgram):', error);
      }
    }
  }

  static async deleteProgram(id: string): Promise<void> {
    const programs = (await this.getPrograms()).filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));

    if (this.isFirebaseReady()) {
      try {
        await deleteDoc(doc(db!, 'programs', id));
      } catch (error) {
        console.error('Firestore Error (deleteProgram):', error);
      }
    }
  }
}
