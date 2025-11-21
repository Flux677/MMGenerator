// ============================================
// FIXED: Boss Death Rewards
// Issues Fixed:
// - Armor stand ~onInteract tidak work (butuh Mythiccrucible)
// - Merchant tidak bisa interact
// - Particle spam = lag
// ============================================

export function getDeathRewardPrompts(rewardType) {
    const rewards = {
        chest_spawn: getTreasureChestReward(),
        portal_spawn: getPortalSpawnReward(),
        npc_merchant: getNPCMerchantReward(), // FIXED
        arena_transform: getArenaTransformReward(),
        buff_station: getBuffStationReward(),
        fireworks_celebration: getFireworksCelebrationReward()
    };
    
    return rewards[rewardType] || rewards.chest_spawn;
}

function getTreasureChestReward() {
    return `
=== DEATH REWARD: TREASURE CHEST (FIXED - OPTIMIZED) ===

**Fixes:**
- Particle count reduced 80%
- Auto-give items instead of interact (simpler)
- No armor stand interaction needed

\`\`\`yaml
~onDeath:
- skill{s=BOSS_DEATH_CHEST} @origin

BOSS_DEATH_CHEST:
  Skills:
  # Announcement
  - message{m="&6&l✦ VICTORY! ✦"} @PIR{r=80}
  - message{m="&eTreasure claimed!"} @PIR{r=80}
  
  # REDUCED particles (200 → 40)
  - particles{p=firework;a=40;hs=3;vs=5;y=2} @origin
  - particles{p=totem_of_undying;a=30;hs=2;vs=3} @origin
  - sound{s=entity.player.levelup;v=1.5;p=1} @PIR{r=40}
  - sound{s=ui.toast.challenge_complete;v=1.5;p=1;delay=10} @PIR{r=40}
  
  # AUTO-GIVE items to all nearby players (NO INTERACT NEEDED)
  - give{item=DIAMOND;amount=5} @PIR{r=20}
  - give{item=EMERALD;amount=10} @PIR{r=20}
  - give{item=BOSS_CUSTOM_ITEM} @PIR{r=20}
  
  # Particle pillar (REDUCED: 100 → 20)
  - particles{p=end_rod;a=20;hs=0.3;vs=10;y=0} @origin
  - particles{p=enchantment_table;a=30} @ring{r=2;p=8;y=0}
\`\`\`
`;
}

function getPortalSpawnReward() {
    return `
=== DEATH REWARD: PORTAL (FIXED - OPTIMIZED) ===

**Fixes:**
- Particle spam reduced 70%
- Portal detection radius increased (more forgiving)
- Clearer messaging

\`\`\`yaml
~onDeath:
- skill{s=BOSS_DEATH_PORTAL} @origin

BOSS_DEATH_PORTAL:
  Skills:
  - message{m="&d&l✦ VICTORY! ✦"} @PIR{r=80}
  - message{m="&5Portal opens..."} @PIR{r=80}
  
  # REDUCED particles (500 → 80)
  - particles{p=portal;a=80;hs=3;vs=5} @origin
  - sound{s=block.portal.trigger;v=1.5;p=0.8} @PIR{r=40}
  - delay 40
  
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
  # REDUCED particles (100 → 15 per cycle)
  - particles{p=portal;a=15;repeat=2400;repeati=5;hs=1.5;vs=2} @self
  - particles{p=end_rod;a=5;repeat=2400;repeati=20} @ring{r=2;p=4;y=1}
  
  # NO sound spam (removed ambient loop)
  
  # Check for players (INCREASED radius 3 → 5)
  - skill{s=PORTAL_TELEPORT} @self ~onTimer:10
  
  # Close after 2 min
  - message{m="&5Portal closing...";delay=2200} @PIR{r=30}
  - remove{delay=2400} @self

PORTAL_TELEPORT:
  TargetConditions:
  - distance{d=<5} true  # Increased from 3 to 5
  Skills:
  - message{m="&d<trigger.name> enters portal!"} @PIR{r=30}
  - particles{p=portal;a=50} @trigger  # REDUCED 200 → 50
  - sound{s=entity.enderman.teleport;v=1.5} @trigger
  
  # CHANGE COORDS: x=0, y=100, z=0
  - teleport{world=world;x=0;y=100;z=0} @trigger
  
  - particles{p=portal;a=50;delay=5} @trigger
  - message{m="&aWelcome to Reward Room!";delay=10} @trigger
  - potion{type=REGENERATION;d=100;l=1;delay=20} @trigger
\`\`\`

**SETUP:** Build reward room at coordinates (x=0, y=100, z=0) atau change koordinat!
`;
}

function getNPCMerchantReward() {
    return `
=== DEATH REWARD: MERCHANT (FIXED - NO MYTHICCRUCIBLE) ===

**CRITICAL FIX:**
- Armor stand ~onInteract TIDAK WORK tanpa Mythiccrucible!
- Solution: Use proximity trigger + actionbar prompt
- Auto-give items when player approach

\`\`\`yaml
~onDeath:
- skill{s=BOSS_DEATH_MERCHANT} @origin

BOSS_DEATH_MERCHANT:
  Skills:
  - message{m="&a&l✦ VICTORY! ✦"} @PIR{r=80}
  - message{m="&eMerchant appears..."} @PIR{r=80}
  
  # REDUCED particles (200 → 40)
  - particles{p=enchantment_table;a=40;hs=2;vs=3} @origin
  - sound{s=entity.villager.celebrate;v=1.5;p=1} @PIR{r=40}
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
  # REDUCED particles (10 → 3 per cycle)
  - particles{p=happy_villager;a=3;repeat=6000;repeati=40} @self
  - particles{p=enchantment_table;a=2;repeat=6000;repeati=60;y=2} @self
  
  # FIXED: Use proximity check instead of ~onInteract
  - skill{s=MERCHANT_CHECK_NEARBY} @self ~onTimer:20
  
  # Despawn after 5 min
  - message{m="&eMerchant leaving...";delay=5800} @PIR{r=30}
  - particles{p=portal;a=50;delay=6000} @self  # REDUCED 200 → 50
  - sound{s=entity.villager.no;v=1;delay=6000} @self
  - message{m="&7Merchant vanishes...";delay=6000} @PIR{r=30}
  - remove{delay=6020} @self

# FIXED: Check for nearby players
MERCHANT_CHECK_NEARBY:
  TargetConditions:
  - distance{d=<5} true  # Player within 5 blocks
  Skills:
  - skill{s=MERCHANT_TRADE} @trigger ?!varequals{var=target.merchant_traded;val=true}

MERCHANT_TRADE:
  Skills:
  # Mark as traded (prevent spam)
  - setvar{var=target.merchant_traded;val=true;duration=6000} @trigger
  
  - message{m="&e[Merchant] Victory rewards!"} @trigger
  - sound{s=entity.villager.trade;v=1} @trigger
  - particles{p=happy_villager;a=20} @trigger  # REDUCED 30 → 20
  
  # AUTO-GIVE rewards (NO CLICK NEEDED)
  - give{item=DIAMOND;amount=10} @trigger
  - give{item=EMERALD_BLOCK;amount=5} @trigger
  - give{item=ENCHANTED_GOLDEN_APPLE;amount=2} @trigger
  - give{item=BOSS_CUSTOM_WEAPON} @trigger
  
  - message{m="&aItems added to inventory!"} @trigger
\`\`\`

**HOW IT WORKS:**
1. Merchant spawns after boss death
2. Player walks within 5 blocks
3. Items AUTO-GIVEN to inventory (no click!)
4. Each player can claim once
5. Merchant despawns after 5 minutes

**NO Mythiccrucible needed!**
`;
}

function getArenaTransformReward() {
    return `
=== DEATH REWARD: ARENA TRANSFORM (FIXED - OPTIMIZED) ===

**Fixes:**
- Particle spam reduced 85%
- Smoother earthquake effect
- Faster execution

\`\`\`yaml
~onDeath:
- skill{s=BOSS_DEATH_TRANSFORM} @origin

BOSS_DEATH_TRANSFORM:
  Skills:
  - message{m="&a&l✦ VICTORY! ✦"} @PIR{r=80}
  - message{m="&eArena transforms..."} @PIR{r=80}
  
  # OPTIMIZED earthquake (10 shakes → 5 shakes)
  - recoil{r=20;pitch=-0.5;repeat=5;repeati=10} @PIR{r=40}
  - sound{s=entity.wither.break_block;v=1.5;p=0.5;repeat=5;repeati=10} @PIR{r=40}
  # REDUCED particles (500 → 60)
  - particles{p=block{b=STONE};a=60;hs=15;vs=3;y=0;repeat=5;repeati=10} @self
  
  - delay 50
  
  # Clear hazards
  - blockmask{m=AIR;r=25;d=8;blocktypes=LAVA,MAGMA_BLOCK,FIRE} @self
  - message{m="&aHazards cleared!"} @PIR{r=40}
  - delay 20
  
  # Create 4 loot platforms
  - skill{s=SPAWN_LOOT_PLATFORM} @forward{f=8}
  - skill{s=SPAWN_LOOT_PLATFORM} @forward{f=8;ly=90}
  - skill{s=SPAWN_LOOT_PLATFORM} @forward{f=8;ly=180}
  - skill{s=SPAWN_LOOT_PLATFORM} @forward{f=8;ly=270}
  
  # Center pillar (REDUCED particles)
  - blockmask{m=GLOWSTONE;r=2;d=8;na=true} @self
  - blockmask{m=GOLD_BLOCK;r=1;d=6;na=true} @self
  - particles{p=firework;a=50;hs=3;vs=10} @self  # REDUCED 300 → 50
  - sound{s=entity.player.levelup;v=1.5} @PIR{r=40}

SPAWN_LOOT_PLATFORM:
  Skills:
  # 5x5 platform
  - blockmask{m=QUARTZ_BLOCK;r=2;d=1;y=5;na=false;oa=false} @self
  - blockmask{m=GOLD_BLOCK;r=0;d=1;y=5;na=false;oa=false} @self
  - particles{p=explosion;a=20;y=5} @self  # REDUCED 50 → 20
  - sound{s=block.anvil.land;v=0.8;p=1.5;y=5} @self
  
  # Spawn loot
  - dropitem{item=DIAMOND;amount=3-5;y=6} @self
  - dropitem{item=EMERALD;amount=5-8;y=6} @self
  
  # Light
  - blockmask{m=LIGHT;r=1;d=3;y=6} @self
\`\`\`
`;
}

function getBuffStationReward() {
    return `
=== DEATH REWARD: BUFF STATION (FIXED - OPTIMIZED) ===

**Fixes:**
- Particle spam reduced 80%
- Smoother buff application
- Clear feedback

\`\`\`yaml
~onDeath:
- skill{s=BOSS_DEATH_BUFF_STATION} @origin

BOSS_DEATH_BUFF_STATION:
  Skills:
  - message{m="&a&l✦ VICTORY! ✦"} @PIR{r=80}
  - message{m="&bBuff Station activated!"} @PIR{r=80}
  
  # REDUCED particles (300 → 50)
  - particles{p=end_rod;a=50;hs=3;vs=8;y=0} @origin
  - sound{s=block.beacon.activate;v=1.5;p=1} @PIR{r=40}
  - delay 40
  
  - summon{type=BUFF_STATION;l=@origin} @origin

BUFF_STATION:
  Type: ARMOR_STAND
  Display: '&b&l⚡ Buff Station ⚡'
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
  # REDUCED particles (50 → 10 per cycle)
  - particles{p=enchantment_table;a=10;repeat=2400;repeati=10;hs=3;vs=3;y=2} @self
  - particles{p=firework;a=5;repeat=2400;repeati=30;hs=2;vs=2;y=3} @self
  - particles{p=end_rod;a=8;repeat=2400;repeati=20} @ring{r=4;p=6;y=0}
  
  # REDUCED sound (removed looping ambient)
  
  # Check nearby players
  - skill{s=STATION_BUFF_PLAYERS} @self ~onTimer:20
  
  # Despawn after 2 min
  - message{m="&bStation fading...";delay=2200} @PIR{r=30}
  - remove{delay=2400} @self

STATION_BUFF_PLAYERS:
  TargetConditions:
  - distance{d=<10} true
  Skills:
  - skill{s=APPLY_VICTORY_BUFFS} @trigger ?!varequals{var=target.victory_buffed;val=true}

APPLY_VICTORY_BUFFS:
  Skills:
  - message{m="&b✦ Victory Buffs! ✦"} @trigger
  
  # REDUCED particles (150 → 40)
  - particles{p=firework;a=30;hs=1.5;vs=2} @trigger
  - particles{p=totem_of_undying;a=10} @trigger
  - sound{s=entity.player.levelup;v=1;p=1.5} @trigger
  
  # 10-minute buffs
  - potion{type=INCREASE_DAMAGE;d=12000;l=2} @trigger
  - potion{type=SPEED;d=12000;l=2} @trigger
  - potion{type=REGENERATION;d=12000;l=2} @trigger
  - potion{type=DAMAGE_RESISTANCE;d=12000;l=1} @trigger
  - potion{type=LUCK;d=12000;l=3} @trigger
  
  - setvar{var=target.victory_buffed;val=true;duration=12000} @trigger
  - message{m="&7Buffs last 10 minutes!";delay=20} @trigger
\`\`\`
`;
}

function getFireworksCelebrationReward() {
    return `
=== DEATH REWARD: CELEBRATION (FIXED - OPTIMIZED) ===

**Fixes:**
- Particle count reduced 75%
- Fireworks staggered (less lag spike)
- Smoother execution

\`\`\`yaml
~onDeath:
- skill{s=BOSS_DEATH_CELEBRATION} @origin

BOSS_DEATH_CELEBRATION:
  Skills:
  - message{m="&6&l✦✦✦ EPIC VICTORY! ✦✦✦"} @PIR{r=80}
  - message{m="&eCelebration!"} @PIR{r=80}
  - sound{s=ui.toast.challenge_complete;v=1.5;p=1} @PIR{r=80}
  - delay 20
  
  - skill{s=FIREWORKS_SHOW} @self
  - skill{s=LOOT_RAIN} @self
  - skill{s=VICTORY_FANFARE} @self

FIREWORKS_SHOW:
  Skills:
  # REDUCED particles per burst (500 → 80)
  - particles{p=firework;a=80;hs=6;vs=10;y=15} @self
  - sound{s=entity.firework_rocket.large_blast;v=1.5;p=1} @PIR{r=40}
  - delay 15
  
  - particles{p=firework;a=80;hs=6;vs=10;y=15} @forward{f=8}
  - sound{s=entity.firework_rocket.large_blast;v=1.5;p=1.2} @PIR{r=40}
  - delay 15
  
  - particles{p=firework;a=80;hs=6;vs=10;y=15} @forward{f=8;ly=90}
  - sound{s=entity.firework_rocket.large_blast;v=1.5;p=0.8} @PIR{r=40}
  - delay 15
  
  - particles{p=firework;a=80;hs=6;vs=10;y=15} @forward{f=8;ly=180}
  - sound{s=entity.firework_rocket.large_blast;v=1.5;p=1.5} @PIR{r=40}
  - delay 15
  
  # Final burst (REDUCED 1500 → 200)
  - particles{p=firework;a=150;hs=10;vs=15;y=20} @self
  - particles{p=totem_of_undying;a=50;hs=8;vs=12;y=20} @self
  - sound{s=entity.firework_rocket.large_blast;v=2;p=1} @PIR{r=80}
  - sound{s=entity.generic.explode;v=1.5;p=0.8} @PIR{r=80}
  - recoil{r=25;pitch=-0.8} @PIR{r=40}

LOOT_RAIN:
  Skills:
  # Staggered drops (reduce lag spike)
  - dropitem{item=DIAMOND;amount=5-10;y=25} @ring{r=12;p=6;y=0}
  - delay 20
  - dropitem{item=EMERALD;amount=10-15;y=25} @ring{r=10;p=8;y=0}
  - delay 20
  - dropitem{item=GOLD_INGOT;amount=15-20;y=25} @ring{r=8;p=10;y=0}
  - delay 20
  - dropitem{item=ENCHANTED_GOLDEN_APPLE;amount=2-3;y=25} @ring{r=6;p=4;y=0}
  - dropitem{item=NETHERITE_INGOT;amount=3-5;y=25} @ring{r=6;p=4;y=0}
  - delay 20
  - dropitem{item=BOSS_LEGENDARY_WEAPON;amount=1;y=25} @self
  - dropitem{item=BOSS_RARE_ARMOR;amount=1;y=25} @forward{f=4}
  
  # REDUCED particles (200 → 40)
  - particles{p=firework;a=40;repeat=80;repeati=10;hs=12;vs=15;y=25} @self

VICTORY_FANFARE:
  Skills:
  - sound{s=block.note_block.pling;v=1;p=2} @PIR{r=40}
  - delay 5
  - sound{s=block.note_block.pling;v=1;p=1.8} @PIR{r=40}
  - delay 5
  - sound{s=block.note_block.pling;v=1;p=1.6} @PIR{r=40}
  - delay 5
  - sound{s=block.note_block.pling;v=1;p=2.2} @PIR{r=40}
  - delay 10
  - sound{s=entity.player.levelup;v=1.5;p=1} @PIR{r=40}
  
  # Buffs
  - potion{type=REGENERATION;d=100;l=2} @PIR{r=40}
  - potion{type=ABSORPTION;d=100;l=1} @PIR{r=40}
  - message{m="&6&lCongratulations!"} @PIR{r=80}
\`\`\`
`;
}