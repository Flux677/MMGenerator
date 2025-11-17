# 🚀 Advanced Features Guide

## Panduan Lengkap Fitur Advanced MythicMobs Generator

---

## 📊 **DIFFICULTY PRESETS**

### 1. **⚖️ Balanced** (Recommended untuk Start)
```yaml
Stats:
- HP: 500-800
- Damage: 10-15
- Mechanics: Fair dan balanced

Cocok untuk:
- Server dengan player mixed skill
- First boss encounter
- Learning mechanics
```

### 2. **💪 Hard Challenge**
```yaml
Stats:
- HP: 1000-1500
- Damage: 20-30
- Mechanics: Complex patterns, multiple phases

Cocok untuk:
- Experienced players
- End-game content
- Guild boss fights
```

### 3. **😈 Nightmare Mode**
```yaml
Stats:
- HP: 300-500 (LOW!)
- Damage: 35-50 (HIGH!)
- Mechanics: INSANE - one-shot potential

Karakteristik:
- Glass cannon (boss mati cepat)
- Player mati cepat jika salah
- Requires perfect execution
- High risk, high reward

Contoh Request:
"Buat nightmare boss assassin:
- Low HP (400)
- One-shot backstab (45 damage)
- Invisible/stealth mechanic
- Fast movement (speed 0.5)
- Teleport spam
- Critical hits fatal
Boss mati dalam 30 detik JIKA player perfect play"
```

### 4. **🧠 Psychological Horror**
```yaml
Stats:
- HP: 600-800
- Damage: 8-12 (RENDAH!)
- Mechanics: Darkness, sound, stealth, tension

Karakteristik:
- Damage BUKAN ancaman utama
- Atmosphere = horror
- Jump scares
- Limited vision
- Sound-based detection

Key Features:
- Darkness/Blindness effects
- Ambient horror sounds
- Unpredictable movement
- Stalking behavior
- One-shot potential (avoidable)

Contoh Request:
"Buat psychological horror boss 'The Watcher':
- Darkness aura (blind players dalam 30 block)
- Detect player dari SOUND (sprint=loud, sneak=quiet)
- Boss tidak auto-target, harus detect
- Teleport behind player (jumpscare)
- Slow approach (menakutkan)
- Instant kill jika catch player, tapi bisa dodge
- Heartbeat sound mendekat = boss near
- Screen shake effects
Base: WARDEN atau WITHER_SKELETON"
```

### 5. **🔥 Souls-like**
```yaml
Stats:
- HP: 700-1000
- Damage: 15-25
- Mechanics: Pattern-based, telegraphed, FAIR

Karakteristik:
- Semua attack ditelegraph 2s sebelumnya
- Fixed attack patterns
- Punish panic actions
- Reward patience
- Learning curve steep

Key Features:
- 2-second visual warnings (particles)
- Audio cues before attacks
- Clear dodge windows
- Pattern recognition required
- Deaths = player mistakes

Contoh Request:
"Buat souls-like boss knight:
- All attacks telegraphed (red particles 2s)
- 3-hit combo → overhead slam → spin attack (pattern)
- Punish early dodge (tracking attack)
- Reward patience (opening after combo)
- Shield phase (must break with heavy attacks)
- Phase 2: Faster but same patterns
- Fair HP (800)
- One-shot IF player greedy"
```

### 6. **🕷️ Overwhelming Swarm**
```yaml
Stats:
- HP: 400-600
- Damage: 5-10 (per hit LOW)
- Mechanics: MANY minions, constant pressure

Karakteristik:
- Boss damage rendah
- Summon BANYAK minion
- Minion swarm player
- Boss heals from minions
- Overwhelming tactics

Key Features:
- Summon waves (8-16 minions)
- Minions coordinate with boss
- Boss buff minions
- Must manage multiple threats
- AOE recommended for players

Contoh Request:
"Buat swarm boss Spider Queen:
- Low damage (8 per hit)
- Summon 12 baby spiders every 30s
- Boss heal 2 HP per spider alive (every 3s)
- Spiders swarm player (5 HP each)
- Web trap (slow player) → spider bite combo
- Phase 2: 24 spiders!
- Must kill spiders or boss regen
- Poison DOT from all spiders"
```

---

## 🧠 **AI COMPLEXITY LEVELS**

### 1. **🎯 Advanced AI**
```yaml
Features:
- ThreatTable (aggro management)
- Smart targeting (low HP priority)
- Adaptive behavior
- Basic state tracking

Example Config:
Modules:
  ThreatTable: true
  
AITargetSelectors:
- 0 clear
- 1 attacker
- 2 lowhealthplayers
- 3 players

Skills:
- threat{amount=500} @trigger ~onDamaged
- threat{amount=100} @PIR{r=20;sort=LOWEST_HEALTH}
```

### 2. **🧬 Elite AI**
```yaml
Features:
- Variable-based state machine
- Decision trees
- Counter-play mechanics
- Combo systems
- Adaptive tactics

Example Config:
Skills:
# State tracking
- setvar{var=caster.stance;val=neutral} @self ~onSpawn
- setvar{var=caster.combo_ready;val=true} @self ~onSpawn

# Decision making
- skill{s=AGGRESSIVE_STANCE} @self ?health{h=>70%}
- skill{s=DEFENSIVE_STANCE} @self ?health{h=<30%}
- skill{s=COUNTER_ATTACK} @trigger ~onDamaged ?varequals{var=caster.stance;val=defensive}

# Combo system
- skill{s=COMBO_1} @target ?varequals{var=caster.combo_ready;val=true}
- setvar{var=caster.combo_ready;val=false} @self
- setvar{var=caster.combo_ready;val=true;delay=200} @self
```

### 3. **👁️ Nightmare AI**
```yaml
Features:
- Learns player patterns
- Punishes repetitive actions
- Adapts to player skill
- Pattern recognition
- Meta-gaming

Example Config:
Skills:
# Track player actions
- setvar{var=target.dodge_count;val=0} @trigger ~onCombat
- variableMath{var=target.dodge_count;operation=ADD;value=1} @trigger (on dodge detect)

# Punish spam
BOSS_punish_dodge_spam:
  Conditions:
  - variableInRange{var=target.dodge_count;val=>5}
  Skills:
  - message{m="&c<caster.name> reads your pattern!"} @trigger
  - skill{s=TRACKING_ATTACK} @trigger  # Can't dodge this
  - setvar{var=target.dodge_count;val=0} @trigger

# Track damage taken
- variableMath{var=caster.damage_taken;operation=ADD;value=<skill.var.damage-amount>} @self ~onDamaged

# Adapt if taking too much damage
- setvar{var=caster.defensive_mode;val=true} @self ?variableInRange{var=caster.damage_taken;val=>200}
- potion{type=RESISTANCE;d=200;l=2} @self ?varequals{var=caster.defensive_mode;val=true}
```

---

## ⚙️ **ADVANCED MECHANICS**

### 1. **📊 Multi-Phase System**

**Apa itu:**
Boss berubah behavior di different HP thresholds.

**Implementasi:**
```yaml
# Phase Setup
Skills:
- setvar{var=caster.phase;val=1} @self ~onSpawn

# Phase 2 Transition (50% HP)
BOSS_phase_2_transition:
  Cooldown: 999
  Conditions:
  - health{h=<50%} true
  - varequals{var=caster.phase;val=1} true
  Skills:
  - setvar{var=caster.phase;val=2} @self
  - message{m="&c&l⚠ PHASE 2 ⚠"} @PIR{r=50}
  - heal{a=100} @self  # Partial heal
  - summon{t=MINION;amount=4} @ring{r=8;p=4}
  - potion{type=SPEED;d=9999;l=1} @self
  - effect:particles{p=explosion;a=100;hs=3;vs=3} @self
  - effect:sound{s=entity.ender_dragon.growl;v=2} @self
  - barSet{name=BOSS_BAR;color=RED} @self  # Bar color change

# Phase 3 (25% HP)
BOSS_phase_3_transition:
  Cooldown: 999
  Conditions:
  - health{h=<25%} true
  - varequals{var=caster.phase;val=2} true
  Skills:
  - setvar{var=caster.phase;val=3} @self
  - message{m="&4&l⚠⚠⚠ FINAL PHASE ⚠⚠⚠"} @PIR{r=50}
  - setvar{var=caster.enraged;val=true} @self
  - potion{type=INCREASE_DAMAGE;d=9999;l=1} @self
  # Unlock ultimate skills
  - setSkillCooldown{skill=BOSS_ULTIMATE;seconds=0} @self

# Phase-specific skills
BOSS_skill_phase_1_only:
  Cooldown: 15
  Conditions:
  - varequals{var=caster.phase;val=1} true
  Skills:
  - damage{a=10} @target

BOSS_skill_phase_2_3:
  Cooldown: 10
  Conditions:
  - variableInRange{var=caster.phase;val=>2} true
  Skills:
  - damage{a=20} @target
  - summon{t=MINION;amount=2} @self
```

**Tips:**
- Transition harus jelas (visual + audio + message)
- Each phase unlock new skills
- Adjust cooldowns per phase
- Phase 3 = desperation (spam skills)

### 2. **🔢 Variable State Machine**

**Apa itu:**
Boss punya multiple "states" yang berubah based on conditions.

**States Umum:**
- **Stance:** Aggressive, Defensive, Neutral
- **Mode:** Normal, Enraged, Weakened
- **Combo:** Ready, Active, Cooldown
- **Special:** Transformed, Powered, Vulnerable

**Implementasi:**
```yaml
# Initialize states
Skills:
- setvar{var=caster.stance;val=neutral;type=STRING} @self ~onSpawn
- setvar{var=caster.mode;val=normal;type=STRING} @self ~onSpawn
- setvar{var=caster.combo_state;val=ready;type=STRING} @self ~onSpawn

# Check and switch states
BOSS_check_stance:
  Skills:
  # Aggressive if high HP
  - setvar{var=caster.stance;val=aggressive} @self ?health{h=>70%}
  # Defensive if low HP
  - setvar{var=caster.stance;val=defensive} @self ?health{h=<30%}
  # Neutral otherwise
  - setvar{var=caster.stance;val=neutral} @self ?health{h=30to70%}

# Aggressive stance behavior
BOSS_aggressive_attack:
  Cooldown: 5
  Conditions:
  - varequals{var=caster.stance;val=aggressive} true
  Skills:
  - damage{a=15} @target
  - lunge{v=3} @target

# Defensive stance behavior  
BOSS_defensive_heal:
  Cooldown: 15
  Conditions:
  - varequals{var=caster.stance;val=defensive} true
  Skills:
  - heal{a=50} @self
  - potion{type=RESISTANCE;d=100;l=2} @self
  - teleport{l=@ring{r=15;p=1}} @self  # Escape

# Enrage trigger
BOSS_enrage_trigger:
  Conditions:
  - health{h=<20%} true
  - varequals{var=caster.mode;val=normal} true
  Skills:
  - setvar{var=caster.mode;val=enraged} @self
  - message{m="&c<caster.name> ENRAGES!"} @PIR{r=50}
  - potion{type=SPEED;d=9999;l=2} @self
  - potion{type=INCREASE_DAMAGE;d=9999;l=1} @self
```

### 3. **🌋 Environmental Hazards**

**Apa itu:**
Boss manipulate arena/environment.

**Types:**
- Block placement (lava, fire, webs)
- Summon hazard entities
- Arena transformation
- Dynamic obstacles

**Implementasi:**
```yaml
# Lava Ring
BOSS_lava_ring:
  Cooldown: 45
  Skills:
  - message{m="&cThe ground erupts!"} @PIR{r=30}
  - blockmask{m=LAVA;r=12;d=20;na=true;oa=false} @ring{r=12;p=16;y=0}
  - blockmask{m=AIR;r=6;d=5;oa=true} @self  # Safe zone center
  - delay 200
  - blockmask{m=OBSIDIAN;r=12;d=20;na=true} @ring{r=12;p=16;y=0}  # Remove after 10s

# Falling Hazards
BOSS_ceiling_spikes:
  Cooldown: 30
  Skills:
  - summon{t=HAZARD_SPIKE;amount=8} @ring{r=10;p=8;y=10}
  - effect:particles{p=block_crack;b=iron_block;a=50} @ring{r=10;p=8;y=10}
  
# Arena Transformation
BOSS_arena_transform:
  Cooldown: 999
  Conditions:
  - health{h=<40%} true
  Skills:
  - message{m="&4&lThe arena transforms!"} @PIR{r=50}
  - effect:sound{s=entity.ender_dragon.growl;v=2} @self
  # Create pillars
  - blockmask{m=STONE_BRICKS;r=2;d=8;na=true} @ring{r=15;p=4;y=-1}
  # Floor hazards
  - blockmask{m=MAGMA_BLOCK;r=20;d=1;na=true;pattern=random} @self
  # Lighting
  - blockmask{m=LIGHT;r=3;d=1} @ring{r=15;p=8}
```

### 4. **🤝 Minion Coordination**

**Apa itu:**
Boss dan minion bekerja sama secara tactical.

**Mechanics:**
- Boss buff minions
- Minions protect boss
- Coordinated attacks
- Boss react to minion deaths

**Implementasi:**
```yaml
# Boss Rally Ability
BOSS_rally_troops:
  Cooldown: 30
  Conditions:
  - mobsinradius{r=20;types=MINION_TYPE;a=>2} true
  Skills:
  - message{m="&e<caster.name> rallies the troops!"} @PIR{r=40}
  - effect:sound{s=block.bell.use;v=2} @self
  # Buff all minions
  - potion{type=INCREASE_DAMAGE;d=200;l=2} @MIR{r=25;types=MINION_TYPE}
  - potion{type=SPEED;d=200;l=1} @MIR{r=25;types=MINION_TYPE}
  - heal{a=20} @MIR{r=25;types=MINION_TYPE}
  # Boss also buffed
  - potion{type=REGENERATION;d=100;l=1} @self

# Minion Protect Boss
MINION_protect_boss_skill:
  TriggerConditions:
  - entitytype{t=BOSS_TYPE} @target  # If targeting boss
  Conditions:
  - entitytype{t=BOSS_TYPE} @EIR{r=10}  # Boss nearby
  Skills:
  - taunt @trigger  # Taunt player
  - threat{amount=1000} @trigger
  - teleport{} @location{c=@BOSS_TYPE;r=30}  # Jump to boss
  - message{m="Minion protects the boss!"} @trigger

# Boss Enrage on Minion Death
BOSS_minion_death_check:
  Cooldown: 5
  Conditions:
  - mobsinradius{r=30;types=MINION_TYPE;a=<2} true
  - varequals{var=caster.minions_enrage;val=false} true
  Skills:
  - setvar{var=caster.minions_enrage;val=true} @self
  - message{m="&c<caster.name> enrages as minions fall!"} @PIR{r=50}
  - potion{type=SPEED;d=9999;l=1} @self
  - potion{type=INCREASE_DAMAGE;d=9999;l=0} @self
  - summon{t=ELITE_MINION;amount=2} @ring{r=5;p=2}  # Summon elites

# Coordinated Attack
BOSS_coordinated_strike:
  Cooldown: 20
  Conditions:
  - mobsinradius{r=15;types=MINION_TYPE;a=>3} true
  Skills:
  - message{m="&eCoordinated strike!"} @PIR{r=30}
  # Boss telegraphs
  - effect:particles{p=crit;a=50;hs=2;vs=2;repeat=20;repeati=1} @self
  - delay 20
  # Boss attacks
  - damage{a=15} @PIR{r=8}
  # Minions attack simultaneously
  - signal{s=ATTACK_NOW} @MIR{r=20;types=MINION_TYPE}

# Minion receives signal
MINION_attack_on_signal:
  Skills:
  - damage{a=5} @NearestPlayer{r=10}
  - lunge{v=2} @NearestPlayer{r=10}
```

### 5. **📈 Adaptive Difficulty**

**Apa itu:**
Boss adjust difficulty based on fight progression dan player performance.

**Adjustments:**
- Time-based scaling
- Performance-based difficulty
- Player count scaling
- Soft enrage timer

**Implementasi:**
```yaml
# Initialize timer
Skills:
- setvar{var=caster.fight_timer;val=0;type=INTEGER} @self ~onCombat
- setvar{var=caster.no_damage_timer;val=0} @self ~onCombat

# Increment timers
- variableMath{var=caster.fight_timer;operation=ADD;value=1} @self ~onTimer:20
- variableMath{var=caster.no_damage_timer;operation=ADD;value=1} @self ~onTimer:20

# Reset no damage timer when hit
- setvar{var=caster.no_damage_timer;val=0} @self ~onDamaged

# Soft Enrage (Fight too long)
BOSS_soft_enrage:
  Cooldown: 999
  Conditions:
  - variableInRange{var=caster.fight_timer;val=>300}  # 5 minutes
  Skills:
  - message{m="&c&lBoss grows impatient! Damage increased!"} @PIR{r=50}
  - potion{type=INCREASE_DAMAGE;d=9999;l=1} @self
  - potion{type=SPEED;d=9999;l=1} @self
  - setvar{var=caster.fight_timer;val=0} @self  # Reset for next enrage

# Player Doing Too Well
BOSS_buff_when_losing:
  Cooldown: 60
  Conditions:
  - variableInRange{var=caster.no_damage_timer;val=>60}  # 1 min no damage
  Skills:
  - message{m="&e<caster.name> adapts to your tactics!"} @PIR{r=40}
  - potion{type=REGENERATION;d=200;l=3} @self
  - potion{type=SPEED;d=200;l=0} @self
  - setvar{var=caster.no_damage_timer;val=0} @self

# Player Count Scaling
BOSS_scale_to_players:
  Skills:
  - setvar{var=caster.player_count;val=<caster.level>} @self
  # More players = more HP
  - heal{a=200} @self ?variableInRange{var=caster.player_count;val=>3}
  - heal{a=400} @self ?variableInRange{var=caster.player_count;val=>5}
  # More damage too
  - potion{type=INCREASE_DAMAGE;d=9999;l=0} @self ?variableInRange{var=caster.player_count;val=>3}
  - potion{type=INCREASE_DAMAGE;d=9999;l=1} @self ?variableInRange{var=caster.player_count;val=>5}
```

### 6. **🛡️ Counter-Attack System**

**Apa itu:**
Boss punish specific player actions.

**Counters:**
- Block breaking
- Projectile shooting
- Melee spam
- Potion usage
- Skill spam

**Implementasi:**
```yaml
# Counter Front Attack
BOSS_counter_frontal:
  TriggerConditions:
  - fieldofview{a=90;r=0} true  # Attack from front
  Conditions:
  - varequals{var=caster.stance;val=defensive} true
  - chance{c=0.5} true  # 50% chance
  Skills:
  - message{m="&e⚔ Parried!"} @trigger
  - damage{a=15;ignorearmor=true} @trigger
  - throw{v=8;vy=3} @trigger
  - effect:sound{s=item.shield.block;v=1} @self
  - effect:particles{p=crit;a=20} @self

# Punish Backstab Attempt
BOSS_punish_backstab:
  TriggerConditions:
  - fieldofview{a=90;r=180} true  # Attack from behind
  Conditions:
  - varequals{var=caster.aware;val=true} true
  Skills:
  - message{m="&cNice try!"} @trigger
  - teleport{l=@trigger;y=0} @self  # Teleport behind player
  - damage{a=25} @trigger
  - potion{type=SLOW;d=60;l=2} @trigger

# Counter Projectile
BOSS_reflect_projectile:
  TriggerConditions:
  - projectile true
  Conditions:
  - varequals{var=caster.reflecting;val=true} true
  - chance{c=0.3} true
  Skills:
  - message{m="&eReflected!"} @trigger
  - projectile{v=20;i=1;hs=true} @trigger
  - effect:particles{p=end_rod;a=10} @self

# Punish Skill Spam
BOSS_detect_spam:
  Skills:
  - variableMath{var=target.action_count;operation=ADD;value=1} @trigger
  - setvar{var=target.action_count;val=0;delay=100} @trigger  # Reset after 5s
  
BOSS_punish_spam:
  Conditions:
  - variableInRange{var=target.action_count;val=>5} true
  Skills:
  - message{m="&c<caster.name> punishes your spam!"} @trigger
  - damage{a=20} @trigger
  - potion{type=WEAKNESS;d=200;l=2} @trigger
  - potion{type=SLOW;d=200;l=1} @trigger
  - setvar{var=target.action_count;val=0} @trigger
```

---

## 🎯 **EXAMPLE FULL REQUEST**

### Nightmare Souls-like Boss

```
Buat boss "Blade Dancer - The Forgotten Duelist" dengan:

DIFFICULTY: Souls-like + Nightmare elements
AI: Elite (variable state machine)

=== STATS ===
- HP: 450 (LOW untuk boss)
- Damage: 30-40 (HIGH)
- Armor: 5
- Speed: 0.45 (FAST)

=== CORE CONCEPT ===
Samurai/swordmaster boss yang:
- Every attack telegraphed 2 detik
- Pattern-based combat (must learn patterns)
- Instant death jika kena combo penuh
- TAPI semua dodgeable dengan skill

=== MECHANICS ===

1. STANCE SYSTEM (Variable State):
   - Iaido Stance: Fast single slash
   - Flowing Stance: 3-hit combo
   - Counter Stance: Parry player attack

2. TELEGRAPH SYSTEM:
   - Red particles 2s sebelum attack
   - Sword glow (different color per stance)
   - Audio cue (blade sheathe sound)
   - Slow charge animation

3. COMBO PATTERNS:
   Pattern A: Slash → Dash → Overhead (20+15+25 damage)
   Pattern B: Spin → Spin → Thrust (15+15+30 damage)
   Pattern C: Dash → Grab → Execute (10+0+40 instant)

4. PUNISH SYSTEM:
   - Counter if attacked during charge
   - Punish dodge spam (tracking slash)
   - Punish heal attempt (interrupt)

5. PHASE TRANSITIONS:
   Phase 1 (100-60%): Slow, clear telegraphs
   Phase 2 (60-30%): Faster, shorter telegraphs
   Phase 3 (<30%): Desperate, mix patterns

6. OPENINGS:
   - 3s window after combo miss
   - Vulnerable during stance change
   - Punish = stagger (5s opening)

=== ADVANCED FEATURES ===
- ✅ Multi-Phase System
- ✅ Variable State Machine (stances)
- ✅ Counter-Attack System (parry)
- ✅ Adaptive (learn player dodge timing)

=== TECHNICAL ===
- Base: WITHER_SKELETON
- Disguise: Player "SamuraiDuelist" (samurai skin)
- Particles: 
  * Iaido: white crit
  * Flowing: blue enchant
  * Counter: yellow spark
- Sounds:
  * Telegraph: blade sheathe
  * Attack: blade swing
  * Counter: shield block
- Boss Bar: RED, PROGRESS style

=== BALANCE ===
- Boss die in 60-90 seconds IF player perfect
- Player die in 2-3 hits IF careless
- Every death = player mistake (fair)
- Skill expression HIGH
- Learning curve steep but rewarding

Generate dengan:
- Detailed telegraph system
- Clear combo patterns
- Variable stance tracking
- Counter mechanics
- Phase transitions
- Fair but brutal balance
```

---

## 💡 **TIPS MAKSIMALKAN AI**

### 1. **Gunakan Variables Everywhere**
```yaml
# Track EVERYTHING
- setvar{var=caster.phase;val=1}
- setvar{var=caster.stance;val=neutral}
- setvar{var=caster.combo;val=0}
- setvar{var=caster.enraged;val=false}
- setvar{var=caster.ultimate_ready;val=true}
- setvar{var=caster.last_skill;val=none}
- setvar{var=target.marked;val=false}
- setvar{var=target.combo_hit;val=0}
```

### 2. **Inline Conditions untuk Dynamic Behavior**
```yaml
- damage{a=10} @target ?varequals{var=caster.phase;val=1}
- damage{a=20} @target ?varequals{var=caster.phase;val=2}
- damage{a=35} @target ?varequals{var=caster.phase;val=3}
```

### 3. **Skill Dependencies**
```yaml
- skill{s=COMBO_2} @target ?varequals{var=caster.combo;val=1}
- skill{s=COMBO_3} @target ?varequals{var=caster.combo;val=2}
- skill{s=FINISHER} @target ?varequals{var=caster.combo;val=3}
```

### 4. **Smart Cooldown Management**
```yaml
# Dynamic cooldowns based on phase
- setSkillCooldown{skill=BIG_ATTACK;seconds=30} @self ?varequals{var=caster.phase;val=1}
- setSkillCooldown{skill=BIG_ATTACK;seconds=15} @self ?varequals{var=caster.phase;val=2}
- setSkillCooldown{skill=BIG_ATTACK;seconds=5} @self ?varequals{var=caster.phase;val=3}
```

### 5. **Feedback ke Player**
```yaml
- message{m="&e<caster.name> enters defensive stance!"} @PIR{r=30}
- message{m="&cPhase 2!"} @PIR{r=50}
- message{m="&4Ultimate ready!"} @PIR{r=40}
- title{t="&c⚠ DANGER";st="Boss preparing ultimate";fadein=10;stay=40;fadeout=10} @PIR{r=50}
```

---

## 🎮 **DEPLOYMENT**

Upload file yang sudah di-update ke Vercel:
1. Replace semua file lama
2. Redeploy
3. Test dengan generate boss baru
4. Check variable usage di config
5. Enjoy advanced mechanics!

---

**SEKARANG TOOLS MAKSIMAL! AI CLAUDE FULLY UTILIZED!** 