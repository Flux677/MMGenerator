// ============================================
// FILE: api/generate.js (IMPROVED v3.0)
// Main generator with enhanced prompt system
// ============================================

// Import improved prompt modules
import { buildMainPrompt } from './prompts/main.js';
import { getDifficultyGuide } from './prompts/difficulty.js';
import { getAIComplexityGuide } from './prompts/ai-complexity.js';
import { getFeaturePrompts } from './prompts/features.js';
import { getSyntaxReference } from './prompts/syntax.js';
import { getAdvancedMechanics } from './prompts/advanced.js';
import { getVisualEffectPrompts } from './prompts/visual-effects.js';
import { getAIBehaviorPrompts } from './prompts/ai-behavior.js';
import { getHealingTowerPrompts } from './prompts/healing-tower.js';
import { getDeathRewardPrompts } from './prompts/death-rewards.js';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    
    if (!ANTHROPIC_API_KEY) {
        console.error('ANTHROPIC_API_KEY not found');
        return res.status(500).json({ 
            error: 'Server configuration error: API key not configured' 
        });
    }

    try {
        const { 
            category, 
            difficulty = 'balanced',
            aiComplexity = 'advanced',
            description, 
            options = {}
        } = req.body;

        if (!category || !description) {
            return res.status(400).json({ 
                error: 'Missing required fields: category and description' 
            });
        }

        // Validate description length
        if (description.length < 20) {
            return res.status(400).json({
                error: 'Description too short. Please provide more details (at least 20 characters).'
            });
        }

        // Build enhanced prompt
        const prompt = buildEnhancedPrompt(category, difficulty, aiComplexity, description, options);

        console.log('Calling Claude API with enhanced prompt system...');
        console.log('Features enabled:', {
            phaseSystem: options.phaseSystem,
            customAI: options.customAIBehavior,
            healingTowers: options.healingTowerSystem,
            deathReward: options.bossDeathReward,
            visualEffects: options.spawnAuraEffect || options.spawnHologram || options.summonMechanic
        });

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 16000,
                temperature: 0.8,  // Higher creativity for better mob designs
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Claude API Error:', response.status, errorText);
            throw new Error(`Claude API Error: ${response.status}`);
        }

        const data = await response.json();
        const textContent = data.content
            .filter(block => block.type === 'text')
            .map(block => block.text)
            .join('\n');

        // Parse JSON response
        let result;
        try {
            const jsonMatch = textContent.match(/```json\s*\n([\s\S]*?)\n```/);
            if (jsonMatch) {
                result = JSON.parse(jsonMatch[1]);
            } else {
                result = JSON.parse(textContent);
            }
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.log('Raw response:', textContent.substring(0, 500));
            
            // Fallback: Extract sections manually
            result = {
                mobs: extractSection(textContent, 'mobs') || textContent,
                skills: extractSection(textContent, 'skills') || '',
                items: options.includeItems ? extractSection(textContent, 'items') : '',
                setup_guide: extractSection(textContent, 'setup') || generateDefaultSetupGuide(category, options)
            };
        }

        const finalResult = {
            mobs: result.mobs || '# No mobs configuration generated',
            skills: result.skills || '# No skills configuration generated',
            items: result.items || '# No items configuration',
            setup_guide: result.setup_guide || generateDefaultSetupGuide(category, options)
        };

        // Add metadata
        finalResult.metadata = {
            generated_at: new Date().toISOString(),
            category,
            difficulty,
            aiComplexity,
            features: Object.keys(options).filter(k => options[k] === true)
        };

        console.log('Generation successful!');
        return res.status(200).json(finalResult);

    } catch (error) {
        console.error('Generation error:', error);
        return res.status(500).json({ 
            error: error.message || 'Failed to generate configuration'
        });
    }
}

// ============================================
// BUILD ENHANCED PROMPT (v3.0)
// ============================================
function buildEnhancedPrompt(category, difficulty, aiComplexity, description, options) {
    options = options || {};
    
    // Core prompts
    const mainPrompt = buildMainPrompt(category, difficulty, aiComplexity, description);
    const diffGuide = getDifficultyGuide(difficulty);
    const aiGuide = getAIComplexityGuide(aiComplexity);
    const featurePrompts = getFeaturePrompts(options, difficulty);
    const syntaxRef = getSyntaxReference();
    const advancedMech = getAdvancedMechanics();
    
    // Visual effects
    const visualEffects = getVisualEffectPrompts({
        spawnAuraEffect: options.spawnAuraEffect,
        spawnHologram: options.spawnHologram,
        summonMechanic: options.summonMechanic,
        summonMethod: options.summonMethod
    });
    
    // Custom AI Behavior
    const aiBehaviorPrompts = options.customAIBehavior ? getAIBehaviorPrompts(options.aiBehavior) : '';
    
    // Healing Tower System
    const healingTowerPrompts = options.healingTowerSystem ? getHealingTowerPrompts({
        towerCount: options.towerCount,
        towerHealPower: options.towerHealPower,
        towerHP: options.towerHP,
        towerRespawn: options.towerRespawn
    }) : '';
    
    // Death Reward System
    const deathRewardPrompts = options.bossDeathReward ? getDeathRewardPrompts(options.deathReward) : '';
    
    // Build final prompt
    let fullPrompt = `${mainPrompt}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIFFICULTY PRESET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${diffGuide}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI COMPLEXITY LEVEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${aiGuide}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ENABLED FEATURES & MECHANICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${featurePrompts}

${visualEffects ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VISUAL SPAWN EFFECTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${visualEffects}
` : ''}

${aiBehaviorPrompts ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUSTOM AI BEHAVIOR SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${aiBehaviorPrompts}
` : ''}

${healingTowerPrompts ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HEALING TOWER MECHANIC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${healingTowerPrompts}
` : ''}

${deathRewardPrompts ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BOSS DEATH REWARD SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${deathRewardPrompts}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MYTHICMOBS SYNTAX REFERENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${syntaxRef}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADVANCED MECHANICS & PATTERNS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${advancedMech}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINAL REQUIREMENTS CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ LibDisguises ONLY (NO ModelEngine)
✅ Valid MythicMobs syntax (100% accurate)
✅ Base Type = vanilla Minecraft mob
✅ ALL major attacks telegraphed (difficulty appropriate)
✅ Production-ready configurations
✅ Return valid JSON format ONLY
${options.phaseSystem ? '✅ Multi-phase system with dramatic transitions' : ''}
${options.customAIBehavior ? `✅ ${options.aiBehavior} AI behavior pattern` : ''}
${options.healingTowerSystem ? `✅ ${options.towerCount} healing tower(s) with ${options.towerHealPower} heal power` : ''}
${options.bossDeathReward ? `✅ ${options.deathReward} death reward mechanic` : ''}
${options.summonMechanic ? '✅ Custom summon mechanic with SPAWNER mob' : ''}
${options.bossBarSystem ? '✅ Dynamic Boss Bar with phase updates' : ''}
${options.soundSystem ? '✅ Layered sound design for atmosphere' : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JSON OUTPUT FORMAT (STRICT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Return ONLY this JSON structure:

\`\`\`json
{
  "mobs": "# Complete Mobs.yml configuration\\n# Use \\\\n for newlines\\n...",
  "skills": "# Complete Skills.yml configuration\\n...",
  "items": "${options.includeItems ? '# Items.yml configuration\\n...' : '# Items not requested'}",
  "setup_guide": "# Setup guide with installation steps\\n..."
}
\`\`\`

⚠️ CRITICAL REMINDERS:
- Create configs that are MEMORABLE and EXCITING
- Telegraph attacks clearly (visual + audio + text)
- Include recovery windows after big attacks
- Balance challenge with fairness
- Make boss feel ALIVE and REACTIVE
- Add EMOTIONAL MOMENTS (tension, climax, relief)
- Think CINEMATIC - this is an experience, not just stats

NOW GENERATE THE MOST EPIC, TENSION-FILLED BOSS CONFIGURATION!`;

    return fullPrompt;
}

// ============================================
// HELPER FUNCTIONS
// ============================================
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

function generateDefaultSetupGuide(category, options) {
    const features = [];
    if (options.customAIBehavior) features.push(`Custom AI: ${options.aiBehavior}`);
    if (options.healingTowerSystem) features.push(`Healing Towers: ${options.towerCount}x`);
    if (options.bossDeathReward) features.push(`Death Reward: ${options.deathReward}`);
    if (options.summonMechanic) features.push(`Summon: ${options.summonMethod}`);
    
    let guide = `# MythicMobs Setup Guide
# Category: ${category.toUpperCase()}
# Generated: ${new Date().toLocaleString()}

## Prerequisites
✅ Minecraft Server (Spigot/Paper 1.16+)
✅ MythicMobs plugin (latest version recommended)
✅ LibDisguises plugin (latest version)
✅ ProtocolLib (dependency for LibDisguises)

## Installation Steps

1. **Install Required Plugins**
   - Download MythicMobs from SpigotMC
   - Download LibDisguises from SpigotMC  
   - Download ProtocolLib from SpigotMC
   - Place all .jar files in /plugins/ folder
   - Restart server

2. **Copy Configuration Files**
   \`\`\`
   Mobs.yml    → /plugins/MythicMobs/Mobs/
   Skills.yml  → /plugins/MythicMobs/Skills/
   ${options.includeItems ? 'Items.yml   → /plugins/MythicMobs/Items/' : ''}
   \`\`\`

3. **Reload MythicMobs**
   \`\`\`
   /mm reload
   \`\`\`
   Check console for any errors.

## Spawning
\`\`\`
/mm mobs spawn <MOB_INTERNAL_NAME> 1
\`\`\`

## Enabled Features
${features.length > 0 ? features.map(f => `- ${f}`).join('\n') : '- Standard boss configuration'}

${options.healingTowerSystem ? `
## Healing Tower System
- ${options.towerCount} tower(s) spawn automatically within 20 blocks
- Towers heal boss every second (${options.towerHealPower} heal power)
- Players MUST destroy towers to stop healing
- Tower HP: ${options.towerHP}
${options.towerRespawn !== 'false' ? `- Respawn Time: ${options.towerRespawn} seconds` : '- No respawn (destroy once)'}
` : ''}

${options.bossDeathReward ? `
## Boss Death Reward
- Type: ${options.deathReward.replace('_', ' ')}
- Triggers automatically on boss death
- See in-game for reward details
` : ''}

${options.summonMechanic ? `
## Custom Summon System
- Method: ${options.summonMethod.replace('_', ' ')}
- Refer to mob configuration for setup details
- DO NOT use /mm mobs spawn for this boss!
` : ''}

## Testing Checklist
- [ ] Mob spawns without errors
- [ ] All skills function correctly
- [ ] Phase transitions work (if enabled)
- [ ] Visual effects display properly
- [ ] Sound effects play correctly
- [ ] Custom features work as intended
- [ ] Balance feels appropriate

## Troubleshooting
**Mob doesn't spawn:**
- Check /mm reload for syntax errors
- Verify base Type is valid vanilla mob
- Check console logs

**Skills not working:**
- Verify skill names match in Mobs.yml
- Check cooldown values
- Test triggers with /mm test

**Disguise not showing:**
- Ensure LibDisguises + ProtocolLib installed
- Check /disguise command works
- Verify skin name exists (for player disguises)

**Performance issues:**
- Reduce particle amounts
- Increase skill cooldowns
- Limit active mob count

## Resources
- MythicMobs Wiki: https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/home
- LibDisguises: https://www.spigotmc.org/resources/libsdisguises.81/
- Support: Check MythicMobs Discord

## Credits
Generated by MythicMobs Generator v3.0
Powered by Claude AI`;

    return guide;
}