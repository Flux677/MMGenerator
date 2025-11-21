# 🚀 Deployment Guide - MythicMobs Generator v3.0

## 📋 Pre-Deployment Checklist

### ✅ Requirements Check
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Vercel account created (free tier OK)
- [ ] Claude API key obtained from Anthropic
- [ ] Repository cloned locally

### ✅ Code Structure Validation
```
MMGenerator/
├── api/
│   ├── generate.js (MAIN HANDLER)
│   └── prompts/
│       ├── main.js (IMPROVED v3.0)
│       ├── difficulty.js (IMPROVED v3.0)
│       ├── features.js (IMPROVED v3.0)
│       ├── ai-complexity.js
│       ├── ai-behavior.js
│       ├── healing-tower.js
│       ├── death-rewards.js
│       ├── visual-effects.js
│       ├── syntax.js
│       └── advanced.js
├── public/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── generator.js
│       └── ui.js
├── vercel.json
├── package.json
└── README.md
```

---

## 🔧 Step-by-Step Deployment

### Step 1: Update Files

Replace these files dengan improved versions:

1. **api/prompts/main.js** → New cinematic prompt system
2. **api/prompts/difficulty.js** → Enhanced difficulty guides
3. **api/prompts/features.js** → Improved mechanics
4. **api/generate.js** → Updated main handler

### Step 2: Verify Environment

```bash
# Check Node.js version
node --version
# Should be v18.x or higher

# Check npm
npm --version

# Install Vercel CLI
npm install -g vercel
```

### Step 3: Test Locally (CRITICAL!)

```bash
# Install dependencies
npm install

# Run local dev server
vercel dev

# Test at http://localhost:3000
```

**Local Testing Checklist:**
- [ ] Page loads without errors
- [ ] All UI elements visible
- [ ] Form submits successfully
- [ ] Generation works (test with API key)
- [ ] Results display correctly
- [ ] Copy buttons work
- [ ] Download works

### Step 4: Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? [Your account]
# - Link to existing project? N
# - Project name? [MMGenerator or custom]
# - Directory? ./ (default)
# - Override settings? N

# Production deployment
vercel --prod
```

### Step 5: Configure Environment Variables

**CRITICAL:** Set API key in Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add variable:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-api03-...` (your Claude API key)
   - Environments: ✅ Production, ✅ Preview, ✅ Development

5. **REDEPLOY** after setting env var:
```bash
vercel --prod
```

### Step 6: Verify Deployment

Visit your deployment URL (e.g., `https://mm-generator-seven.vercel.app`)

**Verification Checklist:**
- [ ] Page loads correctly
- [ ] No console errors
- [ ] All difficulty presets visible
- [ ] New features (AI Behavior, Healing Tower, Death Reward) present
- [ ] Generate button works
- [ ] Results display properly
- [ ] Config files downloadable

---

## 🧪 Testing Guide

### Basic Functionality Tests

#### Test 1: Balanced Boss
**Input:**
- Category: Boss
- Difficulty: Balanced
- AI: Advanced
- Description: "Fire wizard boss dengan fireball, fire ring AOE, teleport. Base BLAZE dengan wizard skin."

**Expected:**
- HP: 600-1000
- Damage: 12-18
- Skills telegraphed 1-2 seconds
- Recovery windows after big attacks
- Valid YAML syntax

#### Test 2: Nightmare Glass Cannon
**Input:**
- Category: Boss
- Difficulty: Nightmare
- AI: Elite
- Description: "Shadow assassin dengan dash, backstab, smoke bomb. One-shot ultimate. Base ENDERMAN."

**Expected:**
- HP: 300-600 (LOW!)
- Damage: 40-70 (HIGH!)
- One-shot skill telegraphed 3-5 seconds
- Fast movement speed
- NO healing mechanics

#### Test 3: Psychological Horror
**Input:**
- Category: Boss
- Difficulty: Psychological
- AI: Nightmare
- Description: "Stalker horror boss, darkness effects, jumpscare, silent movement. Base WARDEN."

**Expected:**
- Darkness effects mandatory
- Horror soundscape (heartbeat, ambient)
- Stalking behavior (teleport, no sound)
- Jumpscare mechanics
- Unpredictable attack timing

### Advanced Feature Tests

#### Test 4: Custom AI Behavior
**Enable:**
- ✅ Custom AI Behavior
- Select: Aggressive Rush

**Expected:**
- AI always closes distance
- No retreat mechanics
- High attack frequency
- Speed boost skills
- Threat generation

#### Test 5: Healing Tower System
**Enable:**
- ✅ Healing Tower System
- Towers: 2
- Heal Power: Medium (10 HP/sec)
- Tower HP: 200

**Expected:**
- BOSS_HEALING_TOWER mob generated
- Towers spawn on boss spawn
- Heal skill every 20 ticks (1 second)
- Visual beam effect
- Players can destroy towers

#### Test 6: Death Reward
**Enable:**
- ✅ Boss Death Reward
- Type: Fireworks Celebration

**Expected:**
- Reward skill on ~onDeath trigger
- Fireworks particle effects
- Loot rain from sky
- Victory sounds
- Player buffs

### Integration Tests

#### Test 7: All Features Combined
**Enable:**
- ✅ Multi-Phase System
- ✅ Custom AI Behavior (Berserker)
- ✅ Healing Tower (3 towers)
- ✅ Death Reward (Portal)
- ✅ Spawn Aura
- ✅ Boss Bar

**Expected:**
- Complex configuration but valid syntax
- All systems working together
- No conflicts between features
- Performance acceptable (particle count reasonable)

---

## 🐛 Common Deployment Issues

### Issue 1: "API Key Not Configured"
**Symptom:** Generation fails with "Server configuration error"

**Solution:**
1. Check environment variable set in Vercel Dashboard
2. Verify variable name: `ANTHROPIC_API_KEY` (exact case)
3. Redeploy after setting env var
4. Check deployment logs

### Issue 2: "Module Not Found"
**Symptom:** Import errors in console

**Solution:**
1. Verify all prompt files in correct directory
2. Check import paths in generate.js
3. Ensure `package.json` has correct structure
4. Redeploy

### Issue 3: CORS Errors
**Symptom:** Fetch fails with CORS error

**Solution:**
1. Check CORS headers in generate.js:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

### Issue 4: Function Timeout
**Symptom:** "Function execution timeout"

**Solution:**
1. Increase timeout in vercel.json:
```json
{
  "functions": {
    "api/generate.js": {
      "maxDuration": 60
    }
  }
}
```

2. Check Claude API response time
3. Optimize prompt size if needed

### Issue 5: Invalid JSON Response
**Symptom:** "JSON Parse Error" in console

**Solution:**
1. Check fallback extraction in generate.js
2. Verify prompt instructs JSON output
3. Test locally with verbose logging
4. Check Claude API response format

---

## 📊 Performance Optimization

### API Response Time
- **Target:** < 15 seconds
- **Current:** ~10-20 seconds (varies by complexity)

**Optimization:**
- Use temperature: 0.8 (balance creativity & speed)
- Limit max_tokens: 16000 (sufficient for configs)
- Prompt conciseness maintained

### Particle Effects
**Guidelines for generated configs:**
- Ambient effects: 10-20 particles
- Attack effects: 30-50 particles
- Ultimate effects: 100-200 particles
- **Never exceed 500 particles in single skill**

### Skill Cooldowns
**Minimum recommendations:**
- Basic attacks: 3 seconds
- Special moves: 10 seconds
- Ultimate: 25 seconds
- Phase transitions: 60 seconds

---

## 🔒 Security Checklist

- [ ] API key stored in environment variable (NOT in code)
- [ ] CORS properly configured
- [ ] Input validation on backend
- [ ] No sensitive data logged
- [ ] Rate limiting considered (via Vercel)
- [ ] Error messages don't expose internals

---

## 📈 Monitoring & Analytics

### What to Monitor:

1. **Function Invocations**
   - Track via Vercel Dashboard
   - Check for unusual spikes

2. **Error Rate**
   - Monitor failed generations
   - Check logs for patterns

3. **Response Times**
   - Aim for < 20 seconds
   - Alert if > 30 seconds consistently

4. **API Usage**
   - Monitor Claude API token usage
   - Stay within budget limits

### Logging Best Practices

```javascript
// In generate.js
console.log('Generation started:', {
  category,
  difficulty,
  aiComplexity,
  features: Object.keys(options).filter(k => options[k])
});

console.log('Claude API response time:', responseTime);
console.log('Generation successful:', mobName);
```

---

## 🚦 Post-Deployment Validation

### 1-Hour Check
- [ ] No critical errors in logs
- [ ] Test all difficulty presets
- [ ] Test all AI behaviors
- [ ] Test all death rewards

### 24-Hour Check
- [ ] Monitor error rate
- [ ] Check API usage
- [ ] Collect user feedback (if applicable)
- [ ] Review generated configs quality

### 1-Week Check
- [ ] Analyze usage patterns
- [ ] Identify common issues
- [ ] Plan improvements
- [ ] Update documentation if needed

---

## 🔄 Update Workflow

When updating prompt modules:

1. **Test locally FIRST:**
```bash
vercel dev
# Test changes thoroughly
```

2. **Deploy to preview:**
```bash
vercel
# Test preview URL
```

3. **Deploy to production:**
```bash
vercel --prod
# Only after preview validated
```

4. **Monitor for issues:**
- Check logs immediately
- Test live site
- Have rollback plan ready

---

## 📞 Support & Help

If deployment fails:

1. Check Vercel deployment logs
2. Review function logs for errors
3. Test locally to isolate issue
4. Check environment variables
5. Verify API key valid
6. Open issue on GitHub with:
   - Error message
   - Deployment logs
   - Steps to reproduce

---

## ✅ Final Deployment Checklist

Before marking deployment complete:

- [ ] All prompt modules updated (v3.0)
- [ ] Environment variables set
- [ ] Local testing passed
- [ ] Preview deployment tested
- [ ] Production deployment successful
- [ ] All difficulty presets work
- [ ] All AI behaviors work
- [ ] All features functional
- [ ] Performance acceptable
- [ ] No errors in console
- [ ] Mobile responsive
- [ ] Documentation updated
- [ ] README.md current
- [ ] Changelog updated

---

**Deployment Status:** ✅ Ready for Production

**Version:** 3.0.0

**Last Updated:** 2025-01-XX (update saat deploy)

**Deployed URL:** https://mm-generator-seven.vercel.app/ (update dengan URL kamu)

---

*Happy deploying! 🚀*