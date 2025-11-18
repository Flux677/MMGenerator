// BASE PROMPT - Core mechanics & syntax
export function getBasePrompt(category, difficulty, aiComplexity, description) {
    const categoryGuides = {
        boss: 'Boss tunggal dengan skill kompleks dan multiple phases',
        boss_dungeon: 'Boss utama beserta 2-3 jenis minion mobs untuk dungeon',
        miniboss: 'Mini boss dengan skill menengah, tidak terlalu kompleks',
        normal: 'Mob biasa untuk world exploration, skill simple'
    };

    const difficultyGuides = {
        balanced: { hp: '500-800', damage: '10-15', desc: 'Balanced stats, fair mechanics' },
        hard: { hp: '1000-1500', damage: '20-30', desc: 'High HP and damage, complex patterns' },
        nightmare: { hp: '300-500', damage: '35-50', desc: 'LOW HP but DEVASTATING damage' },
        psychological: { hp: '600-800', damage: '8-12', desc: 'Darkness, stealth, jump scares' },
        souls: { hp: '700-1000', damage: '15-25', desc: 'Pattern-based, telegraphed attacks' },
        swarm: { hp: '400-600', damage: '5-10', desc: 'Low damage, summons many minions' }
    };

    const aiComplexityGuides = {
        advanced: 'ThreatTable, smart targeting, adaptive behavior',
        elite: 'Variable-based state machine, decision trees, counter-play',
        nightmare: 'Learns player patterns, adaptive AI, punishes repetition'
    };

    const diff = difficultyGuides[difficulty] || difficultyGuides.balanced;

    return `You are an EXPERT MythicMobs configuration generator. Create a ${categoryGuides[category]}.

=== REQUIREMENTS ===
Difficulty: ${difficulty.toUpperCase()} - ${diff.desc}
Recommended Stats: HP ${diff.hp}, Damage ${diff.damage}
AI Complexity: ${aiComplexity.toUpperCase()} - ${aiComplexityGuides[aiComplexity]}

User Request: ${description}

=== CRITICAL RULES ===
1. ONLY use LibDisguises for visuals (NO ModelEngine!)
2. Base Type MUST be vanilla Minecraft mob (ZOMBIE, SKELETON, WITHER_SKELETON, etc)
3. 100% valid MythicMobs syntax only
4. Production-ready, complete configurations
5. Proper YAML indentation (2 spaces)

=== LIBDISGUISES SYNTAX ===
Player Skin:
\`\`\`yaml
Disguise:
  Type: PLAYER
  Player: SkinName
  Skin: SkinName
\`\`\`

Mob Type:
\`\`\`yaml
Disguise:
  Type: WITHER_SKELETON
  Glowing: true
  CustomName: "&c&lBoss Name"
\`\`\`

Valid Types: ZOMBIE, SKELETON, WITHER_SKELETON, STRAY, PIGLIN, HOGLIN, RAVAGER, VEX, PILLAGER, VINDICATOR, EVOKER, IRON_GOLEM, etc.

=== MYTHICMOBS BASIC SYNTAX ===

**MOBS Configuration:**
\`\`\`yaml
INTERNAL_NAME:
  Type: ZOMBIE
  Display: '&c&lDisplay Name'
  Health: 500
  Damage: 15
  Armor: 10
  Disguise:
    Type: PLAYER
    Player: Herobrine
    Skin: Herobrine
  Options:
    MovementSpeed: 0.3
    FollowRange: 32
    KnockbackResistance: 0.5
    PreventOtherDrops: true
    PreventSlimeSplit: true
    Silent: false
  AITargetSelectors:
  - 0 clear
  - 1 attacker
  - 2 players
  AIGoalSelectors:
  - 0 clear
  - 1 meleeattack
  - 2 randomstroll
  Skills:
  - skill{s=SKILL_NAME} @target ~onTimer:100
  - skill{s=ATTACK_SKILL} @target ~onAttack
  - skill{s=DAMAGED_SKILL} @self ~onDamaged
  Drops:
  - DIAMOND 1-3 1.0
  - exp 100-200 1.0
\`\`\`

**SKILLS Configuration:**
\`\`\`yaml
SKILL_NAME:
  Cooldown: 10
  Conditions:
  - distance{d=<10} true
  - incombat true
  TargetConditions:
  - health{h=>20%} true
  Skills:
  - message{m="&e<caster.name> &fuses skill!"} @PIR{r=30}
  - effect:sound{s=entity.ender_dragon.growl;v=1.5;p=1} @self
  - effect:particles{p=flame;a=50;hs=2;vs=2;s=0.5;repeat=20;repeati=1} @self
  - damage{amount=15;ignoreArmor=false} @target
  - throw{velocity=5;velocityY=2} @target
  - delay 10
  - potion{type=SLOW;duration=100;level=1} @target
\`\`\`

**Key Mechanics:**
- **damage{amount=X;ignoreArmor=true}** - Deal damage
- **projectile{v=10;i=1;hs=true}** - Launch projectile
- **summon{type=MOB;amount=3}** - Summon entities
- **teleport{}** - Teleport to target
- **throw{velocity=5;velocityY=2}** - Knockback
- **potion{type=SLOW;duration=100;level=1}** - Apply effect
- **effect:particles{p=FLAME;a=20}** - Particle effects
- **effect:sound{s=SOUND_NAME;v=1;p=1}** - Play sound
- **heal{amount=50}** - Heal entity
- **threat{amount=500}** - Aggro manipulation

**Targeters:**
- **@self** - Caster itself
- **@target** - Current target
- **@trigger** - Entity that triggered skill
- **@PIR{r=10}** - Players in radius 10
- **@EIR{r=10}** - All entities in radius
- **@MIR{r=20;types=MOB_TYPE}** - Mobs in radius by type
- **@Ring{r=8;p=8}** - Circle of 8 points, radius 8
- **@Forward{f=5}** - 5 blocks forward
- **@Line{r=10;p=5}** - Line pattern
- **@Cone{a=90;r=10;p=8}** - Cone pattern

**Triggers:**
- **~onTimer:100** - Every 5 seconds (20 ticks = 1s)
- **~onAttack** - When attacking entity
- **~onDamaged** - When taking damage
- **~onSpawn** - When spawned
- **~onDeath** - When dying
- **~onCombat** - When entering combat
- **~onTargetChange** - When changing target

**Conditions:**
- **distance{d=<10}** - Distance less than 10
- **health{h=>50%}** - Health above 50%
- **incombat** - Is in combat
- **stance{s=STANCE_NAME}** - Has specific stance
- **wearing{s=DIAMOND_HELMET}** - Wearing item

=== VARIABLES SYSTEM ===
Track state with variables:
\`\`\`yaml
# Set variable
- setvar{var=caster.phase;val=1;type=INTEGER} @self ~onSpawn
- setvar{var=caster.enraged;val=false;type=STRING} @self
- setvar{var=caster.combo;val=0;duration=100} @self  # Temporary

# Math operations
- variableMath{var=caster.counter;operation=ADD;value=1} @self
- variableAdd{var=caster.damage_taken;amount=10} @self

# Check variable in conditions
- varequals{var=caster.phase;val=2} true
- variableInRange{var=caster.combo;val=>3} true

# Use in skills
- skill{s=PHASE2_SKILL} @self ?varequals{var=caster.phase;val=2}
- damage{a=20} @target ?varequals{var=caster.enraged;val=true}
\`\`\`

=== AI MODULES ===
\`\`\`yaml
Modules:
  ThreatTable: true
  ImmunityTable: true

# Threat manipulation
- threat{amount=500} @trigger  # Increase aggro
- threatdrop{amount=100} @targeter  # Decrease aggro
- taunt @trigger  # Force aggro
\`\`\`

${category === 'boss_dungeon' ? `
=== BOSS + DUNGEON STRUCTURE ===
Create:
1. Main boss: BOSS_NAME
2. Minion 1: BOSS_NAME_MINION_1 
3. Minion 2: BOSS_NAME_MINION_2

Boss can summon minions:
\`\`\`yaml
- summon{type=BOSS_NAME_MINION_1;amount=2} @ring{r=8;p=2}
\`\`\`

Minions should support boss (heal, buff, protect).
` : ''}`;
}