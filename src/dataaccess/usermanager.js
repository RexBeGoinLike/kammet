import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from './firebase'

export let user;
export async function signIn(e, email, password){
  e.preventDefault();
  await signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      user = auth.currentUser;
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      throw error;
    });
}

export async function signOut(){
  await signOut(auth);
}