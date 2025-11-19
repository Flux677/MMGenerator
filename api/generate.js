// ============================================
// FILE UTAMA: api/generate.js (UPDATED)
// ============================================
// Import prompt modules
import { buildMainPrompt } from './prompts/main.js';
import { getDifficultyGuide } from './prompts/difficulty.js';
import { getAIComplexityGuide } from './prompts/ai-complexity.js';
import { getFeaturePrompts } from './prompts/features.js';
import { getSyntaxReference } from './prompts/syntax.js';
import { getAdvancedMechanics } from './prompts/advanced.js';
import { getVisualEffectPrompts } from './prompts/visual-effects.js'; // NEW
import { getAIBehaviorPrompts } from './prompts/ai-behavior.js'; // NEW
import { getHealingTowerPrompts } from './prompts/healing-tower.js'; // NEW
import { getDeathRewardPrompts } from './prompts/death-rewards.js'; // NEW


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

        // Build prompt dari modules
        const prompt = buildCompletePrompt(category, difficulty, aiComplexity, description, options);

        console.log('Calling Claude API...');

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
                temperature: 0.7,
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

        // Parse JSON
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
            result = {
                mobs: extractSection(textContent, 'mobs') || textContent,
                skills: extractSection(textContent, 'skills') || '',
                items: options.includeItems ? extractSection(textContent, 'items') : '',
                setup_guide: extractSection(textContent, 'setup') || generateDefaultSetupGuide(category)
            };
        }

        const finalResult = {
            mobs: result.mobs || '# No mobs configuration generated',
            skills: result.skills || '# No skills configuration generated',
            items: result.items || '# No items configuration',
            setup_guide: result.setup_guide || generateDefaultSetupGuide(category)
        };

        return res.status(200).json(finalResult);

    } catch (error) {
        return res.status(500).json({ 
            error: error.message || 'Failed to generate configuration'
        });
    }
}

// ============================================
// FUNCTION: Build Complete Prompt (UPDATED)
// ============================================
function buildCompletePrompt(category, difficulty, aiComplexity, description, options) {
    options = options || {};
    
    // Ambil data dari modules
    const mainPrompt = buildMainPrompt(category, difficulty, aiComplexity, description);
    const diffGuide = getDifficultyGuide(difficulty);
    const aiGuide = getAIComplexityGuide(aiComplexity);
    const featurePrompts = getFeaturePrompts(options, difficulty);
    const syntaxRef = getSyntaxReference();
    const advancedMech = getAdvancedMechanics();
    
    // NEW: Visual effects prompts
    const visualEffects = getVisualEffectPrompts({
        spawnAuraEffect: options.spawnAuraEffect,
        spawnHologram: options.spawnHologram,
        summonMechanic: options.summonMechanic,
        summonMethod: options.summonMethod
    });
    // NEW: AI Behavior prompts
    const aiBehaviorPrompts = options.customAIBehavior ? getAIBehaviorPrompts(options.aiBehavior) : '';
    
    // NEW: Healing Tower prompts
    const healingTowerPrompts = options.healingTowerSystem ? getHealingTowerPrompts({
        towerCount: options.towerCount,
        towerHealPower: options.towerHealPower,
        towerHP: options.towerHP,
        towerRespawn: options.towerRespawn
    }) : '';
    
    // NEW: Death Reward prompts
    const deathRewardPrompts = options.bossDeathReward ? getDeathRewardPrompts(options.deathReward) : '';
    
    // Gabungkan semua
    let fullPrompt = `${mainPrompt}

=== DIFFICULTY GUIDE ===
${diffGuide}

=== AI COMPLEXITY GUIDE ===
${aiGuide}

=== FEATURES TO IMPLEMENT ===
${featurePrompts}

${visualEffects ? `=== VISUAL SPAWN EFFECTS ===
${visualEffects}
` : ''}

${aiBehaviorPrompts ? `=== CUSTOM AI BEHAVIOR SYSTEM ===
${aiBehaviorPrompts}
` : ''}

${healingTowerPrompts ? `=== HEALING TOWER SYSTEM ===
${healingTowerPrompts}
` : ''}

${deathRewardPrompts ? `=== BOSS DEATH REWARD SYSTEM ===
${deathRewardPrompts}
` : ''}

=== MYTHICMOBS SYNTAX REFERENCE ===
${syntaxRef}

=== ADVANCED MECHANICS ===
${advancedMech}

OUTPUT FORMAT (STRICT JSON):
\`\`\`json
{
  "mobs": "# Complete Mobs.yml configuration\\n...",
  "skills": "# Complete Skills.yml configuration\\n...",
  "items": "${options.includeItems ? '# Items.yml configuration\\n...' : '# Items not requested'}",
  "setup_guide": "# Setup guide\\n..."
}
\`\`\`

CRITICAL REQUIREMENTS:
1. Use LibDisguises for visual (NO ModelEngine)
2. Valid MythicMobs syntax only
3. Base Type MUST be vanilla Minecraft mob
4. Production-ready configurations
5. Return valid JSON format
${options.customAIBehavior ? `6. Implement ${options.aiBehavior} AI behavior pattern thoroughly` : ''}
${options.healingTowerSystem ? `7. Create ${options.towerCount} healing tower(s) with ${options.towerHealPower} heal power` : ''}
${options.bossDeathReward ? `8. Implement ${options.deathReward} death reward mechanic` : ''}
${options.summonMechanic ? `9. Include SPAWNER mob configuration for summon mechanic` : ''}

Generate COMPLETE, WORKING, ADVANCED configuration NOW!`;

    return fullPrompt;
}

// Helper functions
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

function generateDefaultSetupGuide(category) {
    return `# Setup Guide - ${category.toUpperCase()}

## Installation
1. Install plugins:
   - MythicMobs (latest)
   - LibDisguises (latest)
   - ProtocolLib (dependency)

2. Copy configurations:
   - Mobs.yml → plugins/MythicMobs/Mobs/
   - Skills.yml → plugins/MythicMobs/Skills/
   - Items.yml → plugins/MythicMobs/Items/

3. Reload: /mm reload

## Spawning
/mm mobs spawn <INTERNAL_NAME> 1

4. Advanced Features 
##AI Behavior System
- Mob menggunakan AI behavior pattern: ${options.aiBehavior}
- Behavior akan otomatis aktif saat combat
- Perhatikan AI reaction terhadap player actions

## Healing Tower System
- ${options.towerCount} healing tower(s) akan spawn otomatis
- Tower heal power: ${options.towerHealPower}
- Tower HP: ${options.towerHP}
- Respawn time: ${options.towerRespawn === 'false' ? 'No respawn' : options.towerRespawn + ' seconds'}
- Players harus destroy towers untuk stop healing

## Boss Death Reward
- Reward type: ${options.deathReward}
- Akan trigger otomatis saat boss mati
- Reward muncul di lokasi boss death

## Testing
1. Spawn mob in safe area
2. Test all skills and mechanics
3. Test new features (AI behavior, towers, rewards)
4. Adjust stats if needed

## Resources
- Wiki: https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/home
- LibDisguises: https://www.spigotmc.org/resources/libsdisguises.81/`;

    return guide;
}