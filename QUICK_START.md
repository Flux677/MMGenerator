# 🚀 Quick Start - Deploy dalam 5 Menit

## 📁 Step 1: Persiapan Files (1 menit)

1. **Download/Extract semua files** ke folder `mythicmobs-generator/`

2. **Pastikan struktur seperti ini:**
   ```
   mythicmobs-generator/
   ├── public/
   │   ├── index.html
   │   ├── css/
   │   │   └── style.css
   │   └── js/
   │       ├── generator.js
   │       └── ui.js
   ├── api/
   │   └── generate.js
   ├── vercel.json
   ├── .gitignore
   └── README.md
   ```

3. **PENTING:** Jangan ada file `.env` atau API key di code!

---

## ☁️ Step 2: Deploy ke Vercel (2 menit)

### Via Vercel Dashboard (Paling Mudah):

1. **Buka:** https://vercel.com/signup
2. **Sign up** (gratis)
3. **Klik:** "Add New Project"
4. **Upload folder** `mythicmobs-generator/`
5. **Klik:** "Deploy"
6. **Tunggu** sampai selesai (30 detik - 1 menit)

✅ Deployment pertama selesai!

---

## 🔑 Step 3: Set API Key (1 menit)

**CRITICAL - Jangan skip!**

1. Di Vercel Dashboard, **klik project** yang baru di-deploy
2. Go to: **Settings** → **Environment Variables**
3. **Add Variable:**
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-api03-xxxxx` (API key Claude Anda)
   - **Environment:** ✅ Production, Preview, Development (centang semua)
4. **Klik:** "Save"

---

## 🔄 Step 4: Redeploy (1 menit)

**Wajib redeploy agar env variable aktif:**

1. Go to: **Deployments** tab
2. **Klik •••** (three dots) pada deployment teratas
3. **Klik:** "Redeploy"
4. **Tunggu** sampai selesai

✅ Setup complete!

---

## ✅ Step 5: Test (30 detik)

1. **Copy URL** dari Vercel (contoh: `https://your-project.vercel.app`)
2. **Buka URL** di browser
3. **Test generate:**
   - Pilih kategori: **Boss**
   - Tulis deskripsi: 
     ```
     Buat fire dragon boss dengan skill:
     - Fireball projectile
     - Fire breath area damage
     - Wing slam knockback
     Base mob: ENDER_DRAGON
     Disguise: player skin "FireDragon"
     ```
   - **Klik:** "Generate Mob"

4. **Tunggu 10-20 detik**
5. **Check hasil** di tabs: Mobs, Skills, Setup

✅ Jika berhasil = DONE! 🎉

---

## 🔒 Bonus: Make it Private (Opsional)

Agar hanya Anda yang bisa akses:

1. Go to: **Settings** → **General**
2. Scroll to: **Deployment Protection**
3. Enable: **Vercel Authentication**
4. Save

Sekarang perlu login Vercel untuk akses website.

---

## 🆘 Troubleshooting Cepat

### ❌ Error: "API key not configured"

**Fix:**
1. Check Settings → Environment Variables
2. Pastikan `ANTHROPIC_API_KEY` ada
3. Redeploy

### ❌ Error: "Failed to fetch"

**Fix:**
1. Check Vercel logs: Deployments → View Function Logs
2. Pastikan `/api/generate` accessible
3. Check browser console (F12)

### ❌ Response lambat/timeout

**Fix:**
1. Normal 10-30 detik untuk generate
2. Jika >60 detik = timeout
3. Coba prompt lebih simple dulu

### ❌ JSON parse error

**Fix:**
1. Issue dari Claude response
2. Try generate lagi
3. Simplify prompt

---

## 📖 Next Steps

### 1. Customize Prompt

Edit `api/generate.js` function `buildPrompt()` untuk customize AI behavior.

### 2. Add Features

- Rate limiting
- Save history
- Multiple AI models
- Custom templates

### 3. Read Full Docs

- `README.md` - Full documentation
- `SPAWNERS_GUIDE.txt` - Setup spawners
- `DEPLOYMENT_CHECKLIST.md` - Deploy checklist

---

## 🎯 Usage Tips

### Generate Boss yang Bagus

**Deskripsi harus detail:**
```
Buat boss Ice Lich dengan:

Stats:
- Health: 500
- Damage: 15
- Speed: normal

Skills:
1. Frost Nova - freeze area 10 block
2. Ice Spike - summon ice spike projectile
3. Blizzard - AOE damage + slow
4. Summon Frozen Minion - spawn 3 ice zombie

Phases:
- Phase 1 (100-50% HP): Normal attacks
- Phase 2 (<50% HP): Cast faster, summon more

Base mob: WITHER_SKELETON
Disguise: player "IceLich"
Particle: snowflake ambient
```

### Generate Dungeon Boss + Mobs

**Pilih kategori "Boss + Dungeon Mobs":**
```
Dungeon boss Necromancer dengan minions:

Boss: Necromancer
- Summon undead
- Life drain beam
- Dark ritual (heal + buff)
- Teleport when damaged

Minion 1: Skeleton Warrior (melee)
- Basic sword attack
- Shield bash

Minion 2: Zombie Brute (tank)
- High HP
- Slow but strong

Minion 3: Ghost (range)
- Floating mob
- Soul projectile

Base mobs: WITHER_SKELETON, ZOMBIE, SKELETON, VEX
All with LibDisguises
```

---

## ✨ Pro Tips

1. **Specific = Better Results**
   - Sebutkan exact skills
   - Detail damage/cooldown
   - Specify base mob type

2. **Reference Existing Content**
   - "Like Terraria's Eye of Cthulhu"
   - "Similar to Ender Dragon fight"
   - "Based on [anime character]"

3. **Test Incremental**
   - Start simple (1-2 skills)
   - Test di server
   - Generate advanced setelah tau works

4. **Mention LibDisguises**
   - Always specify disguise type
   - Player skin names or mob type
   - Check available disguises

5. **Balance Matters**
   - Request balanced stats
   - Reasonable cooldowns
   - Fair health/damage

---

## 📊 Cost Estimate

**Claude API Usage:**
- Per generate: ~$0.03 - $0.10
- $5 credit ≈ 50-150 generations
- Depends on complexity

**Tips hemat:**
- Clear, specific prompts
- Avoid over-complex requests
- Generate sekali, tweak manual

---

## 🎉 You're Ready!

Deploy successful = Tinggal pakai!

**Workflow:**
1. Buka URL Vercel
2. Pilih kategori
3. Describe mob detail
4. Generate
5. Download configs
6. Upload ke server
7. Test & adjust

Happy creating! 🚀

---

**Support:**
- Check README.md untuk details
- Read MythicMobs Wiki untuk syntax
- Vercel docs untuk deployment issues

**Remember:**
- ❌ Never commit API keys
- ✅ Always use Environment Variables
- ✅ Test di test server dulu
- ✅ Backup configs before applying