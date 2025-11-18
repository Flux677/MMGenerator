// ============================================
// MODULE: Advanced Mechanics & Targeters
// ============================================

export function getAdvancedMechanics() {
    return getTargetersReference() + getConditionsReference() + getTriggersReference() + getBossBarReference();
}

function getTargetersReference() {
    return `
=== TARGETERS (Complete List) ===

**Self/Target:**
- @self - Caster
- @target - Current target
- @trigger - Entity that triggered skill
- @origin - Spawn location
- @parent - Parent mob
- @children{target=markers} - Summoned entities
- @ModelPassengers - Mounted entities

**Players:**
- @PIR{r=10} - Players in radius
- @PIR{r=20;sort=NEAREST} - Nearest player
- @PIR{r=30;limit=1} - One random player
- @NearestPlayer{r=16} - Nearest player
- @PlayersInRadius{r=12} - All players in radius
- @PlayersInCone{a=90;r=10} - Players in cone
- @PlayersInLine{r=10;p=5} - Players in line

**Entities:**
- @EIR{r=10} - Entities in radius
- @EIRR{min=5;max=15} - Entities in radius range
- @LivingInRadius{r=12} - Living entities
- @LivingInCone{a=180;r=12} - Cone area
- @MIR{r=20;types=ZOMBIE} - Mobs in radius (specific type)
- @MobsInRadius{r=30;types=MINION;a=>3} - Count check
- @MobsInWorld{t=BOSS_TYPE} - All mobs of type in world

**Locations:**
- @forward{f=5} - 5 blocks forward
- @forward{f=5;lp=true} - Lock to pitch
- @Ring{r=8;p=8} - Circle of 8 points
- @Ring{radius=5;points=12;y=2} - Elevated ring
- @Circle{radius=10;points=16} - Horizontal circle
- @Line{r=10;p=5} - Line pattern (5 points, 10 blocks)
- @Cone{a=90;r=10;p=8} - Cone pattern
- @selflocation - Caster location
- @targetlocation - Target location
- @RLNTE - Random location near target entity

**Advanced:**
- @Threat{limit=5} - Top 5 threat
- @ThreatTable - All in threat table
- @ThreatTablePlayers - Players in threat table
- @LivingInFrustum{r=12;a=90} - In view frustum
- @RandomLocationsNearOrigin{a=5;r=10;minr=5} - Random points

**Filters & Sorting:**
\`\`\`yaml
@target{
  conditions=[
    - distance{d=<10}
    - health{h=>50%}
  ];
  sort=NEAREST;
  limit=1
}

# Sort options:
sort=NEAREST
sort=FURTHEST
sort=LOWEST_HEALTH
sort=HIGHEST_HEALTH
sort=RANDOM
sort=THREAT

# Limit:
limit=1  # Only 1 target
limit=5  # Max 5 targets
\`\`\`
`;
}

function getConditionsReference() {
    return `
=== CONDITIONS (Complete List) ===

**Health & Damage:**
- health{h=>50%} - Health above 50%
- health{h=<500} - Health below 500
- health{h=100to500} - Health between 100-500
- healthPercent{h=>0.5} - Health above 50%
- haspotioneffect{type=POISON} - Has poison effect
- damage{a=>10;d=<100} - Damage taken check

**Distance & Location:**
- distance{d=<10} - Distance less than 10
- distance{d=>5;d=<20} - Distance 5-20
- distancefromtarget{d=<15} - Distance from target
- altitude{a=>60;a=<100} - Y level check
- biome{b=PLAINS} - In plains biome
- inregion{r=region_name} - In WorldGuard region
- incombat - In combat state
- onground - On ground

**Line of Sight & View:**
- lineofsight - Has line of sight
- fieldofview{a=90;r=0} - In 90° cone (front)
- behind - Behind target
- inside - Inside target block
- lightlevel{l=>8} - Light level 8+

**Entity Checks:**
- entitytype{t=ZOMBIE} - Is zombie type
- mythicmobtype{t=CUSTOM_MOB} - Is MythicMob type
- samemob - Same mob type as caster
- mobsinradius{r=20;types=MINION;a=>3} - Minion count
- mobsinworld{t=BOSS;a=<2} - Max 2 bosses in world
- targetwithin{d=10} - Has target within 10 blocks
- playerwithin{d=15} - Player within 15 blocks

**Player Checks:**
- wearing{s=DIAMOND_HELMET} - Wearing diamond helmet
- holding{m=DIAMOND_SWORD} - Holding diamond sword
- hasinventoryspace - Has inventory space
- permission{p=perm.node} - Has permission
- score{o=objective;v=>10} - Scoreboard check

**Variable Checks:**
- varequals{var=caster.phase;val=2} - Variable equals 2
- variableInRange{var=caster.counter;val=>5} - Counter > 5
- variableInRange{var=caster.hp;val=10to50} - HP between 10-50
- offgcd - Global cooldown ready

**World & Time:**
- day - Is daytime
- night - Is nighttime
- raining - Is raining
- thunder - Is thundering
- weather{w=CLEAR} - Weather check

**Stance & State:**
- stance{s=aggressive} - In aggressive stance
- crouching - Is crouching
- sprinting - Is sprinting
- gliding - Is gliding
- swimming - Is swimming
- burning - Is on fire
- frozen - Is frozen

**Negation:**
Add "!" before condition to negate:
- !health{h=>50%} - Health NOT above 50%
- !haspotioneffect{type=POISON} - Does NOT have poison
`;
}

function getTriggersReference() {
    return `
=== TRIGGERS (Complete List) ===

**Combat:**
- ~onSpawn - When mob spawns
- ~onFirstSpawn - Only first spawn (not respawn)
- ~onLoad - When chunk loads
- ~onDespawn - When despawning
- ~onDeath - When dies
- ~onAttack - When attacks
- ~onDamaged - When takes damage
- ~onExplode - When explodes
- ~onTeleport - When teleports

**Target:**
- ~onChangeTarget - When changes target
- ~onEnterCombat - When enters combat
- ~onDropCombat - When leaves combat
- ~onTargetDeath - When target dies

**Timer:**
- ~onTimer:20 - Every 20 ticks (1 second)
- ~onTimer:100 - Every 5 seconds
- ~onTimer:200 - Every 10 seconds

**Interaction:**
- ~onInteract - When player interacts
- ~onRightClick - Right click interaction
- ~onDamage - When damages something
- ~onBlockBreak - When breaks block
- ~onBlockPlace - When places block

**Signal:**
- ~onSignal:SIGNAL_NAME - When receives signal

**Projectile:**
- ~onShoot - When shoots projectile
- ~onHit - When projectile hits

**Player:**
- ~onPlayerKill - When kills player
- ~onKillPlayer - When kills player (alias)

**Misc:**
- ~onTrade - Villager trade
- ~onBrew - Brewing stand
- ~onCraft - Crafting table
- ~onFish - Fishing
`;
}

function getBossBarReference() {
    return `
=== BOSS BAR SYSTEM ===

**Setup:**
\`\`\`yaml
MOB_NAME:
  BossBar:
    Enabled: true
    Title: '&c&lBoss Name'
    Color: RED
    Style: SOLID
    Range: 50
\`\`\`

**Colors:**
PINK, BLUE, RED, GREEN, YELLOW, PURPLE, WHITE

**Styles:**
SOLID, SEGMENTED_6, SEGMENTED_10, SEGMENTED_12, SEGMENTED_20

**Dynamic Update:**
\`\`\`yaml
# Flash effect on damage
BOSS_bar_flash:
  Skills:
  - barSet{name="BOSS";value=<caster.hp>/<caster.mhp>;color=WHITE} @self
  - delay 2
  - barSet{name="BOSS";value=<caster.hp>/<caster.mhp>;color=RED} @self

# Change color on phase
BOSS_phase_2:
  Skills:
  - setvar{var=caster.phase;val=2} @self
  - barSet{name="BOSS";color=PURPLE;title="&d&lPHASE 2"} @self

# Update value
- barSet{name="BOSS";value=<caster.hp>/<caster.mhp>} @self ~onDamaged
\`\`\`

=== PRODUCTION TIPS ===

**Performance:**
1. Use cooldowns on expensive skills
2. Limit particle amounts (20-50 max)
3. Use conditions to prevent spam
4. Despawn entities when done

**Balance:**
1. Always telegraph big attacks (1-3 seconds)
2. Provide dodge windows after combos
3. Scale HP/damage to server gear level
4. Test with actual players

**Polish:**
1. Add sounds to all major actions
2. Use particles for visual feedback
3. Add messages for important events
4. Screen shake for big hits

**Common Patterns:**
\`\`\`yaml
# Stop movement during attack
- setspeed{s=0} @self
- lockmodel{l=true} @self
# ... attack skills ...
- setspeed{s=0.3;delay=40} @self
- lockmodel{l=false;delay=40} @self

# Combo system
- setvar{var=caster.combo;val=1} @self
- state{s=combo_1} @self
- damage{a=10} @target
- delay 20
- skill{s=COMBO_2} @self ?varequals{var=caster.combo;val=1}

# Phase transition
- skill{s=PHASE_2} @self ?health{h=<50%} ?varequals{var=caster.phase;val=1}
\`\`\`

**Remember:**
- NO ModelEngine (use LibDisguises only)
- Escape special chars in JSON strings
- Use \\n for newlines in output
- Test all mechanics in-game
- Balance for fun, not frustration

GENERATE COMPLETE, PRODUCTION-READY CONFIGURATIONS NOW!
`;
}