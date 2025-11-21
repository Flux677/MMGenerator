# 📋 QUICK REFERENCE GUIDE

## 🔧 **FIXED MODULES - DEPLOYMENT**

### **Step 1: Update Files di Repo**

Ganti 3 files ini di folder `api/prompts/`:

1. **healing-tower.js** → Artifact `healing_tower_fixed`
2. **death-rewards.js** → Artifact `death_rewards_fixed`  
3. **visual-effects.js** → Artifact `summon_mechanic_fixed`

---

### **Step 2: Critical Changes Checklist**

✅ **Healing Tower:**
- Particle reduced: 200 → 10-30
- Use `@MIR{r=40;t=BOSS_INTERNAL_NAME;...}` (exact name!)
- No sound spam (removed looping)
- Minimal particles (3-5 per tick)

✅ **Death Rewards:**
- Merchant: Proximity trigger (NO ~onInteract)
- All rewards: Particle count reduced 70-80%
- Auto-give items (no click needed)
- Portal detection: 3 blocks → 5 blocks

✅ **Custom Summon:**
- Armor stand: Proximity + holding item (NO click!)
- All methods: Particle reduced 70%
- Buildup time: 3-5s → 1.5-2s
- Working without Mythiccrucible

---

## 📝 **COPY-PASTE: Boss Template dengan Healing Towers**

```yaml
# Replace: YOUR_BOSS_NAME, BASE_MOB, SKIN_NAME

YOUR_BOSS_NAME:
  Type: BASE_MOB
  Display: '&c&lBoss Name'
  Health: 1000
  Damage: 15
  Options:
    MovementSpeed: 0.3
    FollowRange: 32
  Disguise:
    Type: PLAYER
    Player: SKIN_NAME
    Skin: SKIN_NAME
  BossBar:
    Enabled: true
    Title: '&c&lBoss Name'
    Color: RED
    Style: SOLID
    Range: 50
  Skills:
  # SPAWN TOWERS
  - skill{s=BOSS_SPAWN_TOWERS} @self ~onSpawn
  # TOWER DESTROYED REACTION
  - skill{s=BOSS_TOWER_DESTROYED} @self ~onSignal:TOWER_DESTROYED
  # ... other skills ...

# SPAWN TOWERS SKILL
BOSS_SPAWN_TOWERS:
  Skills:
  - message{m="&e<caster.name> activates healing towers!"} @PIR{r=40}
  - particles{p=enchantment_table;a=30;hs=3;vs=2} @self
  - sound{s=block.beacon.activate;v=1.5;p=0.8} @PIR{r=40}
  - delay 20
  # Spawn 2 towers
  - summon{type=BOSS_HEALING_TOWER;l=@forward{f=15;ly=0}} @self
  - summon{type=BOSS_HEALING_TOWER;l=@forward{f=15;ly=180}} @self

# TOWER DESTROYED REACTION
BOSS_TOWER_DESTROYED:
  Skills:
  - message{m="&c<caster.name>: My tower!"} @PIR{r=30}
  - potion{type=INCREASE_DAMAGE;d=100;l=1} @self
  - potion{type=SPEED;d=100;l=1} @self

# HEALING TOWER MOB
BOSS_HEALING_TOWER:
  Type: ARMOR_STAND
  Display: '&a&l❤ Healing Tower ❤'
  Health: 200
  Options:
    Invisible: false
    Invulnerable: false
    PreventOtherDrops: true
    CustomNameVisible: true
    AlwaysShowName: true
    Despawn: false
  Equipment:
  - END_ROD HAND
  Skills:
  # Init
  - setvar{var=caster.tower_active;val=true} @self ~onSpawn
  - particles{p=heart;a=10;hs=1;vs=1;y=2} @self ~onSpawn
  - sound{s=block.beacon.activate;v=0.8;p=1.2} @self ~onSpawn
  
  # HEAL BOSS (CRITICAL: Change YOUR_BOSS_NAME!)
  - heal{a=10} @MIR{r=40;t=YOUR_BOSS_NAME;limit=1;sort=NEAREST} ~onTimer:20 ?varequals{var=caster.tower_active;val=true}
  - particles{p=heart;a=3;y=2} @self ~onTimer:20
  - particles{p=happy_villager;a=2} @MIR{r=40;t=YOUR_BOSS_NAME;limit=1} ~onTimer:20
  
  # DEATH
  - setvar{var=caster.tower_active;val=false} @self ~onDeath
  - message{m="&c&l⚔ Tower DESTROYED!"} @PIR{r=30} ~onDeath
  - particles{p=explosion;a=30;hs=2;vs=2} @self ~onDeath
  - sound{s=entity.generic.explode;v=1.5;p=0.8} @self ~onDeath
  - signal{s=TOWER_DESTROYED} @MIR{r=50;t=YOUR_BOSS_NAME} ~onDeath
```

---

## 📝 **COPY-PASTE: Death Reward (Merchant)**

```yaml
# Add to boss ~onDeath:
~onDeath:
- skill{s=BOSS_DEATH_MERCHANT} @origin

BOSS_DEATH_MERCHANT:
  Skills:
  - message{m="&a&l✦ VICTORY! ✦"} @PIR{r=80}
  - message{m="&eMerchant appears..."} @PIR{r=80}
  - particles{p=enchantment_table;a=40;hs=2;vs=3} @origin
  - sound{s=entity.villager.celebrate;v=1.5;p=1} @PIR{r=40}
  - delay 40
  - summon{type=BOSS_VICTORY_MERCHANT;l=@origin} @origin

BOSS_VICTORY_MERCHANT:
  Type: VILLAGER
  Display: '&6&l⚜ Victory Merchant ⚜'
  Health: 50
  Options:
    Invulnerable: true
    Silent: false
    Despawn: false
    PreventOtherDrops: true
  Disguise:
    Type: VILLAGER
    Profession: CLERIC
  Skills:
  - particles{p=happy_villager;a=3;repeat=6000;repeati=40} @self
  - particles{p=enchantment_table;a=2;repeat=6000;repeati=60;y=2} @self
  - skill{s=MERCHANT_CHECK_NEARBY} @self ~onTimer:20
  - message{m="&eMerchant leaving...";delay=5800} @PIR{r=30}
  - particles{p=portal;a=50;delay=6000} @self
  - sound{s=entity.villager.no;v=1;delay=6000} @self
  - message{m="&7Merchant vanishes...";delay=6000} @PIR{r=30}
  - remove{delay=6020} @self

MERCHANT_CHECK_NEARBY:
  TargetConditions:
  - distance{d=<5} true
  Skills:
  - skill{s=MERCHANT_TRADE} @trigger ?!varequals{var=target.merchant_traded;val=true}

MERCHANT_TRADE:
  Skills:
  - setvar{var=target.merchant_traded;val=true;duration=6000} @trigger
  - message{m="&e[Merchant] Victory rewards!"} @trigger
  - sound{s=entity.villager.trade;v=1} @trigger
  - particles{p=happy_villager;a=20} @trigger
  # CUSTOMIZE REWARDS:
  - give{item=DIAMOND;amount=10} @trigger
  - give{item=EMERALD_BLOCK;amount=5} @trigger
  - give{item=ENCHANTED_GOLDEN_APPLE;amount=2} @trigger
  - message{m="&aItems added to inventory!"} @trigger
```

---

## 📝 **COPY-PASTE: Custom Summon (Proximity)**

```yaml
# Spawner entity
BOSS_SPAWNER:
  Type: ARMOR_STAND
  Display: '&c&l[Boss Spawner]'
  Health: 1
  Options:
    Invisible: true
    Invulnerable: true
    Marker: true
    Silent: true
    Despawn: false
  Skills:
  - skill{s=SPAWNER_INIT} @self ~onSpawn
  - skill{s=CHECK_PROXIMITY} @self ~onTimer:20

SPAWNER_INIT:
  Skills:
  - setvar{var=caster.spawned;val=false;type=STRING} @self
  - setvar{var=caster.cooldown;val=false;type=STRING} @self

CHECK_PROXIMITY:
  Conditions:
  - varequals{var=caster.spawned;val=false} true
  - varequals{var=caster.cooldown;val=false} true
  - mobsinworld{t=YOUR_BOSS_NAME;a=0} true
  TargetConditions:
  - playerwithin{d=8} true
  Skills:
  - setvar{var=caster.spawned;val=true} @self
  # WARNING
  - message{m="&c&l⚠ WARNING!"} @PIR{r=30}
  - sound{s=block.bell.use;v=1.5;p=0.5} @PIR{r=30}
  - particles{p=reddust;c=#FF0000;a=30;repeat=10;repeati=1} @ring{r=6;p=10;y=0}
  - delay 10
  # BUILDUP
  - message{m="&e&lSomething awakens..."} @PIR{r=30}
  - particles{p=portal;a=30;repeat=20;repeati=1;hs=2;vs=2} @self
  - particles{p=flame;a=15;repeat=20;repeati=1} @ring{r=4;p=8;y=0}
  - sound{s=entity.wither.ambient;v=1;p=0.8} @self
  - delay 20
  # SPAWN
  - summon{type=YOUR_BOSS_NAME;l=@self} @self
  - particles{p=explosion;a=50} @self
  - particles{p=flame;a=60;hs=3;vs=3} @self
  - sound{s=entity.wither.spawn;v=1.5;p=0.5} @self
  - recoil{r=25;pitch=-0.6} @PIR{r=30}
  - message{m="&c&l<mob.name> SUMMONED!"} @PIR{r=40}
  # COOLDOWN (5 min)
  - setvar{var=caster.cooldown;val=true} @self
  - setvar{var=caster.cooldown;val=false;delay=6000} @self
  - setvar{var=caster.spawned;val=false;delay=6000} @self

# Place spawner: /mm mobs spawn BOSS_SPAWNER 1
```

---

## 🎯 **OPTIMIZATION ENFORCEMENT**

Add ini ke SETIAP prompt request untuk force optimization:

```
CRITICAL OPTIMIZATION:
- Max 30 particles per skill (50 ultimates)
- NO loops > 20 repeats
- Ambient particles: 5 max
- Sound volume max 1.5 (0.8 ambient)
- Screen shake radius max 25
- Fight duration: 3-5 minutes target
- Damage scaling, NOT burst
- TPS impact < -2 during fight
```

---

## ⚡ **INSTANT FIXES**

### **Tower tidak heal:**
```yaml
# Line to fix (in BOSS_HEALING_TOWER):
- heal{a=10} @MIR{r=40;t=EXACT_BOSS_NAME;limit=1;sort=NEAREST} ~onTimer:20

# Make sure EXACT_BOSS_NAME matches your boss internal name!
```

### **Merchant tidak give items:**
```yaml
# Increase proximity range:
TargetConditions:
- distance{d=<7} true  # Changed from 5 to 7
```

### **Spawner tidak trigger:**
```yaml
# Increase detection range:
TargetConditions:
- playerwithin{d=10} true  # Changed from 8 to 10
```

### **Particle lag:**
```yaml
# Reduce ALL particle amounts to max 30:
- particles{p=flame;a=30} @self  # MAX!
- particles{p=explosion;a=50} @self  # Only for ultimates

# Reduce repeat:
- particles{repeat=20;repeati=5} @self  # MAX 20 repeats!
```

---

## 🎮 **TESTING COMMANDS**

```bash
# Spawn boss with towers
/mm mobs spawn YOUR_BOSS_NAME 1

# Check TPS before fight
/tps

# Fight for 2 minutes

# Check TPS after
/tps
# Should be > 18 TPS

# Test tower healing
/mm mobs spawn YOUR_BOSS_NAME 1
# Damage boss, watch HP
# Should see healing (green particles)

# Test death reward
/kill @e[type=WITHER_SKELETON,name="Boss Name"]
# Check if reward spawns
# Walk close to claim

# Test spawner
/mm mobs spawn BOSS_SPAWNER 1
# Walk within 8 blocks
# Boss should spawn with effects
```

---

## 📊 **PERFORMANCE TARGETS**

| Metric | Target | How to Check |
|--------|--------|--------------|
| **TPS** | > 18.0 | `/tps` during fight |
| **Particles/skill** | < 50 | Count in config |
| **Fight Length** | 3-5 min | Timer from spawn to death |
| **Lag Spikes** | None | Player movement smooth? |
| **Healing Tower** | Works | Boss HP increases? |
| **Death Reward** | Triggers | Item received? |

---

## ✅ **FINAL CHECKLIST**

Deploy checklist:

- [ ] Updated 3 files (healing-tower, death-rewards, visual-effects)
- [ ] Tested locally dengan `vercel dev`
- [ ] Verified particle counts < 50 per skill
- [ ] Tested healing tower (boss name matches)
- [ ] Tested death rewards (proximity works)
- [ ] Tested custom summon (no click needed)
- [ ] TPS stable during 5-minute test fight
- [ ] All features work without Mythiccrucible
- [ ] Deployed to production `vercel --prod`
- [ ] In-game testing completed

---

**System READY! Deploy dan enjoy boss fights yang smooth & menegangkan! 🚀**