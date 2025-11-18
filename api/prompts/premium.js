// PREMIUM MECHANICS - Advanced MythicMobs features
export function getPremiumMechanics(options) {
    return `
=== PREMIUM MYTHICMOBS MECHANICS ===

**1. TOTEM - Precise Hitbox Attacks**
For melee attacks with custom hitboxes:
\`\`\`yaml
BOSS_totem_slash:
  Cooldown: 10
  Skills:
  - message{m="&c<caster.name> &fslashes!"} @PIR{r=30}
  - effect:sound{s=entity.player.attack.sweep;v=1;p=0.8} @self
  - totem{
      md=2;
      oH=TOTEM_HIT_DAMAGE;
      hr=3;
      vr=4;
      drawhitbox=false;
      delay=10;
      repeat=5;
      repeati=1
    } @forward{f=2}

TOTEM_HIT_DAMAGE:
  Skills:
  - damage{amount=15;ignoreArmor=true} @trigger
  - throw{velocity=5;velocityY=2} @trigger
  - effect:particles{p=crit;a=20} @trigger
\`\`\`

**2. PROJECTILE - Advanced Projectiles**
Homing, bouncing, exploding projectiles:
\`\`\`yaml
BOSS_fireball:
  Cooldown: 8
  Skills:
  - projectile{
      bulletType=MOB;
      bullet=MAGMA_CUBE;
      oS=[ - effect:particles{p=flame;a=10} @self ];
      oH=FIREBALL_HIT;
      oT=FIREBALL_TICK;
      oE=FIREBALL_END;
      v=20;
      i=1;
      hR=2;
      vR=2;
      md=50;
      ac=0.98;
      hnp=true;
      g=-0.05;
      bounce=true;
      bv=0.5
    } @target

FIREBALL_HIT:
  Skills:
  - damage{amount=20;ignoreArmor=true} @trigger
  - effect:particles{p=explosion;a=50} @origin
  - throw{velocity=8;velocityY=3} @EIR{r=5}

FIREBALL_TICK:
  Skills:
  - effect:particles{p=flame;a=5} @origin

FIREBALL_END:
  Skills:
  - effect:particles{p=smoke;a=30} @origin
\`\`\`

**3. MISSILE - Tracking Projectiles**
Homing missiles that follow target:
\`\`\`yaml
BOSS_homing_missile:
  Cooldown: 15
  Skills:
  - message{m="&4Missile locked!"} @trigger
  - missile{
      ot=MISSILE_TICK;
      oH=MISSILE_HIT;
      v=30;
      i=1;
      hR=2;
      vR=2;
      in=0.75;
      hs=true;
      hfs=1.25;
      d=120;
      mr=2000;
      sE=true
    } @target

MISSILE_HIT:
  Skills:
  - damage{amount=25;ignoreArmor=true} @trigger
  - effect:particles{p=explosion;a=80} @origin
  - throw{velocity=10;velocityY=4} @EIR{r=6}

MISSILE_TICK:
  Skills:
  - effect:particles{p=flame;a=3} @origin
  - effect:particles{p=smoke;a=2} @origin
\`\`\`

**4. PROPEL - Dash Mechanics**
Fast movement/charges:
\`\`\`yaml
BOSS_dash_attack:
  Cooldown: 12
  Skills:
  - message{m="&c<caster.name> &fdashes!"} @PIR{r=30}
  - effect:sound{s=entity.ravager.step;v=1;p=1.5} @self
  - setspeed{speed=0} @self
  - propel{v=2.5;repeat=15;repeati=1} @forward{f=1}
  - damage{amount=12} @EIR{r=2} ~onTimer:1 0,15
  - delay 15
  - setspeed{speed=0.3} @self
\`\`\`

**5. LUNGE - Leap Attack**
Jump to target:
\`\`\`yaml
BOSS_leap:
  Cooldown: 15
  Conditions:
  - distance{d=>5} true
  - distance{d=<20} true
  Skills:
  - message{m="&c<caster.name> &fleaps!"} @PIR{r=30}
  - effect:sound{s=entity.ender_dragon.flap;v=1;p=0.8} @self
  - lunge{velocity=3;velocityY=1.5} @target
  - delay 20
  - damage{amount=18;ignoreArmor=true} @EIR{r=4}
  - throw{velocity=6;velocityY=3} @EIR{r=4}
  - effect:particles{p=explosion;a=50} @self
\`\`\`

**6. MOUNT - Grab Mechanic**
Grab and control player:
\`\`\`yaml
BOSS_grab:
  Cooldown: 25
  Conditions:
  - distance{d=<3} true
  Skills:
  - message{m="&4GRABBED!"} @trigger
  - effect:sound{s=entity.ravager.attack;v=1;p=0.5} @self
  - mount{} @trigger
  - delay 60  # 3 seconds grabbed
  - damage{amount=30;ignoreArmor=true} @passengers
  - throw{velocity=15;velocityY=6} @passengers
  - dismountall{} @self
\`\`\`

**7. VELOCITY - Movement Control**
Manipulate entity velocity:
\`\`\`yaml
# Launch up
- velocity{m=set;x=0;y=2;z=0} @target

# Pull toward boss
- velocity{m=add;x=<caster.dx>;y=0.5;z=<caster.dz>} @PIR{r=15}

# Throw away
- velocity{m=set;x=<target.dx>;y=1;z=<target.dz>} @target
\`\`\`

**8. BLOCKMASK - Arena Manipulation**
Change blocks in arena:
\`\`\`yaml
BOSS_lava_ring:
  Cooldown: 40
  Skills:
  - message{m="&cThe arena burns!"} @PIR{r=50}
  - blockmask{m=LAVA;r=15;d=20;na=true;oa=false} @ring{r=15;p=16;y=0}
  - blockmask{m=AIR;r=8;d=5;oa=true} @self  # Safe zone
  - delay 200  # 10 seconds
  - blockmask{m=AIR;r=15;d=20;na=true;oa=true} @ring{r=15;p=16;y=0}

# Light pillar
- blockmask{m=LIGHT;r=3;d=5;oa=true} @location
\`\`\`

**9. STATE - Animation Control**
Control visual states:
\`\`\`yaml
# Play attack animation
- state{s=attack_slash;p=3} @self  # Priority 3
- lockmodel{l=true} @self
- delay 30  # Animation duration
- state{s=current_state;r=true} @self  # Remove
- lockmodel{l=false} @self

# Set default states
- defaultstate{t=idle;s=idle_aggressive} @self
- defaultstate{t=walk;s=walk_fast} @self

# Loop animation
- state{s=channel_spell;lo=5} @self  # Loop 5 times
\`\`\`

**10. SIGNAL - Coordination**
Communicate between mobs:
\`\`\`yaml
# Boss signals minions
BOSS_signal_attack:
  Skills:
  - message{m="&c<caster.name> &esignals attack!"} @PIR{r=50}
  - signal{s=ATTACK_NOW} @MIR{r=30;types=MINION_TYPE}

# Minion receives signal
MINION_receive_signal:
  TriggerConditions:
  - signal{s=ATTACK_NOW} true
  Skills:
  - potion{type=SPEED;duration=100;level=2} @self
  - skill{s=AGGRESSIVE_ATTACK} @target
\`\`\`

**11. SETSPEED - Dynamic Speed**
Change movement speed:
\`\`\`yaml
# Stop during attack
- setspeed{speed=0} @self
- delay 40
- setspeed{speed=0.3} @self

# Speed burst
- setspeed{speed=2;repeat=20;repeati=1} @self
\`\`\`

**12. RANDOMSKILL - Variety**
Random attack selection:
\`\`\`yaml
BOSS_random_attack:
  Cooldown: 10
  Skills:
  - randomskill{
      skills=[
        [ - skill{s=ATTACK_A} @target ],
        [ - skill{s=ATTACK_B} @target ],
        [ - skill{s=ATTACK_C} @target ]
      ]
    } @self
\`\`\`

**13. GCD - Global Cooldown**
Prevent skill spam:
\`\`\`yaml
- skill{s=BIG_ATTACK} @target
- gcd{ticks=40} @self  # 2 second global cooldown
\`\`\`

**14. GOTO - Pathfinding**
Navigate to location:
\`\`\`yaml
# Go to target smoothly
- goto{speedModifier=1.5;sh=2;sv=2} @target

# Return to spawn
- goto{} @Origin
\`\`\`

**15. RECOIL - Screen Shake**
Impactful visual feedback:
\`\`\`yaml
- recoil{r=20;pitch=-0.8} @PIR{r=32}
- delay 1
- recoil{r=20;pitch=0.6} @PIR{r=32}
- delay 1
- recoil{r=20;pitch=-0.4} @PIR{r=32}
\`\`\``;
}