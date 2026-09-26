# ShopPro Frontend — Testing Guide

## 1. Automated tests (apne computer par)

```bash
npm install
npm run lint     # code ki galtiyan (errors pipeline rok dete hain, warnings nahi)
npm test         # unit tests ek dafa chalao
npm run test:watch   # code likhte waqt tests khud chalte rahein
npm run build    # production build check
```

Tests `__tests__` folders mein hain, file ka naam `*.test.js` ya `*.test.jsx` hota hai.

## 2. CI/CD pipeline (GitHub Actions)

File: `.github/workflows/ci-cd.yml`

- **Har push aur Pull Request par (CI):** lint → tests → build. Kuch bhi fail ho to GitHub par red ❌ aata hai.
- **Deploy (CD):** sirf `main` branch par, aur sirf jab aap ise on karein.

Result dekhne ke liye: GitHub repo → **Actions** tab.

### Deploy on karne ke liye (jab server ready ho)

Repo → **Settings → Secrets and variables → Actions**

**Variables** tab:
| Naam | Value |
|---|---|
| `DEPLOY_ENABLED` | `true` |
| `VITE_API_URL` | `https://api.yourdomain.com/api` |
| `VITE_STORAGE_URL` | `https://api.yourdomain.com/storage` |

**Secrets** tab:
| Naam | Value |
|---|---|
| `SSH_HOST` | server ka IP ya domain |
| `SSH_USER` | server ka username |
| `SSH_PRIVATE_KEY` | SSH private key (poori, BEGIN se END tak) |
| `SSH_PORT` | aam taur par `22` (optional) |
| `FRONTEND_PATH` | server par folder, jaise `/var/www/shoppro-frontend` |

Jab tak `DEPLOY_ENABLED` set nahi, pipeline sirf test karegi, deploy nahi.

## 3. Manual testing checklist

Backend (`php artisan serve`) aur frontend (`npm run dev`) dono chala kar `http://localhost:5173` kholein.
Har item check karke ✅ lagayein. Browser mein `F12 → Console` khula rakhein; koi **red error** aaye to note karein.

### Guest (bina login)
- [ ] Home page khulta hai, products ki tasveerein aati hain
- [ ] Shop page: products list, pagination (agla/pichla page)
- [ ] Search mein likhein — typing rokne ke baad results badalte hain
- [ ] Category filter kaam karta hai
- [ ] Product detail page: tasveerein, qeemat, reviews, rating
- [ ] Wishlist ❤️ dabane par login page par bhejta hai
- [ ] Compare mein 4 se zyada products add nahi hote
- [ ] Blog, Help Center pages khulte hain

### Customer (`@gmail.com` se register karein)
- [ ] Register → login
- [ ] Ghalat password par error message aur "attempts remaining"
- [ ] Cart: add, quantity badlein, remove
- [ ] Wishlist: add aur **remove** (pehle remove par crash hota tha)
- [ ] Checkout: address, shipping charge, coupon, COD se order place
- [ ] Order confirmation page, My Orders mein order dikhe
- [ ] Order cancel (24 ghante ke andar)
- [ ] Review likhein
- [ ] Loyalty page khulta hai (pehle crash hota tha)
- [ ] Profile: naam aur avatar badlein, password change
- [ ] Logout

### Seller (`@yahoo.com` se register karein)
- [ ] Register → admin approval se pehle dashboard band hai
- [ ] Admin approve kare → seller login
- [ ] Product add (tasveer ke saath), edit, delete
- [ ] Sirf approved categories mein product ban sakta hai
- [ ] Category request bhejna
- [ ] Orders aur analytics pages

### Admin
- [ ] Dashboard ke numbers (orders, revenue, users)
- [ ] Seller approve/reject, user block/unblock
- [ ] Product approve/reject (approve ke baad shop mein dikhe)
- [ ] Order status badlein, rider assign karein
- [ ] COD order delivered → payment "paid" ho jaye
- [ ] Coupons, categories, shipping zones, warehouses
- [ ] Blog post likhein (editor sahi khule)
- [ ] Reports aur system logs

### Rider (`@rider.shoppro.com`) aur Support (`@support.shoppro.com`)
- [ ] Admin approval ke baad login
- [ ] Rider: assigned delivery → Picked Up → Delivered
- [ ] Support: tickets dekhein aur reply karein

### Mobile aur speed
- [ ] `F12` → phone icon — mobile size par sab pages theek dikhein
- [ ] `F12 → Lighthouse` → Performance report chalayein, score note karein
