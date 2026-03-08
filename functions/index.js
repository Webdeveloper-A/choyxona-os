const functions = require("firebase-functions");
const admin = require("firebase-admin");

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