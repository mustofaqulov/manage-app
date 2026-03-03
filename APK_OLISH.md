# 📱 APK Olish - To'liq Yo'riqnoma

## 🎯 GitHub Actions orqali APK olish

### 1. GitHub'ga Kiring

Brauzerda quyidagi linkni oching:

```
https://github.com/mustofaqulov/manage-app/actions
```

### 2. Workflow Holatini Ko'ring

Sahifada **"Build Android APK"** workflow ko'rinadi.

**Status belgilari:**
- 🟡 **Sariq doira** = Hozir ishlayapti (kutish kerak)
- ✅ **Yashil galochka** = Tayyor! (APK yuklab olish mumkin)
- ❌ **Qizil X** = Xatolik (menga yozing, tuzataman)

### 3. Workflow Detaillariga Kiring

1. Eng yuqoridagi workflow ni bosing (oxirgi commit)
2. Workflow sahifasi ochiladi
3. Qadamlarni ko'rishingiz mumkin:
   - Setup Node.js ✅
   - Setup Java ✅
   - Install dependencies ✅
   - Build Android Debug APK ✅
   - Upload APK ✅

### 4. APK Yuklab Olish

Build tugagach (3-5 daqiqa):

1. Workflow sahifasini pastga scroll qiling
2. **"Artifacts"** bo'limini toping
3. **"app-debug"** ni bosing
4. ZIP fayl yuklab olinadi (~50-80 MB)
5. ZIP'ni oching
6. Ichida `app-debug.apk` fayl bor! 📦

---

## 📲 Telefonqa O'rnatish

### Variant 1: USB orqali

1. USB kabel bilan telefonni kompyuterga ulang
2. APK faylni telefon storage'ga ko'chiring
3. Telefonda "Files" yoki "My Files" ni oching
4. APK faylni toping va bosing
5. "Install unknown apps" ruxsatini bering
6. "Install" ni bosing

### Variant 2: Google Drive orqali

1. APK faylni Google Drive'ga upload qiling
2. Telefondan Google Drive'ni oching
3. APK faylni yuklab oling
4. Yuklab olingandan keyin o'rnating

### Variant 3: Telegram orqali

1. O'zingizga (Saved Messages) APK faylni yuboring
2. Telefondan Telegram'ni oching
3. APK'ni yuklab oling va oching
4. O'rnating

---

## 🔒 "Install Unknown Apps" Ruxsati

Agar telefon "Can't install unknown apps" desa:

1. **Settings** → **Security** ga kiring
2. **Install unknown apps** ni toping
3. **Chrome** yoki **Files** ni tanlang
4. **"Allow from this source"** ni yoqing ✓
5. Qaytib kelib APK'ni yana bosing

---

## ✅ O'rnatilgandan Keyin

1. Telefonda "Manage LC" ikonkasi paydo bo'ladi
2. Bosib oching
3. Login ekrani ochiladi
4. Telegram authentication orqali kiring

---

## 🔄 Yangi APK Kerak Bo'lsa

Agar kodni o'zgartirganingizdan keyin yangi APK kerak bo'lsa:

**Yo'l 1 - Avtomatik:**
```bash
git add .
git commit -m "yangilik qo'shildi"
git push origin main
# GitHub Actions avtomatik ishga tushadi
```

**Yo'l 2 - Manual:**
1. https://github.com/mustofaqulov/manage-app/actions ga kiring
2. "Build Android APK" ni bosing
3. "Run workflow" → "Run workflow" ni bosing
4. 3-5 daqiqa kuting
5. APK'ni yuklab oling

---

## ❌ Agar Xatolik Bo'lsa

GitHub Actions'da xatolik (qizil ❌) ko'rsangiz:

1. Workflow ni bosing
2. Qizil X belgisi bo'lgan qadamni bosing
3. Xatolik xabarini screenshot qiling
4. Menga yuboring, tuzataman!

---

## 📊 Hozirgi Holat

**Repository**: https://github.com/mustofaqulov/manage-app

**GitHub Actions**: https://github.com/mustofaqulov/manage-app/actions

**Eng oxirgi push**: ci: Add GitHub Actions workflow for Android APK build

**Workflow**: Build Android APK (avtomatik ishga tushdi!)

---

## 🎯 Keyingi Qadamlar

1. ✅ GitHub Actions page'ni oching
2. ✅ Workflow statusni kuzating (3-5 daqiqa)
3. ✅ APK yuklab oling
4. ✅ Telefonqa o'rnating
5. ✅ Test qiling!

---

**Savol bo'lsa, menga yozing!** 💪
