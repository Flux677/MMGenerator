# 🗡️ MythicMobs Generator

Generator otomatis untuk membuat konfigurasi MythicMobs custom menggunakan Claude AI.

## ✨ Features

- ✅ Generate Boss, Mini Boss, dan Mob biasa
- ✅ Generate Boss dengan minion untuk dungeon
- ✅ Terintegrasi dengan LibDisguises
- ✅ Syntax 100% sesuai MythicMobs Wiki
- ✅ Skill kompleks dan balanced
- ✅ UI simple dan minimalis
- ✅ Download semua config sekaligus

## 📋 Prerequisites

### Server Requirements
- Minecraft Server (Spigot/Paper 1.16+)
- **MythicMobs** plugin (latest version)
- **LibDisguises** plugin (latest version)
- **ProtocolLib** (dependency untuk LibDisguises)

### Development Requirements
- Node.js 18+ (untuk local development)
- Vercel Account (untuk deployment)
- Claude API Key dari Anthropic

## 🚀 Deployment ke Vercel

### Step 1: Persiapan Project

1. Clone atau download project ini
2. Struktur folder harus seperti ini:

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
└── README.md
```

### Step 2: Deploy ke Vercel

1. **Install Vercel CLI** (opsional):
```bash
npm install -g vercel
```

2. **Login ke Vercel**:
```bash
vercel login
```

3. **Deploy Project**:
```bash
vercel
```

ATAU upload langsung via Vercel Dashboard:
- Buka https://vercel.com/
- Klik "Add New Project"
- Import dari Git atau Upload folder

### Step 3: Set Environment Variables

**PENTING**: Jangan taruh API key di file!

1. Buka project di Vercel Dashboard
2. Go to **Settings → Environment Variables**
3. Add variable:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: `sk-ant-...` (API key Claude Anda)
   - **Environment**: Production, Preview, Development (pilih semua)

4. Klik **Save**
5. **Redeploy** project (penting agar env var aktif)

### Step 4: Testing

1. Buka URL Vercel Anda (e.g., `your-project.vercel.app`)
2. Test generate mob
3. Check console browser jika ada error

## 🔒 Private Deployment

Untuk membuat deployment private (tidak bisa diakses publik):

### Option 1: Vercel Password Protection

1. Go to **Settings → General**
2. Scroll ke **Deployment Protection**
3. Enable **Vercel Authentication**
4. Sekarang hanya orang dengan akses Vercel team yang bisa akses

### Option 2: Custom Password Protection

Tambahkan basic auth di `vercel.json`:

```json
{
  "routes": [
    {
      "src": "/(.*)",
      "headers": {
        "WWW-Authenticate": "Basic realm=\"Protected\""
      },
      "status": 401
    }
  ]
}
```

Atau buat middleware di `api/auth.js`.

## 📖 Cara Penggunaan

### 1. Generate Mob

1. Pilih **kategori mob**:
   - **Boss**: Boss tunggal dengan skill kompleks
   - **Boss + Dungeon Mobs**: Boss + 2-3 minion
   - **Mini Boss**: Boss menengah
   - **Mob Biasa**: Mob untuk world

2. Tulis **deskripsi detail**:
```
Buat ice wizard boss yang bisa:
- Summon ice minion
- Skill freeze area (slow + damage)
- Teleport saat low HP
- Base mob: STRAY
- Disguise: player skin "IceWizard"
```

3. Pilih **fitur tambahan** (opsional):
   - Generate Items/Drops
   - Advanced AI (ThreatTable)
   - Particle Effects

4. Klik **Generate Mob**

### 2. Review & Download

1. Lihat hasil di **4 tabs**:
   - **Mobs Config**: Konfigurasi mob utama
   - **Skills Config**: Semua skill mob
   - **Items Config**: Item drops (jika diaktifkan)
   - **Setup Guide**: Panduan instalasi

2. **Copy** code per-file atau **Download All**

### 3. Install ke Server

1. Copy file ke server:
```
Mobs.yml → plugins/MythicMobs/Mobs/
Skills.yml → plugins/MythicMobs/Skills/
Items.yml → plugins/MythicMobs/Items/
```

2. Reload MythicMobs:
```
/mm reload
```

3. Spawn mob:
```
/mm mobs spawn <INTERNAL_NAME> 1
```

## 🎮 Contoh Penggunaan

### Boss Berdasarkan Karakter Anime

**Input:**
```
Buat boss Satoru Gojo dari Jujutsu Kaisen:
- Skill "Infinity" (barrier yang block damage)
- Skill "Blue" (pull enemies)
- Skill "Red" (push explosion)
- Skill "Purple" (massive damage beam)
- Phase 2: Domain Expansion
- Base: IRON_GOLEM
- Disguise: player "SatoruGojo"
```

### Boss untuk Dungeon

**Input:**
```
Buat dungeon boss Lich King dengan:
- Boss: Lich King (summon skeletons)
- Minion 1: Death Knight (melee)
- Minion 2: Banshee (range)
- Boss skill: Frost Nova, Death Grip, Army of Dead
- Base boss: WITHER_SKELETON
```

### Mini Boss

**Input:**
```
Mini boss Golem Guard:
- Skill slam (knockback)
- Skill shield (damage reduction)
- Passive: counter-attack
- Base: IRON_GOLEM
```

## 📚 MythicMobs Syntax Reference

### Mobs Configuration

```yaml
INTERNAL_NAME:
  Type: ZOMBIE                    # Base Minecraft mob
  Display: '&c&lDisplay Name'     # Nama yang muncul
  Health: 100                     # HP
  Damage: 10                      # Base damage
  Armor: 5                        # Armor points
  
  # LibDisguises
  Disguise:
    Type: PLAYER
    Player: Herobrine
    Skin: Herobrine
  
  # Options
  Options:
    MovementSpeed: 0.3
    FollowRange: 32
    KnockbackResistance: 0.5
    PreventOtherDrops: true
  
  # AI Settings
  AITargetSelectors:
  - 0 clear
  - 1 attacker
  - 2 players
  
  AIGoalSelectors:
  - 0 clear
  - 1 meleeattack
  - 2 randomstroll
  
  # Skills
  Skills:
  - skill{s=SKILL_NAME} @target ~onTimer:100
  - skill{s=SKILL_NAME} @self ~onDamaged
  
  # Drops
  Drops:
  - DIAMOND 1-3 1.0
  - droptable{t=BOSS_DROPS} 1.0
```

### Skills Configuration

```yaml
SKILL_NAME:
  Cooldown: 10                    # Cooldown in seconds
  
  Conditions:                     # Conditions for caster
  - distance{d=<10} true
  - haspotioneffect{type=POISON} false
  
  TargetConditions:              # Conditions for target
  - playerwithin{d=20} true
  
  Skills:                        # Mechanics
  - damage{amount=10;ignoreArmor=true} @target
  - projectile{v=10;i=1;hs=true} @target
  - summon{type=ZOMBIE;amount=3} @self
  - teleport @target
  - throw{velocity=5;velocityY=2} @target
  - potion{type=SLOW;duration=100;level=1} @target
  - effect:particles{p=flame;a=50;hs=1;vs=1} @self
  - sound{s=ENTITY_DRAGON_GROWL;v=1;p=1} @self
  - message{m="<caster.name> used skill!"} @PIR{r=30}
```

### Common Mechanics

**Damage & Combat:**
```yaml
- damage{amount=20;ignoreArmor=true}
- heal{amount=50}
- suicide
```

**Movement:**
```yaml
- teleport @target
- leap{velocity=2;velocityY=1}
- throw{velocity=5;velocityY=2}
- pull{velocity=3}
- lunge{velocity=5}
```

**Summons:**
```yaml
- summon{type=ZOMBIE;amount=3;radius=5}
- summonarea{type=SKELETON;amount=10;radius=20}
```

**Effects:**
```yaml
- potion{type=SLOW;duration=100;level=2}
- ignite{ticks=100}
- freeze{duration=100}
```

**Particles:**
```yaml
- effect:particles{p=flame;a=50;hs=1;vs=1;y=1}
- effect:particles{p=soul;a=20;speed=0.1}
```

**Sounds:**
```yaml
- sound{s=ENTITY_ENDER_DRAGON_GROWL;v=1;p=1}
- sound{s=ENTITY_WITHER_SPAWN;v=2;p=0.8}
```

### Targeters

```yaml
@self                          # Caster
@target                        # Current target
@trigger                       # Entity that triggered skill

@PIR{r=10}                    # Players in radius
@EIR{r=10}                    # Entities in radius
@MIR{r=10}                    # Mobs in radius

@Ring{radius=5;points=8}      # Ring of points
@Circle{radius=10;points=16}   # Circle pattern
@Forward{f=5}                  # Forward location
@Origin                        # Spawn location
```

### Triggers

```yaml
~onSpawn                       # When mob spawns
~onLoad                        # When chunk loads
~onDeath                       # When mob dies
~onTimer:100                   # Every 5 seconds (20 ticks = 1s)
~onAttack                      # When mob attacks
~onDamaged                     # When mob takes damage
~onInteract                    # When player interacts
~onTeleport                    # When mob teleports
~onExplode                     # When mob explodes
```

### Conditions

```yaml
# Distance
- distance{d=<10} true
- distance{d=10to20} true

# Health
- health{h=<50%} true
- health{h=>80%} true

# Location
- altitude{a=<64} true
- biome{b=DESERT} true
- world{w=world_nether} true

# Player
- playerwithin{d=10} true
- wearing{s=DIAMOND_HELMET} true
- holding{i=DIAMOND_SWORD} true

# Effects
- haspotioneffect{type=POISON} true
- hasaura{aura=BURNING} true

# Advanced
- variableequals{var=caster.phase;val=2} true
- chance{c=0.5} true
- stance{s=AGGRESSIVE} true
```

## 🔧 Troubleshooting

### Error: API Key Not Configured

**Solusi:**
1. Check Environment Variables di Vercel Dashboard
2. Pastikan `ANTHROPIC_API_KEY` sudah di-set
3. Redeploy project setelah set env var

### Error: JSON Parse Error

**Solusi:**
1. Ini biasanya karena response AI format salah
2. Coba generate lagi dengan deskripsi lebih jelas
3. Check console browser untuk error detail

### Mob Tidak Spawn

**Solusi:**
1. Check `/mm reload` output untuk syntax error
2. Pastikan base Type adalah vanilla mob (ZOMBIE, SKELETON, dll)
3. Test dengan `/mm mobs spawn INTERNAL_NAME 1`

### Disguise Tidak Muncul

**Solusi:**
1. Pastikan LibDisguises dan ProtocolLib terinstall
2. Check `/disguise` command works
3. Format disguise harus benar (lihat contoh di atas)

### Skill Tidak Fire

**Solusi:**
1. Check cooldown tidak terlalu besar
2. Check conditions terpenuhi
3. Test trigger dengan `/mm test`

## 📖 Resources

### Official Wikis
- [MythicMobs Wiki](https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/home)
- [LibDisguises Wiki](https://www.spigotmc.org/resources/libs-disguises-free.81/)
- [Anthropic Claude API](https://docs.anthropic.com/)

### MythicMobs Wiki Pages
- [Mobs Configuration](https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/Mobs/Mobs)
- [Skills](https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/Skills/Skills)
- [Mechanics](https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/Skills/Mechanics)
- [Targeters](https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/Skills/Targeters)
- [Conditions](https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/Skills/conditions)
- [Triggers](https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/Skills/Triggers)
- [Items](https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/Items/Items)
- [Drops](https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/drops/Drops)

## ⚙️ Advanced Configuration

### Custom Prompts

Edit `api/generate.js` function `buildPrompt()` untuk customize prompt AI.

### API Timeout

Edit `vercel.json`:
```json
{
  "functions": {
    "api/generate.js": {
      "maxDuration": 60
    }
  }
}
```

### Rate Limiting

Tambahkan rate limiting di `api/generate.js` jika perlu.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork repository
2. Create feature branch
3. Test thoroughly
4. Submit pull request

## 📝 License

MIT License - free to use and modify

## ⚠️ Disclaimer

- Tool ini generate config berdasarkan AI
- Selalu test config di test server dulu
- Sesuaikan balance (HP, damage, cooldown) sesuai kebutuhan
- Tidak bertanggung jawab atas masalah di server production

## 💬 Support

Butuh bantuan? 
- Baca Wiki MythicMobs terlebih dahulu
- Check console error
- Test di test server dulu

---

Made with ❤️ using Claude AI