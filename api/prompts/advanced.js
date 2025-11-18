// ADVANCED PROMPT - Complex mechanics for elite/nightmare AI
export function getAdvancedPrompt(options) {
    let prompt = `
=== ADVANCED MECHANICS ===

**1. STATE MACHINE SYSTEM**
Boss should track states with variables:
\`\`\`yaml
# Initialize states
- setvar{var=caster.phase;val=1;type=INTEGER} @self ~onSpawn
- setvar{var=caster.stance;val=neutral;type=STRING} @self
- setvar{var=caster.combo_count;val=0} @self
- setvar{var=caster.enraged;val=false} @self

# State transitions
- setvar{var=caster.stance;val=aggressive} @self ?health{h=<50%}
- skill{s=AGGRESSIVE_ATTACKS} @target ?varequals{var=caster.stance;val=aggressive}
\`\`\``;

    if (options.phaseSystem) {
        prompt += `

**2. MULTI-PHASE SYSTEM**
Implement phase transitions:
\`\`\`yaml
BOSS_phase_transition:
  Conditions:
  - health{h=<50%} true
  - varequals{var=caster.phase;val=1} true
  Skills:
  - message{m="&c<caster.name> &fenters &4Phase 2&f!"} @PIR{r=50}
  - setvar{var=caster.phase;val=2} @self
  - effect:particles{p=explosion;a=100;hs=3;vs=3} @self
  - effect:sound{s=entity.ender_dragon.growl;v=2;p=0.5} @self
  - potion{type=DAMAGE_RESISTANCE;duration=200;level=2} @self
  - heal{amount=200} @self
  - summon{type=MINION_TYPE;amount=3} @ring{r=8;p=3}
  - gcd{ticks=100} @self  # Global cooldown

# Phase 2 exclusive skills
BOSS_phase2_ultimate:
  Cooldown: 30
  Conditions:
  - varequals{var=caster.phase;val=2} true
  Skills:
  - message{m="&c&l<caster.name> &4uses ULTIMATE!"} @PIR{r=50}
  - damage{amount=30;ignoreArmor=true} @PIR{r=15}
  - throw{velocity=10;velocityY=5} @PIR{r=15}
\`\`\``;
    }

    if (options.variableStates) {
        prompt += `

**3. COMBO SYSTEM**
Chain attacks with variables:
\`\`\`yaml
BOSS_combo_1:
  Cooldown: 20
  Skills:
  - setvar{var=caster.combo;val=1} @self
  - state{s=attack_1} @self
  - damage{amount=10} @target
  - delay 15
  - skill{s=BOSS_combo_2} @self ?varequals{var=caster.combo;val=1}

BOSS_combo_2:
  Skills:
  - setvar{var=caster.combo;val=2} @self
  - state{s=attack_2} @self
  - damage{amount=15} @target
  - delay 20
  - skill{s=BOSS_combo_3} @self ?varequals{var=caster.combo;val=2}

BOSS_combo_3:
  Skills:
  - setvar{var=caster.combo;val=0} @self
  - state{s=attack_3_finisher} @self
  - damage{amount=25;ignoreArmor=true} @target
  - throw{velocity=15;velocityY=5} @target
  - effect:particles{p=crit;a=100} @target
\`\`\``;
    }

    if (options.counterMechanics) {
        prompt += `

**4. COUNTER-ATTACK SYSTEM**
React to player actions:
\`\`\`yaml
BOSS_counter_attack:
  TriggerConditions:
  - fieldofview{a=90;r=0} true  # Attacked from front
  Conditions:
  - stance{s=defensive} true
  Skills:
  - message{m="&e&lCOUNTERED!"} @trigger
  - damage{amount=15;ignoreArmor=true} @trigger
  - throw{velocity=8;velocityY=3} @trigger
  - effect:particles{p=crit;a=50} @trigger
  - variableMath{var=caster.counter_bonus;operation=ADD;value=1} @self

# Punish repetitive actions
BOSS_adaptive_defense:
  Conditions:
  - variableInRange{var=target.spam_count;val=>5} true
  Skills:
  - message{m="&c<caster.name> &fadapts to your pattern!"} @trigger
  - potion{type=WEAKNESS;duration=100;level=2} @trigger
  - damage{amount=20} @trigger
\`\`\``;
    }

    if (options.adaptiveDifficulty) {
        prompt += `

**5. ADAPTIVE DIFFICULTY**
Boss adjusts to fight duration:
\`\`\`yaml
# Track fight time
- setvar{var=caster.fight_timer;val=0} @self ~onCombat
- variableMath{var=caster.fight_timer;operation=ADD;value=1} @self ~onTimer:20

# Enrage if fight too long
BOSS_enrage_timeout:
  Conditions:
  - variableInRange{var=caster.fight_timer;val=>300}  # 5 minutes
  Skills:
  - message{m="&4<caster.name> &cENRAGES from exhaustion!"} @PIR{r=50}
  - setvar{var=caster.enraged;val=true} @self
  - potion{type=SPEED;duration=9999;level=1} @self
  - potion{type=INCREASE_DAMAGE;duration=9999;level=1} @self
  - setvar{var=caster.fight_timer;val=0} @self

# Track no-damage streak
- setvar{var=caster.no_hit_timer;val=0} @self ~onSpawn
- variableMath{var=caster.no_hit_timer;operation=ADD;value=1} @self ~onTimer:20
- setvar{var=caster.no_hit_timer;val=0} @self ~onDamaged

# Buff if player too good
- potion{type=REGENERATION;duration=100;level=2} @self ?variableInRange{var=caster.no_hit_timer;val=>60}
\`\`\``;
    }

    if (options.minionCoordination) {
        prompt += `

**6. MINION COORDINATION**
Boss and minions work together:
\`\`\`yaml
BOSS_rally_minions:
  Cooldown: 30
  Skills:
  - message{m="&e<caster.name> &frallies the troops!"} @PIR{r=50}
  - effect:sound{s=entity.ravager.roar;v=2;p=0.8} @self
  - potion{type=INCREASE_DAMAGE;duration=200;level=1} @MIR{r=30;types=MINION_TYPE}
  - potion{type=SPEED;duration=200;level=1} @MIR{r=30;types=MINION_TYPE}
  - heal{amount=50} @MIR{r=30;types=MINION_TYPE}

# Minions protect boss
MINION_protect_boss:
  Conditions:
  - entitytype{t=BOSS_TYPE} @PIR{r=10}
  TriggerConditions:
  - entitytype{t=BOSS_TYPE} @target
  Skills:
  - taunt @trigger
  - threat{amount=1000} @trigger
  - message{m="&eMinion protects the boss!"} @trigger

# Boss enrage when minions die
BOSS_minion_death_rage:
  Conditions:
  - mobsinradius{r=30;types=MINION_TYPE;a=<2} true
  Skills:
  - message{m="&c<caster.name> &4RAGES &cat fallen allies!"} @PIR{r=50}
  - setvar{var=caster.enraged;val=true} @self
  - potion{type=SPEED;duration=9999;level=1} @self
  - potion{type=INCREASE_DAMAGE;duration=9999;level=1} @self
\`\`\``;
    }

    if (options.environmentalHazards) {
        prompt += `

**7. ENVIRONMENTAL HAZARDS**
Boss manipulates arena:
\`\`\`yaml
BOSS_spawn_hazards:
  Cooldown: 40
  Skills:
  - message{m="&cThe arena becomes deadly!"} @PIR{r=50}
  - blockmask{m=MAGMA_BLOCK;r=5;d=10;na=true;oa=false} @ring{r=12;p=8}
  - summon{type=HAZARD_MOB;amount=4} @ring{r=10;p=4}
  - delay 200
  - blockmask{m=AIR;r=5;d=10;na=true;oa=true} @ring{r=12;p=8}

# Create safe zones
BOSS_safe_zone:
  Skills:
  - blockmask{m=LIGHT;r=3;d=5;oa=true} @self
  - effect:particles{p=totem;a=50;hs=3;vs=1;repeat=100;repeati=2} @self
\`\`\``;
    }

    prompt += `

**8. BOSS BAR MANAGEMENT**
Visual feedback with boss bar:
\`\`\`yaml
# Update on damage
- barSet{name="BOSS";value=<caster.hp>/<caster.mhp>;color=RED} @self ~onDamaged
- delay 5
- barSet{name="BOSS";value=<caster.hp>/<caster.mhp>;color=PURPLE} @self

# Change color on phase
- barSet{name="BOSS";value=<caster.hp>/<caster.mhp>;color=YELLOW} @self ?varequals{var=caster.phase;val=2}
\`\`\`

**9. MOVEMENT CONTROL**
Lock movement during attacks:
\`\`\`yaml
- setspeed{speed=0} @self  # Stop movement
- lockmodel{l=true} @self  # Lock rotation
- delay 40  # Attack animation
- setspeed{speed=0.3} @self  # Restore
- lockmodel{l=false} @self
\`\`\`

**10. SCREEN SHAKE EFFECT**
Impactful hits with recoil:
\`\`\`yaml
- recoil{r=20;pitch=-0.8} @PIR{r=32}
- delay 1
- recoil{r=20;pitch=0.6} @PIR{r=32}
\`\`\``;

    return prompt;
}