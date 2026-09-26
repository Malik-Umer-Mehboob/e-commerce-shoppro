# ShopPro — Free Deployment Guide

Teen free services istemaal hongi:

| Kya | Kahan | Free plan |
|---|---|---|
| Database (MySQL) | **Aiven** | 1 GB, credit card nahi |
| Backend (Laravel) | **Render** | 512 MB RAM, credit card nahi |
| Frontend (React) | **Vercel** | Hobby plan |

Backend aur frontend ki repos alag hain aur **alag alag deploy hoti hain**. Bas ek doosre ka URL pata hona chahiye. Isi tarteeb se chalein: **Database → Backend → Frontend → Backend ko frontend ka URL.**

---

## Step 1: Database (Aiven)

1. [aiven.io](https://aiven.io) par GitHub se sign up karein.
2. **Create service → MySQL → Free plan** → apne qareeb ka region chunein → Create.
3. Service **Running** ho jaye to **Overview** mein yeh cheezein note karein: `Host`, `Port`, `User` (aam taur par `avnadmin`), `Password`, `Database name` (aam taur par `defaultdb`).
4. Wahin **CA certificate → Download** karein. File Notepad mein kholein, poora text (`-----BEGIN CERTIFICATE-----` se `-----END CERTIFICATE-----` tak) copy kar lein.

## Step 2: APP_KEY banayein (apne computer par)

```bash
cd shoppro-backend
php artisan key:generate --show
```

Jo `base64:...` aaye, copy kar lein. (Yeh aap ki `.env` nahi badalta.)

## Step 3: Backend (Render)

1. [render.com](https://render.com) par GitHub se sign up karein.
2. **New → Blueprint** → `shoppro-backend` repo chunein. Render `render.yaml` khud parh lega.
3. Render yeh values maangega:

| Naam | Value |
|---|---|
| `APP_KEY` | Step 2 wala `base64:...` |
| `APP_URL` | abhi `https://shoppro-backend.onrender.com` likh dein (Step 3.5 mein check karein) |
| `FRONTEND_URL` | abhi `http://localhost:5173` (Step 5 mein badlenge) |
| `CORS_ALLOWED_ORIGINS` | abhi `*` (Step 5 mein badlenge) |
| `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | Aiven se |
| `DB_SSL_CA_CERT` | Aiven ka poora CA certificate text |
| `ADMIN_EMAIL` | apna admin email |
| `ADMIN_PASSWORD` | **naya, mazboot** password (purana nahi — woh GitHub par public hai) |

4. **Apply** dabayein. Pehla deploy 5-10 minute leta hai. Logs mein `apache2 -D FOREGROUND` aa jaye to backend chal raha hai.
5. Service ke upar jo URL likha hai (jaise `https://shoppro-backend-xxxx.onrender.com`) copy karein. Agar yeh Step 3 wale `APP_URL` se alag hai to **Environment** mein `APP_URL` theek kar dein.
6. Browser mein `https://<aap-ka-url>/api/homepage` kholein — `"success":true` aana chahiye.

### Backend ki auto-deploy on karein

1. Render → service → **Settings → Deploy Hook** → URL copy karein.
2. GitHub → `shoppro-backend` repo → **Settings → Secrets and variables → Actions**:
   - **Secrets** tab → New: `RENDER_DEPLOY_HOOK_URL` = woh URL
   - **Variables** tab → New: `DEPLOY_ENABLED` = `true`

Ab `main` par har push: tests → Docker build → pass hon to Render deploy.

## Step 4: Frontend (Vercel)

1. [vercel.com](https://vercel.com) par GitHub se sign up karein.
2. **Add New → Project** → `e-commerce-shoppro` repo → **Import**.
3. **Environment Variables** mein add karein:

| Naam | Value |
|---|---|
| `VITE_API_URL` | `https://<backend-url>/api` |
| `VITE_STORAGE_URL` | `https://<backend-url>/storage` |

4. **Deploy** dabayein. Jo URL mile (jaise `https://e-commerce-shoppro.vercel.app`) copy karein.

### Frontend ki auto-deploy on karein

Teen cheezein chahiye:
- **Token:** Vercel → avatar → **Account Settings → Tokens → Create** → copy
- **Org ID:** Account Settings → **General** → "Vercel ID" (team ho to Team Settings → Team ID)
- **Project ID:** Project → **Settings → General** → Project ID

GitHub → `e-commerce-shoppro` repo → **Settings → Secrets and variables → Actions**:
- **Secrets:** `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- **Variables:** `DEPLOY_ENABLED` = `true`

`vercel.json` mein Vercel ki apni auto-deploy band hai, taake deploy **sirf tests pass hone ke baad** pipeline se ho.

## Step 5: Backend ko frontend ka URL batayein

Render → backend service → **Environment**:
- `FRONTEND_URL` = `https://<frontend-url>`
- `CORS_ALLOWED_ORIGINS` = `https://<frontend-url>`

**Save** → Render dobara deploy karega. Phir frontend URL kholein aur admin se login karke check karein.

---

## Free plan ki hadood (zaroor parhein)

- **Pehli request slow:** 15 minute koi visitor na aaye to Render backend so jata hai. Agli request par jaagne mein takreeban 1 minute lagta hai.
- **Upload ki gayi images mit jati hain:** Render free par server ki files har restart/deploy par saaf ho jati hain. Product images aur avatars ke liye cloud storage (jaise Cloudinary) lagani hogi — yeh agla qadam hai.
- **Database:** Aiven free 1 GB hai, aur kaafi arsa istemaal na ho to band ho sakta hai (pehle email aati hai; dashboard se dobara on karein).
- **Emails:** abhi `MAIL_MAILER=log` hai, yani emails bheji nahi jatin. Gmail SMTP lagane ke liye Render mein `MAIL_MAILER=smtp`, `MAIL_HOST=smtp.gmail.com`, `MAIL_PORT=587`, `MAIL_USERNAME`, `MAIL_PASSWORD` (Gmail App Password), `MAIL_ENCRYPTION=tls`, `MAIL_FROM_ADDRESS` add karein.

## Masla aaye to

- **Render deploy fail:** service → **Logs** → aakhri red lines copy karein.
- **Frontend khulta hai lekin products nahi aate:** `F12 → Console`. `CORS` likha ho to Step 5 check karein. `localhost:8000` likha ho to Vercel ke `VITE_API_URL` check karke dobara deploy karein.
- **Database connection error:** `DB_SSL_CA_CERT` mein poora certificate hai ya nahi, aur `DB_PORT` Aiven wala hai (3306 nahi hota).
