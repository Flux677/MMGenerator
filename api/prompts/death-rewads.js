// ============================================
// MODULE: Boss Death Reward System (NEW)
// FILE: api/prompts/death-rewards.js
// ============================================

export function getDeathRewardPrompts(rewardType) {
    const rewards = {
        chest_spawn: getTreasureChestReward(),
        portal_spawn: getPortalSpawnReward(),
        npc_merchant: getNPCMerchantReward(),
        arena_transform: getArenaTransformReward(),
        buff_station: getBuffStationReward(),
        fireworks_celebration: getFireworksCelebrationReward()
    };
    
    return rewards[rewardType] || rewards.chest_spawn;
}

function getTreasureChestReward() {
    return `
=== DEATH REWARD: TREASURE CHEST SPAWN (ENABLED) ===
Spawn loot chest at boss death location.

**Mechanic:**
- Chest spawns at exact boss death coordinates
- Contains boss loot items
- Remains for 5 minutes then despawns
- Visual effects and fanfare
- Players can open and claim rewards

**Implementation:**
\`\`\`yaml
# Add to BOSS mob ~onDeath:
~onDeath:
- skill{s=BOSS_DEATH_CHEST} @origin

BOSS_DEATH_CHEST:
  Skills:
  # Announcement
  - message{m="&6&l✦ VICTORY! ✦"} @PIR{r=100}
  - message{m="&eA treasure chest has appeared!"} @PIR{r=100}
  # Visual buildup
  - particles{p=firework;a=200;hs=5;vs=10;y=2;repeat=60;repeati=1} @origin
  - particles{p=totem_of_undying;a=300;hs=3;vs=5} @origin
  - sound{s=entity.player.levelup;v=2;p=1} @PIR{r=50}
  - sound{s=ui.toast.challenge_complete;v=2;p=1;delay=10} @PIR{r=50}
  - delay 60
  # Spawn chest entity (armor stand with chest head)
  - summon{type=BOSS_LOOT_CHEST;l=@origin} @origin
  # Particle pillar effect
  - particles{p=end_rod;a=100;hs=0.5;vs=15;y=0} @origin
  - particles{p=enchantment_table;a=200} @ring{r=3;p=12;y=0}

# LOOT CHEST MOB
BOSS_LOOT_CHEST:
  Type: ARMOR_STAND
  Display: '&6&l⚜ Boss Treasure ⚜'
  Health: 1
  Options:
    Invisible: false
    Invulnerable: true
    Marker: false
    PreventOtherDrops: true
    CustomNameVisible: true
    AlwaysShowName: true
    Despawn: false
  Equipment:
  - CHEST HEAD
  Skills:
  # Glowing effect
  - particles{p=enchantment_table;a=20;repeat=6000;repeati=20;y=1} @self
  - particles{p=firework;a=5;repeat=6000;repeati=40;y=1} @self
  # Interaction
  - skill{s=CHEST_OPEN} @self ~onInteract
  # Auto-despawn after 5 minutes
  - remove{delay=6000} @self
  - message{m="&7The treasure chest fades away...";delay=6000} @PIR{r=30}

CHEST_OPEN:
  Skills:
  - message{m="&a<trigger.name> opened the treasure chest!"} @PIR{r=30}
  - particles{p=explosion;a=50} @self
  - particles{p=firework;a=100;hs=3;vs=3} @self
  - sound{s=block.chest.open;v=2} @self
  - sound{s=entity.player.levelup;v=1;p=1.5} @trigger
  # Give items to player
  - give{item=DIAMOND;amount=5} @trigger
  - give{item=EMERALD;amount=10} @trigger
  - give{item=BOSS_CUSTOM_ITEM} @trigger
  # Remove chest after opening
  - remove{delay=20} @self
\`\`\`
`;
}

function getPortalSpawnReward() {
    return `
=== DEATH REWARD: PORTAL SPAWN (ENABLED) ===
Portal spawns that teleports players to reward room.

**Mechanic:**
- Portal activates at boss death location
- Players can enter portal within 2 minutes
- Teleports to pre-built reward room coordinates
- Portal has swirling particle effect
- Auto-closes after time limit

**Implementation:**
\`\`\`yaml
~onDeath:
- skill{s=BOSS_DEATH_PORTAL} @origin

BOSS_DEATH_PORTAL:
  Skills:
  - message{m="&d&l✦ VICTORY! ✦"} @PIR{r=100}
  - message{m="&5A mysterious portal opens..."} @PIR{r=100}
  - particles{p=portal;a=500;hs=5;vs=10} @origin
  - sound{s=block.portal.trigger;v=2;p=0.8} @PIR{r=50}
  - delay 40
  # Spawn portal entity
  - summon{type=BOSS_REWARD_PORTAL;l=@origin} @origin

BOSS_REWARD_PORTAL:
  Type: ARMOR_STAND
  Display: '&5&l⚡ Reward Portal ⚡'
  Health: 1
  Options:
    Invisible: true
    Invulnerable: true
    Marker: true
    CustomNameVisible: true
    AlwaysShowName: true
    Despawn: false
  Skills:
  # Swirling portal effect
  - particles{p=portal;a=100;repeat=2400;repeati=2;hs=2;vs=3} @self
  - particles{p=end_rod;a=30;repeat=2400;repeati=5} @ring{r=2;p=8;y=1}
  - particles{p=enchantment_table;a=50;repeat=2400;repeati=10} @ring{r=3;p=12;y=0}
  - sound{s=block.portal.ambient;v=0.5;repeat=2400;repeati=100} @self
  # Teleport players who get close
  - skill{s=PORTAL_TELEPORT} @self ~onTimer:10
  # Close portal after 2 minutes
  - message{m="&5The portal begins to close...";delay=2200} @PIR{r=30}
  - remove{delay=2400} @self

PORTAL_TELEPORT:
  TargetConditions:
  - distance{d=<3} true
  Skills:
  - message{m="&d<trigger.name> enters the portal!"} @PIR{r=30}
  - particles{p=portal;a=200} @trigger
  - sound{s=entity.enderman.teleport;v=2} @trigger
  - teleport{world=world;x=0;y=100;z=0} @trigger  # SET YOUR REWARD ROOM COORDS!
  - particles{p=portal;a=200;delay=5} @trigger
  - message{m="&aWelcome to the Reward Room!";delay=10} @trigger
  - potion{type=REGENERATION;d=200;l=2;delay=20} @trigger

# NOTE: Setup reward room at coordinates first!
# Recommended: Build enclosed room with chests, decorations
# Coordinates example: x=0, y=100, z=0 (floating island)
\`\`\`
`;
}

function getNPCMerchantReward() {
    return `
=== DEATH REWARD: NPC MERCHANT SPAWN (ENABLED) ===
Merchant NPC spawns with exclusive victory trades.

**Mechanic:**
- Merchant villager spawns at boss location
- Offers exclusive items/trades
- Remains for 5 minutes
- Players can trade with victory currency
- Despawns with farewell message

**Implementation:**
\`\`\`yaml
~onDeath:
- skill{s=BOSS_DEATH_MERCHANT} @origin

BOSS_DEATH_MERCHANT:
  Skills:
  - message{m="&a&l✦ VICTORY! ✦"} @PIR{r=100}
  - message{m="&eA mysterious merchant appears..."} @PIR{r=100}
  - particles{p=enchantment_table;a=200;hs=3;vs=5} @origin
  - sound{s=entity.villager.celebrate;v=2;p=1} @PIR{r=50}
  - delay 40
  - summon{type=BOSS_VICTORY_MERCHANT;l=@origin} @origin

BOSS_VICTORY_MERCHANT:
  Type: VILLAGER
  Display: '&6&l⚜ Victory Merchant ⚜'
  Health: 50
  Options:
    Invulnerable: true
    Silent: false
    Despawn: false
    PreventOtherDrops: true
  Disguise:
    Type: VILLAGER
    Profession: CLERIC
  Skills:
  # Glowing effect
  - particles{p=happy_villager;a=10;repeat=6000;repeati=20} @self
  - particles{p=enchantment_table;a=15;repeat=6000;repeati=30;y=2} @self
  # Greet nearby players
  - skill{s=MERCHANT_GREET} @self ~onTimer:100
  # Give items on interaction
  - skill{s=MERCHANT_TRADE} @self ~onInteract
  # Despawn after 5 minutes
  - message{m="&eThe merchant prepares to leave...";delay=5800} @PIR{r=30}
  - particles{p=portal;a=200;delay=6000} @self
  - sound{s=entity.villager.no;v=1;delay=6000} @self
  - message{m="&7The merchant vanishes...";delay=6000} @PIR{r=30}
  - remove{delay=6020} @self

MERCHANT_GREET:
  TargetConditions:
  - distance{d=<8} true
  Skills:
  - message{m="&e[Merchant] Congratulations on your victory! Browse my wares!"} @trigger
  - sound{s=entity.villager.yes;v=1} @trigger

MERCHANT_TRADE:
  Skills:
  - message{m="&e[Merchant] Here, take this as reward!"} @trigger
  - sound{s=entity.villager.trade;v=1} @trigger
  - particles{p=happy_villager;a=30} @trigger
  # Give rewards (customize these!)
  - give{item=DIAMOND;amount=10} @trigger
  - give{item=EMERALD_BLOCK;amount=5} @trigger
  - give{item=ENCHANTED_GOLDEN_APPLE;amount=2} @trigger
  - give{item=BOSS_CUSTOM_WEAPON} @trigger
  # Can only trade once per player (use variable)
  - setvar{var=target.traded;val=true;duration=6000} @trigger

# NOTE: For actual villager trading GUI, use Citizens or Shopkeepers plugin
# This is simplified instant-give version
\`\`\`
`;
}

function getArenaTransformReward() {
    return `
=== DEATH REWARD: ARENA TRANSFORM (ENABLED) ===
Arena transforms after victory - platforms spawn, blocks change.

**Mechanic:**
- Arena undergoes dramatic transformation
- Spawn loot platforms around area
- Replace hazard blocks with safe blocks
- Create parkour/platforms to rewards
- Visual earthquake effect

**Implementation:**
\`\`\`yaml
~onDeath:
- skill{s=BOSS_DEATH_TRANSFORM} @origin

BOSS_DEATH_TRANSFORM:
  Skills:
  # Announcement
  - message{m="&a&l✦ VICTORY! ✦"} @PIR{r=100}
  - message{m="&eThe arena transforms..."} @PIR{r=100}
  # Earthquake effect
  - recoil{r=25;pitch=-0.8;repeat=10;repeati=5} @PIR{r=50}
  - sound{s=entity.wither.break_block;v=2;p=0.5;repeat=10;repeati=5} @PIR{r=50}
  - particles{p=block{b=STONE};a=500;hs=20;vs=5;y=0;repeat=10;repeati=5} @self
  - delay 50
  # Clear hazard blocks
  - blockmask{m=AIR;r=30;d=10;blocktypes=LAVA,MAGMA_BLOCK,FIRE} @self
  - message{m="&aHazards cleared!"} @PIR{r=50}
  - delay 20
  # Create loot platforms
  - skill{s=SPAWN_LOOT_PLATFORM} @forward{f=8}
  - skill{s=SPAWN_LOOT_PLATFORM} @forward{f=8;ly=90}
  - skill{s=SPAWN_LOOT_PLATFORM} @forward{f=8;ly=180}
  - skill{s=SPAWN_LOOT_PLATFORM} @forward{f=8;ly=270}
  # Center reward pillar
  - blockmask{m=GLOWSTONE;r=2;d=10;na=true} @self
  - blockmask{m=GOLD_BLOCK;r=1;d=8;na=true} @self
  - particles{p=firework;a=300;hs=5;vs=15} @self
  - sound{s=entity.player.levelup;v=2} @PIR{r=50}
  # Spawn reward chest on top
  - summon{type=REWARD_CHEST;l=@self;y=10} @self

SPAWN_LOOT_PLATFORM:
  Skills:
  # Create 5x5 platform
  - blockmask{m=QUARTZ_BLOCK;r=2;d=1;y=5;na=false;oa=false} @self
  - blockmask{m=GOLD_BLOCK;r=0;d=1;y=5;na=false;oa=false} @self
  - particles{p=explosion;a=50;y=5} @self
  - sound{s=block.anvil.land;v=1;p=1.5;y=5} @self
  # Spawn loot
  - dropitem{item=DIAMOND;amount=3-5;y=6} @self
  - dropitem{item=EMERALD;amount=5-8;y=6} @self
  # Glowing effect
  - blockmask{m=LIGHT;r=1;d=3;y=6} @self

# REWARD CHEST entity (can interact)
REWARD_CHEST:
  Type: ARMOR_STAND
  Display: '&6&l⚜ Final Reward ⚜'
  Equipment:
  - CHEST HEAD
  Options:
    CustomNameVisible: true
    Invulnerable: true
  Skills:
  - particles{p=enchantment_table;a=30;repeat=6000;repeati=20} @self
  - skill{s=GIVE_FINAL_REWARD} @self ~onInteract

GIVE_FINAL_REWARD:
  Skills:
  - give{item=NETHERITE_INGOT;amount=5} @trigger
  - give{item=BOSS_LEGENDARY_ITEM} @trigger
  - message{m="&6You claimed the final reward!"} @trigger
  - particles{p=firework;a=100} @trigger
  - remove @self
\`\`\`
`;
}

function getBuffStationReward() {
    return `
=== DEATH REWARD: BUFF STATION (ENABLED) ===
Spawn totem that gives permanent buffs to players.

**Mechanic:**
- Beacon-like totem spawns
- Players within radius get buffs
- Buff lasts 10 minutes
- Visual aura effect
- Totem remains for 2 minutes

**Implementation:**
\`\`\`yaml
~onDeath:
- skill{s=BOSS_DEATH_BUFF_STATION} @origin

BOSS_DEATH_BUFF_STATION:
  Skills:
  - message{m="&a&l✦ VICTORY! ✦"} @PIR{r=100}
  - message{m="&bA power station has been activated!"} @PIR{r=100}
  - particles{p=end_rod;a=300;hs=5;vs=15;y=0} @origin
  - sound{s=block.beacon.activate;v=2;p=1} @PIR{r=50}
  - delay 40
  - summon{type=BUFF_STATION;l=@origin} @origin

BUFF_STATION:
  Type: ARMOR_STAND
  Display: '&b&l⚡ Victory Buff Station ⚡'
  Health: 1
  Options:
    Invisible: false
    Invulnerable: true
    Marker: false
    CustomNameVisible: true
    AlwaysShowName: true
    Despawn: false
  Equipment:
  - BEACON HEAD
  Skills:
  # Pulsing aura effect
  - particles{p=enchantment_table;a=50;repeat=2400;repeati=5;hs=5;vs=5;y=2} @self
  - particles{p=firework;a=20;repeat=2400;repeati=10;hs=3;vs=3;y=3} @self
  - particles{p=end_rod;a=30;repeat=2400;repeati=8} @ring{r=5;p=12;y=0}
  - sound{s=block.beacon.ambient;v=0.5;repeat=2400;repeati=50} @self
  # Give buffs to nearby players
  - skill{s=STATION_BUFF_PLAYERS} @self ~onTimer:20
  # Despawn after 2 minutes
  - message{m="&bThe buff station is fading...";delay=2200} @PIR{r=30}
  - remove{delay=2400} @self

STATION_BUFF_PLAYERS:
  TargetConditions:
  - distance{d=<10} true
  Skills:
  # Check if player already buffed
  - skill{s=APPLY_VICTORY_BUFFS} @trigger ?!varequals{var=target.victory_buffed;val=true}

APPLY_VICTORY_BUFFS:
  Skills:
  - message{m="&b✦ You received Victory Buffs! ✦"} @trigger
  - particles{p=firework;a=100;hs=2;vs=3} @trigger
  - particles{p=totem_of_undying;a=50} @trigger
  - sound{s=entity.player.levelup;v=1;p=1.5} @trigger
  # Apply powerful buffs (10 minutes)
  - potion{type=INCREASE_DAMAGE;d=12000;l=2} @trigger
  - potion{type=SPEED;d=12000;l=2} @trigger
  - potion{type=REGENERATION;d=12000;l=2} @trigger
  - potion{type=DAMAGE_RESISTANCE;d=12000;l=1} @trigger
  - potion{type=LUCK;d=12000;l=3} @trigger
  # Mark player as buffed
  - setvar{var=target.victory_buffed;val=true;duration=12000} @trigger
  - message{m="&7Buffs last 10 minutes!";delay=20} @trigger
\`\`\`
`;
}

function getFireworksCelebrationReward() {
    return `
=== DEATH REWARD: VICTORY CELEBRATION (ENABLED) ===
Epic fireworks show with loot raining from sky.

**Mechanic:**
- Massive fireworks display
- Items drop from sky across arena
- Musical celebration sounds
- Particle effects everywhere
- Screen shake for impact
- Lasts 30 seconds

**Implementation:**
\`\`\`yaml
~onDeath:
- skill{s=BOSS_DEATH_CELEBRATION} @origin

BOSS_DEATH_CELEBRATION:
  Skills:
  # Victory announcement
  - message{m="&6&l✦✦✦ EPIC VICTORY! ✦✦✦"} @PIR{r=100}
  - message{m="&eThe heavens celebrate your triumph!"} @PIR{r=100}
  - sound{s=ui.toast.challenge_complete;v=2;p=1} @PIR{r=100}
  - delay 20
  # Launch celebration sequence
  - skill{s=FIREWORKS_SHOW} @self
  - skill{s=LOOT_RAIN} @self
  - skill{s=VICTORY_FANFARE} @self

FIREWORKS_SHOW:
  Skills:
  # Firework burst 1
  - particles{p=firework;a=500;hs=10;vs=15;y=20} @self
  - sound{s=entity.firework_rocket.large_blast;v=2;p=1} @PIR{r=50}
  - delay 15
  # Firework burst 2
  - particles{p=firework;a=500;hs=10;vs=15;y=20} @forward{f=10}
  - sound{s=entity.firework_rocket.large_blast;v=2;p=1.2} @PIR{r=50}
  - delay 15
  # Firework burst 3
  - particles{p=firework;a=500;hs=10;vs=15;y=20} @forward{f=10;ly=90}
  - sound{s=entity.firework_rocket.large_blast;v=2;p=0.8} @PIR{r=50}
  - delay 15
  # Firework burst 4
  - particles{p=firework;a=500;hs=10;vs=15;y=20} @forward{f=10;ly=180}
  - sound{s=entity.firework_rocket.large_blast;v=2;p=1.5} @PIR{r=50}
  - delay 15
  # Final mega burst
  - particles{p=firework;a=1000;hs=15;vs=20;y=25} @self
  - particles{p=totem_of_undying;a=500;hs=12;vs=18;y=25} @self
  - sound{s=entity.firework_rocket.large_blast;v=3;p=1} @PIR{r=100}
  - sound{s=entity.generic.explode;v=2;p=0.8} @PIR{r=100}
  - recoil{r=30;pitch=-1} @PIR{r=50}

LOOT_RAIN:
  Skills:
  # Drop items from sky across arena
  # Wave 1 - Diamonds
  - dropitem{item=DIAMOND;amount=5-10;y=30} @ring{r=15;p=8;y=0}
  - delay 20
  # Wave 2 - Emeralds
  - dropitem{item=EMERALD;amount=10-15;y=30} @ring{r=12;p=10;y=0}
  - delay 20
  # Wave 3 - Gold
  - dropitem{item=GOLD_INGOT;amount=15-20;y=30} @ring{r=10;p=12;y=0}
  - delay 20
  # Wave 4 - Special items
  - dropitem{item=ENCHANTED_GOLDEN_APPLE;amount=2-3;y=30} @ring{r=8;p=6;y=0}
  - dropitem{item=NETHERITE_INGOT;amount=3-5;y=30} @ring{r=8;p=6;y=0}
  - delay 20
  # Wave 5 - Boss custom items
  - dropitem{item=BOSS_LEGENDARY_WEAPON;amount=1;y=30} @self
  - dropitem{item=BOSS_RARE_ARMOR;amount=1;y=30} @forward{f=5}
  # Particle effects for drops
  - particles{p=firework;a=200;repeat=100;repeati=5;hs=15;vs=20;y=30} @self

VICTORY_FANFARE:
  Skills:
  # Musical celebration
  - sound{s=block.note_block.pling;v=1;p=2} @PIR{r=50}
  - delay 5
  - sound{s=block.note_block.pling;v=1;p=1.8} @PIR{r=50}
  - delay 5
  - sound{s=block.note_block.pling;v=1;p=1.6} @PIR{r=50}
  - delay 5
  - sound{s=block.note_block.pling;v=1;p=2.2} @PIR{r=50}
  - delay 10
  - sound{s=entity.player.levelup;v=2;p=1} @PIR{r=50}
  # Buff all players
  - potion{type=REGENERATION;d=200;l=3} @PIR{r=50}
  - potion{type=ABSORPTION;d=200;l=2} @PIR{r=50}
  - message{m="&6&lCongratulations, Heroes!"} @PIR{r=100}
\`\`\`

**Visual Enhancement (Continuous particles during celebration):**
\`\`\`yaml
# Add continuous particle effects
~onDeath:
- particles{p=firework;a=50;repeat=600;repeati=5;hs=20;vs=15;y=10} @origin
- particles{p=happy_villager;a=30;repeat=600;repeati=10;hs=15;vs=10} @origin
- particles{p=enchantment_table;a=40;repeat=600;repeati=8} @ring{r=20;p=16;y=0}
\`\`\`
`;
}