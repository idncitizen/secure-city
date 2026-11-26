import { getApps, getApp, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function normalizePrivateKey(rawKey) {
  if (!rawKey) return undefined;
  return rawKey
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n")
    .trim();
}

function getAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (projectId && clientEmail && privateKey) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  return initializeApp();
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}
