// ============================================
// MODULE: Difficulty Guides (IMPROVED v3.0)
// FILE: api/prompts/difficulty.js
// ============================================

export function getDifficultyGuide(difficulty) {
    const guides = {
        balanced: {
            hp: '600-1000',
            damage: '12-18',
            speed: '0.3-0.35',
            description: 'Challenging but fair - suitable for most players',
            mechanics: `
**BALANCED DIFFICULTY PHILOSOPHY:**
- Fair challenge for average skilled players
- Clear counterplay to all mechanics
- Mistakes are punishing but not fatal
- Skill progression feels rewarding

**Combat Design:**
- Major attacks (20+ damage): 1-2 second telegraph
- Mix of single-target and AoE attacks
- Some avoidable, some unavoidable damage
- Clear attack patterns with variations
- Balanced DPS check (not too tight)

**Telegraph System:**
\`\`\`yaml
# Example: Telegraphed big attack
BOSS_slam_attack:
  Cooldown: 15
  Skills:
  # WARNING PHASE (1.5 seconds)
  - actionbar{m="&c⚠ SLAM INCOMING!"} @PIR{r=30}
  - particles{p=reddust;c=#FF0000;a=80;repeat=30;repeati=1;hs=2;vs=0.5;y=0} @ring{r=6;p=12}
  - sound{s=block.bell.use;v=1.5;p=0.8} @self
  - delay 30
  
  # ATTACK EXECUTION
  - damage{a=25;ignorearmor=true} @PIR{r=6}
  - throw{v=8;vy=3} @PIR{r=6}
  - particles{p=explosion;a=100} @self
  - recoil{r=25;pitch=-1} @PIR{r=32}
  - sound{s=entity.generic.explode;v=2} @self
  
  # RECOVERY (2 seconds vulnerability)
  - setspeed{s=0} @self
  - setAI{ai=false} @self
  - message{m="&7Opening!"} @PIR{r=20}
  - delay 40
  - setspeed{s=0.3} @self
  - setAI{ai=true} @self
\`\`\`

**Skill Cooldowns:**
- Basic attacks: 3-5 seconds
- Special moves: 10-15 seconds
- Ultimate: 30-45 seconds
- Phase abilities: 60+ seconds

**Player Experience Goals:**
- Deaths feel fair (player made a mistake)
- Victories feel earned
- Room for both skilled AND casual players
- Learning curve present but not steep`
        },
        
        hard: {
            hp: '1200-2000',
            damage: '20-35',
            speed: '0.35-0.42',
            description: 'High damage, complex patterns - requires coordination and skill',
            mechanics: `
**HARD DIFFICULTY PHILOSOPHY:**
- Designed for skilled players / groups
- Complex attack patterns with variations
- Tight DPS/healing checks
- Punishes mistakes heavily
- Requires strategy and coordination

**Combat Design:**
- Telegraph times: 0.5-1 second (FAST!)
- Multiple overlapping mechanics
- Some fake-out attacks (feints)
- Adaptive AI that counters player tactics
- Enrage timers create pressure

**Advanced Mechanics:**
\`\`\`yaml
# Fast combo with short telegraph
BOSS_rapid_combo:
  Cooldown: 12
  Skills:
  # WARNING (0.5 seconds only!)
  - particles{p=crit;a=100} @self
  - sound{s=block.note_block.pling;v=1;p=2} @self
  - delay 10
  
  # HIT 1
  - damage{a=18} @target
  - throw{v=3;vy=1} @target
  - delay 8
  
  # HIT 2 (barely any telegraph!)
  - lunge{v=2} @target
  - damage{a=20} @target
  - delay 8
  
  # FINISHER (clear telegraph)
  - particles{p=explosion;a=50;repeat=15;repeati=1} @self
  - delay 15
  - damage{a=30;ignorearmor=true} @PIR{r=5}
  - throw{v=10;vy=3} @PIR{r=5}

# Pattern variation (keeps players guessing)
BOSS_feint_attack:
  Cooldown: 20
  Skills:
  # Looks like big attack...
  - particles{p=reddust;c=#FF0000;a=100;repeat=20;repeati=1} @self
  - sound{s=block.bell.use;v=1;p=0.8} @self
  - delay 20
  # FAKE OUT! Small attack instead
  - damage{a=10} @target
  - message{m="&7Feint!"} @PIR{r=20}

# Adaptive counter
~onDamaged:
- setvar{var=caster.player_pattern;val=aggressive} @self ?distance{d=<5}
- skill{s=BOSS_counter_melee} @trigger ?varequals{var=caster.player_pattern;val=aggressive}

BOSS_counter_melee:
  Skills:
  - message{m="&c<caster.name> adapts to your tactics!"} @PIR{r=30}
  - damage{a=25;ignorearmor=true} @trigger
  - throw{v=10;vy=3} @trigger
  - potion{type=WEAKNESS;d=100;l=2} @trigger
\`\`\`

**Skill Cooldowns:**
- Basic attacks: 2-3 seconds
- Special moves: 8-12 seconds
- Ultimate: 20-30 seconds
- Combos chain rapidly

**Player Experience Goals:**
- Requires practice and mastery
- Pattern recognition essential
- Team coordination important
- High skill ceiling`
        },
        
        nightmare: {
            hp: '300-600',
            damage: '40-70',
            speed: '0.4-0.55',
            description: 'GLASS CANNON - Low HP but devastating one-shot mechanics',
            mechanics: `
**NIGHTMARE DIFFICULTY PHILOSOPHY:**
- Boss dies FAST if player skilled
- Player dies FAST if makes mistake
- One-shot potential with LONG telegraphs
- High risk, high reward gameplay
- Speed kills trump survivability

**CRITICAL BALANCE:**
- Boss HP: LOW (300-600) - kill in 1-2 minutes if played well
- Boss Damage: EXTREME (40-70 per hit)
- Boss Speed: HIGH (fast, aggressive)
- Mechanics: LETHAL but heavily telegraphed

**One-Shot Mechanics:**
\`\`\`yaml
# INSTANT DEATH attack with 3-5 second warning
BOSS_obliteration:
  Cooldown: 30
  Skills:
  # PHASE 1: Early warning (5 seconds total)
  - message{m="&4&l━━━━━━━━━━━━━━━━━━━━"} @PIR{r=50}
  - message{m="&4&l  ⚠ FATAL ATTACK ⚠"} @PIR{r=50}
  - message{m="&4&l━━━━━━━━━━━━━━━━━━━━"} @PIR{r=50}
  - title{t="&4&l⚠ RUN AWAY ⚠";st="&cInstant death in 5 seconds!";fadein=5;stay=90;fadeout=5} @PIR{r=50}
  
  # PHASE 2: Visual buildup
  - particles{p=reddust;c=#FF0000;a=200;repeat=100;repeati=1;hs=8;vs=3} @self
  - particles{p=explosion;a=50;repeat=100;repeati=3} @ring{r=12;p=16;y=0}
  - sound{s=entity.wither.spawn;v=2;p=0.5;repeat=100;repeati=20} @self
  
  # PHASE 3: Final countdown
  - message{m="&c3...";delay=60} @PIR{r=50}
  - sound{s=block.note_block.pling;v=2;p=0.5;delay=60} @PIR{r=50}
  - message{m="&c2...";delay=80} @PIR{r=50}
  - sound{s=block.note_block.pling;v=2;p=0.8;delay=80} @PIR{r=50}
  - message{m="&4&l1...";delay=95} @PIR{r=50}
  - sound{s=block.note_block.pling;v=2;p=1.2;delay=95} @PIR{r=50}
  
  - delay 100
  
  # EXECUTION (instant death in 15 block radius)
  - message{m="&4&l💀 OBLITERATE!"} @PIR{r=50}
  - particles{p=explosion;a=1000;hs=15;vs=10} @self
  - damage{a=200;ignorearmor=true} @PIR{r=15}  # GUARANTEED DEATH
  - throw{v=20;vy=8} @PIR{r=15}
  - recoil{r=50;pitch=-3} @PIR{r=50}
  - sound{s=entity.generic.explode;v=3;p=0.3} @PIR{r=50}

# Fast attacks between big ones
BOSS_quick_strike:
  Cooldown: 3
  Skills:
  - particles{p=crit;a=30} @self
  - delay 5  # Very short telegraph!
  - damage{a=50;ignorearmor=true} @target
  - throw{v=6;vy=2} @target
\`\`\`

**NO HEALING:**
Boss should NOT have healing mechanics.
Boss should NOT have high HP.
Boss relies on KILLING PLAYERS FAST.

**Skill Cooldowns:**
- Fast attacks: 2-4 seconds (40-50 damage)
- One-shots: 25-40 seconds (instant death, long telegraph)
- Mobility: High (teleport, dash frequently)

**Player Experience Goals:**
- Adrenaline-pumping intensity
- Every attack matters
- Skill expression through dodging
- Fast-paced, do-or-die gameplay
- Boss should die in 1-2 minutes if played perfectly`
        },
        
        psychological: {
            hp: '700-1000',
            damage: '10-20',
            speed: '0.25-0.35',
            description: 'Horror experience - darkness, sound design, unpredictability',
            mechanics: `
**PSYCHOLOGICAL HORROR PHILOSOPHY:**
- Create FEAR and TENSION, not just challenge
- Damage is moderate, ATMOSPHERE is terrifying
- Unpredictable attack timing
- Darkness effects mandatory
- Sound design is critical
- Mind games over mechanics

**Core Horror Elements:**

1. **Mandatory Darkness**
\`\`\`yaml
~onSpawn:
- potion{type=DARKNESS;d=9999;l=2} @PIR{r=40}

~onTimer:60:
- potion{type=DARKNESS;d=9999;l=2} @PIR{r=40}

~onTimer:200:
- potion{type=BLINDNESS;d=80;l=1} @PIR{r=40}
- sound{s=entity.warden.heartbeat;v=1;p=0.6} @PIR{r=30}
\`\`\`

2. **Stalking Behavior**
\`\`\`yaml
# Silent movement (no attack sounds)
~onTimer:100:
- teleport{l=@RLNTE{r=15;minr=10}} @NearestPlayer{r=30}
- particles{p=smoke;a=20} @self
- sound{s=entity.enderman.ambient;v=0.3;p=0.5} @PIR{r=10}

# Long periods of NO attacks (builds tension)
BOSS_stalking_phase:
  Cooldown: 120
  Skills:
  - setAI{ai=false} @self
  - setspeed{s=0} @self
  - message{m="&7...it's quiet..."} @PIR{r=30}
  - delay 100
  - message{m="&7...too quiet..."} @PIR{r=30}
  - delay 100
  - setAI{ai=true} @self
  - setspeed{s=0.35} @self
\`\`\`

3. **Jumpscare Mechanics**
\`\`\`yaml
BOSS_jumpscare:
  Cooldown: 60
  Skills:
  # Teleport behind player
  - teleport{l=@target;spread=2} @NearestPlayer{r=30}
  - look{l=force;immediately=true} @target
  
  # Moment of silence...
  - delay 15
  
  # JUMPSCARE!
  - message{m="&c&l&k|||&r &4&lBEHIND YOU!&r &c&l&k|||"} @target
  - title{t="&4&l⚠";st="";fadein=0;stay=10;fadeout=5} @target
  - sound{s=entity.ghast.scream;v=3;p=0.3} @target
  - recoil{r=50;pitch=-2.5} @target
  - particles{p=smoke;a=200;hs=3;vs=3} @target
  
  # Moderate damage (fear > damage)
  - damage{a=20} @target
  - throw{v=8;vy=3} @target
\`\`\`

4. **Horror Soundscape**
\`\`\`yaml
# Constant ambient horror
~onSpawn:
- sound{s=entity.warden.heartbeat;v=1;p=0.8;repeat=9999;repeati=40} @PIR{r=30}

~onTimer:300:
- sound{s=ambient.cave;v=0.8;p=0.5} @PIR{r=30}

~onTimer:400:
- sound{s=entity.ghast.ambient;v=0.3;p=0.3} @PIR{r=30}

~onTimer:250:
- sound{s=entity.warden.listening;v=0.5;p=0.6} @PIR{r=25}

# Directional audio cues
BOSS_audio_positioning:
  Skills:
  - sound{s=entity.enderman.stare;v=0.8;p=0.5} @target  # From boss to player
  - message{m="&7You hear breathing nearby..."} @target
\`\`\`

5. **Clone Confusion**
\`\`\`yaml
BOSS_spawn_clones:
  Cooldown: 45
  Skills:
  - message{m="&7Which one is real...?"} @PIR{r=30}
  - summon{type=BOSS_CLONE;amount=3} @ring{r=8;p=3}
  - teleport{l=@ring{r=8;p=1}} @self  # Real boss hides in circle
  
# Clones look identical but have 1 HP
BOSS_CLONE:
  Type: <SAME_AS_BOSS>
  Display: '<SAME_AS_BOSS>'
  Health: 1
  Disguise: <SAME_AS_BOSS>
  Skills:
  - remove{delay=200} @self  # Despawn after 10 seconds
\`\`\`

**Skill Cooldowns:**
- Unpredictable timing (15-60 seconds)
- Long silent periods
- Sudden burst of activity

**Player Experience Goals:**
- Constant unease and tension
- Jump scares create adrenaline
- Darkness hides threats
- Sound design creates paranoia
- Feels like horror game, not just boss fight`
        },
        
        souls: {
            hp: '800-1200',
            damage: '18-30',
            speed: '0.3-0.38',
            description: 'Pattern-based combat - telegraphed, learnable, punishing but FAIR',
            mechanics: `
**SOULS-LIKE PHILOSOPHY:**
- EVERY death is player's fault
- EVERY attack is dodgeable
- Patterns are learnable and consistent
- Rewards patience and observation
- Punishes panic and spam

**CRITICAL DESIGN RULES:**

1. **ALL MAJOR ATTACKS HAVE 2-SECOND MINIMUM TELEGRAPH**
2. **Fixed attack patterns (players can memorize)**
3. **Clear openings after combos**
4. **No RNG one-shots**
5. **Stamina/patience mechanics**

**Pattern-Based Combat:**
\`\`\`yaml
# COMBO PATTERN 1: Three-hit slash
BOSS_combo_pattern_1:
  Cooldown: 20
  Skills:
  # TELEGRAPH (2 seconds)
  - actionbar{m="&e⚔ Combo incoming..."} @PIR{r=30}
  - particles{p=crit;a=50;repeat=40;repeati=1} @self
  - sound{s=item.trident.throw;v=1;p=0.8} @self
  - delay 40
  
  # HIT 1: Right slash
  - damage{a=15} @target
  - message{m="&7Right slash!"} @PIR{r=20}
  - particles{p=sweep_attack;a=30} @self
  - delay 15
  
  # HIT 2: Left slash
  - damage{a=15} @target
  - message{m="&7Left slash!"} @PIR{r=20}
  - particles{p=sweep_attack;a=30} @self
  - delay 15
  
  # HIT 3: Overhead slam (bigger damage)
  - particles{p=reddust;c=#FF0000;a=80;repeat=20;repeati=1;hs=2;vs=0.5} @ring{r=5;p=8}
  - delay 20
  - damage{a=25;ignorearmor=true} @PIR{r=5}
  - throw{v=6;vy=2} @PIR{r=5}
  - recoil{r=20;pitch=-1} @PIR{r=32}
  
  # OPENING (2 seconds vulnerability)
  - setspeed{s=0} @self
  - message{m="&a&lOPENING!"} @PIR{r=20}
  - delay 40
  - setspeed{s=0.35} @self

# COMBO PATTERN 2: Charge attack
BOSS_combo_pattern_2:
  Cooldown: 25
  Skills:
  # TELEGRAPH (2 seconds)
  - actionbar{m="&c⚠ Preparing charge..."} @PIR{r=30}
  - particles{p=smoke;a=80;repeat=40;repeati=1} @self
  - sound{s=entity.ravager.roar;v=1;p=0.8} @self
  - delay 40
  
  # CHARGE (linear, dodgeable)
  - lunge{v=5;vy=0} @target
  - damage{a=30;ignorearmor=true} @line{r=15;p=10}
  - throw{v=10;vy=3} @line{r=15;p=10}
  - particles{p=explosion;a=100} @line{r=15;p=10}
  
  # CRASH (if hits wall or misses)
  - delay 20
  - setspeed{s=0} @self
  - message{m="&a&lOPENING!"} @PIR{r=20}
  - delay 60
  - setspeed{s=0.35} @self
\`\`\`

**Phase Transitions:**
\`\`\`yaml
# Phase 2 at 50% HP - NEW patterns unlocked
BOSS_phase_2:
  Conditions:
  - health{h=<50%} true
  - varequals{var=caster.phase;val=1} true
  Skills:
  # Long transition (players can heal/buff)
  - setAI{ai=false} @self
  - message{m="&e<caster.name> prepares new techniques..."} @PIR{r=50}
  - delay 100
  
  # Phase change
  - setvar{var=caster.phase;val=2} @self
  - message{m="&c&lPHASE 2!"} @PIR{r=50}
  - setAI{ai=true} @self
  
  # New combo patterns available in phase 2
\`\`\`

**Stamina Punishment:**
\`\`\`yaml
# Punish players who spam dodge/attack
~onDamaged:
- variableMath{var=caster.player_hits;operation=ADD;value=1} @self
- setvar{var=caster.player_hits;val=0;delay=60} @self

# If hit 8+ times in 3 seconds = player is spamming
BOSS_punish_spam:
  Conditions:
  - variableInRange{var=caster.player_hits;val=>8} true
  Skills:
  - message{m="&c<caster.name> punishes your panic!"} @PIR{r=30}
  - damage{a=30;ignorearmor=true} @PIR{r=8}
  - throw{v=12;vy=4} @PIR{r=8}
  - potion{type=WEAKNESS;d=100;l=2} @PIR{r=8}
  - setvar{var=caster.player_hits;val=0} @self
\`\`\`

**Skill Cooldowns:**
- Basic combos: 15-25 seconds
- Special moves: 30-40 seconds
- Phase abilities: One-time per phase

**Player Experience Goals:**
- Learning curve rewards dedication
- Every death teaches a lesson
- Mastery feels incredibly satisfying
- "Git gud" mentality
- NO excuses - skill issue only`
        },
        
        swarm: {
            hp: '400-700',
            damage: '6-12',
            speed: '0.35-0.42',
            description: 'Overwhelming numbers - constant minion spam, low individual damage',
            mechanics: `
**SWARM DIFFICULTY PHILOSOPHY:**
- Boss is WEAK individually
- Power comes from NUMBERS
- Constantly summons minions (6-10 at once)
- Player must manage both boss AND adds
- AoE damage is effective counter

**Combat Design:**
- Boss damage: LOW (6-12 per hit)
- Minion damage: LOW (3-5 per hit)
- Combined damage: HIGH (if swarmed)
- Minion count: MANY (6-10 constantly)
- Boss summons: FREQUENT (every 15-20 seconds)

**Constant Summoning:**
\`\`\`yaml
# Summon minions constantly
~onTimer:100:
- skill{s=BOSS_summon_swarm} @self

BOSS_summon_swarm:
  Conditions:
  - mobsinradius{r=30;types=MINION;a=<10} true  # Max 10 minions
  Skills:
  - message{m="&e<caster.name> calls reinforcements!"} @PIR{r=40}
  - particles{p=portal;a=100;hs=5;vs=3} @ring{r=6;p=4;y=0}
  - sound{s=block.portal.trigger;v=1.5} @self
  - summon{type=MINION_1;amount=2} @ring{r=8;p=2}
  - summon{type=MINION_2;amount=2} @ring{r=8;p=2}
  - particles{p=explosion;a=50} @ring{r=8;p=4}

# Respawn minions if killed
~onSignal:MINION_DIED:
- summon{type=MINION_1;amount=1;delay=40} @ring{r=6;p=1}
\`\`\`

**Buff Minions:**
\`\`\`yaml
# Boss buffs swarm periodically
BOSS_rally_swarm:
  Cooldown: 30
  Conditions:
  - mobsinradius{r=25;types=MINION;a=>4} true
  Skills:
  - message{m="&6<caster.name> empowers the swarm!"} @PIR{r=40}
  - particles{p=enchantment_table;a=200;hs=8;vs=5} @self
  - sound{s=block.bell.use;v=2} @self
  
  # Buff ALL minions
  - potion{type=INCREASE_DAMAGE;d=200;l=1} @MIR{r=25;types=MINION}
  - potion{type=SPEED;d=200;l=1} @MIR{r=25;types=MINION}
  - heal{a=50} @MIR{r=25;types=MINION}
\`\`\`

**Coordinated Attacks:**
\`\`\`yaml
# Boss signals all minions to attack
BOSS_coordinated_assault:
  Cooldown: 40
  Conditions:
  - mobsinradius{r=30;types=MINION;a=>6} true
  Skills:
  - message{m="&c&lALL OUT ASSAULT!"} @PIR{r=50}
  - signal{s=ATTACK_NOW} @MIR{r=30;types=MINION}
  
  # Boss also attacks
  - lunge{v=3} @target
  - damage{a=15} @target

# Minions respond
MINION:
  Skills:
  - skill{s=MINION_burst} @self ~onSignal:ATTACK_NOW

MINION_burst:
  Skills:
  - lunge{v=2} @NearestPlayer{r=30}
  - damage{a=8} @target
\`\`\`

**Enrage if Minions Die:**
\`\`\`yaml
# Boss gets stronger when alone
BOSS_desperation:
  Conditions:
  - mobsinradius{r=30;types=MINION;a=<3} true
  - varequals{var=caster.desperate;val=false} true
  Skills:
  - setvar{var=caster.desperate;val=true} @self
  - message{m="&c<caster.name> fights desperately!"} @PIR{r=40}
  - potion{type=INCREASE_DAMAGE;d=9999;l=2} @self
  - potion{type=SPEED;d=9999;l=1} @self
  
  # Spam summon even more
  - summon{type=MINION;amount=4} @ring{r=6;p=4}
\`\`\`

**Skill Cooldowns:**
- Summon: 15-20 seconds
- Buff minions: 25-35 seconds
- Coordinated attack: 35-45 seconds
- Boss individual attacks: 8-12 seconds

**Player Experience Goals:**
- Overwhelming pressure from numbers
- Must prioritize targets (boss vs adds)
- AoE skills are valuable
- Crowd control is key
- Feel outnumbered but not hopeless`
        }
    };

    const guide = guides[difficulty] || guides.balanced;
    
    return `
=== DIFFICULTY: ${difficulty.toUpperCase()} ===

**Description:** ${guide.description}

**Stat Recommendations:**
- Health: ${guide.hp}
- Damage: ${guide.damage}
- Movement Speed: ${guide.speed}

**Mechanics Philosophy:**
${guide.mechanics}

**REMEMBER:** Telegraph and feedback are CRITICAL for player experience!
`;
}