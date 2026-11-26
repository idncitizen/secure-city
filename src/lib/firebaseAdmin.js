import { getApps, getApp, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function normalizePrivateKey(rawKey) {
  if (!rawKey) return undefined;
  return rawKey.replace(/\\n/g, "\n").replace(/^"|"$/g, "");
}

function getAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
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

  // Fallback jika berjalan di lingkungan GCP / emulator dengan ADC
  return initializeApp();
}

const adminApp = getAdminApp();
export const adminDb = getFirestore(adminApp);
