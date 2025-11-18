// ============================================
// MODULE: Difficulty Guides
// ============================================

export function getDifficultyGuide(difficulty) {
    const guides = {
        balanced: {
            hp: '500-800',
            damage: '10-15',
            speed: '0.3-0.35',
            description: 'Balanced stats, fair mechanics, suitable for most players',
            mechanics: `
- Moderate HP and damage
- Clear attack patterns with 1-2 second telegraphs
- Balanced mix of melee and ranged attacks
- Reasonable cooldowns (10-20 seconds)
- Fair difficulty curve`
        },
        
        hard: {
            hp: '1000-1500',
            damage: '20-30',
            speed: '0.35-0.4',
            description: 'High HP and damage, complex attack patterns, requires skill',
            mechanics: `
- High health pool for extended fights
- Complex combo systems
- Multiple attack phases
- Shorter telegraphs (0.5-1 second)
- Punishing mechanics for mistakes
- Requires good reaction time and strategy`
        },
        
        nightmare: {
            hp: '300-500',
            damage: '35-50',
            speed: '0.4-0.5',
            description: 'LOW HP but DEVASTATING mechanics, one-shot potential, glass cannon style',
            mechanics: `
- GLASS CANNON: Low HP but MASSIVE damage
- One-shot potential attacks with long telegraphs (3-5 seconds)
- Fast movement speed
- High-risk high-reward gameplay
- Boss dies fast IF player skilled
- Player dies fast IF makes mistake
- NO healing for boss
- Aggressive AI constantly attacking`
        },
        
        psychological: {
            hp: '600-800',
            damage: '8-12',
            speed: '0.25-0.3',
            description: 'Menegangkan: darkness effects, sound cues, stealth mechanics, jump scares',
            mechanics: `
- Darkness/blindness effects constantly
- Limited vision = fear factor
- Ambient horror sounds (breathing, heartbeat, whispers)
- Directional audio cues for positioning
- Jumpscare mechanics on ambush
- Unpredictable teleportation
- Stalking behavior (long periods no attack)
- Detection-based aggro (sound/movement triggers)
- Clone spawns (which is real?)
- Screen shake effects
- Paranoia-inducing mechanics`
        },
        
        souls: {
            hp: '700-1000',
            damage: '15-25',
            speed: '0.3-0.35',
            description: 'Pattern-based combat, telegraphed attacks (2s warning), punishing but FAIR',
            mechanics: `
- ALL major attacks have 2-second clear telegraphs
- Fixed attack patterns players can learn
- Punish panic rolling/dodging
- Reward patience and timing
- Clear openings after attack combos
- Pattern recognition is key
- Every death is player mistake
- All attacks are dodgeable
- NO random one-shots
- Learning curve required but fair
- Stamina punishment for spam
- Multiple attack phases with new patterns`
        },
        
        swarm: {
            hp: '400-600',
            damage: '5-10',
            speed: '0.35-0.4',
            description: 'Low individual damage, summons MANY minions, overwhelming tactics',
            mechanics: `
- Low individual damage per hit
- Constantly summons minions (6-10 at once)
- Overwhelming numbers strategy
- Minions respawn periodically
- Boss buffs minions when low HP
- Area denial with summons
- Crowd control resistant
- Focus splitting mechanics
- Must manage both boss and adds
- AoE attacks effective counter`
        }
    };

    const guide = guides[difficulty] || guides.balanced;
    
    return `
DIFFICULTY: ${difficulty.toUpperCase()}
Description: ${guide.description}

Recommended Stats:
- Health: ${guide.hp}
- Damage: ${guide.damage}
- Movement Speed: ${guide.speed}

Mechanics Guidelines:
${guide.mechanics}
`;
}