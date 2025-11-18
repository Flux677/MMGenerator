// Vercel Serverless Function
// API Key akan diambil dari Environment Variables di Vercel Dashboard

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get API key from environment variables
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    
    if (!ANTHROPIC_API_KEY) {
        console.error('ANTHROPIC_API_KEY not found in environment variables');
        return res.status(500).json({ 
            error: 'Server configuration error: API key not configured' 
        });
    }

    try {
        const { 
            category, 
            difficulty = 'balanced',        // Default ke balanced
            aiComplexity = 'advanced',      // Default ke advanced
            description, 
            options = {}                     // Default ke empty object
        } = req.body;
        

        // Validation
        if (!category || !description) {
            return res.status(400).json({ 
                error: 'Missing required fields: category and description' 
            });
        }

        // Build comprehensive prompt with new features
        const prompt = buildAdvancedPrompt(category, difficulty, aiComplexity, description, options);

        // Call Claude API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 8000,
                temperature: 0.7,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Claude API Error:', errorText);
            throw new Error(`Claude API Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Extract text from response
        const textContent = data.content
            .filter(block => block.type === 'text')
            .map(block => block.text)
            .join('\n');

        // Parse JSON from response
        let result;
        try {
            // Try to extract JSON from markdown code blocks
            const jsonMatch = textContent.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch) {
                result = JSON.parse(jsonMatch[1]);
            } else {
                // Try direct JSON parse
                result = JSON.parse(textContent);
            }
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('Raw response:', textContent);
            
            // If parsing fails, return raw text in structured format
            result = {
                mobs: extractSection(textContent, 'mobs') || textContent,
                skills: extractSection(textContent, 'skills') || '',
                items: options.includeItems ? extractSection(textContent, 'items') : '',
                setup_guide: extractSection(textContent, 'setup') || 'See generated configurations above'
            };
        }

        // Ensure all required fields exist
        const finalResult = {
            mobs: result.mobs || '# No mobs configuration generated',
            skills: result.skills || '# No skills configuration generated',
            items: result.items || '# No items configuration',
            setup_guide: result.setup_guide || generateDefaultSetupGuide(category)
        };

        return res.status(200).json(finalResult);

    } catch (error) {
        console.error('Generation error:', error);
        return res.status(500).json({ 
            error: error.message || 'Failed to generate mob configuration',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

// Helper: Build ADVANCED comprehensive prompt
function buildAdvancedPrompt(category, difficulty, aiComplexity, description, options) {
    options = options || {};
    
    const categoryGuides = {
        boss: 'Boss tunggal dengan skill kompleks dan multiple phases',
        boss_dungeon: 'Boss utama beserta 2-3 jenis minion mobs untuk dungeon',
        miniboss: 'Mini boss dengan skill menengah, tidak terlalu kompleks',
        normal: 'Mob biasa untuk world exploration, skill simple'
    };

    const difficultyGuides = {
        balanced: {
            hp: '500-800',
            damage: '10-15',
            description: 'Balanced stats, fair mechanics, suitable for most players'
        },
        hard: {
            hp: '1000-1500',
            damage: '20-30',
            description: 'High HP and damage, complex attack patterns, requires skill'
        },
        nightmare: {
            hp: '300-500',
            damage: '35-50',
            description: 'LOW HP but DEVASTATING mechanics, one-shot potential, glass cannon style'
        },
        psychological: {
            hp: '600-800',
            damage: '8-12',
            description: 'Menegangkan: darkness effects, sound cues, stealth mechanics, jump scares'
        },
        souls: {
            hp: '700-1000',
            damage: '15-25',
            description: 'Pattern-based combat, telegraphed attacks (2s warning), punishing but FAIR'
        },
        swarm: {
            hp: '400-600',
            damage: '5-10',
            description: 'Low individual damage, summons MANY minions, overwhelming tactics'
        }
    };

    const aiComplexityGuides = {
        advanced: 'ThreatTable, smart targeting, adaptive behavior',
        elite: 'Variable-based state machine, decision trees, counter-play mechanics',
        nightmare: 'Learns player patterns, adaptive AI, punishes repetitive actions'
    };

    const diff = difficultyGuides[difficulty] || difficultyGuides.balanced;

    let prompt = `You are an EXPERT MythicMobs configuration generator. Create a ${categoryGuides[category]} with ${diff.description}.

=== DIFFICULTY: ${difficulty.toUpperCase()} ===
${diff.description}
Recommended Stats:
- Health: ${diff.hp}
- Damage: ${diff.damage}
- Adjust based on mechanics complexity

=== AI COMPLEXITY: ${aiComplexity.toUpperCase()} ===
${aiComplexityGuides[aiComplexity]}

=== USER REQUEST ===
${description}

=== CRITICAL ADVANCED REQUIREMENTS ===

1. **VARIABLE SYSTEM (MANDATORY for ${aiComplexity})**
   Use variables extensively for state tracking:
   \`\`\`yaml
   Skills:
   - setvar{var=caster.phase;val=1;type=INTEGER} @self ~onSpawn
   - setvar{var=caster.enraged;val=false;type=STRING} @self ~onSpawn
   - setvar{var=caster.combo_count;val=0;type=INTEGER} @self ~onSpawn
   - setvar{var=caster.last_skill;val=none;type=STRING} @self ~onSpawn
   \`\`\`

   Check variables in conditions:
   \`\`\`yaml
   Conditions:
   - varequals{var=caster.phase;val=2} true
   - variableInRange{var=caster.combo_count;val=>3} true
   \`\`\`

2. **STATE MACHINE IMPLEMENTATION**
   Boss should have clear states tracked by variables:
   - Phase (1, 2, 3)
   - Stance (aggressive, defensive, neutral)
   - Combo state
   - Enrage state
   - Special mode (transformed, powered up, etc)

`;

    if (options.phaseSystem) {
        prompt += `
3. **MULTI-PHASE SYSTEM (ENABLED)**
   Implement AT LEAST 2 phases with clear transitions:
   
   \`\`\`yaml
   # Phase Transition Example
   BOSS_phase_transition:
     Conditions:
     - health{h=<50%} true
     - varequals{var=caster.phase;val=1} true
     Skills:
     - setvar{var=caster.phase;val=2} @self
     - message{m="&c<caster.name> enters Phase 2!"} @PIR{r=50}
     - effect:particles{p=explosion;a=50;hs=2;vs=2} @self
     - potion{type=DAMAGE_RESISTANCE;d=100;l=2} @self
     - heal{amount=100} @self
     - summon{type=MINION_NAME;amount=3} @ring{r=5;p=3}
   \`\`\`

   Each phase should have:
   - Different skill priorities
   - New abilities unlock
   - Behavior changes
   - Visual indicators (particles, sounds)
`;
    }

    if (options.variableStates) {
        prompt += `
4. **ADVANCED VARIABLE USAGE (ENABLED)**
   Track everything with variables:
   
   \`\`\`yaml
   # Combo System
   - setvar{var=caster.combo;val=1} @self
   - setvar{var=caster.combo;val=2} ?varequals{var=caster.combo;val=1}
   - setvar{var=caster.combo;val=3} ?varequals{var=caster.combo;val=2}
   - setvar{var=caster.combo;val=0} ?varequals{var=caster.combo;val=3}
   
   # Cooldown Tracking
   - setvar{var=caster.ultimate_ready;val=false} @self
   - setvar{var=caster.ultimate_ready;val=true;delay=600} @self
   
   # Player Tracking
   - setvar{var=target.marked;val=true;duration=100} @trigger ~onDamaged
   
   # Adaptive Behavior
   - variableMath{var=caster.hit_count;operation=ADD;value=1} @self ~onDamaged
   - setvar{var=caster.defensive;val=true} ?variableInRange{var=caster.hit_count;val=>10}
   \`\`\`
`;
    }

    if (options.counterMechanics) {
        prompt += `
5. **COUNTER-ATTACK SYSTEM (ENABLED)**
   Boss responds to player actions:
   
   \`\`\`yaml
   # Counter Melee
   BOSS_counter_melee:
     TriggerConditions:
     - fieldofview{a=90;r=0} true  # Attacked from front
     Conditions:
     - varequals{var=caster.defensive;val=true}
     Skills:
     - message{m="&eCountered!"} @trigger
     - damage{a=10;ignorearmor=true} @trigger
     - throw{v=5;vy=2} @trigger
     - setvar{var=caster.counter_count;operation=ADD;value=1} @self
   
   # Punish Same Skill Spam
   BOSS_punish_pattern:
     TriggerConditions:
     - wearing{s=DIAMOND_HELMET} true  # Example: detect player equipment
     Conditions:
     - varequals{var=target.spam_detected;val=true}
     Skills:
     - message{m="&c<caster.name> adapts to your tactics!"} @trigger
     - damage{a=20} @trigger
     - potion{type=WEAKNESS;d=100;l=2} @trigger
   \`\`\`
`;
    }

    if (options.adaptiveDifficulty) {
        prompt += `
6. **ADAPTIVE DIFFICULTY (ENABLED)**
   Boss adjusts to player performance:
   
   \`\`\`yaml
   # Track Fight Duration
   - setvar{var=caster.fight_timer;val=0} @self ~onCombat
   - variableMath{var=caster.fight_timer;operation=ADD;value=1} @self ~onTimer:20
   
   # Buff if Fight Too Long
   BOSS_timeout_buff:
     Conditions:
     - variableInRange{var=caster.fight_timer;val=>300}  # 5 minutes
     Skills:
     - message{m="&c<caster.name> grows impatient!"} @PIR{r=50}
     - potion{type=INCREASE_DAMAGE;d=9999;l=0} @self
     - potion{type=SPEED;d=9999;l=1} @self
     - setvar{var=caster.fight_timer;val=0} @self
   
   # Debuff if Player Doing Too Well
   - setvar{var=caster.no_damage_timer;val=0} @self ~onSpawn
   - variableMath{var=caster.no_damage_timer;operation=ADD;value=1} @self ~onTimer:20
   - setvar{var=caster.no_damage_timer;val=0} @self ~onDamaged
   
   # Player Too Good = Boss Harder
   - potion{type=REGENERATION;d=100;l=2} @self ?variableInRange{var=caster.no_damage_timer;val=>60}
   \`\`\`
`;
    }

    if (options.minionCoordination) {
        prompt += `
7. **MINION COORDINATION (ENABLED)**
   Boss and minions work together:
   
   \`\`\`yaml
   # Boss Buffs Minions
   BOSS_rally_minions:
     Cooldown: 30
     Skills:
     - message{m="&e<caster.name> rallies the troops!"} @PIR{r=50}
     - potion{type=INCREASE_DAMAGE;d=200;l=1} @MIR{r=20;types=MINION_TYPE}
     - potion{type=SPEED;d=200;l=1} @MIR{r=20;types=MINION_TYPE}
     - heal{a=50} @MIR{r=20;types=MINION_TYPE}
   
   # Minions Protect Boss
   MINION_protect_boss:
     Conditions:
     - entitytype{t=BOSS_TYPE} @PIR{r=10}
     TriggerConditions:
     - entitytype{t=BOSS_TYPE} @target
     Skills:
     - taunt @trigger
     - threat{amount=500} @trigger
     - teleport{} @location{c=@BOSS}
   
   # Boss Enrage if Minions Die
   BOSS_minion_death_enrage:
     Conditions:
     - mobsinradius{r=30;types=MINION_TYPE;a=<3} true
     Skills:
     - setvar{var=caster.enraged;val=true} @self
     - message{m="&c<caster.name> ENRAGES!"} @PIR{r=50}
     - potion{type=SPEED;d=9999;l=1} @self
     - potion{type=INCREASE_DAMAGE;d=9999;l=1} @self
   \`\`\`
`;
    }

    if (options.environmentalHazards) {
        prompt += `
8. **ENVIRONMENTAL HAZARDS (ENABLED)**
   Boss interacts with arena:
   
   \`\`\`yaml
   # Spawn Hazards
   - summon{type=HAZARD_MOB;l=@ring{r=10;p=4}} @self
   - blockmask{m=MAGMA_BLOCK;r=5;d=10;na=true} @self
   - blockmask{m=LIGHT;r=3;d=5} @location
   
   # Arena Transformation
   BOSS_transform_arena:
     Cooldown: 60
     Conditions:
     - health{h=<30%} true
     Skills:
     - message{m="&cThe arena transforms!"} @PIR{r=50}
     - blockmask{m=LAVA;r=15;d=20;na=true;oa=false} @ring{r=15;p=8;y=0}
     - blockmask{m=AIR;r=8;d=5;oa=true} @self  # Safe zone
     - effect:sound{s=entity.ender_dragon.growl;v=2;p=0.5} @self
   \`\`\`
`;
    }

    if (difficulty === 'psychological') {
        prompt += `
=== PSYCHOLOGICAL HORROR MECHANICS ===
Since difficulty is PSYCHOLOGICAL, implement:

1. **Darkness System**
   - potion{type=DARKNESS;d=9999;l=2} @PIR{r=30}
   - potion{type=BLINDNESS;d=100;l=1} @PIR{r=30} ~onTimer:200
   - Limited vision = fear

2. **Sound Design**
   - Ambient sounds (breathing, heartbeat)
   - Directional audio cues
   - Jumpscare sounds on ambush
   - effect:sound{s=entity.warden.heartbeat;v=1;p=0.8} @PIR{r=30} ~onTimer:40

3. **Unpredictable Movement**
   - Random teleports behind player
   - Wall/ceiling positioning
   - Disappear and reappear
   - teleport{l=@ring{r=10;p=1;y=5}} @self ~onTimer:100

4. **Tension Building**
   - Long periods of stalking (no attack)
   - Detection-based aggro (sound/movement)
   - One-shot potential but avoidable
   - Screen shake effects

5. **Paranoia Mechanics**
   - Clone spawns (which is real?)
   - Fake sounds/particles
   - Random fear effects
   - potion{type=SLOW;d=100;l=3} @trigger  # Panic slow
`;
    }

    if (difficulty === 'souls') {
        prompt += `
=== SOULS-LIKE MECHANICS ===
Since difficulty is SOULS-LIKE, implement:

1. **Telegraph System**
   All major attacks MUST have 2-second warning:
   \`\`\`yaml
   BOSS_big_attack:
     Cooldown: 20
     Skills:
     # Telegraph phase
     - effect:particles{p=crit;a=100;hs=2;vs=2;repeat=40;repeati=1} @self
     - effect:sound{s=block.bell.use;v=1;p=0.5} @self
     - message{m="&e⚠ WARNING: Big attack incoming!"} @PIR{r=30}
     - delay 40
     # Actual attack
     - damage{a=30;ignorearmor=true} @PIR{r=8}
     - throw{v=10;vy=3} @PIR{r=8}
   \`\`\`

2. **Pattern Recognition**
   - Fixed attack sequences
   - Punish panic rolling
   - Reward patience
   - Clear openings after attacks

3. **Stamina Punishment**
   - Punish players who spam dodge/block
   - setvar{var=target.stamina;val=100} @trigger ~onCombat
   - variableMath{var=target.stamina;operation=SUB;value=20} @trigger (on dodge)
   - Exhausted = vulnerable

4. **Fair but Brutal**
   - Every death is player mistake
   - All attacks dodgeable
   - No random one-shots
   - Learning curve required
`;
    }

    if (difficulty === 'nightmare') {
        prompt += `
=== NIGHTMARE MODE MECHANICS ===
Since difficulty is NIGHTMARE:

1. **Glass Cannon Stats**
   - Health: ${diff.hp} (LOWER than normal)
   - Damage: ${diff.damage} (MUCH HIGHER)
   - Speed: 0.4-0.5 (FAST)
   - Armor: 0-5 (LOW)

2. **Instant Death Mechanics**
   - One-shot ultimate skill
   - BUT: Long telegraph (3-5s warning)
   - Clear dodge windows
   - Visual + audio warnings

3. **High Risk High Reward**
   - Boss dies fast IF player skilled
   - Player dies fast IF makes mistake
   - No healing for boss
   - Aggressive AI

4. **Insane Mechanics**
   - Teleport spam
   - Multiple projectiles
   - Clone explosions
   - Time manipulation
   - Reality warping effects
`;
    }

    prompt += `

=== MYTHICMOBS SYNTAX REFERENCE ===

**Variables & Conditions:**
\`\`\`yaml
# Set variable
- setvar{var=caster.variable_name;val=VALUE;type=STRING/INTEGER/FLOAT} @self
- setvar{var=caster.counter;val=0;duration=100} @self  # Temporary

# Math operations
- variableMath{var=caster.counter;operation=ADD/SUB/MULT/DIV;value=1} @self
- variableAdd{var=caster.hp_stolen;amount=<skill.var.damage-amount>} @self

# Check variable
- varequals{var=caster.phase;val=2} true
- variableInRange{var=caster.counter;val=>5} true
- variableInRange{var=caster.hp;val=<50} true

# Variable-based skills
- skill{s=PHASE_2_SKILLS} @self ?varequals{var=caster.phase;val=2}
\`\`\`

**Advanced AI:**
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
- 2 avoidcombat{speed=1.3;d=5} ?health{h=<20%}
- 3 randomstroll

# Threat manipulation
- threat{amount=500} @trigger ~onDamaged
- threatdrop{amount=100} @targeter ~onTimer:100
\`\`\`

**State System:**
\`\`\`yaml
# Set default states
- defaultstate{t=idle;s=idle_normal} @self
- defaultstate{t=walk;s=walk_normal} @self

# Change state
- state{s=attack_combo_1;p=3} @self
- state{s=enraged_idle;lo=5} @self  # Loop
- state{s=current_state;r=true} @self  # Remove

# Lock model during animation
- lockmodel{l=true} @self
- lockmodel{l=false;delay=60} @self
\`\`\`

**Combo System:**
\`\`\`yaml
BOSS_combo_starter:
  Cooldown: 15
  Skills:
  - setvar{var=caster.combo;val=1} @self
  - state{s=combo_1} @self
  - damage{a=10} @target
  - delay 20
  - skill{s=BOSS_combo_2} @self ?varequals{var=caster.combo;val=1}

BOSS_combo_2:
  Skills:
  - setvar{var=caster.combo;val=2} @self
  - state{s=combo_2} @self
  - damage{a=15} @target
  - delay 25
  - skill{s=BOSS_combo_3} @self ?varequals{var=caster.combo;val=2}

BOSS_combo_3:
  Skills:
  - setvar{var=caster.combo;val=0} @self
  - state{s=combo_3_finisher} @self
  - damage{a=25;ignorearmor=true} @target
  - throw{v=15;vy=5} @target
\`\`\`

**Advanced MythicMobs Premium Mechanics:**
\`\`\`yaml
# TOTEM for precise hitbox
- totem{md=2;oH=DAMAGE_SKILL;hr=3;vr=4;drawhitbox=false;delay=20;repeat=5;repeati=1} @forward{f=1}

# PROJECTILE advanced
- projectile{
    bulletType=MOB;
    oS=[ - effect:particles{p=flame;a=10}];
    oH=HIT_SKILL;
    oT=TICK_SKILL;
    oE=END_SKILL;
    interpolation=4;
    v=20;
    i=1;
    hR=2;
    vR=2;
    md=50;
    ac=0.98;
    hnp=true;
    origin=@self;
    fromorigin=true;
    sE=false;
    g=-0.05;
    bounce=true;
    bv=0.5
  }

# MISSILE tracking
- missile{
    ot=TICK_SKILL;
    oH=HIT_SKILL;
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
  }

# THROW advanced
- throw{v=10;vy=4} @target
- throw{velocity=5;velocityY=2} @PIR{r=8}

# PROPEL for dash
- propel{v=2} @forward{f=5}
- propel{v=0.25;repeat=15;repeati=1} @target

# LUNGE attack
- lunge{v=3;vy=1} @target

# MOUNT for grab
- mount{} @target
- DismountAll{} @self

# VELOCITY control
- velocity{m=set;x=0;y=10;z=0} @self
- velocity{m=add;x=1;y=0;z=1} @self

# SUMMON advanced
- summon{
    t=MOB_TYPE;
    amount=3;
    radius=5;
    yoffset=2;
    yaw=<random.float.-90to90>;
    velocity=2;
    velocityY=4;
    onSurface=true
  } @ring{r=8;p=8}

# BLOCKMASK for arena
- blockmask{m=LAVA;r=10;d=20;na=true;oa=false} @ring{r=12;p=16}
- blockmask{m=LIGHT;r=3;d=5;oa=true} @self

# SETSTANCE for behavior
- setstance{stance=rage} @self
- setstance{stance=defensive} @self

# BODYROTATION control
- bodyrotation{mh=30;mb=30;rde=40;rdu=60} @self
- bodyrotation{mh=0;mb=0;rde=0;rdu=0} @self

# LOCKMODEL during animation
- lockmodel{l=true} @self
- lockmodel{l=false;delay=60} @self

# STATE animation
- state{s=attack_combo;p=3} @self
- state{s=current_state;r=true} @self  # Remove
- state{s=idle;lo=5} @self  # Loop

# DEFAULTSTATE
- defaultstate{t=idle;s=idle_aggressive} @self
- defaultstate{t=walk;s=walk_fast} @self

# SETSPEED dynamic
- setspeed{t=walking;s=0} @self
- setspeed{t=walking;s=2;delay=40} @self
- setspeed{speed=1.5;repeat=10;repeati=1} @self

# GCD global cooldown
- gcd{ticks=100} @self

# OFFGCD condition
Conditions:
- offgcd true

# SETAI control
- setAI{ai=false} @self
- setAI{ai=true;delay=100} @self

# LOOK mechanic
- look{l=force;repeat=60;repeati=1} @target
- look{headOnly=true;immediately=true} @target

# GOTO pathfinding
- goto{speedModifier=1;sh=2;sv=2} @target

# SIGNAL coordination
- signal{s=ATTACK_NOW} @MIR{r=20}

# TAUNT aggro
- taunt @trigger
- threat{amount=1000} @trigger

# BRIGHTNESS (if using glowing mobs)
- brightness{b=15;s=15} @self
- brightness{b=-1;s=-1} @self  # Reset

# RECOIL screen shake
- recoil{r=20;pitch=-0.8} @PIR{r=32}
- delay 1
- recoil{r=20;pitch=0.6} @PIR{r=32}

# SETTARGETSCORE objective tracking
- settargetscore{o=phase;v=2} @self
- modifytargetscore{objective=counter;action=add;value=1} @self

# SCORE conditions
Conditions:
- score{o=phase;v=2} true
- score{o=enraged;v=1} true

# RUNAITARGETSELECTOR
- runaitargetselector{target=players} @self

# POTIONCLEAR
- potionclear{} @self

# CANCELEVENT
- CancelEvent{sync=true} @self ~onInteract
- CancelEvent{sync=true} @self ~onAttack

# REMOVE entity
- remove{delay=100} @self
- remove @children{target=markers}

# DROPITEM
- dropitem{i=CUSTOM_ITEM;amount=1} @self

# STOPSOUND
- stopsound{s=sound_name} @PIR{r=32}

# SETROTATION
- setrotation{yaw=90} @self
- setrotation{relative=true;pitch=<random.float.-90to90>} @self

# RANDOMSKILL
- randomskill{
    skills=[ - skill{s=SKILL_A}],
           [ - skill{s=SKILL_B}],
           [ - skill{s=SKILL_C}]
  } @self
\`\`\`

**Advanced Targeters:**
\`\`\`yaml
@self
@target
@trigger  # Entity that triggered
@children{target=markers}  # Summoned entities
@ModelPassengers  # Mounted entities

# Player targeters
@PIR{r=10}  # Players in radius
@PIR{r=20;sort=NEAREST}  # Nearest player
@PIR{r=30;limit=1}  # One player
@NearestPlayer{r=16}
@PlayersInRadius{r=12;conditions=[...]}

# Entity targeters
@EIR{r=10}  # Entities in radius
@EIRR{min=5;max=15}  # Entity in radius range
@LivingInRadius{r=12}
@LivingInCone{a=180;r=12}  # Cone area
@MIR{r=20;types=ZOMBIE}  # Mobs in radius specific type
@MobsInRadius{r=30;types=MINION_TYPE;a=>3}  # Count check

# Location targeters  
@forward{f=5}  # 5 blocks forward
@forward{f=5;lp=true}  # Lock to pitch
@Ring{r=8;p=8}  # Circle of 8 points
@Ring{radius=5;points=12;y=2}
@Circle{radius=10;points=16}
@Line{r=10;p=5}  # Line pattern
@Cone{a=90;r=10;p=8}  # Cone pattern

# Special targeters
@Origin  # Spawn location
@RLNTE  # Random location near target entity
@targetlocation  # Target's location
@selflocation  # Self location
@FOT  # Forward of target

# Filters
@target{conditions=[
  - distance{d=<10}
  - health{h=>50%}
]}

# Sort options
sort=NEAREST
sort=FURTHEST  
sort=LOWEST_HEALTH
sort=HIGHEST_HEALTH
sort=RANDOM

# Limit
limit=1  # Only 1 target
limit=5  # Max 5 targets
\`\`\`

=== LIBDISGUISES INTEGRATION ===
MANDATORY: Use LibDisguises for visual (NO MODEL ENGINE!)
\`\`\`yaml
Disguise:
  Type: PLAYER
  Player: SkinName
  Skin: SkinName

# OR for mob type
Disguise:
  Type: WITHER_SKELETON
  Glowing: true
  CustomName: "&c&lBoss Name"
  
# Advanced options
Disguise:
  Type: ZOMBIE
  Baby: true
  Burning: false
  ShowName: true
\`\`\`

CRITICAL: DO NOT use Model Engine mechanics like:
- model{m=...} (Model Engine only!)
- partvis (Model Engine only!)
- modelpart (Model Engine only!)
- changepart (Model Engine only!)

Instead use:
- LibDisguises for appearance
- Armor stands untuk effects
- Particles untuk visuals
- Summon entities untuk props

=== OUTPUT FORMAT ===
Return JSON with complete, production-ready configurations:
\`\`\`json
{
  "mobs": "# Complete Mobs.yml with ALL features",
  "skills": "# Complete Skills.yml with ALL mechanics",
  "items": "# Items if requested",
  "setup_guide": "# Detailed setup guide"
}
\`\`\`

=== CRITICAL IMPLEMENTATION NOTES ===

Based on REAL production bosses (Tower Skeleton, Mega Warden, Pumpkin King):

1. **NO MODEL ENGINE**: User does NOT have Model Engine. Use LibDisguises ONLY!
   - ❌ NO: model{m=...}, partvis, modelpart, changepart
   - ✅ YES: Disguise, armor stands, particles, summons

2. **TOTEM for Hitboxes**: Use totem for ALL melee attacks
   ```yaml
   - totem{md=2;oH=DAMAGE_SKILL;hr=3;vr=4;delay=20;repeat=5;repeati=1} @forward{f=1}
   ```

3. **Variables Extensively**: Track EVERYTHING
   - Phase tracking
   - Combo states
   - Shield HP
   - Cooldowns
   - Player patterns

4. **Boss Bar Management**: Flash on damage, change color on phase
   ```yaml
   - barSet{name="BOSS";value=<caster.hp>/<caster.mhp>;color=WHITE} @self
   - delay 2
   - barSet{name="BOSS";value=<caster.hp>/<caster.mhp>;color=PURPLE} @self
   ```

5. **Movement Control**: 
   - setspeed{s=0} during attacks
   - lockmodel during animations
   - Restore after

6. **Projectiles**: Use advanced projectile system with tick/hit/end events

7. **Sound Design**: Multiple sounds per attack (grunt, swing, impact)

8. **Particle Effects**: Rich particle usage for polish

9. **Recoil**: Screen shake for impactful hits
   ```yaml
   - recoil{r=20;pitch=-0.8} @PIR{r=32}
   - delay 1
   - recoil{r=20;pitch=0.6} @PIR{r=32}
   ```

10. **Inline Conditions**: Use for dynamic behavior
    ```yaml
    - damage{a=20} @target ?varequals{var=caster.enraged;val=true}
    ```

Generate a LIVING, BREATHING mob with true AI behavior!
Make this boss MEMORABLE and UNIQUE!
Push MythicMobs to its LIMITS!
`;

    return prompt;
}
    const categoryGuides = {
        boss: 'Boss tunggal dengan skill kompleks dan multiple phases',
        boss_dungeon: 'Boss utama beserta 2-3 jenis minion mobs untuk dungeon',
        miniboss: 'Mini boss dengan skill menengah, tidak terlalu kompleks',
        normal: 'Mob biasa untuk world exploration, skill simple'
    };

    let prompt = `Kamu adalah expert MythicMobs configuration generator. Generate konfigurasi LENGKAP dan VALID untuk: ${categoryGuides[category]}

DESKRIPSI REQUEST:
${description}

CRITICAL REQUIREMENTS:
1. WAJIB gunakan LibDisguises untuk visual (JANGAN gunakan ModelEngine/plugin berbayar)
2. Syntax HARUS 100% sesuai MythicMobs Wiki
3. Base Type HARUS vanilla Minecraft mob (ZOMBIE, SKELETON, IRON_GOLEM, dll)
4. Skills harus balanced dan menarik
5. Output HARUS dalam format JSON yang valid

`;

    if (category === 'boss_dungeon') {
        prompt += `STRUKTUR UNTUK BOSS + DUNGEON:
- 1 Boss utama dengan nama format: <NAMA>_BOSS
- 2-3 jenis minion dengan nama format: <NAMA>_MINION_1, <NAMA>_MINION_2
- Boss bisa summon minion
- Minion mendukung boss dalam combat

`;
    }

    if (options.advancedAI) {
        prompt += `AI MODULES:
- Implementasikan ThreatTable untuk aggro management
- Custom AITargetSelectors dan AIGoalSelectors
- Behavior yang intelligent

`;
    }

    if (options.particleEffects) {
        prompt += `VISUAL EFFECTS:
- Gunakan particle effects dari https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/Skills/Mechanics/Particle/Particle-Types
- Effect untuk skill animations
- Ambient particles untuk atmosphere

`;
    }

    prompt += `LIBDISGUISES SYNTAX:
Format 1 - Player Skin:
Disguise:
  Type: PLAYER
  Player: <username>
  Skin: <username>

Format 2 - Mob Type:
Disguise:
  Type: <MOB_TYPE>
  Baby: true/false

Valid Types: ZOMBIE, SKELETON, WITHER_SKELETON, STRAY, PIGLIN, HOGLIN, RAVAGER, VEX, PILLAGER, VINDICATOR, EVOKER, dll

MYTHICMOBS SYNTAX REFERENCE:

MOBS Configuration:
\`\`\`yaml
INTERNAL_NAME:
  Type: <MINECRAFT_MOB_TYPE>
  Display: '&c&lDisplay Name'
  Health: 100
  Damage: 10
  Armor: 5
  Disguise:
    Type: PLAYER
    Player: Herobrine
  Options:
    MovementSpeed: 0.3
    FollowRange: 32
    KnockbackResistance: 0.5
    PreventOtherDrops: true
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
  - skill{s=SKILL_NAME} @self ~onDamaged
  Drops:
  - DIAMOND 1-3 1.0
\`\`\`

SKILLS Configuration:
\`\`\`yaml
SKILL_NAME:
  Cooldown: 10
  Conditions:
  - distance{d=<10} true
  TargetConditions:
  - haspotioneffect{type=POISON} false
  Skills:
  - damage{amount=10} @target
  - effect:particles{p=flame;a=50;hs=1;vs=1} @self
  - message{m="<caster.name> used skill!"} @PIR{r=30}
\`\`\`

Key Mechanics:
- damage{amount=X;ignoreArmor=true}
- projectile{v=10;i=1;hs=true}
- summon{type=MOB_NAME;amount=3}
- teleport{} @target
- throw{velocity=5;velocityY=2}
- potion{type=SLOW;duration=100;level=1}
- particles{particle=FLAME;amount=10}
- sound{s=ENTITY_ENDER_DRAGON_GROWL;v=1;p=1}

Targeters:
- @self
- @target
- @PIR{r=10} (Players in radius)
- @EIR{r=10} (Entities in radius)
- @Ring{radius=5;points=8}
- @Forward{f=5}

Triggers:
- ~onTimer:100 (every 5 seconds)
- ~onAttack
- ~onDamaged
- ~onSpawn
- ~onDeath

OUTPUT FORMAT (STRICT JSON):
Berikan response dalam JSON dengan format berikut:
\`\`\`json
{
  "mobs": "# MythicMobs configuration\\nINTERNAL_NAME:\\n  Type: ZOMBIE\\n  ...",
  "skills": "# Skills configuration\\nSKILL_NAME:\\n  Skills:\\n  - ...",
  "items": "${options.includeItems ? '# Items configuration\\nITEM_NAME:\\n  ...' : '# Items not requested'}",
  "setup_guide": "# Setup Guide\\n1. Copy Mobs.yml to plugins/MythicMobs/Mobs/\\n2. ..."
}
\`\`\`

IMPORTANT NOTES:
- Jangan gunakan ModelEngine, Model Engine, atau plugin model 3D berbayar
- HANYA gunakan LibDisguises untuk disguise
- Escape special characters dalam JSON string
- Gunakan \\n untuk newline dalam string
- Test semua syntax sesuai Wiki MythicMobs
- Base mob Type harus vanilla (ZOMBIE, SKELETON, etc)

Generate konfigurasi yang production-ready dan siap pakai!`;

    return prompt;
}

// Helper: Extract section from text
function extractSection(text, sectionName) {
    const patterns = [
        new RegExp(`# ${sectionName}[\\s\\S]*?(?=\\n#|$)`, 'i'),
        new RegExp(`${sectionName}[\\s\\S]*?(?=\\n\\n|$)`, 'i')
    ];
    
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) return match[0];
    }
    
    return null;
}

// Helper: Generate default setup guide
function generateDefaultSetupGuide(category) {
    return `# Setup Guide - ${category.toUpperCase()}

## Installation

1. Install required plugins:
   - MythicMobs (latest version)
   - LibDisguises (latest version)
   - ProtocolLib (dependency for LibDisguises)

2. Copy generated configurations:
   - Mobs.yml → plugins/MythicMobs/Mobs/
   - Skills.yml → plugins/MythicMobs/Skills/
   - Items.yml → plugins/MythicMobs/Items/ (if generated)

3. Reload MythicMobs:
   /mm reload

## Spawning Mobs

Command: /mm mobs spawn <INTERNAL_NAME> [amount]

Example: /mm mobs spawn CUSTOM_BOSS 1

## Testing

1. Spawn the mob in a safe area
2. Test all skills and mechanics
3. Adjust Health/Damage values as needed
4. Fine-tune cooldowns and ranges

## Troubleshooting

- If disguise not working: Check LibDisguises installation
- If skills not firing: Check conditions and cooldowns
- For errors: Check /mm reload output

## Additional Resources

- MythicMobs Wiki: https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/home
- LibDisguises Wiki: https://www.spigotmc.org/resources/libsdisguises.81/
`;
}