const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require('cors')({ origin: true });

admin.initializeApp();

exports.notifyOfitsiantWhenReady = functions.firestore
  .document("orders/{orderId}")
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();

    // Agar status "tayyor" ga o‘zgargan bo‘lsa va oldin boshqa bo‘lgan bo‘lsa
    if (newData.status === "tayyor" && previousData.status !== "tayyor") {
      const placeType = newData.placeType || 'table';
      const placeName = newData.placeName || newData.tableNumber || 'noma\'lum';
      const orderId = context.params.orderId;

      // Ofitsiantning FCM tokenini olish (buyurtmada saqlangan deb hisoblaymiz)
      // Real loyihada buyurtma yuborilganda ofitsiant tokenini saqlash kerak
      const ofitsiantToken = newData.ofitsiantToken; // buyurtmada saqlangan token

      if (!ofitsiantToken) {
        console.log("Ofitsiant tokeni topilmadi:", orderId);
        return null;
      }

      const prefix = placeType === 'room' ? 'Xona ' : 'Stol #';
      const label = `${prefix}${placeName}`;
      const message = {
        notification: {
          title: "Buyurtma tayyor!",
          body: `${label} tayyor! Mijozga yetkazib bering.`,
        },
        data: {
          orderId: orderId,
          placeType,
          placeName,
        },
        token: ofitsiantToken,
      };

      try {
        await admin.messaging().send(message);
        console.log("Bildirishnoma yuborildi:", orderId);
      } catch (error) {
        console.error("Bildirishnoma yuborishda xato:", error);
      }
    }

    return null;
  });

// Callable function for creating new staff accounts
exports.addStaff = functions.https.onCall(async (data, context) => {
  // security checks
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Kirishingiz talab etiladi');
  }

  const requesterUid = context.auth.uid;
  const requesterDoc = await admin.firestore().collection('users').doc(requesterUid).get();
  const requesterData = requesterDoc.exists ? requesterDoc.data() : {};
  if (requesterData.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Faqat adminlar yangi xodim qo`sha oladi');
  }

  const { email, password, name, role } = data;
  if (!email || !password || !name || !role) {
    throw new functions.https.HttpsError('invalid-argument', 'Email, parol, ism va rol kiritilishi kerak');
  }

  const allowedRoles = ['admin', 'ofitsiant', 'kassa', 'oshxona'];
  if (!allowedRoles.includes(role.toLowerCase())) {
    throw new functions.https.HttpsError('invalid-argument', 'Roli noto`g`ri');
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });
    // save to Firestore as well (front-end code relies on this collection)
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email,
      name,
      role: role.toLowerCase(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    // optional: set custom claim for role in auth token
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: role.toLowerCase() });

    return { uid: userRecord.uid };
  } catch (err) {
    throw new functions.https.HttpsError('internal', err.message || 'Ichki server xatosi');
  }
});

// HTTP endpoint alternative with explicit CORS support
exports.addStaffHttp = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Only POST allowed');
    }

    // verify Firebase ID token if provided
    const authHeader = req.headers.authorization || '';
    let requesterRole = null;
    if (authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1];
      try {
        const decoded = await admin.auth().verifyIdToken(idToken);
        const doc = await admin.firestore().collection('users').doc(decoded.uid).get();
        requesterRole = doc.exists ? doc.data().role : null;
      } catch (e) {
        console.warn('Token verify failed', e);
      }
    }

    if (requesterRole !== 'admin') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const { email, password, name, role } = req.body;
    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const allowedRoles = ['admin', 'ofitsiant', 'kassa', 'oshxona'];
    if (!allowedRoles.includes(role.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    try {
      const userRecord = await admin.auth().createUser({ email, password, displayName: name });
      await admin.firestore().collection('users').doc(userRecord.uid).set({
        email,
        name,
        role: role.toLowerCase(),
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      await admin.auth().setCustomUserClaims(userRecord.uid, { role: role.toLowerCase() });
      return res.json({ uid: userRecord.uid });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });
});

  db.collection("orders")
  .where("ofitsiantId", "==", auth.currentUser.uid)
  .where("status", "==", "tayyor")
  .onSnapshot(snapshot => {
    snapshot.forEach(doc => {
      const order = doc.data();

      Toastify({
        text: `Stol #${order.tableNumber} tayyor!`,
        duration: 8000,
        close: true,
        gravity: "top",
        position: "center",
        style: { background: "linear-gradient(to right, #16a34a, #22c55e)" }
      }).showToast();

      // 🔊 Ovoz
      new Audio("https://assets.mixkit.co/sfx/preview/mixkit-bell-notification-1-100.mp3")
        .play()
        .catch(() => {});
    });
  });
