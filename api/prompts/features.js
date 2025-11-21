// ============================================
// MODULE: Feature Prompts (IMPROVED v3.0)
// FILE: api/prompts/features.js
// ============================================

export function getFeaturePrompts(options, difficulty) {
    let features = '';

    if (options.phaseSystem) {
        features += getPhaseSystemPrompt(difficulty);
    }

    if (options.variableStates) {
        features += getVariableStatePrompt();
    }

    if (options.counterMechanics) {
        features += getCounterMechanicsPrompt();
    }

    if (options.adaptiveDifficulty) {
        features += getAdaptiveDifficultyPrompt();
    }

    if (options.minionCoordination) {
        features += getMinionCoordinationPrompt();
    }

    if (options.environmentalHazards) {
        features += getEnvironmentalHazardsPrompt();
    }

    // Difficulty-specific enhancements
    features += getDifficultyEnhancements(difficulty);

    return features || '# Standard mechanics';
}

function getPhaseSystemPrompt(difficulty) {
    return `
=== MULTI-PHASE SYSTEM (ENABLED) ===
Create AT LEAST 2-3 distinct phases with DRAMATIC transitions.

**Phase Design Philosophy:**
- Each phase should feel like a NEW boss
- Players should adapt strategy between phases
- Transitions should be MEMORABLE moments
- Visual/audio distinction between phases

**Implementation Requirements:**

\`\`\`yaml
# PHASE TRACKING
~onSpawn:
- setvar{var=caster.phase;val=1;type=INTEGER} @self
- setvar{var=caster.phase_locked;val=false} @self

# PHASE 2 TRANSITION (50% HP)
BOSS_phase_2_transition:
  Conditions:
  - health{h=<50%} true
  - varequals{var=caster.phase;val=1} true
  - varequals{var=caster.phase_locked;val=false} true
  Skills:
  # Lock phase change
  - setvar{var=caster.phase_locked;val=true} @self
  
  # DRAMATIC BUILDUP (3 seconds)
  - message{m="&c&l━━━━━━━━━━━━━━━━━━━━"} @PIR{r=50}
  - message{m="&c&l   PHASE 2 INCOMING!"} @PIR{r=50}
  - message{m="&c&l━━━━━━━━━━━━━━━━━━━━"} @PIR{r=50}
  
  # Become invulnerable during transition
  - setAI{ai=false} @self
  - potion{type=DAMAGE_RESISTANCE;d=100;l=255} @self
  - setspeed{s=0} @self
  
  # Visual buildup
  - particles{p=reddust;c=#FF0000;a=100;repeat=60;repeati=1;hs=3;vs=3} @self
  - particles{p=explosion;a=20;repeat=60;repeati=3} @ring{r=5;p=12;y=0}
  - sound{s=entity.wither.ambient;v=2;p=0.5;repeat=60;repeati=10} @self
  
  # Screen effects
  - recoil{r=30;pitch=-0.5;repeat=15;repeati=4} @PIR{r=50}
  - title{t="&c&lPHASE 2";st="&7Prepare yourself...";fadein=10;stay=40;fadeout=10} @PIR{r=50}
  
  - delay 60
  
  # PHASE CHANGE BURST
  - particles{p=explosion;a=500;hs=8;vs=8} @self
  - particles{p=flame;a=300;hs=5;vs=5} @self
  - sound{s=entity.wither.spawn;v=3;p=0.5} @self
  - sound{s=entity.ender_dragon.growl;v=2;p=0.8;delay=5} @self
  - recoil{r=30;pitch=-1.5} @PIR{r=50}
  
  # Phase 2 changes
  - setvar{var=caster.phase;val=2} @self
  - heal{a=200} @self  # Heal on phase change
  - potion{type=INCREASE_DAMAGE;d=9999;l=1} @self  # Permanent buff
  - potion{type=SPEED;d=9999;l=1} @self
  - summon{type=MINION;amount=3} @ring{r=8;p=3}  # Summon adds
  
  # Unlock movement
  - setAI{ai=true;delay=20} @self
  - setspeed{s=0.35;delay=20} @self
  - potionclear{delay=20} @self
  
  # Boss Bar update
  - barSet{
      name="BOSS";
      color=PURPLE;
      title="&d&l⚔ <caster.name> - PHASE 2 ⚔"
    } @self
  
  - message{m="&c<caster.name>: You forced me to get serious!"} @PIR{r=50}

# PHASE 3 TRANSITION (20% HP) - FINAL PHASE
BOSS_phase_3_transition:
  Conditions:
  - health{h=<20%} true
  - varequals{var=caster.phase;val=2} true
  Skills:
  # ENRAGE MODE
  - message{m="&4&l━━━━ FINAL PHASE ━━━━"} @PIR{r=50}
  - title{t="&4&lENRAGE";st="&cAll attacks empowered!";fadein=5;stay=30;fadeout=5} @PIR{r=50}
  
  # Visual chaos
  - particles{p=explosion;a=1000;hs=10;vs=10} @self
  - particles{p=flame;a=500;hs=8;vs=8} @self
  - sound{s=entity.ender_dragon.growl;v=3;p=0.3} @self
  - recoil{r=40;pitch=-2} @PIR{r=50}
  
  # Massive buffs
  - setvar{var=caster.phase;val=3} @self
  - potion{type=INCREASE_DAMAGE;d=9999;l=2} @self
  - potion{type=SPEED;d=9999;l=2} @self
  - potion{type=REGENERATION;d=9999;l=2} @self
  
  # All skills cooldown reduced (faster attacks)
  - setvar{var=caster.enraged;val=true} @self
  
  # Boss Bar update
  - barSet{
      name="BOSS";
      color=RED;
      style=SEGMENTED_20;
      title="&4&l⚔ <caster.name> - ENRAGED ⚔"
    } @self
\`\`\`

**Phase-Specific Skills:**
Each phase must unlock NEW skills or modify existing ones:

\`\`\`yaml
# Phase 2 exclusive skill
BOSS_phase2_ultimate:
  Cooldown: 20
  Conditions:
  - varequals{var=caster.phase;val=2} true
  Skills:
  # New powerful attack only in phase 2
  - [skill mechanics]

# Skill that changes behavior per phase
BOSS_adaptive_attack:
  Cooldown: 10
  Skills:
  # Phase 1: Normal version
  - damage{a=15} @target ?varequals{var=caster.phase;val=1}
  
  # Phase 2: Enhanced version
  - damage{a=25;ignorearmor=true} @target ?varequals{var=caster.phase;val=2}
  - throw{v=5;vy=2} @target ?varequals{var=caster.phase;val=2}
  
  # Phase 3: Brutal version
  - damage{a=40;ignorearmor=true} @PIR{r=8} ?varequals{var=caster.phase;val=3}
  - throw{v=10;vy=3} @PIR{r=8} ?varequals{var=caster.phase;val=3}
\`\`\`

**CRITICAL:** Phases must feel EARNED. Don't just add HP, add MECHANICS!
`;
}

function getVariableStatePrompt() {
    return `
=== VARIABLE STATE MACHINE (ENABLED) ===
Create complex behavior tracking with variables.

**Use Cases:**
1. Combo Systems
2. Rage/Resource Tracking
3. Player Behavior Memory
4. Cooldown Management
5. Phase Substates
6. Pattern Counters

**Combo System Example:**
\`\`\`yaml
# Initialize combo
~onSpawn:
- setvar{var=caster.combo_count;val=0;type=INTEGER} @self
- setvar{var=caster.last_attack;val=none;type=STRING} @self

# Combo starter
BOSS_combo_1:
  Cooldown: 15
  Skills:
  - setvar{var=caster.combo_count;val=1} @self
  - setvar{var=caster.last_attack;val=slash} @self
  - damage{a=10} @target
  - message{m="&eCombo Started!"} @PIR{r=20}
  - particles{p=crit;a=50} @target
  # Auto-trigger next combo after delay
  - skill{s=BOSS_combo_2;delay=15} @self

# Combo continues
BOSS_combo_2:
  Conditions:
  - varequals{var=caster.combo_count;val=1} true
  Skills:
  - setvar{var=caster.combo_count;val=2} @self
  - setvar{var=caster.last_attack;val=smash} @self
  - damage{a=15} @target
  - throw{v=5;vy=2} @target
  - message{m="&6Combo x2!"} @PIR{r=20}
  - skill{s=BOSS_combo_3;delay=15} @self

# Combo finisher
BOSS_combo_3:
  Conditions:
  - varequals{var=caster.combo_count;val=2} true
  Skills:
  - setvar{var=caster.combo_count;val=0} @self  # Reset
  - damage{a=25;ignorearmor=true} @PIR{r=8}
  - throw{v=10;vy=3} @PIR{r=8}
  - particles{p=explosion;a=100} @self
  - message{m="&c&lCOMBO FINISHER!"} @PIR{r=30}
  - recoil{r=20;pitch=-1} @PIR{r=32}

# Reset combo if interrupted
~onDamaged:
- setvar{var=caster.combo_count;val=0} @self ?variableInRange{var=caster.combo_count;val=>1}
- message{m="&7Combo interrupted..."} @PIR{r=20}
\`\`\`

**Rage System Example:**
\`\`\`yaml
~onSpawn:
- setvar{var=caster.rage;val=0;type=INTEGER} @self

# Gain rage on damage
~onDamaged:
- variableMath{var=caster.rage;operation=ADD;value=5} @self
- particles{p=angry_villager;a=<caster.var.rage>} @self
- actionbar{m="&cRAGE: <caster.var.rage>/100"} @PIR{r=20}

# Rage threshold abilities
BOSS_rage_ability:
  Conditions:
  - variableInRange{var=caster.rage;val=>50} true
  Skills:
  - message{m="&c<caster.name> channels RAGE!"} @PIR{r=30}
  - variableMath{var=caster.rage;operation=SUB;value=50} @self
  - damage{a=30;ignorearmor=true} @PIR{r=12}
  - potion{type=INCREASE_DAMAGE;d=100;l=2} @self
\`\`\`
`;
}

function getCounterMechanicsPrompt() {
    return `
=== COUNTER-ATTACK SYSTEM (ENABLED) ===
Boss reacts intelligently to player actions.

**Counter Patterns:**

1. **Frontal Counter** (reward backstab)
\`\`\`yaml
~onDamaged:
- skill{s=BOSS_front_counter} @trigger ?fieldofview{a=90;r=0}

BOSS_front_counter:
  Skills:
  - message{m="&e⚔ PARRIED!"} @trigger
  - particles{p=crit;a=100;hs=2;vs=2} @self
  - sound{s=item.shield.block;v=2;p=1.5} @self
  - damage{a=20;ignorearmor=true} @trigger
  - throw{v=8;vy=3} @trigger
  - potion{type=WEAKNESS;d=60;l=2} @trigger
\`\`\`

2. **Punish Spam Attacks**
\`\`\`yaml
# Track hits
~onDamaged:
- variableMath{var=caster.hit_count;operation=ADD;value=1} @self
- setvar{var=caster.hit_count;val=0;delay=100} @self

# Punish if hit 5+ times in 5 seconds
~onTimer:20:
- skill{s=BOSS_punish_spam} @self ?variableInRange{var=caster.hit_count;val=>5}

BOSS_punish_spam:
  Skills:
  - message{m="&c<caster.name>: ENOUGH!"} @PIR{r=30}
  - particles{p=explosion;a=300;hs=5;vs=5} @self
  - damage{a=30} @PIR{r=10}
  - throw{v=15;vy=5} @PIR{r=10}
  - recoil{r=25;pitch=-1.5} @PIR{r=32}
  - setvar{var=caster.hit_count;val=0} @self
\`\`\`

3. **Adapt to Ranged Play**
\`\`\`yaml
# Track melee vs ranged hits
~onDamaged:
- setvar{var=caster.melee_hit;val=true} @self ?distance{d=<5}
- setvar{var=caster.ranged_hit;val=true} @self ?distance{d=>10}

# If only ranged, close gap
~onTimer:100:
- skill{s=BOSS_gap_closer} @target ?varequals{var=caster.ranged_hit;val=true}

BOSS_gap_closer:
  Skills:
  - message{m="&c<caster.name> won't let you kite!"} @PIR{r=30}
  - particles{p=cloud;a=100} @self
  - teleport{l=@target;spread=3} @self
  - damage{a=25} @PIR{r=5}
  - setvar{var=caster.ranged_hit;val=false} @self
\`\`\`
`;
}

function getAdaptiveDifficultyPrompt() {
    return `
=== ADAPTIVE DIFFICULTY (ENABLED) ===
Boss adjusts based on fight performance.

**1. Enrage Timer** (prevent stalling)
\`\`\`yaml
~onSpawn:
- setvar{var=caster.fight_time;val=0;type=INTEGER} @self

~onTimer:20:
- variableMath{var=caster.fight_time;operation=ADD;value=1} @self

# Soft enrage at 5 minutes
BOSS_soft_enrage:
  Conditions:
  - variableInRange{var=caster.fight_time;val=>300} true
  - varequals{var=caster.enraged;val=false} true
  Skills:
  - setvar{var=caster.enraged;val=true} @self
  - message{m="&4<caster.name> grows impatient!"} @PIR{r=50}
  - potion{type=INCREASE_DAMAGE;d=9999;l=1} @self
  - potion{type=SPEED;d=9999;l=1} @self

# Hard enrage at 10 minutes
BOSS_hard_enrage:
  Conditions:
  - variableInRange{var=caster.fight_time;val=>600} true
  Skills:
  - message{m="&4&lTIME'S UP!"} @PIR{r=50}
  - damage{a=999;ignorearmor=true} @PIR{r=100}  # Wipe mechanic
\`\`\`

**2. Buff if Not Taking Damage** (punish passive play)
\`\`\`yaml
~onSpawn:
- setvar{var=caster.no_damage_timer;val=0} @self

~onTimer:20:
- variableMath{var=caster.no_damage_timer;operation=ADD;value=1} @self

~onDamaged:
- setvar{var=caster.no_damage_timer;val=0} @self

# Heal if not hit for 30 seconds
BOSS_passive_heal:
  Conditions:
  - variableInRange{var=caster.no_damage_timer;val=>60} true
  Skills:
  - message{m="&a<caster.name> recovers health!"} @PIR{r=30}
  - heal{a=100} @self
  - particles{p=happy_villager;a=100} @self
  - setvar{var=caster.no_damage_timer;val=0} @self
\`\`\`
`;
}

function getMinionCoordinationPrompt() {
    return `
=== MINION COORDINATION (ENABLED) ===
Boss and minions work as a TEAM.

**Coordinated Attack Pattern:**
\`\`\`yaml
# Boss signals minions
BOSS_coordinated_strike:
  Cooldown: 30
  Conditions:
  - mobsinradius{r=30;types=MINION;a=>2} true
  Skills:
  - message{m="&e<caster.name>: ATTACK TOGETHER!"} @PIR{r=40}
  - signal{s=ATTACK_NOW} @MIR{r=30;types=MINION}
  
  # Boss waits for minions
  - setAI{ai=false} @self
  - particles{p=enchantment_table;a=100;repeat=40;repeati=2} @self
  - delay 40
  
  # Synchronized attack
  - damage{a=20} @target
  - setAI{ai=true} @self

# Minion responds to signal
MINION:
  Skills:
  - skill{s=MINION_burst_attack} @self ~onSignal:ATTACK_NOW

MINION_burst_attack:
  Skills:
  - lunge{v=3;vy=1} @NearestPlayer{r=30}
  - damage{a=15} @target
  - particles{p=crit;a=50} @target
\`\`\`

**Boss Protects Minions:**
\`\`\`yaml
# Boss shields minions when low HP
BOSS_rally_minions:
  Cooldown: 45
  Conditions:
  - mobsinradius{r=25;types=MINION;a=>1} true
  Skills:
  - message{m="&6<caster.name> empowers allies!"} @PIR{r=40}
  - particles{p=enchantment_table;a=200;hs=8;vs=5} @self
  - sound{s=block.bell.use;v=2;p=1.2} @self
  
  # Buff ALL minions
  - potion{type=INCREASE_DAMAGE;d=200;l=2} @MIR{r=25;types=MINION}
  - potion{type=SPEED;d=200;l=1} @MIR{r=25;types=MINION}
  - potion{type=DAMAGE_RESISTANCE;d=200;l=1} @MIR{r=25;types=MINION}
  - heal{a=100} @MIR{r=25;types=MINION}
  
  # Visual effect on minions
  - particles{p=happy_villager;a=50} @MIR{r=25;types=MINION}
\`\`\`
`;
}

function getEnvironmentalHazardsPrompt() {
    return `
=== ENVIRONMENTAL HAZARDS (ENABLED) ===
Boss transforms the battlefield.

**Arena Hazards:**
\`\`\`yaml
# Spawn hazard zones
BOSS_hazard_zones:
  Cooldown: 40
  Skills:
  - message{m="&c⚠ HAZARD ZONES SPAWNING!"} @PIR{r=50}
  - title{t="&c⚠ WARNING";st="&7Avoid the danger zones!";fadein=5;stay=20;fadeout=5} @PIR{r=50}
  
  # Mark zones (2 seconds warning)
  - particles{p=reddust;c=#FF0000;a=100;repeat=40;repeati=1} @ring{r=8;p=4;y=0}
  - sound{s=block.note_block.pling;v=1;p=0.5;repeat=40;repeati=10} @PIR{r=50}
  - delay 40
  
  # Activate hazards
  - blockmask{m=MAGMA_BLOCK;r=3;d=5;na=true;oa=false} @ring{r=8;p=4;y=0}
  - particles{p=flame;a=200;hs=3;vs=3} @ring{r=8;p=4;y=0}
  - sound{s=block.lava.pop;v=2} @ring{r=8;p=4;y=0}
  
  # Damage players in zones
  - damage{a=5;repeat=100;repeati=20} @PIR{r=3}
  - potion{type=SLOW;d=100;l=1;repeat=100;repeati=20} @PIR{r=3}
  
  # Remove after 5 seconds
  - blockmask{m=STONE;r=3;d=5;delay=100} @ring{r=8;p=4;y=0}
\`\`\`

**Dynamic Arena Change:**
\`\`\`yaml
BOSS_transform_arena:
  Conditions:
  - health{h=<30%} true
  - varequals{var=caster.arena_transformed;val=false} true
  Skills:
  - setvar{var=caster.arena_transformed;val=true} @self
  - message{m="&c&lTHE ARENA TRANSFORMS!"} @PIR{r=50}
  
  # Earthquake effect
  - recoil{r=30;pitch=-0.8;repeat=10;repeati=5} @PIR{r=50}
  - sound{s=entity.wither.break_block;v=2;p=0.5;repeat=10;repeati=5} @PIR{r=50}
  - particles{p=block{b=STONE};a=500;repeat=10;repeati=5;hs=20;vs=5} @self
  
  # Spawn pillars
  - blockmask{m=OBSIDIAN;r=1;d=5;na=false;oa=false;y=0} @ring{r=10;p=4}
  - blockmask{m=CRYING_OBSIDIAN;r=0;d=5;na=false;oa=false;y=5} @ring{r=10;p=4}
\`\`\`
`;
}

function getDifficultyEnhancements(difficulty) {
    if (difficulty === 'psychological') {
        return `
=== PSYCHOLOGICAL HORROR ENHANCEMENTS ===

**Mandatory Darkness:**
\`\`\`yaml
~onSpawn:
- potion{type=DARKNESS;d=9999;l=2} @PIR{r=40}

~onTimer:100:
- potion{type=DARKNESS;d=9999;l=2} @PIR{r=40}
- potion{type=BLINDNESS;d=60;l=1} @PIR{r=40}  # Pulse blindness
\`\`\`

**Horror Soundscape:**
\`\`\`yaml
~onSpawn:
- sound{s=entity.warden.heartbeat;v=1;p=0.8;repeat=9999;repeati=40} @PIR{r=30}

~onTimer:200:
- sound{s=entity.ghast.scream;v=0.5;p=0.3} @PIR{r=30}
- sound{s=ambient.cave;v=0.7;p=0.5} @PIR{r=30}
\`\`\`

**Stalking Behavior:**
\`\`\`yaml
# Silent movement
~onTimer:100:
- teleport{l=@RLNTE{r=12;minr=8}} @NearestPlayer{r=30}
- particles{p=smoke;a=30} @self

# Sudden reveal
BOSS_jumpscare:
  Cooldown: 60
  Skills:
  - teleport{l=@target;spread=2} @NearestPlayer{r=30}
  - look{l=force;immediately=true} @target
  - delay 10
  - message{m="&c&lBEHIND YOU!"} @target
  - sound{s=entity.ghast.scream;v=2;p=0.5} @target
  - recoil{r=40;pitch=-2} @target
  - damage{a=25} @target
\`\`\`
`;
    }
    
    return '';
}