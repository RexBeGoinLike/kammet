import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../src/dataaccess/firebase'

let user;

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

export function getUser () {
  return user;
}

export async function signOut(){
  await signOut(auth);
}