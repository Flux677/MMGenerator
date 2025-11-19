// ============================================
// MODULE: Feature Prompts (Modular)
// ============================================

export function getFeaturePrompts(options, difficulty) {
    let features = '';

    if (options.phaseSystem) {
        features += `
=== MULTI-PHASE SYSTEM (ENABLED) ===
Implement AT LEAST 2 phases with clear transitions:

\`\`\`yaml
# Phase tracking
- setvar{var=caster.phase;val=1;type=INTEGER} @self ~onSpawn

# Phase transition
BOSS_phase_transition:
  Conditions:
  - health{h=<50%} true
  - varequals{var=caster.phase;val=1} true
  Skills:
  - setvar{var=caster.phase;val=2} @self
  - message{m="&c<caster.name> enters Phase 2!"} @PIR{r=50}
  - effect:particles{p=explosion;a=50;hs=2;vs=2} @self
  - effect:sound{s=entity.ender_dragon.growl;v=2;p=0.8} @self
  - potion{type=DAMAGE_RESISTANCE;d=100;l=2} @self
  - heal{amount=100} @self
  - summon{type=MINION;amount=3} @ring{r=5;p=3}

# Phase-specific skills
BOSS_phase2_skill:
  Conditions:
  - varequals{var=caster.phase;val=2} true
  Skills:
  - damage{a=25;ignorearmor=true} @target
\`\`\`

Each phase must have:
- Different skill priorities
- New abilities unlock
- Visual/audio indicators
- Stat changes (speed, damage, etc)
`;
    }

    if (options.variableStates) {
        features += `
=== ADVANCED VARIABLE USAGE (ENABLED) ===
Track EVERYTHING with variables:

\`\`\`yaml
# Combo system
- setvar{var=caster.combo;val=1} @self
- setvar{var=caster.combo;val=2} ?varequals{var=caster.combo;val=1}
- setvar{var=caster.combo;val=3} ?varequals{var=caster.combo;val=2}
- setvar{var=caster.combo;val=0} ?varequals{var=caster.combo;val=3}

# Cooldown tracking
- setvar{var=caster.ultimate_ready;val=false} @self
- setvar{var=caster.ultimate_ready;val=true;delay=600} @self

# Player tracking
- setvar{var=target.marked;val=true;duration=100} @trigger ~onDamaged

# Adaptive behavior
- variableMath{var=caster.hit_count;operation=ADD;value=1} @self ~onDamaged
- setvar{var=caster.defensive;val=true} ?variableInRange{var=caster.hit_count;val=>10}
\`\`\`
`;
    }

    if (options.counterMechanics) {
        features += `
=== COUNTER-ATTACK SYSTEM (ENABLED) ===
Boss responds to player actions:

\`\`\`yaml
# Counter melee from front
BOSS_counter_melee:
  TriggerConditions:
  - fieldofview{a=90;r=0} true
  Conditions:
  - varequals{var=caster.defensive;val=true}
  Skills:
  - message{m="&eCountered!"} @trigger
  - damage{a=10;ignorearmor=true} @trigger
  - throw{v=5;vy=2} @trigger

# Punish skill spam
BOSS_punish_spam:
  Conditions:
  - varequals{var=target.spam_detected;val=true}
  Skills:
  - message{m="&c<caster.name> adapts!"} @trigger
  - damage{a=20} @trigger
  - potion{type=WEAKNESS;d=100;l=2} @trigger
\`\`\`
`;
    }

    if (options.adaptiveDifficulty) {
        features += `
=== ADAPTIVE DIFFICULTY (ENABLED) ===
Boss adjusts to player performance:

\`\`\`yaml
# Track fight duration
- setvar{var=caster.fight_timer;val=0} @self ~onCombat
- variableMath{var=caster.fight_timer;operation=ADD;value=1} @self ~onTimer:20

# Enrage if too long
BOSS_timeout_enrage:
  Conditions:
  - variableInRange{var=caster.fight_timer;val=>300}  # 5 min
  Skills:
  - message{m="&c<caster.name> ENRAGES!"} @PIR{r=50}
  - potion{type=INCREASE_DAMAGE;d=9999;l=1} @self
  - potion{type=SPEED;d=9999;l=1} @self

# Buff if player too good
- setvar{var=caster.no_hit_timer;val=0} @self ~onSpawn
- variableMath{var=caster.no_hit_timer;operation=ADD;value=1} @self ~onTimer:20
- setvar{var=caster.no_hit_timer;val=0} @self ~onDamaged
- potion{type=REGENERATION;d=100;l=2} @self ?variableInRange{var=caster.no_hit_timer;val=>60}
\`\`\`
`;
    }

    if (options.minionCoordination) {
        features += `
=== MINION COORDINATION (ENABLED) ===
Boss and minions work together:

\`\`\`yaml
# Boss buffs minions
BOSS_rally:
  Cooldown: 30
  Skills:
  - message{m="&e<caster.name> rallies!"} @PIR{r=50}
  - potion{type=INCREASE_DAMAGE;d=200;l=1} @MIR{r=20;types=MINION}
  - potion{type=SPEED;d=200;l=1} @MIR{r=20;types=MINION}
  - heal{a=50} @MIR{r=20;types=MINION}

# Minions protect boss
MINION_protect:
  Conditions:
  - entitytype{t=BOSS_TYPE} @PIR{r=10}
  TriggerConditions:
  - entitytype{t=BOSS_TYPE} @target
  Skills:
  - taunt @trigger
  - threat{amount=500} @trigger

# Boss enrages if minions die
BOSS_enrage_minion_death:
  Conditions:
  - mobsinradius{r=30;types=MINION;a=<3} true
  Skills:
  - setvar{var=caster.enraged;val=true} @self
  - message{m="&c<caster.name> ENRAGES!"} @PIR{r=50}
\`\`\`
`;
    }

    if (options.environmentalHazards) {
        features += `
=== ENVIRONMENTAL HAZARDS (ENABLED) ===
Boss interacts with arena:

\`\`\`yaml
# Spawn hazards
- summon{type=HAZARD_MOB;l=@ring{r=10;p=4}} @self
- blockmask{m=MAGMA_BLOCK;r=5;d=10;na=true} @self

# Transform arena
BOSS_transform_arena:
  Cooldown: 60
  Conditions:
  - health{h=<30%} true
  Skills:
  - message{m="&cArena transforms!"} @PIR{r=50}
  - blockmask{m=LAVA;r=15;d=20;na=true;oa=false} @ring{r=15;p=8;y=0}
  - blockmask{m=AIR;r=8;d=5;oa=true} @self  # Safe zone
\`\`\`
`;
    }

    // Difficulty-specific features
    if (difficulty === 'psychological') {
        features += `
=== PSYCHOLOGICAL HORROR (DIFFICULTY: PSYCHOLOGICAL) ===
Implement fear-inducing mechanics:

1. Darkness System
   - potion{type=DARKNESS;d=9999;l=2} @PIR{r=30}
   - potion{type=BLINDNESS;d=100;l=1} @PIR{r=30} ~onTimer:200

2. Horror Sounds
   - effect:sound{s=entity.warden.heartbeat;v=1;p=0.8} @PIR{r=30} ~onTimer:40
   - effect:sound{s=entity.ghast.scream;v=0.5;p=0.5} @PIR{r=30}

3. Unpredictable Movement
   - teleport{l=@ring{r=10;p=1;y=5}} @self ~onTimer:100
   - Random positioning behind player

4. Jump Scares
   - Sudden teleport behind player
   - Loud sound + screen shake
   - recoil{r=20;pitch=-0.8} @PIR{r=32}
`;
    }

    if (difficulty === 'souls') {
        features += `
=== SOULS-LIKE MECHANICS (DIFFICULTY: SOULS) ===
Pattern-based combat:

1. Telegraph System (ALL attacks)
\`\`\`yaml
BOSS_big_attack:
  Cooldown: 20
  Skills:
  # Telegraph (2 seconds)
  - effect:particles{p=crit;a=100;repeat=40;repeati=1} @self
  - effect:sound{s=block.bell.use;v=1;p=0.5} @self
  - message{m="&e⚠ WARNING!"} @PIR{r=30}
  - delay 40
  # Attack
  - damage{a=30;ignorearmor=true} @PIR{r=8}
  - throw{v=10;vy=3} @PIR{r=8}
\`\`\`

2. Fixed attack patterns players can learn
3. Clear openings after combos
4. Every death = player mistake
5. All attacks dodgeable
`;
    }

    if (difficulty === 'nightmare') {
        features += `
=== NIGHTMARE MODE (DIFFICULTY: NIGHTMARE) ===
Glass cannon mechanics:

1. Low HP (${options.hp || '300-500'}) but HIGH damage (${options.damage || '35-50'})
2. Instant death potential with LONG telegraphs (3-5s)
3. Fast movement (Speed: 0.4-0.5)
4. Boss dies FAST if player skilled
5. NO healing for boss
6. Aggressive AI constantly attacking

\`\`\`yaml
# One-shot ultimate with long warning
BOSS_ultimate:
  Cooldown: 45
  Skills:
  - message{m="&c&l⚠ ULTIMATE INCOMING! ⚠"} @PIR{r=50}
  - effect:sound{s=entity.wither.spawn;v=2;p=0.5} @PIR{r=50}
  - effect:particles{p=explosion;a=200;repeat=60;repeati=2} @self
  - delay 60  # 3 seconds warning
  - damage{a=100;ignorearmor=true} @PIR{r=15}
  - throw{v=20;vy=5} @PIR{r=15}
\`\`\`
`;
    }

    return features || '# No special features enabled';
}