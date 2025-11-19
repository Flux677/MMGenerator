// ============================================
// MODULE: AI Complexity Guides
// ============================================

export function getAIComplexityGuide(aiComplexity) {
    const guides = {
        advanced: `
AI COMPLEXITY: ADVANCED

Features:
- ThreatTable system for aggro management
- Smart targeting (nearest, lowest HP, highest threat)
- Adaptive behavior based on conditions
- Dynamic skill priorities
- Target switching mechanics

Implementation:
\`\`\`yaml
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
- 3 avoidcombat{speed=1.3;d=5} ?health{h=<20%}

# Threat manipulation
Skills:
- threat{amount=500} @trigger ~onDamaged
- threatdrop{amount=100} @targeter ~onTimer:100
- taunt @trigger
\`\`\``,

        elite: `
AI COMPLEXITY: ELITE

Features:
- Variable-based state machine
- Decision trees for complex logic
- Counter-play mechanics
- Combo system tracking
- Phase-based behavior changes
- Learning patterns (basic)

Implementation:
\`\`\`yaml
# State tracking variables
Skills:
- setvar{var=caster.phase;val=1;type=INTEGER} @self ~onSpawn
- setvar{var=caster.stance;val=neutral;type=STRING} @self ~onSpawn
- setvar{var=caster.combo;val=0;type=INTEGER} @self ~onSpawn
- setvar{var=caster.last_skill;val=none;type=STRING} @self ~onSpawn

# Decision tree example
BOSS_decide_action:
  Conditions:
  - varequals{var=caster.phase;val=2} true
  Skills:
  - skill{s=PHASE2_AGGRESSIVE} @self ?varequals{var=caster.stance;val=aggressive}
  - skill{s=PHASE2_DEFENSIVE} @self ?varequals{var=caster.stance;val=defensive}
  - skill{s=PHASE2_NEUTRAL} @self ?varequals{var=caster.stance;val=neutral}

# Counter mechanics
BOSS_counter_attack:
  TriggerConditions:
  - fieldofview{a=90;r=0} true  # Attacked from front
  Skills:
  - message{m="&eCountered!"} @trigger
  - damage{a=15;ignorearmor=true} @trigger
  - throw{v=5;vy=2} @trigger
\`\`\``,

        nightmare: `
AI COMPLEXITY: NIGHTMARE

Features:
- Learns player patterns and adapts
- Punishes repetitive actions
- Adaptive AI that counters player tactics
- Memory of player behavior
- Complex state machines
- Predictive mechanics

Implementation:
\`\`\`yaml
# Track player patterns
Skills:
- setvar{var=target.action_history;val=[];type=STRING} @trigger ~onCombat
- variableAdd{var=target.same_action_count;amount=1} @trigger
- setvar{var=target.spam_detected;val=true} @trigger ?variableInRange{var=target.same_action_count;val=>5}

# Adaptive punishment
BOSS_punish_pattern:
  Conditions:
  - varequals{var=target.spam_detected;val=true}
  Skills:
  - message{m="&c<caster.name> adapts to your tactics!"} @trigger
  - damage{a=25;ignorearmor=true} @trigger
  - potion{type=WEAKNESS;d=100;l=2} @trigger
  - setvar{var=target.spam_detected;val=false} @trigger
  - setvar{var=target.same_action_count;val=0} @trigger

# Learning system
- variableMath{var=caster.player_dodges;operation=ADD;value=1} @self
- skill{s=COUNTER_DODGE} @self ?variableInRange{var=caster.player_dodges;val=>3}

# Predictive attacks
- setvar{var=target.movement_pattern;val=detected} @trigger
- skill{s=PREDICT_LOCATION} @self ?varequals{var=target.movement_pattern;val=detected}
\`\`\`

CRITICAL: Boss adapts in real-time, learns from player actions, and becomes harder if player uses same tactics!
`
    };

    return guides[aiComplexity] || guides.advanced;
}