// Vercel Serverless Function - FIXED VERSION
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
        // ✅ FIX: Tambahkan default values untuk parameter baru
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
    // ✅ FIX: Tambahkan null check untuk options
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
${aiComplexityGuides[aiComplexity] || aiComplexityGuides.advanced}

=== USER REQUEST ===
${description}

=== MYTHICMOBS SYNTAX REFERENCE ===

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
    Skin: Herobrine
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
  Skills:
  - damage{amount=10} @target
  - effect:particles{p=flame;a=50;hs=1;vs=1} @self
  - message{m="<caster.name> used skill!"} @PIR{r=30}
\`\`\`

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