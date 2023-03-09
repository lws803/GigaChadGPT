import { App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export class FirebaseAuthError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function verifyIdToken(firebaseApp: App, idToken: string) {
  try {
    const firebaseAuth = getAuth(firebaseApp);
    return await firebaseAuth.verifyIdToken(idToken);
  } catch (e) {
    const error = e as any;
    throw new FirebaseAuthError(error.errorInfo.message);
  }
}
