<<<<<<< HEAD
// Vercel Serverless Function
=======
// Vercel Serverless Function - FIXED VERSION
>>>>>>> 2e6cd79 (Memperbaiki)
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
<<<<<<< HEAD
        const { category, description, options } = req.body;
=======
        // ✅ FIX: Tambahkan default values untuk parameter baru
        const { 
            category, 
            difficulty = 'balanced',        // Default ke balanced
            aiComplexity = 'advanced',      // Default ke advanced
            description, 
            options = {}                     // Default ke empty object
        } = req.body;
>>>>>>> 2e6cd79 (Memperbaiki)

        // Validation
        if (!category || !description) {
            return res.status(400).json({ 
                error: 'Missing required fields: category and description' 
            });
        }

<<<<<<< HEAD
        // Build comprehensive prompt
        const prompt = buildPrompt(category, description, options);
=======
        // Build comprehensive prompt with new features
        const prompt = buildAdvancedPrompt(category, difficulty, aiComplexity, description, options);
>>>>>>> 2e6cd79 (Memperbaiki)

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

<<<<<<< HEAD
// Helper: Build comprehensive prompt
function buildPrompt(category, description, options) {
=======
// Helper: Build ADVANCED comprehensive prompt
function buildAdvancedPrompt(category, difficulty, aiComplexity, description, options) {
    // ✅ FIX: Tambahkan null check untuk options
    options = options || {};
    
>>>>>>> 2e6cd79 (Memperbaiki)
    const categoryGuides = {
        boss: 'Boss tunggal dengan skill kompleks dan multiple phases',
        boss_dungeon: 'Boss utama beserta 2-3 jenis minion mobs untuk dungeon',
        miniboss: 'Mini boss dengan skill menengah, tidak terlalu kompleks',
        normal: 'Mob biasa untuk world exploration, skill simple'
    };

<<<<<<< HEAD
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
=======
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
${aiComplexityGuides[aiComplexity] || aiComplexityGuides.advanced}

=== USER REQUEST ===
${description}

=== MYTHICMOBS SYNTAX REFERENCE ===
>>>>>>> 2e6cd79 (Memperbaiki)

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
<<<<<<< HEAD
=======
    Skin: Herobrine
>>>>>>> 2e6cd79 (Memperbaiki)
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
<<<<<<< HEAD
  TargetConditions:
  - haspotioneffect{type=POISON} false
=======
>>>>>>> 2e6cd79 (Memperbaiki)
  Skills:
  - damage{amount=10} @target
  - effect:particles{p=flame;a=50;hs=1;vs=1} @self
  - message{m="<caster.name> used skill!"} @PIR{r=30}
\`\`\`

<<<<<<< HEAD
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
=======
OUTPUT FORMAT (STRICT JSON):
\`\`\`json
{
  "mobs": "# Complete Mobs.yml configuration",
  "skills": "# Complete Skills.yml configuration",
  "items": "${options.includeItems ? '# Items configuration' : '# Items not requested'}",
  "setup_guide": "# Setup guide"
}
\`\`\`

CRITICAL REQUIREMENTS:
1. Use LibDisguises for visual (NO ModelEngine)
2. Valid MythicMobs syntax only
3. Base Type MUST be vanilla Minecraft mob
4. Production-ready configurations
5. Return valid JSON format

Generate a complete, working configuration!`;
>>>>>>> 2e6cd79 (Memperbaiki)

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