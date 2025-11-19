// ============================================
// MODULE: MythicMobs Syntax Reference (PART 1)
// ============================================

export function getSyntaxReference() {
    return `
=== BASIC CONFIGURATIONS ===

MOBS Configuration:
\`\`\`yaml
MOB_INTERNAL_NAME:
  Type: <MINECRAFT_MOB_TYPE>  # ZOMBIE, SKELETON, WITHER_SKELETON, etc
  Display: '&c&lDisplay Name'
  Health: 500
  Damage: 15
  Armor: 10
  
  Disguise:
    Type: PLAYER
    Player: SkinUsername
    Skin: SkinUsername
    # OR for mob disguise:
    # Type: WITHER_SKELETON
    # Baby: false
    # Burning: false
  
  Options:
    MovementSpeed: 0.3
    FollowRange: 32
    KnockbackResistance: 0.5
    PreventOtherDrops: true
    PreventSlimeSplit: true
    Silent: false
    Despawn: false
  
  Modules:
    ThreatTable: true
    ImmunityTable: true
  
  AITargetSelectors:
  - 0 clear
  - 1 attacker
  - 2 players
  - 3 NearestPlayer
  
  AIGoalSelectors:
  - 0 clear
  - 1 meleeattack
  - 2 randomstroll
  
  Skills:
  - skill{s=SKILL_NAME} @target ~onTimer:100
  - skill{s=SKILL_NAME} @self ~onDamaged
  - skill{s=SKILL_NAME} @self ~onSpawn
  
  Drops:
  - DIAMOND 1-3 1.0
  - exp 100-200 1.0
\`\`\`

SKILLS Configuration:
\`\`\`yaml
SKILL_NAME:
  Cooldown: 10
  Conditions:
  - distance{d=<10} true
  - health{h=>50%} true
  TargetConditions:
  - playerwithin{d=15} true
  Skills:
  - damage{amount=15} @target
  - particles{p=flame;a=20} @self
  - message{m="Skill used!"} @PIR{r=30}
\`\`\`

=== CORE MECHANICS ===

**Variables System:**
\`\`\`yaml
# Set variable
- setvar{var=caster.name;val=VALUE;type=STRING} @self
- setvar{var=caster.counter;val=0;type=INTEGER} @self
- setvar{var=caster.hp;val=100.5;type=FLOAT} @self
- setvar{var=caster.temp;val=x;duration=100} @self  # Temporary

# Math operations
- variableMath{var=caster.counter;operation=ADD;value=1} @self
- variableMath{var=caster.hp;operation=SUB;value=10} @self
- variableMath{var=caster.multiplier;operation=MULT;value=2} @self
- variableMath{var=caster.half;operation=DIV;value=2} @self

# Check variable
Conditions:
- varequals{var=caster.phase;val=2} true
- variableInRange{var=caster.counter;val=>5} true
- variableInRange{var=caster.hp;val=10to50} true

# Use in skills
- damage{a=<caster.var.damage_amount>} @target
- skill{s=PHASE_2} @self ?varequals{var=caster.phase;val=2}
\`\`\`

**Damage Mechanics:**
\`\`\`yaml
- damage{amount=10} @target
- damage{a=20;ignorearmor=true} @target
- damage{a=15;preventknockback=true} @target
- damage{a=<caster.var.damage>} @target  # Variable damage
- percentdamage{p=0.1} @target  # 10% max HP
\`\`\`

**Healing:**
\`\`\`yaml
- heal{amount=50} @self
- heal{a=100;overheal=true} @self
- heal{multiplier=0.5} @self  # 50% max HP
\`\`\`

**Potion Effects:**
\`\`\`yaml
- potion{type=SLOW;duration=100;level=1} @target
- potion{t=POISON;d=200;l=2} @target
- potion{t=REGENERATION;d=100;l=1} @self
- potion{t=INCREASE_DAMAGE;d=9999;l=1} @self  # Permanent
- potionclear @self  # Remove all effects
\`\`\`

**Projectiles:**
\`\`\`yaml
# Simple projectile
- projectile{
    velocity=10;
    interval=1;
    hitSelf=false;
    onTick=TICK_SKILL;
    onHit=HIT_SKILL;
    onEnd=END_SKILL
  } @target

# Advanced projectile
- projectile{
    bulletType=MOB;
    v=20;
    i=1;
    hs=true;
    hR=2;
    vR=2;
    md=50;
    gravity=true;
    bounce=true;
    onTick=[ - particles{p=flame;a=5} @origin ];
    onHit=[ - damage{a=20} @target; - remove @self ];
  }
\`\`\`

**Summon:**
\`\`\`yaml
- summon{type=MOB_NAME;amount=1} @self
- summon{t=MOB;a=3;radius=5;yoffset=2} @ring{r=8;p=8}
- summon{t=MOB;a=1;velocity=2;velocityY=3} @target
\`\`\`

**Teleport & Movement:**
\`\`\`yaml
- teleport{} @target
- teleport{spread=5} @self
- teleport{l=@ring{r=10;p=1}} @self
- throw{velocity=5;velocityY=2} @target
- propel{v=2} @forward{f=5}
- lunge{v=3;vy=1} @target
- velocity{m=set;x=0;y=10;z=0} @self
\`\`\`

**Particles & Sounds:**
\`\`\`yaml
- effect:particles{p=flame;a=50;hs=1;vs=1;y=1} @self
- effect:particles{p=explosion;a=20;speed=0.1} @target
- effect:sound{s=entity.ender_dragon.growl;v=1;p=1} @self
- effect:sound{s=entity.wither.spawn;v=2;p=0.5} @PIR{r=50}
\`\`\`

**Messages:**
\`\`\`yaml
- message{m="<caster.name> used skill!"} @trigger
- message{m="&c&lWARNING!"} @PIR{r=30}
- actionbar{m="&eHealth: <caster.hp>"} @PIR{r=10}
\`\`\`

` + getSyntaxReferencePart2();
}

function getSyntaxReferencePart2() {
    return `
=== ADVANCED MECHANICS ===

**Totem (Hitbox):**
\`\`\`yaml
- totem{
    maxDuration=40;
    onHit=HIT_SKILL;
    hitRadius=3;
    verticalHitRadius=4;
    drawHitbox=false;
    yOffset=0;
    delay=20;
    repeat=5;
    repeatInterval=1
  } @forward{f=2}
\`\`\`

**Missile (Tracking):**
\`\`\`yaml
- missile{
    onTick=TICK_SKILL;
    onHit=HIT_SKILL;
    velocity=30;
    interval=1;
    hitRadius=2;
    verticalHitRadius=2;
    interpolation=0.75;
    hitSelf=true;
    hugSurface=false;
    heightFromSurface=1.25;
    duration=120;
    maxRange=2000;
    stopAtEntity=true
  }
\`\`\`

**BlockMask (Arena Modification):**
\`\`\`yaml
- blockmask{m=LAVA;r=10;d=20;na=true;oa=false} @self
- blockmask{m=AIR;r=5;d=10;oa=true} @self  # Clear blocks
- blockmask{m=LIGHT;r=3;d=5} @location
\`\`\`

**Mount (Grab Mechanic):**
\`\`\`yaml
- mount{} @target  # Grab player
- DismountAll{} @self  # Release
\`\`\`

**State System (Animations):**
\`\`\`yaml
- state{s=attack_combo_1;p=3} @self  # Play 3 times
- state{s=idle_aggressive;lo=5} @self  # Loop 5 times
- state{s=current_state;r=true} @self  # Remove state
- defaultstate{t=idle;s=idle_normal} @self
- defaultstate{t=walk;s=walk_fast} @self
\`\`\`

**Speed Control:**
\`\`\`yaml
- setspeed{type=walking;speed=0} @self  # Stop
- setspeed{t=walking;s=2;delay=40} @self  # Restore after delay
- setspeed{s=1.5;repeat=10;repeati=1} @self  # Temporary boost
\`\`\`

**AI Control:**
\`\`\`yaml
- setAI{ai=false} @self  # Disable AI
- setAI{ai=true;delay=100} @self  # Re-enable after 5s
\`\`\`

**Lock Model:**
\`\`\`yaml
- lockmodel{l=true} @self  # Lock during animation
- lockmodel{l=false;delay=60} @self  # Unlock after 3s
\`\`\`

**Look Mechanic:**
\`\`\`yaml
- look{l=force;repeat=60;repeati=1} @target
- look{headOnly=true;immediately=true} @target
\`\`\`

**GoTo (Pathfinding):**
\`\`\`yaml
- goto{speedModifier=1.5;sh=2;sv=2} @target
- goto{s=2;delay=20} @location
\`\`\`

**Signal (Coordination):**
\`\`\`yaml
- signal{s=ATTACK_NOW} @MIR{r=20;types=MINION}

# On minion:
~onSignal:ATTACK_NOW
\`\`\`

**Threat System:**
\`\`\`yaml
- threat{amount=500} @trigger  # Increase aggro
- threatdrop{amount=100} @targeter  # Reduce aggro
- threatadd{a=1000} @target
- threatmultiply{m=2} @trigger
- taunt @trigger  # Force target
\`\`\`

**Recoil (Screen Shake):**
\`\`\`yaml
- recoil{r=20;pitch=-0.8} @PIR{r=32}
- delay 1
- recoil{r=20;pitch=0.6} @PIR{r=32}
\`\`\`

**Remove:**
\`\`\`yaml
- remove{delay=100} @self
- remove @children{target=markers}
\`\`\`

**Random Skill:**
\`\`\`yaml
- randomskill{
    skills=[
      [ - skill{s=SKILL_A} ],
      [ - skill{s=SKILL_B} ],
      [ - skill{s=SKILL_C} ]
    ]
  } @self
\`\`\`

**Cancel Event:**
\`\`\`yaml
- CancelEvent{sync=true} @self ~onInteract
- CancelEvent{sync=true} @self ~onAttack
\`\`\`

**Set Stance:**
\`\`\`yaml
- setstance{stance=aggressive} @self
- setstance{stance=defensive} @self
\`\`\`

**Body Rotation:**
\`\`\`yaml
- bodyrotation{mh=30;mb=30;rde=40;rdu=60} @self
- bodyrotation{mh=0;mb=0;rde=0;rdu=0} @self  # Reset
\`\`\`

**Set Rotation:**
\`\`\`yaml
- setrotation{yaw=90;pitch=0} @self
- setrotation{relative=true;yaw=45} @self
\`\`\`

**Global Cooldown:**
\`\`\`yaml
- gcd{ticks=100} @self  # 5 second GCD

Conditions:
- offgcd true  # Skill can be used if GCD off
\`\`\`
`;
}