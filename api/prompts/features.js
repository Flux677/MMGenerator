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
    // ✅ NEW: Boss Bar System
    if (options.bossBarSystem) {
        features += `
=== DYNAMIC BOSS BAR SYSTEM (ENABLED) ===
Implement professional boss bar dengan dynamic updates:

**Setup:**
\`\`\`yaml
MOB_NAME:
  BossBar:
    Enabled: true
    Title: '&c&l⚔ BOSS NAME'
    Color: RED
    Style: SOLID
    Range: 50
\`\`\`

**Colors:** RED, PINK, BLUE, GREEN, YELLOW, PURPLE, WHITE

**Styles:** SOLID, SEGMENTED_6, SEGMENTED_10, SEGMENTED_12, SEGMENTED_20

**Dynamic Updates:**
\`\`\`yaml
# Update on damage
BOSS_update_bar:
  Skills:
  - barSet{name="BOSS_NAME";value=<caster.hp>/<caster.mhp>} @self ~onDamaged

# Flash effect
BOSS_bar_flash:
  Skills:
  - barSet{name="BOSS_NAME";color=WHITE} @self
  - delay 2
  - barSet{name="BOSS_NAME";color=RED} @self

# Phase color change
BOSS_phase_2_bar:
  Conditions:
  - health{h=<50%} true
  - varequals{var=caster.phase;val=1} true
  Skills:
  - barSet{name="BOSS_NAME";color=PURPLE;title="&d&lPHASE 2 - ENRAGED"} @self
  - setvar{var=caster.phase;val=2} @self

# Phase 3
BOSS_phase_3_bar:
  Conditions:
  - health{h=<20%} true
  - varequals{var=caster.phase;val=2} true
  Skills:
  - barSet{name="BOSS_NAME";color=YELLOW;title="&e&lFINAL PHASE";style=SEGMENTED_20} @self
  - setvar{var=caster.phase;val=3} @self
\`\`\`

**Integration:** Trigger bar updates on damage, phase transitions, and special attacks.
`;
    }

    // ✅ NEW: Sound System
    if (options.soundSystem) {
        features += `
=== CUSTOM SOUND SYSTEM (ENABLED) ===
Generate atmospheric sound design dengan layered audio:

**Ambient Sounds (Looping):**
\`\`\`yaml
BOSS_ambient_loop:
  Skills:
  - sound{s=entity.warden.heartbeat;v=1;p=0.8} @PIR{r=30} ~onTimer:40
  - sound{s=ambient.cave;v=0.5;p=0.5} @PIR{r=30} ~onTimer:60
  - sound{s=entity.warden.listening;v=0.6;p=0.6} @PIR{r=20} ~onTimer:80
\`\`\`

**Attack Sounds:**
\`\`\`yaml
BOSS_attack_sound:
  Skills:
  - sound{s=entity.ender_dragon.growl;v=2;p=1} @self
  - sound{s=entity.wither.shoot;v=1.5;p=0.8;delay=5} @self
  - sound{s=entity.generic.explode;v=1;p=0.8;delay=10} @self
\`\`\`

**Phase Transition Sounds:**
\`\`\`yaml
BOSS_phase_transition_sound:
  Skills:
  - sound{s=entity.wither.spawn;v=2;p=0.5} @PIR{r=50}
  - sound{s=entity.lightning_bolt.thunder;v=1.5;p=0.8;delay=10} @PIR{r=50}
  - sound{s=ui.toast.challenge_complete;v=1;p=1;delay=20} @PIR{r=50}
\`\`\`

**Directional Audio (Stalking/Positioning):**
\`\`\`yaml
# Sound plays from boss location to player (directional)
- sound{s=entity.warden.ambient;v=0.8;p=0.6} @target
- sound{s=entity.ghast.scream;v=0.5;p=0.3} @NearestPlayer{r=20}
\`\`\`

**Sound Categories by Theme:**
- **Horror:** entity.warden.heartbeat, entity.ghast.ambient, ambient.cave
- **Epic:** entity.ender_dragon.growl, entity.wither.spawn, block.bell.use
- **Elemental Fire:** block.fire.ambient, entity.blaze.ambient, item.firecharge.use
- **Elemental Ice:** block.glass.break, entity.player.hurt_freeze, block.snow.step
- **Elemental Lightning:** entity.lightning_bolt.thunder, block.amethyst_block.chime
- **Elemental Shadow:** entity.enderman.ambient, block.portal.ambient, entity.phantom.ambient

**Integration:** Match sounds to mob theme, layer for depth, use pitch/volume variations.
`;
    }

    // ✅ IMPROVED: Drop Tables
    if (options.includeDropTables) {
        features += `
=== ADVANCED DROP TABLES (ENABLED) ===
Generate sophisticated loot system dengan conditions:

**Basic Drops:**
\`\`\`yaml
Drops:
- DIAMOND 2-4 0.5
- EMERALD 1-2 0.3
- exp 100-200 1.0
\`\`\`

**Conditional Drops:**
\`\`\`yaml
Drops:
# Higher drop if killed with specific item
- RARE_ITEM 1 0.05  # Base 5%
- RARE_ITEM 1 0.15 ~onKill ?holding{m=DIAMOND_SWORD}  # 15% with diamond sword
- RARE_ITEM 1 0.25 ~onKill ?wearing{s=DIAMOND_HELMET}  # 25% with full diamond

# Drop only during specific conditions
- MOON_ESSENCE 1-2 0.8 ?night  # Only drops at night
- SUN_CRYSTAL 1-2 0.8 ?day  # Only drops during day
- STORM_FRAGMENT 1 1.0 ?thunder  # Guaranteed drop during thunderstorm

# Looting enchantment bonus
- ENDER_PEARL 1-3 0.8
- ENDER_PEARL 1 0.2 ~onKill ?looting{l=>1}  # +1 per looting level
\`\`\`

**Drop Pools (Mythic-style):**
\`\`\`yaml
DropTable:
  legendary_pool:
    TotalItems: 1
    MinItems: 0
    Bonus: 0.1
    BonusLuckLevel: 1
    Items:
    - LEGENDARY_SWORD 1 0.3
    - LEGENDARY_AXE 1 0.3
    - LEGENDARY_BOW 1 0.4
  
  rare_materials_pool:
    TotalItems: 2-3
    Items:
    - BOSS_SCALE 1-3 0.8
    - BOSS_FANG 1-2 0.6
    - BOSS_HEART 1 0.2
\`\`\`

**Custom Item Drops:**
\`\`\`yaml
Drops:
- CUSTOM_ITEM_NAME 1 0.15  # Reference to Items.yml
- BOSS_TROPHY 1 1.0  # Guaranteed drop
\`\`\`

Generate drops yang fair tapi exciting, dengan rare items sebagai chase reward.
`;
    
    }

    return features || '# No special features enabled';
}

