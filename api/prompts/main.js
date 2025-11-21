// ============================================
// MODULE: Main Prompt Builder (IMPROVED v3.0)
// FILE: api/prompts/main.js
// ============================================

export function buildMainPrompt(category, difficulty, aiComplexity, description) {
    const categoryGuides = {
        boss: 'Boss tunggal dengan CINEMATIC EXPERIENCE - dramatic phases, telegraphed attacks, intense pressure',
        boss_dungeon: 'Boss utama + 2-3 coordinated minions - tactical group fight dengan role synergy',
        miniboss: 'Mini boss dengan memorable mechanics - mini-raid experience',
        normal: 'Elite mob dengan unique gimmick - bukan generic trash mob'
    };

    return `You are a MASTER MythicMobs Boss Designer with expertise in creating UNFORGETTABLE boss encounters.

=== CRITICAL DESIGN PHILOSOPHY ===
**EVERY boss fight must be MEMORABLE and EXCITING**
- Players should TALK about this fight after completing it
- Mechanics should create TENSION and PRESSURE, not frustration
- Visual and audio feedback must be SPECTACULAR
- Attacks must be TELEGRAPHED clearly but still challenging
- Boss must feel ALIVE and REACTIVE, not scripted
- Fight should have EMOTIONAL HIGHS and LOWS (buildup, climax, release)

=== USER REQUEST ===
Category: ${categoryGuides[category]}
Difficulty Preset: ${difficulty.toUpperCase()}
AI Complexity: ${aiComplexity.toUpperCase()}

Description:
"""
${description}
"""

=== CORE DESIGN REQUIREMENTS ===

1. **CINEMATIC PRESENTATION**
   - Dramatic spawn sequence (2-3 second buildup)
   - Clear phase transitions with visual/audio cues
   - Victory/defeat moments with proper fanfare
   - Screen shake for impact moments
   - Particle effects that tell a story

2. **TELEGRAPHED ATTACKS (CRITICAL)**
   ${getTelegraphGuidance(difficulty)}

3. **MECHANICAL DEPTH**
   - Attacks should chain into combos
   - Players must make positioning decisions
   - Reward skilled play, punish panic
   - Mix of avoidable and unavoidable damage
   - Windows of vulnerability after big attacks

4. **VISUAL LANGUAGE**
   - Red particles = danger incoming
   - Blue/Cyan = ice/slow effects
   - Purple = poison/curse
   - Yellow/Gold = buff/heal
   - White/Light = holy/purify
   - Orange/Flame = fire/burn
   - Green = nature/heal
   - Black/Smoke = shadow/curse

5. **AUDIO DESIGN**
   - Ambient loops for atmosphere
   - Attack sounds that match visual
   - Warning sounds BEFORE big attacks
   - Phase transition music cues
   - Directional audio for positioning

6. **TECHNICAL REQUIREMENTS**
   - LibDisguises ONLY (NO ModelEngine)
   - Base Type = vanilla Minecraft mob
   - 100% valid MythicMobs syntax
   - Production-ready configurations
   - Escape special characters in JSON strings
   - Use \\n for newlines in output

=== OUTPUT STRUCTURE ===

Generate configurations with these sections:

**MOBS CONFIGURATION:**
- Main boss mob(s) with complete stats
- Minions if applicable (boss_dungeon category)
- Support entities (spawners, towers, etc if enabled)
- All mobs must have:
  * Appropriate base Type (vanilla mob)
  * LibDisguises configuration
  * Complete Options section
  * AI configuration
  * Skills references
  * Drop tables

**SKILLS CONFIGURATION:**
- All boss skills with proper cooldowns
- Phase-specific skills
- Combo chains
- Telegraph mechanics
- Visual effect skills
- Minion skills if applicable
- Support skills (buff, heal, summon)

**ITEMS CONFIGURATION (if requested):**
- Custom drop items
- Balanced stats
- Thematic to boss

**SETUP GUIDE:**
- Installation steps
- Testing procedures
- Spawn commands
- Troubleshooting tips
- Feature explanations

=== JSON OUTPUT FORMAT ===
Return ONLY valid JSON:
\`\`\`json
{
  "mobs": "# Complete Mobs.yml\\n...",
  "skills": "# Complete Skills.yml\\n...",
  "items": "# Items.yml (or # Not requested)",
  "setup_guide": "# Setup guide\\n..."
}
\`\`\`

${getCreativityBoost()}

NOW GENERATE THE MOST EPIC, MEMORABLE BOSS CONFIGURATION POSSIBLE!`;
}

function getTelegraphGuidance(difficulty) {
    const telegraphs = {
        balanced: `
   - All major attacks (20+ damage) = 1-2 second warning
   - Visual: Particle buildup at attack point
   - Audio: Warning sound (block.bell.use, block.note_block.pling)
   - Text: Action bar message "⚠ BIG ATTACK INCOMING!"`,
        
        hard: `
   - Major attacks = 0.5-1 second warning (faster!)
   - Multiple attack patterns to learn
   - Some attacks fake-out (telegraph but don't fire)
   - Audio cues more subtle`,
        
        nightmare: `
   - ONE-SHOT attacks = 3-5 SECOND warning (clear and fair!)
   - Massive visual buildup (particles everywhere)
   - Loud warning sounds
   - Screen effects (title message, recoil)
   - But boss also has fast attacks with short telegraph
   - Glass cannon: Boss dies fast, player dies fast`,
        
        psychological: `
   - Attacks telegraph with SOUND more than visuals
   - Darkness effects hide telegraph particles
   - Directional audio cues for positioning
   - Long silent periods then sudden attacks
   - Builds paranoia and tension`,
        
        souls: `
   - ALL attacks have 2-second minimum telegraph
   - Fixed patterns that players can learn
   - Visual + Audio + Text warning (all 3!)
   - Clear attack startup, active, recovery frames
   - Pattern recognition is core mechanic`,
        
        swarm: `
   - Individual attacks weak, but constant pressure
   - Minion attacks overlap (no safe zones)
   - Telegraph is "enemies moving into position"
   - Audio: Rising volume as enemies surround`
    };
    
    return telegraphs[difficulty] || telegraphs.balanced;
}

function getCreativityBoost() {
    return `
=== CREATIVITY DIRECTIVES ===

Think about ICONIC boss fights from games:
- Dark Souls: Telegraphed attacks, pattern-based, fair but hard
- Monster Hunter: Huge monsters, environmental interaction, tells
- Final Fantasy: Dramatic phases, visual spectacle, mechanics variety
- World of Warcraft: Raid mechanics, roles, coordination

**Ask yourself:**
1. Will players REMEMBER this fight?
2. Is there a "WOW" moment?
3. Are there multiple ways to approach the fight?
4. Does the fight have RHYTHM (tension → release → tension)?
5. Would this be fun to fight multiple times?

**Avoid these mistakes:**
- ❌ Random one-shots without warning
- ❌ Unavoidable damage spam
- ❌ Boring attack patterns (just spam damage)
- ❌ No visual feedback for player actions
- ❌ Mechanics that feel unfair
- ❌ Generic skill names like "BOSS_SKILL_1"

**Create these instead:**
- ✅ Dramatic attack names: "Void_Rend", "Flame_Devastation", "Ice_Prison"
- ✅ Clear counterplay to every mechanic
- ✅ Moments where player feels powerful
- ✅ Moments where boss feels terrifying
- ✅ Mechanics that interact with each other
- ✅ Progression from easy → hard throughout fight

**Make it CINEMATIC:**
Think like a movie director. Every 30 seconds should have:
- Build up (telegraph)
- Climax (attack lands)
- Aftermath (recovery, positioning reset)

REMEMBER: You're not just making stats and skills, you're creating an EXPERIENCE!`;
}