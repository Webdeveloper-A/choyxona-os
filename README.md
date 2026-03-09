# choyxona-os / Restaurant POS

Bu loyiha Firebase Auth va Firestore asosidagi restoran POS tizimini namoyish etadi.

## O'rnatish

1. **Firebase loyihasini yarating va konfiguratsiyani o'rnating.**
   - Firebase Console'da yangi loyiha yarating.
   - Authentication (Email/Password va Anonymous) va Firestore'ni yoqing.

2. **Environment variables sozlang:**
   - `.env.example` faylini `.env` ga nusxalang.
   - Firebase Console'dan qiymatlarni oling va `.env` ga qo'ying:
     - Project settings > General > Your apps > Web app > Config
     - Qiymatlarni nusxalab, `.env` ga joylang.

3. **Service Account kaliti:**
   - Firebase Console > Project settings > Service accounts > Generate new private key
   - Yuklab olingan JSON faylini `service-account.json` sifatida saqlang (gitignore'da).
   - Environment variable: `GOOGLE_APPLICATION_CREDENTIALS=./service-account.json` (funktsiyalar yoki server ishga tushganda kerak).

4. **Node.js paketlari (server/Admin):**
   - `npm install`  (menyu va funksiyalarning bir qismi shu papkada ishlaydi)
   - Admin SDK uchun: `npm install firebase-admin dotenv`

5. **Firebase Cloud Functions (ixtiyoriy):**
   - `cd functions && npm install` (agar hali o'rnatilmagan bo'lsa).
   - Loyihaga yangi `addStaff` callable funktsiyasi qo'shildi, u orqali brauzerdan yangi xodim yaratish mumkin.
   - Agar brauzerda CORS bilan bog'liq xatolar yuzaga kelsa yoki function qaytmayotgan bo'lsa, u holda funksiyalar hali deploy qilinmagan bo'lishi mumkin – **`firebase deploy --only functions`** ni ishlating.
   - Shuningdek `addStaffHttp` http endpoint ham mavjud, u CORS sarlavhasini avtomatik qo'shadi; POST so'rov yuborib, Authorization: Bearer &lt;ID token&gt; qo'shishingiz mumkin.

6. **Git sozlang:**
   - Git o'rnating agar yo'q bo'lsa.
   - `git init` (agar repo yo'q bo'lsa)
   - `git add .`
   - `git commit -m "Initial commit"`
   - GitHub'ga push qiling.

## Xavfsizlik

- Service account fayllarini GitHub'ga yuklamang.
- `.env` faylini ignore qiling.
- Agar kalitlar oshkor bo'lsa, yangisini yarating va eskisini o'chiring.
- Brauzerda hech qachon to'liq admin JSON yoki parollar saqlanmaydi.

## Ishga tushirish

- Frontend: Fayllarni oddiy HTTP server bilan oching (Live Server, `python -m http.server` va hokazo).
- Admin sahifasida yangi xodim qo'shish uchun sahifadagi “+ Yangi xodim qo'shish” tugmasidan foydalaning;
  u sizdan email, parol, ismi va rolni so'raydi va backendga so'rov yuboradi.
- Yangi xodim yaratish faqat `admin` roliga ega foydalanuvchilar uchun ochiq.

## Firebase Rules

(...)  ## qoidalar qismini hozirgacha bo'ladi (kattalashishi mumkin)

## Keyingi qadamlar

- Git status tekshiring: `git status` – maxfiy fayllar ko'rinmasligi kerak.
- Agar tarixni tozalash kerak: `git filter-repo --invert-paths --paths-from-file .gitignore` (filter-repo o'rnating).
