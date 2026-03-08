# Restaurant POS System

Bu loyihada Firebase Firestore va Auth ishlatiladi.

## O'rnatish

1. **Firebase loyihasini yarating va konfiguratsiyani o'rnating.**
   - Firebase Console'da yangi loyiha yarating.
   - Authentication va Firestore'ni yoqing.

2. **Environment variables sozlang:**
   - `.env.example` faylini `.env` ga nusxalang.
   - Firebase Console'dan qiymatlarni oling va `.env` ga qo'ying:
     - Project settings > General > Your apps > Web app > Config
     - Qiymatlarni nusxalab, `.env` ga joylang.

3. **Service Account kaliti:**
   - Firebase Console > Project settings > Service accounts > Generate new private key
   - Yuklab olingan JSON faylini `service-account.json` sifatida saqlang (gitignore'da).
   - Environment variable: `GOOGLE_APPLICATION_CREDENTIALS=./service-account.json`

4. **Node.js paketlari:**
   - `npm install`
   - Admin SDK uchun: `npm install firebase-admin dotenv`

5. **Git sozlang:**
   - Git o'rnating agar yo'q bo'lsa.
   - `git init` (agar repo yo'q bo'lsa)
   - `git add .`
   - `git commit -m "Initial commit"`
   - GitHub'ga push qiling.

## Xavfsizlik

- Service account fayllarini GitHub'ga yuklamang.
- `.env` faylini ignore qiling.
- Agar kalitlar oshkor bo'lsa, yangisini yarating va eskisini o'chiring.

## Ishga tushirish

- Frontend: Fayllarni serverda oching (Live Server yoki Python server).
- Admin skriptlari: `node set-role.js` (rol berish uchun).

## Firebase Rules

Firestore va Auth qoidalari xavfsizlik uchun sozlangan bo'lishi kerak. Masalan:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Keyingi qadamlar

- Git status tekshiring: `git status` – maxfiy fayllar ko'rinmasligi kerak.
- Agar tarixni tozalash kerak: `git filter-repo --invert-paths --paths-from-file .gitignore` (filter-repo o'rnating).