// Main Generator Logic
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.addEventListener('click', handleGenerate);
});

async function handleGenerate() {
    const { UIHelpers } = window;
    
    // Get form data
    const category = document.querySelector('input[name="category"]:checked').value;
    const description = document.getElementById('description').value.trim();
    const includeItems = document.getElementById('includeItems').checked;
    const includeDropTables = document.getElementById('includeDropTables').checked;
    const advancedAI = document.getElementById('advancedAI').checked;
    const particleEffects = document.getElementById('particleEffects').checked;
    
    // Validation
    if (!description) {
        UIHelpers.showError('Masukkan deskripsi mob terlebih dahulu!');
        return;
    }
    
    if (description.length < 20) {
        UIHelpers.showError('Deskripsi terlalu pendek! Berikan detail lebih lengkap.');
        return;
    }
    
    // Prepare request data
    const requestData = {
        category,
        description,
        options: {
            includeItems,
            includeDropTables,
            advancedAI,
            particleEffects
        }
    };
    
    try {
        UIHelpers.setLoading(true);
        
        // Call API
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Validate response
        if (!data.mobs && !data.skills) {
            throw new Error('Response tidak mengandung konfigurasi yang valid');
        }
        
        // Display results
        UIHelpers.displayResults(data);
        UIHelpers.showSuccess('Mob berhasil di-generate!');
        
    } catch (error) {
        console.error('Generation error:', error);
        UIHelpers.showError(error.message || 'Terjadi kesalahan saat generate');
    } finally {
        UIHelpers.setLoading(false);
    }
}

// Helper: Build prompt for AI
function buildPrompt(category, description, options) {
    const categoryGuides = {
        boss: 'Boss tunggal dengan skill kompleks dan multiple phases',
        boss_dungeon: 'Boss utama beserta 2-3 jenis minion mobs untuk dungeon',
        miniboss: 'Mini boss dengan skill menengah, tidak terlalu kompleks',
        normal: 'Mob biasa untuk world exploration, skill simple'
    };
    
    let prompt = `Generate konfigurasi MythicMobs untuk: ${categoryGuides[category]}

DESKRIPSI REQUEST:
${description}

REQUIREMENTS:
1. WAJIB gunakan LibDisguises untuk visual mob
2. Syntax HARUS 100% sesuai MythicMobs Wiki
3. Gunakan vanilla Minecraft mob sebagai base Type
4. Skills harus menarik dan balanced
`;

    if (options.advancedAI) {
        prompt += `5. Implementasi AI modules (ThreatTable, PathfinderGoals)
`;
    }

    if (options.particleEffects) {
        prompt += `6. Tambahkan particle effects yang indah
`;
    }

    if (category === 'boss_dungeon') {
        prompt += `
STRUKTUR YANG DIBUTUHKAN:
- 1 Boss utama (nama: <NAMA>_BOSS)
- 2-3 jenis minion mobs (nama: <NAMA>_MINION_1, <NAMA>_MINION_2, dst)
- Boss bisa summon minion
- Minion support boss dalam combat
`;
    }

    prompt += `
OUTPUT FORMAT (PENTING):
Berikan response dalam format JSON seperti ini:
{
  "mobs": "# Isi Mobs.yml configuration",
  "skills": "# Isi Skills.yml configuration",
  "items": "${options.includeItems ? '# Isi Items.yml configuration' : ''}",
  "setup_guide": "# Panduan setup lengkap"
}

PANDUAN SYNTAX:
- Mobs config: https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/Mobs/Mobs
- Skills: https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/Skills/Skills
- LibDisguises format: 
  Disguise:
    Type: PLAYER
    Player: <skin_name>
  ATAU
  Disguise:
    Type: <MOB_TYPE>
    
Contoh mob dengan LibDisguises:
\`\`\`yaml
NAMA_MOB:
  Type: ZOMBIE
  Display: '&cNama Display'
  Health: 100
  Damage: 10
  Disguise:
    Type: PLAYER
    Player: Herobrine
  Skills:
  - skill{s=NAMA_SKILL} @target ~onTimer:100
\`\`\`

JANGAN gunakan ModelEngine atau plugin berbayar lainnya!
HANYA gunakan LibDisguises untuk disguise!`;

    return prompt;
}