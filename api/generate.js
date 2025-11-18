// Main Handler - Orchestrates prompt chunks
import { getBasePrompt } from './prompts/base.js';
import { getAdvancedPrompt } from './prompts/advanced.js';
import { getDifficultyPrompt } from './prompts/difficulty.js';
import { getPremiumMechanics } from './prompts/premium.js';

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
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

        // 🎯 BUILD PROMPT FROM CHUNKS (Only load what's needed!)
        const prompt = buildChunkedPrompt(
            category, 
            difficulty, 
            aiComplexity, 
            description, 
            options
        );

        console.log('Calling Claude API with chunked prompt...');

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
                max_tokens: 16000,
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
                result = JSON.parse(textContent.trim());
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

        // Ensure all fields
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

// 🎯 BUILD PROMPT FROM CHUNKS (Conditional loading!)
function buildChunkedPrompt(category, difficulty, aiComplexity, description, options) {
    const chunks = [];

    // 1. Always include BASE
    chunks.push(getBasePrompt(category, difficulty, aiComplexity, description));

    // 2. Include ADVANCED if AI complexity is high
    if (aiComplexity === 'elite' || aiComplexity === 'nightmare') {
        chunks.push(getAdvancedPrompt(options));
    }

    // 3. Include DIFFICULTY-SPECIFIC
    if (['psychological', 'souls', 'nightmare'].includes(difficulty)) {
        chunks.push(getDifficultyPrompt(difficulty));
    }

    // 4. Include PREMIUM if advanced options enabled
    if (options.phaseSystem || options.counterMechanics || options.environmentalHazards) {
        chunks.push(getPremiumMechanics(options));
    }

    // 5. Always include OUTPUT FORMAT
    chunks.push(`
=== OUTPUT FORMAT ===
Return ONLY valid JSON with this exact structure:
\`\`\`json
{
  "mobs": "# Complete Mobs.yml configuration here with proper YAML syntax",
  "skills": "# Complete Skills.yml configuration here with proper YAML syntax",
  "items": "${options.includeItems ? '# Complete Items.yml configuration' : '# Items not requested'}",
  "setup_guide": "# Detailed setup guide with installation steps"
}
\`\`\`

CRITICAL: 
- Use proper YAML indentation (2 spaces)
- Escape special characters in strings
- Test all syntax against MythicMobs wiki
- Make it production-ready!
`);

    return chunks.join('\n\n');
}

// Helpers
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
1. Install plugins: MythicMobs, LibDisguises, ProtocolLib
2. Copy configs to plugins/MythicMobs/
3. Run: /mm reload

## Spawning
/mm mobs spawn <MOB_NAME> 1

## Testing
- Test all mechanics in safe area
- Adjust HP/Damage as needed
- Fine-tune cooldowns

## Resources
- MythicMobs Wiki: https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/home
`;
}