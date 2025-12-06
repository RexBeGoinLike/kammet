import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function fetchStoreList() {
  try {
    const querySnapshot = await getDocs(collection(db, 'stores'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
}