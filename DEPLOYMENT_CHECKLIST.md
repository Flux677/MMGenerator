# ✅ Deployment Checklist untuk Vercel

## 📦 Pre-Deployment

### 1. File Structure Check
```
mythicmobs-generator/
├── public/
│   ├── index.html          ✅
│   ├── css/
│   │   └── style.css       ✅
│   └── js/
│       ├── generator.js    ✅
│       └── ui.js           ✅
├── api/
│   └── generate.js         ✅
├── vercel.json             ✅
├── .gitignore              ✅
├── README.md               ✅
└── SPAWNERS_GUIDE.txt      ✅
```

### 2. Code Validation

- [ ] Tidak ada API key di file `.env` atau hardcoded
- [ ] Tidak ada `console.log()` yang sensitive
- [ ] Semua path relative sudah benar
- [ ] CSS/JS files linked dengan benar di HTML

### 3. Dependencies Check

- [ ] Tidak ada `node_modules/` di repository
- [ ] Tidak ada file `.env` di repository
- [ ] File `.gitignore` sudah correct

## 🚀 Deployment Steps

### Step 1: Vercel Account Setup

1. **Buat Vercel Account:**
   - Go to https://vercel.com/signup
   - Sign up dengan GitHub/GitLab/Email

2. **Install Vercel CLI (Optional):**
   ```bash
   npm install -g vercel
   ```

### Step 2: Upload Project

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to https://vercel.com/new
2. Klik "Upload" atau "Import Git Repository"
3. Upload folder `mythicmobs-generator/`
4. Wait for upload to complete

**Option B: Via Vercel CLI**

1. Open terminal di folder project
2. Run:
   ```bash
   vercel login
   vercel
   ```
3. Follow prompts:
   - Setup and deploy? **Y**
   - Which scope? **Your account**
   - Link to existing project? **N**
   - Project name? **mythicmobs-generator** (or custom)
   - Directory? **./public**
   - Override settings? **N**

### Step 3: Configure Environment Variables

**CRITICAL STEP - JANGAN SKIP!**

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Pilih project **mythicmobs-generator**
3. Go to **Settings** → **Environment Variables**
4. Add new variable:

   ```
   Name:  ANTHROPIC_API_KEY
   Value: sk-ant-api03-xxxxxxxxxxxxx
   
   Environment:
   ✅ Production
   ✅ Preview
   ✅ Development
   ```

5. Klik **Save**

### Step 4: Redeploy

**PENTING: Redeploy agar env variable aktif!**

1. Go to **Deployments** tab
2. Klik **•••** (three dots) pada latest deployment
3. Klik **Redeploy**
4. Wait for deployment to complete

### Step 5: Test Deployment

1. **Get Deployment URL:**
   - Format: `https://mythicmobs-generator-xxxxx.vercel.app`
   - Copy URL dari Vercel Dashboard

2. **Test Basic Access:**
   - [ ] Website loading correctly?
   - [ ] CSS styling muncul?
   - [ ] UI elements berfungsi?

3. **Test API:**
   - [ ] Buka browser DevTools (F12)
   - [ ] Go to Console tab
   - [ ] Fill form dan klik "Generate Mob"
   - [ ] Check for errors in Console
   - [ ] Response berhasil?

## 🔒 Make Deployment Private

### Option 1: Vercel Authentication (Free)

1. Go to **Settings** → **General**
2. Scroll to **Deployment Protection**
3. Enable **Vercel Authentication**
4. Save changes

Sekarang hanya orang dengan akses Vercel team yang bisa buka.

### Option 2: Password Protection

Tambahkan di `api/middleware.js`:

```javascript
export default function middleware(req) {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || authHeader !== 'Basic ' + btoa('username:password')) {
    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"'
      }
    });
  }
}
```

Update `vercel.json`:
```json
{
  "middleware": ["api/middleware.js"]
}
```

## 🧪 Testing Checklist

### Functionality Tests

- [ ] **Category Selection**
  - All radio buttons work?
  - Selection persists?

- [ ] **Description Input**
  - Textarea accepts input?
  - Validation shows error for empty input?

- [ ] **Optional Features**
  - Checkboxes toggle correctly?
  - Settings saved?

- [ ] **Generate Button**
  - Button disables during generation?
  - Loading indicator shows?
  - Progress messages update?

- [ ] **Results Display**
  - Tabs switch correctly?
  - Code displays in pre/code blocks?
  - Copy buttons work?
  - Download button works?

### API Tests

- [ ] **Successful Generation**
  - Test with simple request
  - Response received?
  - JSON parsed correctly?

- [ ] **Error Handling**
  - Test with empty description
  - Test with API key missing
  - Error messages display?

- [ ] **Edge Cases**
  - Very long description (>1000 chars)
  - Special characters in description
  - Multiple rapid requests

### Browser Compatibility

Test on:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

## 🐛 Common Issues & Solutions

### Issue 1: "API key not configured"

**Cause:** Environment variable tidak di-set atau tidak aktif

**Solution:**
1. Check Environment Variables di Vercel Dashboard
2. Pastikan `ANTHROPIC_API_KEY` ada
3. Redeploy project

### Issue 2: "Failed to fetch"

**Cause:** CORS issue atau API endpoint salah

**Solution:**
1. Check `/api/generate` accessible
2. Check Vercel logs untuk error
3. Pastikan vercel.json routes correct

### Issue 3: "JSON parse error"

**Cause:** Response dari Claude bukan JSON valid

**Solution:**
1. Check `api/generate.js` extractSection logic
2. Add better error handling
3. Log raw response untuk debug

### Issue 4: Build failed

**Cause:** Syntax error atau missing files

**Solution:**
1. Check Vercel build logs
2. Pastikan semua files ada
3. Check vercel.json syntax

### Issue 5: API timeout

**Cause:** Request terlalu lama (>60s)

**Solution:**
1. Increase maxDuration di vercel.json
2. Optimize prompt
3. Reduce max_tokens di API call

## 📊 Monitoring

### Check Logs

1. Go to **Deployments** → Click deployment
2. View **Function Logs**
3. Check for errors

### Check Usage

1. Go to **Analytics**
2. Monitor request counts
3. Check response times

### Cost Monitoring

- Check Anthropic usage: https://console.anthropic.com/usage
- Monitor credit penggunaan
- Set budget alerts

## 🔄 Update & Maintenance

### Update Code

1. Edit files locally
2. Push to Vercel:
   ```bash
   vercel --prod
   ```
   Or re-upload via dashboard

3. Check deployment status

### Update Environment Variables

1. Go to Settings → Environment Variables
2. Edit existing variable
3. Redeploy for changes to take effect

### Rollback Deployment

1. Go to Deployments
2. Find previous working deployment
3. Click **•••** → **Promote to Production**

## 📝 Post-Deployment Checklist

- [ ] URL works and accessible
- [ ] Environment variables set correctly
- [ ] API generation successful
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Private access configured (if needed)
- [ ] Documentation updated with URL
- [ ] Backup environment variables saved securely

## 🎉 Success Criteria

Your deployment is successful when:

✅ Website loads without errors
✅ Can select category and enter description
✅ Generate button triggers API call
✅ Claude API responds successfully
✅ Results display in tabs correctly
✅ Copy and download functions work
✅ No API key exposed in client code
✅ Environment variables secured in Vercel
✅ Private access configured (if required)

---

## 📞 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Support:** https://vercel.com/support
- **Claude API Docs:** https://docs.anthropic.com/
- **MythicMobs Wiki:** https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/home

---

**REMEMBER:**
- ❌ JANGAN commit file `.env`
- ❌ JANGAN hardcode API keys
- ✅ SELALU gunakan Environment Variables
- ✅ TEST di staging dulu sebelum production