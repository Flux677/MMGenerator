// ============================================
// MODULE: Main Prompt Builder
// ============================================

export function buildMainPrompt(category, difficulty, aiComplexity, description) {
    const categoryGuides = {
        boss: 'Boss tunggal dengan skill kompleks dan multiple phases',
        boss_dungeon: 'Boss utama beserta 2-3 jenis minion mobs untuk dungeon',
        miniboss: 'Mini boss dengan skill menengah, tidak terlalu kompleks',
        normal: 'Mob biasa untuk world exploration, skill simple'
    };

    return `You are an EXPERT MythicMobs configuration generator. Create a ${categoryGuides[category]}.

=== USER REQUEST ===
Category: ${category.toUpperCase()}
Difficulty: ${difficulty.toUpperCase()}
AI Complexity: ${aiComplexity.toUpperCase()}
Description: ${description}

=== CORE REQUIREMENTS ===
- Generate COMPLETE and PRODUCTION-READY configurations
- Use LibDisguises ONLY (NO ModelEngine or paid plugins)
- Base mob Type MUST be vanilla Minecraft mob (ZOMBIE, SKELETON, WITHER_SKELETON, etc)
- All syntax MUST be 100% valid MythicMobs syntax
- All skills must be balanced and engaging
- Output MUST be valid JSON format

=== CATEGORY SPECIFICATIONS ===
${category === 'boss_dungeon' ? `
BOSS + DUNGEON Structure:
- 1 main boss with name format: <NAME>_BOSS
- 2-3 minion types with name format: <NAME>_MINION_1, <NAME>_MINION_2, <NAME>_MINION_3
- Boss can summon minions during combat
- Minions support boss with coordinated mechanics
- Each minion type has unique role (tank, damage, support)
` : ''}`;
}