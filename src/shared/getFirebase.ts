import { initializeApp, getApps, getApp } from "firebase/app";

import firebaseConfig from "./config/firebaseConfig";

export default function getFirebase() {
  if (!getApps().length) {
    const app = initializeApp(firebaseConfig);
    return app;
  } else {
    return getApp();
  }
}
