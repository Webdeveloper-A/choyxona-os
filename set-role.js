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

async function setUserRole(uid, role) {
  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    console.log(`Muvaffaqiyatli: ${uid} ga ${role} roli qo'shildi`);
  } catch (error) {
    console.error('Xato:', error);
  }
}

