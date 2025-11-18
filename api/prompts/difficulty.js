// DIFFICULTY-SPECIFIC MECHANICS
export function getDifficultyPrompt(difficulty) {
    const prompts = {
        psychological: `
=== PSYCHOLOGICAL HORROR MECHANICS ===

**1. DARKNESS SYSTEM**
Limit player vision:
\`\`\`yaml
# Constant darkness aura
- potion{type=DARKNESS;duration=9999;level=2} @PIR{r=30} ~onTimer:20
- potion{type=BLINDNESS;duration=100;level=1} @PIR{r=30} ~onTimer:200

# Flash blindness on attack
- potion{type=BLINDNESS;duration=60;level=2} @trigger ~onAttack
\`\`\`

**2. SOUND DESIGN**
Psychological audio cues:
\`\`\`yaml
# Ambient horror sounds
- effect:sound{s=entity.warden.heartbeat;v=0.8;p=0.6} @PIR{r=30} ~onTimer:40
- effect:sound{s=entity.ghast.ambient;v=0.5;p=0.3} @PIR{r=30} ~onTimer:80
- effect:sound{s=ambient.cave;v=1;p=0.5} @PIR{r=30} ~onTimer:60

# Jumpscare sound
- effect:sound{s=entity.enderman.scream;v=2;p=2} @trigger
- effect:sound{s=entity.warden.sonic_boom;v=1;p=1} @trigger
\`\`\`

**3. STEALTH & STALKING**
Unpredictable behavior:
\`\`\`yaml
# Random teleport behind player
HORROR_stalk_teleport:
  Cooldown: 15
  Skills:
  - setAI{ai=false} @self
  - teleport{} @target{l=@backward{f=3}}
  - delay 40
  - setAI{ai=true} @self
  - effect:sound{s=entity.enderman.teleport;v=1;p=0.5} @self

# Disappear and reappear
- potion{type=INVISIBILITY;duration=100;level=1} @self
- teleport{} @ring{r=12;p=1}
- delay 100
- potionclear{} @self
- effect:particles{p=portal;a=100;hs=1;vs=2} @self
\`\`\`

**4. TENSION BUILDING**
Slow dread before attack:
\`\`\`yaml
# Stalking phase (no damage)
- setvar{var=caster.stalking;val=true} @self ~onSpawn
- delay 600  # 30 seconds stalking
- setvar{var=caster.stalking;val=false} @self

# Only attack after stalking
HORROR_attack:
  Conditions:
  - varequals{var=caster.stalking;val=false} true
  Skills:
  - damage{amount=40} @target
  - effect:sound{s=entity.warden.sonic_boom;v=2;p=0.5} @trigger
\`\`\`

**5. JUMPSCARE MECHANICS**
Sudden attacks:
\`\`\`yaml
# Random jumpscare
- randomskill{
    skills=[
      [ - teleport{} @target{l=@forward{f=1}}
        - effect:sound{s=entity.enderman.scream;v=2;p=2} @self
        - recoil{r=30;pitch=-1} @trigger
      ],
      [ - skill{s=NORMAL_ATTACK} @target ]
    ]
  } @self
\`\`\``,

        souls: `
=== SOULS-LIKE MECHANICS ===

**1. TELEGRAPH SYSTEM**
ALL major attacks need 2-second warning:
\`\`\`yaml
SOULS_big_slam:
  Cooldown: 20
  Skills:
  # 2-second telegraph
  - message{m="&e⚠ &cHeavy attack incoming!"} @PIR{r=30}
  - effect:particles{p=crit;a=100;hs=2;vs=2;repeat=40;repeati=1} @self
  - effect:sound{s=block.bell.use;v=1.5;p=0.5} @self
  - setspeed{speed=0} @self
  - lockmodel{l=true} @self
  - delay 40
  # Actual attack
  - damage{amount=30;ignoreArmor=true} @PIR{r=8}
  - throw{velocity=12;velocityY=4} @PIR{r=8}
  - effect:particles{p=explosion;a=50} @self
  - setspeed{speed=0.3} @self
  - lockmodel{l=false} @self
\`\`\`

**2. PATTERN RECOGNITION**
Fixed attack sequences:
\`\`\`yaml
SOULS_combo_pattern:
  Skills:
  # Attack 1
  - damage{amount=10} @target
  - delay 20
  # Attack 2
  - damage{amount=12} @target
  - delay 25
  # Attack 3 (telegraphed finisher)
  - effect:particles{p=flame;a=50;repeat=20;repeati=1} @self
  - delay 20
  - damage{amount=20;ignoreArmor=true} @target
  - throw{velocity=8;velocityY=3} @target
\`\`\`

**3. PUNISH SYSTEM**
Punish spam/panic rolling:
\`\`\`yaml
# Track player actions
- setvar{var=target.action_count;val=0;duration=100} @trigger ~onDamaged
- variableMath{var=target.action_count;operation=ADD;value=1} @trigger

# Punish if spamming (>5 actions in 5s)
SOULS_punish_spam:
  Conditions:
  - variableInRange{var=target.action_count;val=>5} true
  Skills:
  - message{m="&c&lPUNISHED!"} @trigger
  - damage{amount=25;ignoreArmor=true} @trigger
  - potion{type=SLOW;duration=100;level=3} @trigger
\`\`\`

**4. REWARD PATIENCE**
Opening after attacks:
\`\`\`yaml
# Vulnerable state after big attack
- setvar{var=caster.vulnerable;val=true} @self
- delay 40  # 2 second opening
- setvar{var=caster.vulnerable;val=false} @self

# Take extra damage when vulnerable
- damage{amount=5} @self ?varequals{var=caster.vulnerable;val=true}
\`\`\`

**5. FAIR BUT BRUTAL**
Every attack dodgeable:
\`\`\`yaml
# Always give warning before one-shot
SOULS_ultimate:
  Cooldown: 60
  Skills:
  - message{m="&4&l⚠⚠⚠ ULTIMATE ATTACK ⚠⚠⚠"} @PIR{r=50}
  - effect:sound{s=entity.wither.spawn;v=2;p=0.5} @self
  - effect:particles{p=smoke;a=200;hs=3;vs=3;repeat=60;repeati=1} @self
  - delay 60  # 3 second warning!
  - damage{amount=50;ignoreArmor=true} @PIR{r=12}
  - throw{velocity=15;velocityY=6} @PIR{r=12}
\`\`\``,

        nightmare: `
=== NIGHTMARE DIFFICULTY MECHANICS ===

**GLASS CANNON PHILOSOPHY**
Boss has LOW HP but DEVASTATING attacks:
- Health: 300-500 (dies FAST if player skilled)
- Damage: 35-50 (one-shot potential)
- Speed: 0.4-0.5 (FAST movement)
- Armor: 0-5 (minimal defense)

**1. INSTANT DEATH MECHANICS**
But with fair telegraphs:
\`\`\`yaml
NIGHTMARE_oneshot:
  Cooldown: 30
  Skills:
  # 3-second telegraph
  - message{m="&4&l☠ DEATH INCOMING ☠"} @PIR{r=50}
  - effect:particles{p=smoke;a=300;hs=4;vs=4;repeat=60;repeati=1} @self
  - effect:sound{s=entity.wither.spawn;v=2;p=0.5} @self
  - setspeed{speed=0} @self
  - delay 60
  # One-shot attack
  - damage{amount=50;ignoreArmor=true} @PIR{r=10}
  - throw{velocity=20;velocityY=8} @PIR{r=10}
  - effect:particles{p=explosion;a=100;hs=5;vs=5} @self
  - setspeed{speed=0.5} @self
\`\`\`

**2. TELEPORT SPAM**
Unpredictable positioning:
\`\`\`yaml
# Constant teleports
- teleport{} @ring{r=10;p=1} ~onTimer:40
- effect:particles{p=portal;a=50} @self

# Behind player teleport
- teleport{} @target{l=@backward{f=3}} ~onTimer:60
\`\`\`

**3. CLONE EXPLOSIONS**
Multiple fake targets:
\`\`\`yaml
NIGHTMARE_clones:
  Cooldown: 25
  Skills:
  - summon{type=CLONE_MOB;amount=4} @ring{r=8;p=4}
  - potion{type=INVISIBILITY;duration=100;level=1} @self
  - delay 100
  - damage{amount=20} @MIR{r=15;types=CLONE_MOB}  # Clones explode
  - potionclear{} @self
\`\`\`

**4. REALITY WARPING**
Confusing effects:
\`\`\`yaml
# Random levitation
- potion{type=LEVITATION;duration=60;level=5} @PIR{r=20} ~onTimer:100

# Screen shake spam
- recoil{r=30;pitch=<random.float.-1to1>} @PIR{r=32} ~onTimer:20

# Nausea
- potion{type=NAUSEA;duration=200;level=1} @PIR{r=20} ~onTimer:80
\`\`\`

**5. NO HEALING**
Boss never heals - race against time:
\`\`\`yaml
# No heal skills
# No regeneration
# Pure offense, zero defense
\`\`\``
    };

    return prompts[difficulty] || '';
}