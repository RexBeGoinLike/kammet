import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../src/dataaccess/firebase'


export async function signIn(e, email, password) {
  e.preventDefault();
  await signInWithEmailAndPassword(auth, email, password);
}

export function getUser() {
  return auth.currentUser;
}

export async function signOut() {
  await signOut(auth);
}