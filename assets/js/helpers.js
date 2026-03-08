/**
 * Shared Helper Functions for Choyxona OS
 * Used across multiple pages for consistency
 */

// Email validation
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Role-based colors for UI consistency
function getRoleColor(role) {
  if (!role) return "bg-gray-100 text-gray-700";
  switch (role.toLowerCase()) {
    case "admin": return "bg-red-100 text-red-800";
    case "ofitsiant": return "bg-blue-100 text-blue-800";
    case "kassa": return "bg-purple-100 text-purple-800";
    case "oshxona": return "bg-orange-100 text-orange-800";
    default: return "bg-gray-100 text-gray-700";
  }
}

// Table status colors for UI consistency
function getTableStatusColor(status) {
  if (!status) return "bg-gray-100 text-gray-700";
  switch (status.toLowerCase()) {
    case "bo'sh": return "bg-green-100 text-green-800";
    case "band": return "bg-red-100 text-red-800";
    case "tozalanyapti": return "bg-yellow-100 text-yellow-800";
    default: return "bg-gray-100 text-gray-700";
  }
}

// Firebase error code to friendly message mapping
function getFriendlyErrorMessage(errorCode, errorMessage) {
  const errorMap = {
    'auth/invalid-email': 'Email manzili noto\'g\'ri formatda.',
    'auth/user-not-found': 'Bu email bilan foydalanuvchi topilmadi.',
    'auth/wrong-password': 'Parol noto\'g\'ri.',
    'auth/too-many-requests': 'Ko\'p urinishlar. Keyinroq urinib ko\'ring.',
    'auth/user-disabled': 'Bu akkaunt faol emas.',
    'auth/email-already-in-use': 'Bu email allaqachon ro\'yxatdan o\'tgan.',
    'auth/weak-password': 'Parol juda oson. Kamida 6 ta belgi kiriting.',
    'auth/operation-not-allowed': 'Bu amal hozir ishlamaydi.',
    'auth/network-request-failed': 'Internet ulanishni tekshiring.',
  };

  if (errorCode && errorMap[errorCode]) {
    return errorMap[errorCode];
  }

  if (errorMessage) {
    if (errorMessage.includes('topilmadi')) return "Foydalanuvchi ma'lumotlari bazada yo'q.";
    if (errorMessage.includes('rol')) return "Rol aniqlanmadi yok noto'g'ri.";
    return errorMessage;
  }

  return 'Xato yuz berdi. Qayta urinib ko\'ring.';
}

// Safe Firestore timestamp to localized date string
function formatTimestamp(timestamp) {
  if (!timestamp || !timestamp.toDate) {
    return 'vaqt noma\'lum';
  }
  return timestamp.toDate().toLocaleString('uz-UZ', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

// Format currency with Uzbek locale
function formatCurrency(amount) {
  return amount.toLocaleString('uz-UZ') + ' so\'m';
}

// Safe unsubscribe for Firestore listeners
function safeUnsubscribe(unsubscribeFn) {
  if (unsubscribeFn && typeof unsubscribeFn === 'function') {
    try {
      unsubscribeFn();
    } catch (e) {
      console.warn('Error unsubscribing:', e);
    }
  }
}

// Show temporary error/success message with fallback
function showNotification(message, type = 'info', duration = 3000) {
  if (typeof Toastify !== 'undefined') {
    let backgroundColor = '#3b82f6'; // info blue
    if (type === 'success') backgroundColor = '#10b981'; // green
    if (type === 'error') backgroundColor = '#ef4444'; // red
    if (type === 'warning') backgroundColor = '#f59e0b'; // amber

    try {
      Toastify({
        text: message,
        duration: duration,
        close: true,
        gravity: "top",
        position: "center",
        style: { background: backgroundColor }
      }).showToast();
    } catch (e) {
      console.warn('Toastify failed, using fallback', e);
      showFallbackNotification(message, type);
    }
  } else {
    showFallbackNotification(message, type);
  }
}

// Fallback notification system without Toastify
function showFallbackNotification(message, type = 'info') {
  const container = document.getElementById('fallback-notification-container');
  if (!container) {
    const newContainer = document.createElement('div');
    newContainer.id = 'fallback-notification-container';
    newContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99999;
      max-width: 400px;
      pointer-events: none;
    `;
    document.body.appendChild(newContainer);
  }

  const notification = document.createElement('div');
  let bgColor = '#3b82f6'; // info
  let textColor = 'white';
  if (type === 'success') bgColor = '#10b981';
  if (type === 'error') bgColor = '#ef4444';
  if (type === 'warning') bgColor = '#f59e0b';

  notification.style.cssText = `
    background: ${bgColor};
    color: ${textColor};
    padding: 12px 20px;
    border-radius: 8px;
    margin-bottom: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-family: sans-serif;
    pointer-events: auto;
    word-break: break-word;
  `;
  notification.textContent = message;

  const container2 = document.getElementById('fallback-notification-container');
  container2.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Log user action for debugging (with optional on-screen feedback)
function logAction(action, details = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    action,
    details,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  console.log(`[${action}]`, logEntry);

  // if desired show an unobtrusive toast for certain actions
  if (action === 'order_ready_notified') {
    const placeType = details.placeType || 'stol';
    const placeName = details.placeName || details.tableNumber || '–';
    const orderId = details.orderId || 'unknown';
    const prefix = placeType === 'room' ? 'Xona' : 'Stol #';
    showNotification(`[LOG] ${prefix}${placeName} (ID: ${orderId}) tayyor bo'ldi`, 'info', 4000);
  }

  // Future hook: send to analytics/remote logging if needed
}

