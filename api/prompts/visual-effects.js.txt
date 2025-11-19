// ============================================
// MODULE: Visual Effects & Spawn Mechanics
// FILE: api/prompts/visual-effects.js
// ============================================

export function getVisualEffectPrompts(options) {
    let prompts = '';
    
    if (options.spawnAuraEffect) {
        prompts += getSpawnAuraPrompt();
    }
    
    if (options.spawnHologram) {
        prompts += getHologramPrompt();
    }
    
    if (options.summonMechanic) {
        prompts += getSummonMechanicPrompt(options.summonMethod);
    }
    
    return prompts;
}

function getSpawnAuraPrompt() {
    return `
=== SPAWN AURA/CIRCLE EFFECT (ENABLED) ===
Generate custom spawn animation with particle effects:

**Requirements:**
- Create visual buildup BEFORE mob fully spawns (2-5 seconds)
- Use particle effects to create patterns (circle, spiral, explosion, etc)
- Match visual theme to mob's element/type from description
- Add sound effects for dramatic effect

**Pattern Ideas (AI should choose based on mob theme):**
- **Magic Circle:** Rotating ring of particles at ground level
- **Energy Buildup:** Particles converging to spawn point
- **Ritual Pattern:** Complex geometric shapes
- **Elemental Burst:** Element-themed explosion (fire, ice, lightning, shadow)
- **Portal Opening:** Portal/ender particles with swirl effect
- **Divine Descent:** Light beams from sky with holy particles

**Implementation Template:**
\`\`\`yaml
MOB_SPAWN_AURA:
  Skills:
  # Phase 1: Pre-spawn buildup (0-2 seconds)
  - particles{p=PARTICLE_TYPE;a=50;repeat=40;repeati=1;hs=3;vs=0} @origin
  - particles{p=PARTICLE_TYPE;a=30;repeat=40;repeati=1} @ring{r=3;p=12;y=0}
  - sound{s=SOUND_TYPE;v=1;p=0.8} @origin
  
  # Phase 2: Intensify (2-3 seconds)
  - particles{p=PARTICLE_TYPE;a=100;repeat=20;repeati=1;hs=5;vs=1} @origin
  - particles{p=flame;a=50;repeat=20;repeati=1} @ring{r=2;p=8;y=0.5}
  - sound{s=block.portal.trigger;v=1.5;p=1} @origin
  - delay 20
  
  # Phase 3: Spawn burst (3-4 seconds)
  - particles{p=explosion;a=200} @origin
  - particles{p=PARTICLE_TYPE;a=300;hs=5;vs=5} @origin
  - sound{s=entity.wither.spawn;v=2;p=0.5} @origin
  - recoil{r=20;pitch=-0.5} @PIR{r=32}
  
  # Phase 4: Aftermath glow
  - particles{p=PARTICLE_TYPE;a=20;repeat=20;repeati=2} @self
\`\`\`

**Particle Suggestions by Element:**
- Fire: flame, lava, smoke
- Ice: snowflake, item_snowball, reddust (cyan)
- Lightning: electric_spark, crit, end_rod
- Shadow/Dark: smoke, squid_ink, portal
- Holy/Light: firework, enchantment_table, end_rod (white)
- Nature: leaf, composter, happy_villager
- Blood/Curse: reddust (red), drip_lava, crimson_spore

**Sound Suggestions:**
- Dramatic: entity.wither.spawn, entity.ender_dragon.growl
- Magical: block.portal.trigger, block.enchantment_table.use
- Elemental: entity.lightning_bolt.thunder, block.fire.ambient
- Holy: block.bell.use, entity.player.levelup

IMPORTANT: Choose particles and sounds that match the mob's theme!
`;
}

function getHologramPrompt() {
    return `
=== HOLOGRAM NAME/TITLE (ENABLED) ===
Add floating holographic text above mob on spawn:

**Requirements:**
- Display mob title/name with dramatic entrance
- Optional subtitle (role, warning message)
- Animated appearance effect
- Visible from distance

**Note:** MythicMobs doesn't have native holograms. Suggest alternatives:

**Method 1: Enhanced Display Name (Simple)**
\`\`\`yaml
MOB_NAME:
  Display: '&c&l⚔ BOSS TITLE ⚔'
  Options:
    CustomNameVisible: true
    AlwaysShowName: true
\`\`\`

**Method 2: Title/Actionbar Messages (Recommended)**
\`\`\`yaml
HOLOGRAM_ANNOUNCE:
  Skills:
  - title{t="&c&lBOSS NAME";st="&7The Destroyer";fadein=20;stay=60;fadeout=20} @PIR{r=50}
  - actionbar{m="&c⚠ A powerful enemy has appeared!"} @PIR{r=50}
  - sound{s=entity.ender_dragon.growl;v=2} @PIR{r=50}
\`\`\`

**Method 3: Particle Text Effect (Visual)**
\`\`\`yaml
PARTICLE_TEXT:
  Skills:
  # Create text-like particle pattern above mob
  - particles{p=enchantment_table;a=100;hs=2;vs=2;y=3;repeat=60;repeati=2} @self
  - particles{p=end_rod;a=50;hs=1.5;vs=0;y=3.5;repeat=60;repeati=2} @self
\`\`\`

**Method 4: Armor Stand Title (Advanced)**
Note: Requires additional mob for hologram entity
\`\`\`yaml
HOLOGRAM_STAND:
  Type: ARMOR_STAND
  Display: '&c&lBOSS NAME\\n&7Level 100'
  Options:
    Invisible: true
    Marker: true
    CustomNameVisible: true
  Skills:
  - mount{} @parent  # Mount on boss mob
\`\`\`

**Setup Guide Note:**
Recommend using HolographicDisplays or DecentHolograms plugin for proper holograms.
Include integration guide in setup_guide section.
`;
}

function getSummonMechanicPrompt(method) {
    const methodGuide = getSummonMethodGuide(method || 'proximity_trigger');
    
    return `
=== CUSTOM SUMMON MECHANIC (ENABLED) ===
Summon Method: ${(method || 'proximity_trigger').toUpperCase().replace('_', ' ')}

Create custom summoning mechanic instead of direct /mm spawn:

${methodGuide}

**General Requirements:**
- Clear visual/audio feedback when summon triggers
- Prevent spam with cooldowns or one-time use
- Player-friendly error messages if conditions not met
- Match summon aesthetic to mob theme

**Setup Guide Section:**
Include detailed instructions:
1. How to place/create spawner
2. What items/conditions needed
3. Cooldown/respawn mechanics
4. Troubleshooting common issues
`;
}

function getSummonMethodGuide(method) {
    const guides = {
        proximity_trigger: `
**PROXIMITY TRIGGER METHOD:**
Boss spawns when player enters radius (Best for dungeon/arena)

\`\`\`yaml
# Create invisible spawner at arena entrance/center
BOSS_SPAWNER:
  Type: ARMOR_STAND
  Display: '&c&l[Boss Spawner]'
  Health: 1
  Options:
    Invisible: true
    Invulnerable: true
    Marker: true
    Silent: true
    Despawn: false
  Skills:
  - skill{s=SPAWNER_INIT} @self ~onSpawn
  - skill{s=CHECK_PROXIMITY} @self ~onTimer:20

# Initialize spawner variables
SPAWNER_INIT:
  Skills:
  - setvar{var=caster.spawned;val=false;type=STRING} @self
  - setvar{var=caster.cooldown;val=false;type=STRING} @self

# Check for nearby players
CHECK_PROXIMITY:
  Conditions:
  - varequals{var=caster.spawned;val=false} true
  - varequals{var=caster.cooldown;val=false} true
  - mobsinworld{t=BOSS_NAME;a=0} true  # Boss not already alive
  TargetConditions:
  - playerwithin{d=10} true  # Adjust radius: 5-20 blocks
  Skills:
  # Mark as triggered
  - setvar{var=caster.spawned;val=true} @self
  
  # Warning phase (1 second)
  - message{m="&c&l⚠ WARNING! You entered the boss arena!"} @PIR{r=30}
  - sound{s=block.bell.use;v=2;p=0.5} @PIR{r=30}
  - particles{p=reddust;c=#FF0000;a=100;repeat=20;repeati=1} @ring{r=8;p=16;y=0}
  - delay 20
  
  # Buildup phase (2 seconds)
  - message{m="&e&lSomething is awakening..."} @PIR{r=30}
  - particles{p=portal;a=100;repeat=40;repeati=1;hs=3;vs=3} @self
  - particles{p=flame;a=50;repeat=40;repeati=1} @ring{r=5;p=12;y=0}
  - sound{s=entity.wither.ambient;v=1.5;p=0.8} @self
  - delay 40
  
  # Spawn burst
  - summon{type=BOSS_NAME;l=@self} @self
  - particles{p=explosion;a=200} @self
  - particles{p=flame;a=300;hs=5;vs=5} @self
  - sound{s=entity.wither.spawn;v=2;p=0.5} @self
  - sound{s=entity.ender_dragon.growl;v=2;p=0.8;delay=10} @self
  - recoil{r=30;pitch=-0.8} @PIR{r=32}
  - message{m="&c&l<caster.name> HAS BEEN SUMMONED!"} @PIR{r=50}
  
  # Start cooldown (5 minutes = 6000 ticks)
  - setvar{var=caster.cooldown;val=true} @self
  - setvar{var=caster.cooldown;val=false;delay=6000} @self
  - setvar{var=caster.spawned;val=false;delay=6000} @self
\`\`\`

**Radius Recommendations:**
- Tight trigger (dungeon door): d=3-5
- Small arena: d=8-10
- Medium arena: d=12-15
- Large arena: d=18-20

**Optional Enhancements:**

1. **Countdown Timer:**
\`\`\`yaml
- message{m="&eBoss spawning in 5..."} @PIR{r=30}
- sound{s=block.note_block.pling;p=0.5} @PIR{r=30}
- delay 20
- message{m="&e4..."} @PIR{r=30}
- delay 20
- message{m="&e3..."} @PIR{r=30}
- delay 20
- message{m="&c2..."} @PIR{r=30}
- delay 20
- message{m="&c&l1..."} @PIR{r=30}
- delay 20
\`\`\`

2. **Arena Lock (Trap players inside):**
\`\`\`yaml
# After boss spawn
- blockmask{m=BARRIER;r=15;d=5;na=false;oa=false} @ring{r=15;p=32;y=0}
- message{m="&c&lThe arena is sealed!"} @PIR{r=30}

# Remove barriers on boss death (add to boss mob)
~onDeath:
- blockmask{m=AIR;r=15;d=5} @origin
\`\`\`

3. **Multi-Stage Activation:**
\`\`\`yaml
# Stage 1: Far warning
- message{m="&7You feel a dark presence..."} @PIR{r=20} ?playerwithin{d=15}
# Stage 2: Close warning
- message{m="&eSomething stirs..."} @PIR{r=15} ?playerwithin{d=10}
# Stage 3: Spawn
- summon{type=BOSS} @self ?playerwithin{d=5}
\`\`\`
`,

        item_interact: `
**ITEM RIGHT-CLICK METHOD:**
Player uses special item to summon boss

\`\`\`yaml
# Items.yml
BOSS_SUMMON_TOKEN:
  Id: NETHER_STAR
  Display: '&c&lBoss Summon Token'
  Lore:
  - '&7Right-click to summon the boss'
  - '&7Use in designated arena only'
  - ''
  - '&c&lWARNING: DANGEROUS!'
  Options:
    Unbreakable: true
  Skills:
  - skill{s=SUMMON_BOSS_ITEM} @selflocation ~onUse

SUMMON_BOSS_ITEM:
  Conditions:
  # Optional: Check if in arena area
  - altitude{a=>50;a=<100} true
  - mobsinworld{t=BOSS_NAME;a=0} true
  Skills:
  # Consume item
  - remove @self
  
  # Summon sequence
  - message{m="&c&lSummoning ritual started!"} @trigger
  - particles{p=portal;a=200;repeat=60;repeati=1} @origin
  - sound{s=block.portal.trigger;v=2} @origin
  - delay 60
  - summon{type=BOSS_NAME;l=@origin} @origin
  - particles{p=explosion;a=300} @origin
  - sound{s=entity.wither.spawn;v=2} @origin
  - message{m="&c<caster.name> has been summoned!"} @PIR{r=50}
\`\`\`

**How to Give Item:**
/mm items give BOSS_SUMMON_TOKEN 1 [player]
`,

        armor_stand: `
**ARMOR STAND + ITEM METHOD:**
Place item on armor stand "altar" to summon

\`\`\`yaml
# Create altar/pedestal
BOSS_ALTAR:
  Type: ARMOR_STAND
  Display: '&5&l[Summoning Altar]\\n&7Place Diamond to activate'
  Health: 1
  Options:
    Invisible: false
    Invulnerable: true
    Marker: false
    PreventOtherDrops: true
    Despawn: false
  Equipment:
  - skull{player=MHF_Question} HEAD
  Skills:
  - skill{s=CHECK_ALTAR} @self ~onInteract

CHECK_ALTAR:
  TargetConditions:
  - holding{m=DIAMOND} true
  - mobsinworld{t=BOSS_NAME;a=0} true
  Skills:
  # Consume diamond
  - consume{m=DIAMOND;a=1} @trigger
  
  # Ritual animation
  - message{m="&5The altar accepts your offering..."} @trigger
  - particles{p=enchantment_table;a=100;repeat=60;repeati=1} @self
  - particles{p=portal;a=50;repeat=60;repeati=1} @ring{r=3;p=8;y=0}
  - sound{s=block.enchantment_table.use;v=2} @self
  - delay 60
  
  # Summon boss
  - summon{type=BOSS_NAME;l=@self} @self
  - particles{p=explosion;a=200} @self
  - sound{s=entity.wither.spawn;v=2} @self
  - message{m="&c&lThe boss has been summoned!"} @PIR{r=50}
  
  # Remove altar (one-time use)
  - remove{delay=40} @self
\`\`\`

**Alternative: Reusable Altar with Cooldown:**
Add cooldown variable instead of removing altar
`,

        block_ritual: `
**BLOCK RITUAL PATTERN METHOD:**
Complex ritual pattern activation

\`\`\`yaml
# Central ritual activator
RITUAL_CENTER:
  Type: ARMOR_STAND
  Display: '&5&l[Ritual Circle]\\n&7Place Nether Star to activate'
  Options:
    Invisible: true
    Marker: true
    Invulnerable: true
  Skills:
  - skill{s=CHECK_RITUAL} @self ~onInteract

CHECK_RITUAL:
  TargetConditions:
  - holding{m=NETHER_STAR} true
  - mobsinworld{t=BOSS_NAME;a=0} true
  Skills:
  # Consume catalyst
  - consume{m=NETHER_STAR;a=1} @trigger
  
  # Ritual activation sequence
  - message{m="&5&lThe ritual circle activates!"} @PIR{r=30}
  
  # Ring animations (expanding circles)
  - particles{p=portal;a=100;repeat=20;repeati=1} @ring{r=2;p=8;y=0}
  - sound{s=block.portal.ambient;v=1;p=0.8} @self
  - delay 10
  - particles{p=enchantment_table;a=150;repeat=20;repeati=1} @ring{r=4;p=12;y=0}
  - delay 10
  - particles{p=flame;a=200;repeat=20;repeati=1} @ring{r=6;p=16;y=0}
  - sound{s=block.portal.trigger;v=1.5;p=1} @self
  - delay 10
  - particles{p=end_rod;a=250;repeat=20;repeati=1} @ring{r=8;p=20;y=0}
  - delay 10
  
  # Convergence
  - particles{p=portal;a=500;hs=8;vs=3} @self
  - particles{p=explosion;a=100} @self
  - sound{s=entity.lightning_bolt.thunder;v=2} @self
  - recoil{r=25;pitch=-1} @PIR{r=32}
  - delay 20
  
  # Spawn boss
  - summon{type=BOSS_NAME;l=@self} @self
  - particles{p=explosion;a=300;hs=5;vs=5} @self
  - sound{s=entity.wither.spawn;v=2;p=0.5} @self
  - message{m="&c&l<mob.name> EMERGES FROM THE RITUAL!"} @PIR{r=50}
  
  # Cooldown (10 minutes)
  - setvar{var=caster.cooldown;val=true} @self
  - setvar{var=caster.cooldown;val=false;delay=12000} @self
\`\`\`

**Ritual Pattern Blocks (Manual setup):**
Build a pattern around ritual center:
- Circle of glowstone/sea lanterns
- Redstone pattern on ground
- Candles/torches at cardinal points
- Obsidian pillars with nether stars
`
    };
    
    return guides[method] || guides.proximity_trigger;
}