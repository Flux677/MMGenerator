// ============================================
// STREAMING VERSION - FIX VERCEL TIMEOUT
// ============================================

// Import module prompts (AMAN, tidak perlu diubah)
import { buildMainPrompt } from './prompts/main.js';
import { getDifficultyGuide } from './prompts/difficulty.js';
import { getAIComplexityGuide } from './prompts/ai-complexity.js';
import { getFeaturePrompts } from './prompts/features.js';
import { getSyntaxReference } from './prompts/syntax.js';
import { getAdvancedMechanics } from './prompts/advanced.js';

// Vercel Serverless handler (same)
export default async function handler(req, res) {

    // ============ CORS ============
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // ============ VALIDATE API KEY ============
    const API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!API_KEY) {
        return res.status(500).json({ error: 'Anthropic API key missing' });
    }

    try {
        // ====== READ BODY ======
        const { category, difficulty, aiComplexity, description, options } = req.body;

        if (!category || !description) {
            return res.status(400).json({
                error: "Missing category or description"
            });
        }

        // ====== BUILD PROMPT (tidak diubah) ======
        const prompt = buildCompletePrompt(category, difficulty, aiComplexity, description, options);

        // ========== STREAMING REQUEST ke CLAUDE ==========
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
                "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify({
                model: "claude-3-5-sonnet-latest",
                max_tokens: 8000,
                stream: true,   // <==================== PENTING
                messages: [
                    { role: "user", content: prompt }
                ]
            })
        });

        // Jika Claude gagal
        if (!response.ok) {
            const err = await response.text();
            console.error("Claude error:", err);
            return res.status(500).json({ error: "Claude API error" });
        }

        // ========= STREAM RESPONSE KE CLIENT =========
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // STREAM LOOP
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            res.write(chunk);   // <===== KIRIM SEGERA KE CLIENT (anti-timeout)
        }

        res.end();

    } catch (err) {
        console.error("STREAM ERROR:", err);
        return res.status(500).json({ error: "Streaming failed", reason: err.message });
    }
}


// ============================================
// PROMPT BUILDER (bagian kamu sebelumnya, aman)
// ============================================
function buildCompletePrompt(category, difficulty, aiComplexity, description, options) {
    options = options || {};

    const mainPrompt = buildMainPrompt(category, difficulty, aiComplexity, description);
    const diffGuide = getDifficultyGuide(difficulty);
    const aiGuide = getAIComplexityGuide(aiComplexity);
    const featurePrompts = getFeaturePrompts(options, difficulty);
    const syntaxRef = getSyntaxReference();
    const advancedMech = getAdvancedMechanics();

    return `
${mainPrompt}

=== DIFFICULTY GUIDE ===
${diffGuide}

=== AI COMPLEXITY GUIDE ===
${aiGuide}

=== FEATURES TO IMPLEMENT ===
${featurePrompts}

=== MYTHICMOBS SYNTAX REFERENCE ===
${syntaxRef}

=== ADVANCED MECHANICS ===
${advancedMech}

OUTPUT FORMAT:
STRICT JSON inside code block:

\`\`\`json
{
  "mobs": "...",
  "skills": "...",
  "items": "...",
  "setup_guide": "..."
}
\`\`\`

Generate now.
`;
}