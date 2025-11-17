# 📝 Example Requests - Ready to Use!

Copy-paste request ini ke tools untuk test fitur advanced!

---

## 1. 🧠 **PSYCHOLOGICAL HORROR BOSS**

**Category:** Boss  
**Difficulty:** Psychological  
**AI Complexity:** Nightmare  

**✅ Check:**
- Multi-Phase System
- Variable State Machine
- Environmental Hazards
- Adaptive Difficulty

**Request:**
```
Buat psychological horror boss "The Watcher" dengan konsep menegangkan:

=== CORE CONCEPT ===
Boss yang menegangkan bukan dari damage, tapi dari ATMOSPHERE dan MECHANICS.

=== STATS ===
- HP: 700
- Damage: 10 (rendah!)
- Armor: 8
- Speed: 0.25 (LAMBAT tapi menakutkan)

=== HORROR MECHANICS ===

1. DARKNESS SYSTEM:
   - Permanent Darkness II aura (30 block radius)
   - Blindness pulse every 15s (5s duration)
   - Limited vision = fear
   - Screen shake on nearby

2. SOUND DETECTION (Bukan auto-target!):
   - Boss TIDAK otomatis target player
   - Deteksi dari SOUND:
     * Sprint = detected 25 block
     * Walk = detected 12 block
     * Sneak = detected 5 block
     * Break block = detected 20 block
   - Random patrol if no detection
   - Menakutkan karena bisa "hilang" dari aggro

3. STALKING BEHAVIOR:
   - Slow approach (tidak rush)
   - Stop and stare (creepy)
   - Teleport behind player (jumpscare)
   - Disappear and reappear
   - Breathing sound mendekat

4. INSTANT KILL MECHANIC:
   - Jika "catch" player = 45 damage (almost one-shot)
   - TAPI: 3s telegraph (red glow, loud heartbeat)
   - Player BISA dodge dengan sprint away
   - Fair tapi scary

5. ENVIRONMENTAL HORROR:
   - Spawn "watching eyes" (armor stands)
   - Create fog (blindness zones)
   - Flicker lights (light blocks on/off)
   - Ambient horror sounds

=== PHASES ===

Phase 1 (100-60%): Hunting
- Slow patrol
- Detect and stalk
- Single grab attempts

Phase 2 (60-30%): Aggressive
- Faster movement (0.35)
- Teleport behind player
- Summon 2 "watchers" (minions, weak but scary)
- More grab attempts

Phase 3 (<30%): Desperation
- Constant teleports
- Multiple grab attempts
- Scream attack (fear + confusion)
- ALL lights go out (pitch black)

=== VARIABLE TRACKING ===
- var: detection_level (0-100 based on sound)
- var: stalking (true/false)
- var: hunt_mode (patrol/chase/ambush)
- var: player_last_seen (location)
- var: grab_ready (cooldown tracking)

=== MINIONS (Phase 2+) ===
Watcher Minion:
- 15 HP
- 3 damage
- Slow player on hit
- Whisper sounds (creepy)
- Reveal player location to boss

=== TECHNICAL ===
- Base: WARDEN (for detection) atau WITHER_SKELETON
- Disguise: Player "TheWatcher" (dark horror skin)
- Sounds:
  * Ambient: Heartbeat, breathing
  * Alert: Loud scream
  * Grab: Horror sound effect
- Particles:
  * Darkness: Black particles
  * Eyes: Ender eye particles
  * Detection: Sonic wave (blue)
- Arena: Dark enclosed space, pillars for hiding

=== BALANCE ===
- Damage bukan threat utama
- FEAR dari mechanics
- Skilled player bisa stealth through
- One mistake = heavy punishment
- Psychological pressure > raw stats

Generate dengan semua variable tracking, detection system, dan horror atmosphere maksimal!
```

---

## 2. 🔥 **SOULS-LIKE PATTERN BOSS**

**Category:** Boss  
**Difficulty:** Souls-like  
**AI Complexity:** Elite  

**✅ Check:**
- Multi-Phase System
- Variable State Machine
- Counter-Attack System

**Request:**
```
Buat souls-like boss "Artorias the Corrupted Knight":

=== CONCEPT ===
Dark Souls style boss:
- Pattern-based combat
- Telegraphed attacks (2s warning)
- Punishing but FAIR
- Learning curve required

=== STATS ===
- HP: 850
- Damage: 18-28 (depends on attack)
- Armor: 12
- Speed: 0.4

=== PATTERN SYSTEM ===

Pattern A (Distance: >8 blocks):
1. Charge telegraph (2s, blue particles)
2. Dash forward (leap)
3. Overhead slam (28 damage)
4. Opening (3s vulnerable)

Pattern B (Distance: 5-8 blocks):
1. Sword raise (2s, white particles)
2. Horizontal slash (18 damage)
3. Spin attack (22 damage)
4. Thrust (25 damage)
5. Opening (4s vulnerable)

Pattern C (Distance: <5 blocks):
1. Step back (1s)
2. Quick slash (15 damage)
3. Shield bash (10 damage + knockback)
4. Guard stance (2s counter window)

Ultimate Pattern (Phase 2, <40% HP):
1. Power up (5s, invulnerable)
2. Red aura
3. Berserk combo:
   - Slash (20)
   - Slash (20)  
   - Spin (25)
   - Jump (30)
   - AOE explosion (35)
4. Long opening (5s exhausted)

=== TELEGRAPH SYSTEM ===
- Visual: Colored particles (2s)
- Audio: Blade sheathe sound
- Animation: Stance change (model locked)
- Warning message (optional)

MUST be clear and fair!

=== COUNTER MECHANICS ===

1. Parry System:
   - If attacked during Guard Stance
   - Counter slash (35 damage)
   - Stagger player (3s slow)

2. Punish Dodge Spam:
   - Track player dodge count
   - If >3 dodges in 5s
   - Tracking slash (can't dodge)
   - 30 damage

3. Punish Healing:
   - Detect potion effect gain
   - Interrupt with dash attack
   - 20 damage + cancel heal

=== PHASES ===

Phase 1 (100-40%):
- Normal patterns
- 2s telegraphs
- Clear openings

Phase 2 (<40%):
- Unlock Ultimate Pattern
- 1.5s telegraphs (faster)
- Mix patterns randomly
- Power up buff (+damage)

=== VARIABLE STATE MACHINE ===
- var: current_pattern (A/B/C/Ultimate)
- var: pattern_step (1/2/3/4/5)
- var: vulnerable (true/false)
- var: stance (attacking/defending/neutral)
- var: dodge_count (track player)
- var: phase (1/2)

=== OPENING WINDOWS ===
After each pattern = vulnerable period:
- Cannot attack
- Take +50% damage
- Slight slow
- Reward patient players

=== LEARNING CURVE ===
Deaths should teach:
- Pattern recognition
- Dodge timing
- Opening exploitation
- Patience > aggression

=== TECHNICAL ===
- Base: WITHER_SKELETON
- Disguise: Player "CorruptedKnight" (armor skin)
- Equipment: Diamond sword + shield visual
- Particles: Phase 1 blue, Phase 2 red
- Sounds: Blade swings, armor clanking
- Boss Bar: RED, SEGMENTED_6

=== BALANCE ===
- HP enough for 2-3 minute fight
- Damage punishing but not one-shot
- All attacks avoidable with skill
- Fair = frustrating but rewarding
- "Git gud" mentality

Generate dengan complete pattern system, clear telegraphs, punish mechanics, dan fair openings!
```

---

## 3. 🕷️ **SWARM OVERWHELMING BOSS**

**Category:** Boss + Dungeon Mobs  
**Difficulty:** Overwhelming  
**AI Complexity:** Elite  

**✅ Check:**
- Multi-Phase System
- Variable State Machine
- Minion Coordination
- Environmental Hazards

**Request:**
```
Buat swarm boss "Arachne the Brood Mother" dengan mechanics overwhelming:

=== CONCEPT ===
Boss yang menegangkan dari SWARM bukan damage tinggi.
Player must manage multiple threats simultaneously.

=== BOSS STATS ===
- HP: 550
- Damage: 8 (LOW!)
- Armor: 6
- Speed: 0.4 (fast)

=== CORE MECHANICS ===

1. SPAWN WAVES (Key mechanic):
   Wave 1 (100-75% HP): 8 spiderlings
   Wave 2 (75-50% HP): 12 spiderlings
   Wave 3 (50-25% HP): 16 spiderlings + 2 elites
   Wave 4 (<25% HP): 20 spiderlings + 4 elites

   Cooldown: 35s between waves

2. REGENERATION:
   - Boss heal 2 HP per spiderling alive
   - Heal tick every 3s
   - MUST kill spiders or boss regen!
   - Visual: Green particles when healing

3. WEB TRAP COMBO:
   - Boss shoot web (projectile)
   - Hit = Slowness IV + Jump Fatigue (8s)
   - Player STUCK
   - Boss + spiders converge (combo)
   - Devastating if stuck

4. COCOON GRAB:
   - Teleport behind player
   - Wrap in cocoon (cage)
   - Player trapped 10s
   - Boss heal during trap (5 HP/s)
   - Allies can break cocoon (wool blocks)

5. POISON STACKING:
   - Boss + all spiders apply Poison I
   - Stacks = deadly
   - 10 spiders = Poison X essentially

=== MINIONS ===

Spiderling (Normal):
- Base: CAVE_SPIDER
- HP: 5
- Damage: 3
- Poison I on hit (3s)
- Fast movement (0.5 speed)
- Swarm behavior (group up)

Spiderling (Elite):
- HP: 20
- Damage: 6
- Poison II on hit (8s)
- Can web shot (copy boss)
- Explode on death (poison cloud)

=== MINION COORDINATION ===

1. Swarm Tactics:
   - Spiders target same player
   - Surround and overwhelm
   - Cover escape routes

2. Boss Commands:
   - Rally: Buff all spiders (+damage, +speed)
   - Focus: All spiders attack one target
   - Protect: Spiders shield boss (bodyguard)

3. Boss Reaction:
   - If 5+ spiders dead = Boss enrage
   - Faster spawn waves
   - More aggressive

=== PHASES ===

Phase 1 (100-60%): Hunting
- Single spawn waves
- Normal web shots
- Boss focus damage

Phase 2 (60-30%): Nest Defense
- Double spawn waves
- Cocoon traps active
- Boss summon elite spiders
- Poison aura (5 block radius)

Phase 3 (<30%): Frenzy
- Triple spawn waves
- All skills on reduced cooldown
- Boss speed +30%
- Constant spawning (every 20s)
- Desperate tactics

=== ENVIRONMENTAL HAZARDS ===

1. Web Terrain:
   - Boss creates cobweb blocks
   - Slow player movement
   - Restrict mobility

2. Egg Sacs:
   - Spawn around arena
   - "Hatch" into spiderlings
   - Player can destroy early (prevent spawn)

3. Ceiling Drops:
   - Boss climb to ceiling
   - Drop spiders from above
   - Surprise attacks

=== VARIABLE TRACKING ===
- var: minion_count (track alive spiders)
- var: wave_number (1/2/3/4)
- var: boss_enraged (true/false)
- var: phase (1/2/3)
- var: player_webbed (target tracking)
- var: heal_stacks (regen power)

=== STRATEGY (for players) ===
- Kill spiders first OR boss regen
- AOE recommended
- Don't get webbed
- Break cocoons quickly
- Manage swarm or get overwhelmed

=== TECHNICAL ===
- Boss Base: SPIDER
- Disguise: Giant spider (scale 2.5x) or Player "SpiderQueen"
- Minion Base: CAVE_SPIDER
- Particles:
  * Web: White cobweb
  * Poison: Green drip
  * Spawn: Egg particles
- Sounds:
  * Boss: Spider hiss, screech
  * Spawn: Clicking sounds
- Boss Bar: GREEN, SEGMENTED_10

=== BALANCE ===
- Boss damage LOW individually
- Threat from NUMBERS
- Swarm overwhelm = pressure
- Must manage multiple enemies
- Team play recommended
- Solo possible but hard

Generate dengan complete swarm mechanics, minion coordination, regeneration system, dan overwhelming tactics!
```

---

## 4. 😈 **NIGHTMARE GLASS CANNON**

**Category:** Boss  
**Difficulty:** Nightmare  
**AI Complexity:** Nightmare  

**✅ Check:**
- Multi-Phase System
- Variable State Machine
- Counter-Attack System
- Adaptive Difficulty

**Request:**
```
Buat nightmare boss "Reaper - Death's Shadow":

=== CONCEPT ===
Glass cannon extreme:
- VERY low HP (350)
- VERY high damage (40-60)
- One-shot potential BOTH ways
- Fastest fight (30s-2min)
- High skill expression

=== STATS ===
- HP: 350 (extremely low!)
- Damage: 40-60 (one-shot potential!)
- Armor: 0 (no armor!)
- Speed: 0.55 (VERY fast)
- Knockback resistance: 0 (flies back)

=== PHILOSOPHY ===
"You die fast, I die fast, who's better?"
Risk vs reward extreme.

=== INSTANT DEATH MECHANICS ===

1. Reap (Ultimate):
   - Cooldown: 45s
   - Telegraph: 4 seconds
     * Red skull particles
     * Loud bell sound
     * Message: "☠ DEATH APPROACHES ☠"
     * Screen shake
   - Execute: Dash to player
   - Damage: 60 (instant death most players)
   - DODGEABLE: Sidestep during dash
   - Miss = 6s opening (exhausted)

2. Soul Harvest:
   - Quick teleport behind
   - Fast slash (50 damage)
   - 1.5s telegraph (short!)
   - Red particles behind player
   - Dodgeable with fast reaction

3. Death Mark:
   - Mark player (glow)
   - After 8s: Instant 40 damage
   - Player MUST damage boss to remove mark
   - Punishment for passive play

=== FAST MECHANICS ===

1. Blink Strikes:
   - Teleport around player
   - Quick slashes (25 damage each)
   - 3 teleports in 2s
   - Disorienting

2. Clone Feint:
   - Create 3 clones (1 HP)
   - Real boss random position
   - 2s to identify real one
   - Attack wrong = real boss strike

3. Phase Dash:
   - Become invulnerable (2s)
   - Dash through player
   - Exit behind = slash (45 damage)

=== NIGHTMARE AI ===

Learn Player Patterns:
- var: player_dodge_direction (left/right/back)
- Predict and counter next dodge
- Adaptive targeting

Punish Tactics:
- Heal attempt = Death Mark
- Stay far = Soul Pull (forced engage)
- Spam attack = Parry Counter (55 damage)

Adaptive Difficulty:
- If player doing well (no damage 30s)
  = Boss slower telegraphs (help player)
- If player struggling (3+ deaths)
  = Boss 1.5x HP (mercy mode)

=== PHASES ===

Phase 1 (100-50%): Testing
- Normal speed attacks
- 3s telegraphs
- Learn player behavior

Phase 2 (<50%): Serious
- Unlock Reap (ultimate)
- 1.5s telegraphs (faster!)
- More aggressive
- Clone Feint active

"Phase 3" (Boss <100 HP):
- Desperation mode
- Constant teleports
- Spam all skills
- No cooldowns
- All or nothing

=== COUNTER SYSTEM ===

Perfect Dodge:
- If player dodge at exact moment
- Boss stagger (3s)
- Take +100% damage
- Risk vs reward

Parry Mechanic:
- Boss can parry player attacks
- 30% chance during attack
- Counter slash (55 damage)
- Punish aggression

=== VARIABLE TRACKING ===
- var: player_pattern (dodge behavior)
- var: hit_count (combo tracking)
- var: reap_ready (ultimate cooldown)
- var: phase (1/2/desperate)
- var: death_mark_active (curse tracking)
- var: player_skill_level (adaptive tracking)

=== TECHNICAL ===
- Base: VEX (flying) or WITHER_SKELETON
- Disguise: Player "DeathReaper" (grim reaper skin)
- Particles:
  * Reap: Red skull
  * Teleport: Black smoke
  * Mark: Red glow
- Sounds:
  * Ambient: Whispers
  * Telegraph: Bell toll
  * Kill: Reaper laugh
- Boss Bar: PURPLE, PROGRESS (drain fast!)

=== BALANCE ===
- Shortest boss fight possible
- Both die in 1-2 hits
- Skill ceiling VERY high
- Fair but brutal
- Adrenaline rush
- "One shot or get shot"

Generate dengan extreme risk/reward, learning AI, instant death mechanics, dan adaptive difficulty!
```

---

## 5. 🏰 **DUNGEON COMPLETE PACK**

**Category:** Boss + Dungeon Mobs  
**Difficulty:** Hard  
**AI Complexity:** Elite  

**✅ Check:**
- Multi-Phase System
- Variable State Machine
- Minion Coordination
- Environmental Hazards
- Counter-Attack System

**Request:**
```
Buat complete dungeon pack "Frozen Citadel":

=== BOSS: FROST LICH KING ===

Stats:
- HP: 1200
- Damage: 15-25
- Armor: 10
- Speed: 0.3

Core Mechanics:

1. SUMMON MINIONS:
   - Frozen Warriors (melee)
   - Ice Mages (ranged)
   - Frost Golems (tank)
   Wave spawn at 75%, 50%, 25% HP

2. FROST NOVA:
   - AOE 12 block radius
   - Freeze players (Slowness V + Mining Fatigue)
   - 10s duration
   - Damage: 10 + DOT
   - Cooldown: 30s

3. ICE SPIKE BARRAGE:
   - Summon ice spikes from ground
   - 8 projectiles in circle
   - Track player movement
   - 15 damage per spike
   - Cooldown: 20s

4. BLIZZARD (Ultimate):
   - Arena-wide effect
   - Constant damage (3/s)
   - Heavy slow
   - Obscure vision (particles)
   - Duration: 15s
   - Cooldown: 60s

5. ICE ARMOR (Phase 2):
   - Damage reduction 50%
   - Must break (500 damage)
   - Reforms every 45s
   - Boss invulnerable until broken

Phases:
- Phase 1 (100-50%): Normal casting
- Phase 2 (<50%): Ice Armor, faster casts, summon elites

=== MINION 1: FROZEN WARRIOR ===

Stats:
- HP: 80
- Damage: 12
- Speed: 0.35

Skills:
- Frost Blade: Slash (12 dmg + slow)
- Ice Charge: Dash attack (18 dmg)
- Freeze Touch: Melee slow on hit
- Protect King: Shield boss if nearby

AI: Elite
- Coordinate with other warriors
- Focus low HP players
- Protect boss at <30% HP

=== MINION 2: ICE MAGE ===

Stats:
- HP: 45
- Damage: 8 (per projectile)
- Speed: 0.25

Skills:
- Ice Shard: Projectile (8 dmg)
- Frost Shield: Protect self (absorb 20 dmg)
- Glacial Lance: Heavy projectile (20 dmg)
- Mana Link: Heal boss (5 HP/s if alive)

AI: Elite
- Keep distance (ranged)
- Heal boss priority
- Shield when low HP
- Focus casters

=== MINION 3: FROST GOLEM ===

Stats:
- HP: 200
- Damage: 20
- Speed: 0.2 (slow but tanky)

Skills:
- Ice Slam: AOE ground pound (20 dmg)
- Taunt: Force aggro
- Frozen Aura: Slow enemies nearby
- Ice Block: Become invulnerable 5s

AI: Elite
- Tank for boss
- Taunt players attacking boss
- Bodyguard positioning
- Last stand at boss <20% HP

=== MINION COORDINATION ===

1. Formation:
   - Golems front (tank)
   - Warriors mid (DPS)
   - Mages back (support)

2. Boss Commands:
   - "Freeze them!": All cast freeze
   - "Protect me!": Circle boss
   - "Focus fire!": All target one player

3. Synergy:
   - Mages heal boss
   - Warriors protect mages
   - Golems tank damage
   - Work as team

=== ENVIRONMENTAL HAZARDS ===

1. Ice Floor:
   - Slippery (slide effect)
   - Random ice patches spawn
   - Limit mobility

2. Icicle Drops:
   - Fall from ceiling
   - 25 damage if hit
   - Create ice blocks

3. Frost Zones:
   - Blue particle areas
   - Standing = freeze damage
   - Boss creates during fight

4. Blizzard Weather:
   - Obscure vision
   - Constant slow
   - Cold damage (DOT)

=== VARIABLE SYSTEMS ===

Boss Variables:
- phase (1/2)
- ice_armor_active (true/false)
- minion_count (alive)
- blizzard_active (true/false)
- boss_protected (minions nearby)

Minion Variables:
- formation_position (front/mid/back)
- protect_mode (true/false)
- target_priority (player ID)

Coordination Variables:
- boss_command (current order)
- team_formation (active/broken)

=== PHASES ===

Phase 1 (100-50%):
- Normal mechanics
- Summon at 75%
- Ice spikes and nova

Phase 2 (<50%):
- Ice Armor active
- Faster casting (-30% cooldown)
- Summon elite minions
- Blizzard unlocked
- More aggressive

=== ARENA MECHANICS ===

Arena: Frozen throne room
- Ice pillars (cover)
- Slippery floor
- Icicles overhead
- Safe zones (fire braziers)

Dynamic Changes:
- Floor freezes over time
- Icicles spawn more frequent
- Walls close in (soft enrage)

=== BALANCE ===

Solo: Very Hard (manage all alone)
Party (3-5): Hard (intended difficulty)
Raid (6+): Normal (balanced)

Fight Duration: 5-8 minutes
Skill Required: High
Coordination: Essential

=== TECHNICAL ===

Boss:
- Base: STRAY
- Disguise: Player "FrostLichKing"
- Particles: Snowflake, ice
- Sounds: Ice cracking, wind

Minions:
- Warriors: STRAY
- Mages: WITCH
- Golems: IRON_GOLEM (scaled)

Boss Bar: BLUE, SEGMENTED_6

Generate complete dungeon dengan full minion coordination, environmental hazards, dan boss mechanics yang kompleks!
```

---

## 📋 **TIPS UNTUK REQUEST**

1. **Be Specific:**
   - Detail stats
   - Describe mechanics clearly
   - Mention difficulty goal

2. **Mention Features:**
   - Check boxes yang mau dipakai
   - Specify variable usage
   - Request coordination

3. **Balance Goals:**
   - Solo vs party difficulty
   - Fight duration target
   - Skill ceiling

4. **Technical Details:**
   - Base mob preference
   - Disguise type
   - Particle/sound themes

5. **Test Incrementally:**
   - Start simple
   - Add complexity
   - Iterate based on results

---

**Copy request ini, paste ke tools, dan lihat magic happen!** ✨