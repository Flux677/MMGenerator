// ============================================
// MODULE: Custom AI Behavior Patterns (NEW)
// FILE: api/prompts/ai-behavior.js
// ============================================

export function getAIBehaviorPrompts(behaviorType) {
    const behaviors = {
        aggressive_rush: getAggressiveRushBehavior(),
        tactical_kiting: getTacticalKitingBehavior(),
        defensive_counter: getDefensiveCounterBehavior(),
        berserker_mode: getBerserkerModeBehavior(),
        hit_and_run: getHitAndRunBehavior(),
        summoner_support: getSummonerSupportBehavior()
    };
    
    return behaviors[behaviorType] || behaviors.aggressive_rush;
}

function getAggressiveRushBehavior() {
    return `
=== AI BEHAVIOR: AGGRESSIVE RUSH (ENABLED) ===
Implement relentless aggressive behavior - always attack, never retreat.

**Core Characteristics:**
- Always close distance to target
- No defensive stance or retreat mechanics
- High attack frequency
- Prioritize damage over survival
- Chase fleeing targets aggressively

**Implementation:**
\`\`\`yaml
# AI Configuration
AIGoalSelectors:
- 0 clear
- 1 meleeattack
- 2 goto{s=1.5} @target  # Fast pursuit
- 3 randomstroll

AITargetSelectors:
- 0 clear
- 1 attacker
- 2 players
- 3 NearestPlayer{r=50}  # Long aggro range

Options:
  MovementSpeed: 0.4  # Fast movement
  FollowRange: 50
  
# Rush Behavior Skill
BOSS_aggressive_rush:
  Cooldown: 5
  Conditions:
  - distance{d=>5} true  # If target far
  Skills:
  # Speed boost
  - potion{type=SPEED;d=100;l=2} @self
  - message{m="&c<caster.name> charges!"} @PIR{r=30}
  - particles{p=flame;a=30;repeat=20;repeati=1} @self
  - lunge{v=2;vy=0.5} @target
  
# Constant pressure
BOSS_pressure_attack:
  Cooldown: 3
  Conditions:
  - distance{d=<8} true
  Skills:
  - damage{a=12} @target
  - threat{amount=300} @target
  - message{m="&eRelentless!"} @target

# Never retreat (anti-flee)
~onDamaged:
- threat{amount=500} @trigger
- goto{s=1.5} @trigger
\`\`\`

**Behavior Traits:**
- NO retreat or defensive skills
- Always move toward target
- High threat generation
- Ignore low HP (no flee at low health)
- Spam attacks with short cooldowns (3-5 seconds)
`;
}

function getTacticalKitingBehavior() {
    return `
=== AI BEHAVIOR: TACTICAL KITING (ENABLED) ===
Implement ranged combat style - maintain distance, attack from range, retreat when approached.

**Core Characteristics:**
- Keep 10-15 blocks distance from target
- Retreat when target gets close
- Prioritize ranged attacks
- Move unpredictably (side-step, backpedal)
- Punish melee attempts

**Implementation:**
\`\`\`yaml
# AI Configuration
AIGoalSelectors:
- 0 clear
- 1 rangedattack
- 2 avoidplayers{speed=1.3;d=8}  # Flee if too close
- 3 randomstroll

Options:
  MovementSpeed: 0.35
  FollowRange: 32
  
# Distance Check System
~onTimer:20
- skill{s=BOSS_maintain_distance} @self

BOSS_maintain_distance:
  Conditions:
  - distance{d=<8} true  # Too close!
  Skills:
  - message{m="&e<caster.name> retreats!"} @PIR{r=20}
  - particles{p=cloud;a=50} @self
  - teleport{spread=8;maxdistance=15} @self
  - potion{type=SPEED;d=60;l=1} @self
  - throw{v=-5;vy=1} @target  # Push back
  
# Ranged Attack Pattern
BOSS_ranged_assault:
  Cooldown: 4
  Conditions:
  - distance{d=>8;d=<25} true  # Ideal range
  - lineofsight true
  Skills:
  - projectile{
      velocity=20;
      interval=1;
      onTick=PROJ_TICK;
      onHit=PROJ_HIT;
      hitRadius=2
    } @target
  - message{m="&6Ranged attack!"} @self

PROJ_TICK:
  Skills:
  - particles{p=flame;a=5} @origin

PROJ_HIT:
  Skills:
  - damage{a=15} @target
  - throw{v=5;vy=2} @target
  - remove @self

# Punish melee attempts
~onDamaged:
- skill{s=BOSS_kite_away} @self ?distance{d=<6}

BOSS_kite_away:
  Skills:
  - message{m="&cToo close!"} @trigger
  - particles{p=explosion;a=30} @self
  - throw{v=10;vy=3} @trigger
  - teleport{spread=10} @self
  - potion{type=SLOW;d=60;l=2} @trigger
\`\`\`

**Behavior Traits:**
- Always maintain 10-15 block distance
- Teleport away if cornered
- Projectile-based attacks only
- Slow/knockback targets who get close
- Circle-strafe movement pattern
`;
}

function getDefensiveCounterBehavior() {
    return `
=== AI BEHAVIOR: DEFENSIVE COUNTER (ENABLED) ===
Implement defensive stance with counter-attacks - block attacks, punish aggression.

**Core Characteristics:**
- Defensive stance when not attacking
- Counter-attack when hit from front
- Block/parry mechanic with visual feedback
- Punish combos and spam attacks
- Reward patient players, punish aggressive ones

**Implementation:**
\`\`\`yaml
# Initialize defensive stance
~onSpawn:
- setvar{var=caster.defensive_mode;val=true} @self
- setstance{stance=defensive} @self

Options:
  KnockbackResistance: 0.8  # Hard to push
  MovementSpeed: 0.25  # Slower, defensive
  
# Counter System
~onDamaged:
- skill{s=BOSS_attempt_counter} @self

BOSS_attempt_counter:
  TriggerConditions:
  - fieldofview{a=90;r=0} true  # Hit from front
  Conditions:
  - varequals{var=caster.defensive_mode;val=true}
  Skills:
  # Counter success!
  - message{m="&e⚔ COUNTERED!"} @trigger
  - particles{p=crit;a=100;hs=2} @self
  - sound{s=item.shield.block;v=2;p=1.2} @self
  - damage{a=20;ignorearmor=true} @trigger
  - throw{v=8;vy=3} @trigger
  - potion{type=WEAKNESS;d=100;l=1} @trigger
  # Reset defensive mode briefly
  - setvar{var=caster.defensive_mode;val=false} @self
  - setvar{var=caster.defensive_mode;val=true;delay=40} @self

# Block stance (visual)
BOSS_defensive_stance:
  Skills:
  - particles{p=barrier;a=20;repeat=60;repeati=3} @ring{r=2;p=8;y=1}
  - potion{type=DAMAGE_RESISTANCE;d=100;l=1} @self
  - message{m="&7<caster.name> raises guard..."} @PIR{r=20}

# Punish spam attacks
~onTimer:20
- variableMath{var=caster.hit_count;operation=ADD;value=1} @self ~onDamaged
- skill{s=BOSS_punish_spam} @self ?variableInRange{var=caster.hit_count;val=>5}

BOSS_punish_spam:
  Skills:
  - message{m="&c<caster.name> PUNISHES your aggression!"} @PIR{r=30}
  - particles{p=explosion;a=200} @self
  - damage{a=25;ignorearmor=true} @PIR{r=8}
  - throw{v=12;vy=4} @PIR{r=8}
  - setvar{var=caster.hit_count;val=0} @self

# Attack windows (brief offensive)
BOSS_counter_attack:
  Cooldown: 8
  Conditions:
  - varequals{var=caster.defensive_mode;val=true}
  Skills:
  - setvar{var=caster.defensive_mode;val=false} @self
  - message{m="&6Opening!"} @PIR{r=20}
  - setspeed{s=0.5} @self
  - damage{a=15} @target
  - delay 40
  - setspeed{s=0.25} @self
  - setvar{var=caster.defensive_mode;val=true} @self
\`\`\`

**Behavior Traits:**
- Block attacks from front (counter with damage)
- Punish players who spam attack (5+ hits = AoE punish)
- Defensive stance most of the time
- Brief attack windows for players to exploit
- Reward timing and patience
`;
}

function getBerserkerModeBehavior() {
    return `
=== AI BEHAVIOR: BERSERKER MODE (ENABLED) ===
Implement rage-based combat - gets stronger when damaged, enrage at low HP.

**Core Characteristics:**
- Stack rage with each hit taken
- Enrage mode at <30% HP
- Attack speed increases with rage
- Self-damage for more power
- Becomes unstoppable when low HP

**Implementation:**
\`\`\`yaml
# Initialize rage system
~onSpawn:
- setvar{var=caster.rage_stacks;val=0;type=INTEGER} @self
- setvar{var=caster.enraged;val=false} @self

# Gain rage on damage
~onDamaged:
- variableMath{var=caster.rage_stacks;operation=ADD;value=1} @self
- skill{s=BOSS_rage_stack_visual} @self
- skill{s=BOSS_check_enrage} @self ?health{h=<30%}

BOSS_rage_stack_visual:
  Skills:
  - particles{p=angry_villager;a=<caster.var.rage_stacks>} @self
  - message{m="&c<caster.name> RAGE: <caster.var.rage_stacks>"} @PIR{r=20}
  # Buff per stack
  - potion{type=INCREASE_DAMAGE;d=100;l=<caster.var.rage_stacks>} @self
  - potion{type=SPEED;d=100;l=<caster.var.rage_stacks>} @self

# ENRAGE at low HP
BOSS_check_enrage:
  Conditions:
  - varequals{var=caster.enraged;val=false}
  - health{h=<30%}
  Skills:
  - setvar{var=caster.enraged;val=true} @self
  - message{m="&4&l<caster.name> ENRAGES!!!"} @PIR{r=50}
  - particles{p=explosion;a=300;hs=8;vs=8} @self
  - sound{s=entity.ender_dragon.growl;v=2;p=0.5} @self
  - recoil{r=30;pitch=-1} @PIR{r=32}
  # Massive buffs
  - potion{type=INCREASE_DAMAGE;d=9999;l=3} @self
  - potion{type=SPEED;d=9999;l=2} @self
  - potion{type=REGENERATION;d=9999;l=2} @self
  - potion{type=DAMAGE_RESISTANCE;d=9999;l=1} @self

# Berserker attacks (faster when enraged)
BOSS_berserker_strike:
  Cooldown: 2  # Very fast
  Conditions:
  - varequals{var=caster.enraged;val=true}
  Skills:
  - damage{a=18} @target
  - particles{p=damage;a=50} @target
  - threat{amount=400} @target

# Self-harm for power
BOSS_blood_rage:
  Cooldown: 15
  Conditions:
  - variableInRange{var=caster.rage_stacks;val=>5}
  Skills:
  - message{m="&4<caster.name> sacrifices health for power!"} @PIR{r=30}
  - damage{a=50;preventknockback=true} @self  # Hurt self
  - variableMath{var=caster.rage_stacks;operation=ADD;value=3} @self
  - potion{type=INCREASE_DAMAGE;d=200;l=3} @self
  - particles{p=reddust;c=#FF0000;a=200} @self

# Decay rage slowly
~onTimer:100
- variableMath{var=caster.rage_stacks;operation=SUB;value=1} @self ?variableInRange{var=caster.rage_stacks;val=>1}
\`\`\`

**Behavior Traits:**
- Rage stacks increase damage & speed
- Enrage mode at <30% HP (massive buffs)
- Can self-damage for more rage stacks
- Becomes faster and deadlier as fight continues
- Unstoppable when enraged
`;
}

function getHitAndRunBehavior() {
    return `
=== AI BEHAVIOR: HIT AND RUN (ENABLED) ===
Implement guerrilla tactics - attack then teleport away, unpredictable positioning.

**Core Characteristics:**
- Attack → Immediate teleport away
- Reappear from random angles
- Short attack windows
- Frustrate player positioning
- Never stay in same spot

**Implementation:**
\`\`\`yaml
Options:
  MovementSpeed: 0.35
  FollowRange: 40

# Hit and Run pattern
BOSS_hit_and_run:
  Cooldown: 5
  Skills:
  # Appear
  - particles{p=portal;a=100} @self
  - sound{s=entity.enderman.teleport;v=1} @self
  # Attack
  - damage{a=15} @target
  - message{m="&e*Strike!*"} @target
  - particles{p=crit;a=50} @target
  - delay 10
  # Disappear
  - particles{p=portal;a=100} @self
  - teleport{l=@ring{r=12;p=1}} @target
  - particles{p=portal;a=100} @self
  - sound{s=entity.enderman.teleport;v=1} @self

# Unpredictable teleport
~onTimer:60
- skill{s=BOSS_reposition} @self

BOSS_reposition:
  Conditions:
  - playerwithin{d=20} true
  Skills:
  - particles{p=smoke;a=50} @self
  - teleport{l=@RLNTE{a=1;r=15;minr=8}} @target
  - particles{p=smoke;a=50} @self

# Teleport when hit
~onDamaged:
- skill{s=BOSS_escape} @self

BOSS_escape:
  Cooldown: 3
  Skills:
  - message{m="&7Too slow!"} @trigger
  - particles{p=portal;a=80} @self
  - teleport{spread=10;maxdistance=15} @self
  - particles{p=portal;a=80} @self

# Ambush attack (behind player)
BOSS_ambush:
  Cooldown: 12
  Skills:
  - message{m="&7..."} @PIR{r=30}
  - teleport{l=@target} @self
  - look{l=force;immediately=true} @target
  - goto{s=0} @target  # Behind target
  - delay 20
  - message{m="&c&lBEHIND YOU!"} @target
  - damage{a=25;ignorearmor=true} @target
  - throw{v=10;vy=2} @target
  - particles{p=explosion;a=100} @target
  - sound{s=entity.generic.explode;v=1.5} @target
\`\`\`

**Behavior Traits:**
- Never stays in one place
- Teleport after every attack
- Ambush from behind periodically
- Teleport away when damaged
- Extremely mobile and frustrating to hit
`;
}

function getSummonerSupportBehavior() {
    return `
=== AI BEHAVIOR: SUMMONER SUPPORT (ENABLED) ===
Implement summoner style - stay back, summon minions, buff allies, avoid direct combat.

**Core Characteristics:**
- Keep distance from players (20+ blocks)
- Constantly summon minions
- Buff and heal minions
- Teleport away if cornered
- Weak in direct combat, strong with minions

**Implementation:**
\`\`\`yaml
AIGoalSelectors:
- 0 clear
- 1 avoidplayers{speed=1.5;d=15}  # Stay away!
- 2 randomstroll

Options:
  MovementSpeed: 0.3
  FollowRange: 50
  Damage: 5  # Weak direct damage
  
# Constant summoning
~onTimer:100
- skill{s=BOSS_summon_minions} @self

BOSS_summon_minions:
  Conditions:
  - mobsinradius{r=30;types=MINION;a=<8} true  # Max 8 minions
  Skills:
  - message{m="&5<caster.name> summons reinforcements!"} @PIR{r=40}
  - particles{p=portal;a=100;repeat=20;repeati=1} @ring{r=5;p=4;y=0}
  - sound{s=block.portal.trigger;v=1.5} @self
  - summon{type=MINION;amount=2} @ring{r=6;p=2}
  - particles{p=explosion;a=50} @ring{r=6;p=2}

# Buff minions
BOSS_rally_minions:
  Cooldown: 20
  Conditions:
  - mobsinradius{r=25;types=MINION;a=>2} true
  Skills:
  - message{m="&e<caster.name> empowers allies!"} @PIR{r=40}
  - particles{p=enchantment_table;a=200} @self
  - sound{s=block.enchantment_table.use;v=2} @self
  # Buff all minions
  - potion{type=INCREASE_DAMAGE;d=200;l=2} @MIR{r=25;types=MINION}
  - potion{type=SPEED;d=200;l=1} @MIR{r=25;types=MINION}
  - potion{type=REGENERATION;d=200;l=2} @MIR{r=25;types=MINION}
  - heal{a=100} @MIR{r=25;types=MINION}

# Heal minions
~onTimer:60
- heal{a=20} @MIR{r=30;types=MINION}
- particles{p=happy_villager;a=30} @MIR{r=30;types=MINION}

# Escape if cornered
~onDamaged:
- skill{s=BOSS_summoner_escape} @self ?distance{d=<10}

BOSS_summoner_escape:
  Cooldown: 5
  Skills:
  - message{m="&7<caster.name> retreats!"} @PIR{r=20}
  - particles{p=portal;a=150} @self
  - teleport{spread=20;maxdistance=30} @self
  - particles{p=portal;a=150} @self
  # Summon guards at new location
  - summon{type=MINION;amount=2} @ring{r=3;p=2}

# Panic summon when low HP
BOSS_panic_summon:
  Conditions:
  - health{h=<40%} true
  Skills:
  - message{m="&c<caster.name> calls for help!"} @PIR{r=50}
  - summon{type=MINION;amount=4} @ring{r=8;p=4}
  - particles{p=explosion;a=300} @self

# Weak direct attack (discourage melee)
BOSS_weak_attack:
  Cooldown: 8
  Conditions:
  - distance{d=<5} true
  Skills:
  - damage{a=5} @target
  - throw{v=8;vy=3} @target  # Push away
  - message{m="&7Stay back!"} @target
\`\`\`

**Behavior Traits:**
- Always keep 15+ block distance
- Summon minions constantly (max 8)
- Buff and heal minions every 20-60 seconds
- Teleport away if players get close
- Weak in 1v1, deadly with minion army
`;
}