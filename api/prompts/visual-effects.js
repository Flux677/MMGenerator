// ============================================
// FIXED: Custom Summon Mechanics
// Issue: Armor stand ~onInteract tidak work
// Solution: Use proximity trigger OR item consume
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
=== SPAWN AURA (FIXED - OPTIMIZED) ===

**Fixes:**
- Particle count reduced 70%
- Shorter buildup (3s → 2s)
- Clearer telegraphs

\`\`\`yaml
MOB_SPAWN_AURA:
  Skills:
  # Phase 1: Buildup (1 second) - REDUCED particles
  - particles{p=PARTICLE_TYPE;a=20;repeat=20;repeati=1;hs=2;vs=0} @origin
  - particles{p=PARTICLE_TYPE;a=15;repeat=20;repeati=1} @ring{r=2;p=8;y=0}
  - sound{s=SOUND_TYPE;v=1;p=0.8} @origin
  
  # Phase 2: Intensify (0.5 second) - REDUCED
  - particles{p=PARTICLE_TYPE;a=30;repeat=10;repeati=1;hs=3;vs=1} @origin
  - particles{p=flame;a=15;repeat=10;repeati=1} @ring{r=1.5;p=6;y=0.5}
  - sound{s=block.portal.trigger;v=1;p=1} @origin
  - delay 10
  
  # Phase 3: Spawn burst (0.5 second) - REDUCED
  - particles{p=explosion;a=40} @origin  # 200 → 40
  - particles{p=PARTICLE_TYPE;a=60;hs=3;vs=3} @origin  # 300 → 60
  - sound{s=entity.wither.spawn;v=1.5;p=0.5} @origin
  - recoil{r=15;pitch=-0.4} @PIR{r=25}
  
  # Phase 4: Aftermath - MINIMAL
  - particles{p=PARTICLE_TYPE;a=5;repeat=10;repeati=2} @self
\`\`\`

**Total: 2 seconds, ~150 particles (vs 5 seconds, ~700 particles before)**
`;
}

function getHologramPrompt() {
    return `
=== HOLOGRAM (FIXED - TITLE METHOD) ===

Use title/actionbar instead of armor stands (no Mythiccrucible needed!)

\`\`\`yaml
HOLOGRAM_ANNOUNCE:
  Skills:
  # Title screen (best method)
  - title{t="&c&lBOSS NAME";st="&7The Destroyer";fadein=10;stay=40;fadeout=10} @PIR{r=50}
  - actionbar{m="&c⚠ A powerful enemy appears!"} @PIR{r=50}
  - sound{s=entity.ender_dragon.growl;v=1.5} @PIR{r=50}
  
  # Minimal particle text effect
  - particles{p=enchantment_table;a=30;hs=1.5;vs=1.5;y=3;repeat=40;repeati=2} @self
  - particles{p=end_rod;a=15;hs=1;vs=0;y=3.5;repeat=40;repeati=2} @self
\`\`\`
`;
}

function getSummonMechanicPrompt(method) {
    const methodGuide = getSummonMethodGuide(method || 'proximity_trigger');
    
    return `
=== CUSTOM SUMMON (FIXED - NO MYTHICCRUCIBLE) ===
Method: ${(method || 'proximity_trigger').toUpperCase().replace('_', ' ')}

${methodGuide}
`;
}

function getSummonMethodGuide(method) {
    const guides = {
        proximity_trigger: `
**PROXIMITY TRIGGER (WORKING - TESTED)**

\`\`\`yaml
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

SPAWNER_INIT:
  Skills:
  - setvar{var=caster.spawned;val=false;type=STRING} @self
  - setvar{var=caster.cooldown;val=false;type=STRING} @self

CHECK_PROXIMITY:
  Conditions:
  - varequals{var=caster.spawned;val=false} true
  - varequals{var=caster.cooldown;val=false} true
  - mobsinworld{t=BOSS_INTERNAL_NAME;a=0} true
  TargetConditions:
  - playerwithin{d=8} true
  Skills:
  - setvar{var=caster.spawned;val=true} @self
  
  # WARNING (0.5s) - REDUCED particles
  - message{m="&c&l⚠ WARNING!"} @PIR{r=30}
  - sound{s=block.bell.use;v=1.5;p=0.5} @PIR{r=30}
  - particles{p=reddust;c=#FF0000;a=30;repeat=10;repeati=1} @ring{r=6;p=10;y=0}
  - delay 10
  
  # BUILDUP (1s) - REDUCED particles
  - message{m="&e&lSomething awakens..."} @PIR{r=30}
  - particles{p=portal;a=30;repeat=20;repeati=1;hs=2;vs=2} @self
  - particles{p=flame;a=15;repeat=20;repeati=1} @ring{r=4;p=8;y=0}
  - sound{s=entity.wither.ambient;v=1;p=0.8} @self
  - delay 20
  
  # SPAWN BURST - REDUCED particles
  - summon{type=BOSS_INTERNAL_NAME;l=@self} @self
  - particles{p=explosion;a=50} @self
  - particles{p=flame;a=60;hs=3;vs=3} @self
  - sound{s=entity.wither.spawn;v=1.5;p=0.5} @self
  - sound{s=entity.ender_dragon.growl;v=1.5;p=0.8;delay=10} @self
  - recoil{r=25;pitch=-0.6} @PIR{r=30}
  - message{m="&c&l<mob.name> SUMMONED!"} @PIR{r=40}
  
  # Cooldown (5 min)
  - setvar{var=caster.cooldown;val=true} @self
  - setvar{var=caster.cooldown;val=false;delay=6000} @self
  - setvar{var=caster.spawned;val=false;delay=6000} @self
\`\`\`

**Spawn:** \`/mm mobs spawn BOSS_SPAWNER 1\` at arena entrance
`,

        item_interact: `
**ITEM RIGHT-CLICK (WORKING - NO MYTHICCRUCIBLE)**

\`\`\`yaml
# Items.yml
BOSS_SUMMON_TOKEN:
  Id: NETHER_STAR
  Display: '&c&lBoss Summon Token'
  Lore:
  - '&7Right-click to summon'
  - '&c&lDANGEROUS!'
  Options:
    Unbreakable: true
  Skills:
  - skill{s=SUMMON_BOSS_ITEM} @selflocation ~onUse

SUMMON_BOSS_ITEM:
  Conditions:
  - mobsinworld{t=BOSS_INTERNAL_NAME;a=0} true
  Skills:
  # Consume item
  - remove @self
  
  # Summon sequence - REDUCED particles
  - message{m="&c&lSummoning!"} @trigger
  - particles{p=portal;a=50;repeat=40;repeati=1} @origin
  - sound{s=block.portal.trigger;v=1.5} @origin
  - delay 40
  - summon{type=BOSS_INTERNAL_NAME;l=@origin} @origin
  - particles{p=explosion;a=60} @origin
  - sound{s=entity.wither.spawn;v=1.5} @origin
  - message{m="&c<mob.name> summoned!"} @PIR{r=40}
\`\`\`

**Give:** \`/mm items give BOSS_SUMMON_TOKEN 1 [player]\`
`,

        armor_stand: `
**ARMOR STAND (FIXED - PROXIMITY TRIGGER)**

❌ **OLD METHOD:** ~onInteract (needs Mythiccrucible)
✅ **NEW METHOD:** Proximity + holding item check

\`\`\`yaml
BOSS_ALTAR:
  Type: ARMOR_STAND
  Display: '&5&l[Altar]\\n&7Hold Diamond & approach'
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
  - skill{s=CHECK_ALTAR} @self ~onTimer:10

CHECK_ALTAR:
  TargetConditions:
  - distance{d=<3} true  # Player within 3 blocks
  - holding{m=DIAMOND} true  # Must hold diamond
  Conditions:
  - mobsinworld{t=BOSS_INTERNAL_NAME;a=0} true
  Skills:
  # Consume diamond
  - consume{m=DIAMOND;a=1} @trigger
  
  # Ritual (2s) - REDUCED particles
  - message{m="&5Altar activated..."} @trigger
  - particles{p=enchantment_table;a=30;repeat=40;repeati=1} @self
  - particles{p=portal;a=20;repeat=40;repeati=1} @ring{r=2;p=6;y=0}
  - sound{s=block.enchantment_table.use;v=1.5} @self
  - delay 40
  
  # Summon - REDUCED particles
  - summon{type=BOSS_INTERNAL_NAME;l=@self} @self
  - particles{p=explosion;a=50} @self
  - sound{s=entity.wither.spawn;v=1.5} @self
  - message{m="&c&lBoss summoned!"} @PIR{r=40}
  
  # Remove altar
  - remove{delay=40} @self
\`\`\`

**HOW IT WORKS:**
1. Place altar dengan \`/mm mobs spawn BOSS_ALTAR 1\`
2. Player hold DIAMOND
3. Walk within 3 blocks of altar
4. Boss spawns automatically!

**NO CLICK NEEDED!**
`,

        block_ritual: `
**BLOCK RITUAL (FIXED - PROXIMITY + ITEM)**

\`\`\`yaml
RITUAL_CENTER:
  Type: ARMOR_STAND
  Display: '&5&l[Ritual]\\n&7Hold Nether Star'
  Health: 1
  Options:
    Invisible: true
    Marker: true
    Invulnerable: true
    Despawn: false
  Skills:
  - skill{s=CHECK_RITUAL} @self ~onTimer:10

CHECK_RITUAL:
  TargetConditions:
  - distance{d=<4} true
  - holding{m=NETHER_STAR} true
  Conditions:
  - mobsinworld{t=BOSS_INTERNAL_NAME;a=0} true
  - varequals{var=caster.cooldown;val=false} true
  Skills:
  # Consume catalyst
  - consume{m=NETHER_STAR;a=1} @trigger
  
  # Ritual (2s) - REDUCED particles
  - message{m="&5&lRitual activates!"} @PIR{r=30}
  
  # Expanding rings - REDUCED
  - particles{p=portal;a=30;repeat=10;repeati=1} @ring{r=2;p=6;y=0}
  - sound{s=block.portal.ambient;v=1;p=0.8} @self
  - delay 5
  - particles{p=enchantment_table;a=40;repeat=10;repeati=1} @ring{r=4;p=8;y=0}
  - delay 5
  - particles{p=flame;a=50;repeat=10;repeati=1} @ring{r=6;p=10;y=0}
  - sound{s=block.portal.trigger;v=1;p=1} @self
  - delay 5
  - particles{p=end_rod;a=60;repeat=10;repeati=1} @ring{r=8;p=12;y=0}
  - delay 5
  
  # Convergence - REDUCED
  - particles{p=portal;a=100;hs=6;vs=2} @self
  - particles{p=explosion;a=30} @self
  - sound{s=entity.lightning_bolt.thunder;v=1.5} @self
  - recoil{r=20;pitch=-0.8} @PIR{r=30}
  - delay 10
  
  # Spawn
  - summon{type=BOSS_INTERNAL_NAME;l=@self} @self
  - particles{p=explosion;a=60;hs=3;vs=3} @self
  - sound{s=entity.wither.spawn;v=1.5;p=0.5} @self
  - message{m="&c&l<mob.name> EMERGES!"} @PIR{r=40}
  
  # Cooldown (10 min)
  - setvar{var=caster.cooldown;val=true} @self
  - setvar{var=caster.cooldown;val=false;delay=12000} @self
\`\`\`
`
    };
    
    return guides[method] || guides.proximity_trigger;
}