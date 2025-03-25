import { env } from "@/env";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore"

const initFirebaseAdmin = () => {
  const apps = getApps();

  if (!apps.length) {
    initializeApp({
      credential: cert({
        projectId: env.firebase.projectId,
        clientEmail: env.firebase.email,
        privateKey: env.firebase.key?.replace(/\\n/g, "\n")
      })
    })
  }

  return {
    auth: getAuth(),
    db: getFirestore()
  }
}

export const { auth, db } = initFirebaseAdmin();