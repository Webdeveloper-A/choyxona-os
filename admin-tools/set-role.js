const admin = require('firebase-admin');

// Load service account from environment variable
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account.json';

let serviceAccount;
try {
  serviceAccount = require(serviceAccountPath);
} catch (error) {
  console.error('Service account file not found. Set GOOGLE_APPLICATION_CREDENTIALS environment variable.');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setRole(uid, role) {
  try {
    await admin.auth().setCustomUserClaims(uid, { role: role });
    console.log(`Muvaffaqiyat: ${uid} ga ${role} roli berildi`);
  } catch (error) {
    console.error('Xato:', error);
  }
}

// Misol uchun, foydalanuvchi UID va beriladigan rol