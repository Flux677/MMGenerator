// ============================================
// MODULE: Healing Tower System (NEW)
// FILE: api/prompts/healing-tower.js
// ============================================

export function getHealingTowerPrompts(config) {
    const healPowerValues = {
        weak: { amount: 5, description: '5 HP/sec' },
        medium: { amount: 10, description: '10 HP/sec' },
        strong: { amount: 20, description: '20 HP/sec' },
        extreme: { amount: 50, description: '50 HP/sec' }
    };
    
    const healPower = healPowerValues[config.towerHealPower] || healPowerValues.medium;
    const respawnEnabled = config.towerRespawn !== 'false';
    const respawnTime = respawnEnabled ? parseInt(config.towerRespawn) * 20 : 0; // Convert to ticks
    
    return `
=== HEALING TOWER SYSTEM (ENABLED) ===
Create destructible healing towers that auto-heal the boss.

**Configuration:**
- Tower Count: ${config.towerCount}
- Heal Power: ${healPower.description}
- Tower HP: ${config.towerHP}
- Respawn: ${respawnEnabled ? config.towerRespawn + ' seconds' : 'Disabled'}

**Requirements:**
- Towers spawn automatically in radius 20 blocks from boss on spawn
- Towers heal boss every second (20 ticks)
- Players can destroy towers to stop healing
- Visual heal beam effect from tower to boss
- Tower death triggers message to players
${respawnEnabled ? `- Towers respawn after ${config.towerRespawn} seconds with visual effect` : ''}

**Implementation:**

\`\`\`yaml
# ======================================
# HEALING TOWER MOB
# ======================================
BOSS_HEALING_TOWER:
  Type: ARMOR_STAND
  Display: '&a&l❤ Healing Tower ❤'
  Health: ${config.towerHP}
  Options:
    Invisible: false
    Invulnerable: false
    PreventOtherDrops: true
    CustomNameVisible: true
    AlwaysShowName: true
    Silent: false
    Despawn: false
  Equipment:
  - END_ROD HAND
  Skills:
  # Initialize tower
  - skill{s=TOWER_INIT} @self ~onSpawn
  # Healing pulse every second
  - skill{s=TOWER_HEAL_BOSS} @self ~onTimer:20
  # Death effects
  - skill{s=TOWER_DEATH} @self ~onDeath

# ======================================
# TOWER SKILLS
# ======================================

# Initialize tower variables
TOWER_INIT:
  Skills:
  - setvar{var=caster.tower_active;val=true} @self
  - setvar{var=caster.boss_nearby;val=false} @self
  - particles{p=heart;a=50;hs=2;vs=2;y=2} @self
  - particles{p=happy_villager;a=30} @ring{r=2;p=8;y=0}
  - sound{s=block.beacon.activate;v=1;p=1.2} @self
  - message{m="&a&l⚠ Healing Tower activated! Destroy it to stop healing!"} @PIR{r=40}

# Heal boss every second
TOWER_HEAL_BOSS:
  Conditions:
  - varequals{var=caster.tower_active;val=true}
  - mobsinradius{r=30;types=BOSS_TYPE;a=>1} true  # Boss nearby
  TargetConditions:
  - distance{d=<30} true
  Skills:
  # Heal the boss
  - heal{a=${healPower.amount}} @MIR{r=30;types=BOSS_TYPE;limit=1;sort=NEAREST}
  # Visual heal beam effect
  - particles{p=heart;a=10;y=2} @self
  - particles{p=end_rod;a=15;hs=0.3;vs=0.3;y=2} @self
  - particles{p=happy_villager;a=5} @MIR{r=30;types=BOSS_TYPE;limit=1}
  # Sound effect (subtle)
  - sound{s=block.beacon.ambient;v=0.3;p=1.5} @self

# Tower death effects
TOWER_DEATH:
  Skills:
  - setvar{var=caster.tower_active;val=false} @self
  - message{m="&c&l⚔ Healing Tower DESTROYED!"} @PIR{r=40}
  - particles{p=explosion;a=100;hs=3;vs=3} @self
  - particles{p=smoke;a=200;hs=5;vs=5} @self
  - sound{s=entity.generic.explode;v=2;p=0.8} @self
  - recoil{r=15;pitch=-0.5} @PIR{r=20}
  # Notify boss (optional: boss enrage when tower dies)
  - signal{s=TOWER_DESTROYED} @MIR{r=50;types=BOSS_TYPE}
${respawnEnabled ? `  # Respawn tower after delay
  - summon{type=BOSS_HEALING_TOWER;l=@origin;delay=${respawnTime}} @origin` : ''}

# ======================================
# BOSS INTEGRATION
# ======================================

# Add to BOSS mob configuration:
BOSS_NAME:
  # ... existing boss config ...
  Skills:
  # Spawn towers on boss spawn
  - skill{s=BOSS_SPAWN_TOWERS} @self ~onSpawn
  # Optional: React to tower destruction
  - skill{s=BOSS_TOWER_DESTROYED} @self ~onSignal:TOWER_DESTROYED

# Spawn healing towers around boss
BOSS_SPAWN_TOWERS:
  Skills:
  - message{m="&e<caster.name> activates healing towers!"} @PIR{r=50}
  - delay 20
  # Spawn ${config.towerCount} tower(s) in 20 block radius
${generateTowerSpawnCommands(config.towerCount)}
  # Visual effects
  - particles{p=enchantment_table;a=200} @self
  - sound{s=block.beacon.activate;v=2;p=0.8} @PIR{r=50}

# Optional: Boss reaction to tower death
BOSS_TOWER_DESTROYED:
  Skills:
  - message{m="&c<caster.name>: My tower! You'll pay for that!"} @PIR{r=40}
  # Optional: Buff boss when tower destroyed
  - potion{type=INCREASE_DAMAGE;d=100;l=1} @self
  - potion{type=SPEED;d=100;l=1} @self
\`\`\`

**Visual Enhancements:**
\`\`\`yaml
# Enhanced heal beam visual (alternative)
TOWER_HEAL_BEAM:
  Skills:
  # Create line of particles from tower to boss
  - particles{p=heart;a=5} @line{r=30;p=20;y=2}
  - particles{p=end_rod;a=10} @line{r=30;p=20;y=2}
\`\`\`

**Strategic Notes:**
- Towers spawn at ground level within 20 blocks of boss
- Players must prioritize towers or boss will sustain healing
- Tower HP ${config.towerHP} - adjust based on difficulty
- Heal power ${healPower.description} - can out-heal player DPS if ignored
${config.towerCount > 2 ? '- Multiple towers = HIGH healing output, priority targets!' : ''}
${respawnEnabled ? `- Towers respawn: Players must destroy repeatedly or rush boss` : '- No respawn: Destroy once and focus boss'}

**Boss Bar Integration (Optional):**
Add tower counter to boss bar title:
\`\`\`yaml
# Update boss bar with tower count
~onTimer:20
- barSet{
    name="BOSS";
    title="&c<caster.name> &7[Towers: <mob.count.BOSS_HEALING_TOWER>]"
  } @self
\`\`\`

CRITICAL: Towers MUST be destroyable by players! Set Invulnerable: false!
`;
}

function generateTowerSpawnCommands(count) {
    const commands = [];
    const radius = 20;
    
    for (let i = 0; i < count; i++) {
        // Distribute towers evenly in circle
        const angle = (360 / count) * i;
        commands.push(`  - summon{type=BOSS_HEALING_TOWER;l=@forward{f=${radius};ly=${angle}}} @self`);
    }
    
    return commands.join('\n');
}