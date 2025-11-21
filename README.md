# 🗡️ MythicMobs Generator v3.0

> **Generate EPIC, tension-filled custom mobs untuk MythicMobs plugin dengan AI**

[![Version](https://img.shields.io/badge/version-3.0-blue.svg)](https://github.com/Flux677/MMGenerator)
[![Status](https://img.shields.io/badge/status-production-brightgreen.svg)](https://mm-generator-seven.vercel.app/)

## ✨ What's New in v3.0?

### 🎬 Cinematic Boss Fights
- **Dramatic phase transitions** dengan visual buildup & screen effects
- **Telegraph system** - semua attack punya warning yang jelas
- **Recovery windows** - openings setelah big attacks
- **Emotional pacing** - tension → climax → release rhythm

### 🧠 Enhanced AI Systems
- **6 Custom AI Behavior Patterns:**
  - ⚡ Aggressive Rush (relentless pressure)
  - 🎯 Tactical Kiting (ranged combat)
  - 🛡️ Defensive Counter (block & punish)
  - 😡 Berserker Mode (enrage mechanics)
  - 💨 Hit and Run (guerrilla tactics)
  - 👥 Summoner Support (minion focus)

### 🗼 New Mechanics
- **Healing Tower System** - destroyable towers yang heal boss
- **Boss Death Rewards** - 6 types: chest, portal, NPC, arena transform, buff station, fireworks
- **Custom Summon Methods** - proximity trigger, item interact, altar, ritual
- **Visual Spawn Effects** - magic circles, portals, buildup sequences

### 🎚️ Difficulty Presets (Improved!)
1. **⚖️ Balanced** - Fair challenge untuk average players
2. **💪 Hard** - Complex patterns, tight DPS checks
3. **😈 Nightmare** - GLASS CANNON: low HP, devastating one-shots dengan long telegraphs
4. **🧠 Psychological** - Horror experience: darkness, stalking, jumpscares
5. **🔥 Souls-like** - Pattern-based combat, telegraphed, learnable, punishing tapi FAIR
6. **🕷️ Overwhelming** - Swarm tactics dengan constant minion spam

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Vercel Account (free tier OK)
- Claude API Key dari [Anthropic](https://console.anthropic.com/)

### Installation

1. **Clone repository:**
```bash
git clone https://github.com/Flux677/MMGenerator.git
cd MMGenerator
```

2. **Deploy ke Vercel:**
```bash
npm install -g vercel
vercel login
vercel
```

3. **Set Environment Variable:**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add: `ANTHROPIC_API_KEY` = `your-api-key-here`
   - Redeploy project

4. **Access your generator:**
   - URL: `https://your-project.vercel.app`

## 📖 User Guide

### Basic Usage

1. **Select Category:**
   - 👑 Boss - Single boss dengan complex skills
   - 🏰 Boss + Dungeon - Boss + 2-3 coordinated minions
   - ⚔️ Mini Boss - Medium difficulty boss
   - 🌍 Normal Mob - World exploration mob

2. **Choose Difficulty Preset:**
   - Determines HP, damage, telegraph timing
   - Each preset has unique mechanics philosophy

3. **Select AI Complexity:**
   - 🎯 Advanced - ThreatTable, smart targeting
   - 🧬 Elite - Variable-based decisions, state machine
   - 👁️ Nightmare AI - Learns patterns, adapts

4. **Enable Features (Optional):**
   - 📊 Multi-Phase System
   - 🔢 Variable State Machine
   - 🌋 Environmental Hazards
   - 🤝 Minion Coordination
   - 📈 Adaptive Difficulty
   - 🛡️ Counter-Attack System

5. **Write Description:**
```
Example: "Create ice wizard boss inspired by Elsa from Frozen. 
Skills: freeze area (slow + damage), ice prison (trap players), 
summon ice minions, teleport when low HP. Use STRAY as base mob 
with ice wizard skin. Spawn dengan blue magic circle dan snow particles."
```

6. **Generate!**

### Advanced Features

#### 🤖 Custom AI Behavior
Enable untuk control pola bertarung mob:
- **Aggressive Rush**: Selalu menyerang, high pressure
- **Tactical Kiting**: Jaga jarak, ranged attacks
- **Defensive Counter**: Block & punish aggression
- **Berserker Mode**: Enrage saat low HP
- **Hit and Run**: Attack → teleport away
- **Summoner Support**: Summon & buff minions

#### 🗼 Healing Tower System
- Configure tower count (1-4)
- Set heal power (weak/medium/strong/extreme)
- Adjust tower HP & respawn time
- Players harus destroy towers atau boss sustain healing

#### 🎁 Boss Death Rewards
Choose what happens when boss dies:
- 📦 **Treasure Chest** - Loot chest spawns
- 🌀 **Portal** - Teleport to reward room
- 🧙 **NPC Merchant** - Victory trades
- ✨ **Arena Transform** - Platforms & loot areas
- ⚡ **Buff Station** - Totem dengan permanent buffs
- 🎆 **Celebration** - Fireworks & loot rain

#### ✨ Visual Spawn Effects
- **Spawn Aura** - Magic circles, ritual patterns
- **Hologram** - Floating boss title dengan effects
- **Custom Summon** - Proximity trigger, item ritual, altar

## 🎨 Design Philosophy

### CINEMATIC EXPERIENCE
Setiap boss fight harus memorable:
- Dramatic spawn sequence
- Clear visual language (red = danger, blue = ice, etc)
- Sound design for atmosphere
- Screen shake for impact moments

### TELEGRAPHED ATTACKS
**CRITICAL:** All major attacks MUST be telegraphed!
- Visual: Particle buildup
- Audio: Warning sounds
- Text: Action bar messages
- Duration: Based on difficulty (0.5s - 5s)

Example:
```yaml
# 2-second telegraph for big attack
BOSS_slam:
  Skills:
  # WARNING PHASE
  - actionbar{m="&c⚠ SLAM INCOMING!"} @PIR{r=30}
  - particles{p=reddust;c=#FF0000;a=80;repeat=40;repeati=1} @ring{r=6;p=12}
  - sound{s=block.bell.use;v=1.5;p=0.8} @self
  - delay 40  # 2 seconds
  
  # ATTACK
  - damage{a=25;ignorearmor=true} @PIR{r=6}
  - throw{v=8;vy=3} @PIR{r=6}
  
  # RECOVERY (opening)
  - setspeed{s=0} @self
  - delay 40  # 2 seconds vulnerability
  - setspeed{s=0.3} @self
```

### FAIR CHALLENGE
- Mistakes are punishing but not instant death (except Nightmare difficulty)
- Players can learn and improve
- Skill expression through positioning & timing
- Clear counterplay to every mechanic

## 🔧 Configuration Output

Generator menghasilkan 3-4 files:

### 1. Mobs.yml
Complete mob configuration:
- Stats (HP, damage, armor, speed)
- LibDisguises setup
- AI configuration
- Skills references
- Drop tables
- Boss Bar (if enabled)

### 2. Skills.yml
All boss skills:
- Attack mechanics
- Phase-specific skills
- Telegraph systems
- Visual effects
- Combo chains

### 3. Items.yml (Optional)
Custom drop items dengan:
- Balanced stats
- Thematic abilities
- Custom models (if applicable)

### 4. SETUP_GUIDE.txt
Installation instructions:
- Plugin requirements
- File placement
- Spawn commands
- Feature explanations
- Troubleshooting

## 🎯 Difficulty Guide

### ⚖️ Balanced
**HP:** 600-1000 | **Damage:** 12-18 | **Speed:** 0.3-0.35

Telegraph: 1-2 seconds for major attacks
Cooldowns: Basic (3-5s), Special (10-15s), Ultimate (30-45s)
Philosophy: Fair challenge, clear counterplay

### 💪 Hard
**HP:** 1200-2000 | **Damage:** 20-35 | **Speed:** 0.35-0.42

Telegraph: 0.5-1 second (FAST!)
Cooldowns: Basic (2-3s), Special (8-12s), Ultimate (20-30s)
Philosophy: Requires skill & coordination

### 😈 Nightmare
**HP:** 300-600 | **Damage:** 40-70 | **Speed:** 0.4-0.55

Telegraph: One-shots (3-5s), Fast attacks (0.5s)
Cooldowns: Fast (2-4s), One-shots (25-40s)
Philosophy: GLASS CANNON - kill fast or die fast

### 🧠 Psychological
**HP:** 700-1000 | **Damage:** 10-20 | **Speed:** 0.25-0.35

Mechanics: Darkness effects, stalking, jumpscares
Philosophy: Fear > Damage
Atmosphere: Horror soundscape, unpredictable timing

### 🔥 Souls-like
**HP:** 800-1200 | **Damage:** 18-30 | **Speed:** 0.3-0.38

Telegraph: 2 seconds MINIMUM for ALL major attacks
Cooldowns: Fixed patterns (15-25s combos)
Philosophy: Pattern-based, learnable, punishing but FAIR

### 🕷️ Overwhelming
**HP:** 400-700 | **Damage:** 6-12 (per mob) | **Speed:** 0.35-0.42

Mechanics: Constant minion spam (6-10 at once)
Philosophy: Overwhelm with numbers
Counter: AoE damage & crowd control

## 💡 Pro Tips

### For Best Results:

1. **Be Specific in Description:**
   - Mention character references (anime, game, movie)
   - List desired skills explicitly
   - Specify base Minecraft mob
   - Describe visual theme

2. **Balance Features:**
   - Don't enable EVERY feature (overwhelming)
   - Choose 2-4 features that synergize
   - Match features to difficulty preset

3. **Test in Safe Environment:**
   - Always test in creative mode first
   - Adjust stats as needed
   - Check console for errors

4. **Iterate:**
   - Generate multiple versions
   - Mix and match best parts
   - Fine-tune mechanics

### Common Mistakes to Avoid:

❌ Vague descriptions: "make a strong boss"
✅ Specific: "ice wizard with freeze area skill, ice prison trap, summon minions"

❌ Too many features enabled
✅ 2-4 synergistic features

❌ Not testing before deploying
✅ Test in creative, adjust, then deploy

## 🐛 Troubleshooting

### Mob doesn't spawn
- Check `/mm reload` for syntax errors
- Verify base Type is valid vanilla mob
- Check console logs

### Skills not working
- Verify skill names match in Mobs.yml
- Check cooldown values aren't too high
- Test triggers with `/mm test`

### Disguise not showing
- Ensure LibDisguises + ProtocolLib installed
- Check `/disguise` command works
- Verify skin name exists (for player disguises)

### Performance issues
- Reduce particle amounts (default 50 → 20)
- Increase skill cooldowns
- Limit active mob count on server

### Config errors
- Use YAML validator
- Check indentation (spaces, not tabs!)
- Verify all brackets/quotes closed

## 🔒 Security & Privacy

- API key stored securely in Vercel environment variables
- No user data collected or stored
- All generation happens server-side
- CORS enabled for web access only

## 📚 Resources

- [MythicMobs Wiki](https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/home)
- [LibDisguises](https://www.spigotmc.org/resources/libsdisguises.81/)
- [MythicMobs Discord](https://discord.gg/mythiccraft)
- [Anthropic API Docs](https://docs.anthropic.com/)

## 🤝 Contributing

Contributions welcome! Please:
1. Fork repository
2. Create feature branch
3. Test thoroughly
4. Submit pull request with clear description

## 📝 Changelog

### v3.0.0 (Current)
- ✨ Complete overhaul of prompt system
- 🎬 Cinematic boss fights dengan telegraph system
- 🧠 6 custom AI behavior patterns
- 🗼 Healing tower mechanic
- 🎁 6 boss death reward types
- ✨ Visual spawn effects (aura, hologram, summon)
- 📊 Enhanced difficulty presets
- 🎨 Improved visual language & sound design

### v2.0.0
- Custom AI behavior options
- Healing tower system
- Death reward mechanics
- Visual spawn effects
- Modular prompt architecture

### v1.0.0
- Initial release
- Basic mob generation
- Difficulty presets
- LibDisguises integration

## ⚖️ License

MIT License - free to use and modify

## 🙏 Credits

- **Generator:** Built by Flux677
- **AI:** Powered by Claude (Anthropic)
- **Plugin:** MythicMobs by Mythiccraft
- **Community:** MythicMobs Discord & SpigotMC

---

## 💬 Support

Need help? Found a bug?
- Open issue on GitHub
- Join MythicMobs Discord
- Check troubleshooting guide above

---

**Made with ❤️ for the MythicMobs community**

*Generate EPIC bosses. Create MEMORABLE encounters. Build LEGENDARY servers.*