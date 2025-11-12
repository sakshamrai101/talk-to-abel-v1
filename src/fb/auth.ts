import firebase_app from './config'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
const auth = getAuth(firebase_app)

export default async function signUp(email: string, password: string) {
  let result = null,
    error = null
  let fireStore = null
  try {
    result = await createUserWithEmailAndPassword(auth, email, password)
    fireStore = getFirestore(firebase_app)
  } catch (e) {
    error = e
  }
  getFirestore
  return { result, error, fireStore }
}
