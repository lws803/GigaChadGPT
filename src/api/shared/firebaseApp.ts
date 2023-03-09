import { initializeApp, cert, getApp, getApps } from "firebase-admin/app";

export const getFirebaseApp = () => {
  if (getApps().length > 0) return getApp();

  const firebasePrivateKey = JSON.parse(
    process.env.FIREBASE_PRIVATE_KEY!
  ).privateKey;

  return initializeApp({
    credential: cert({
      projectId: "chadgpt-d3458",
      privateKey: firebasePrivateKey,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    projectId: "chadgpt-d3458",
  });
};
