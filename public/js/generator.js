// Main Generator Logic (UPDATED v2.0)
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.addEventListener('click', handleGenerate);
});

async function handleGenerate() {
    const { UIHelpers } = window;
    
    // Get form data
    const category = document.querySelector('input[name="category"]:checked').value;
    const difficulty = document.querySelector('input[name="difficulty"]:checked')?.value || 'balanced';
    const aiComplexity = document.querySelector('input[name="ai_complexity"]:checked')?.value || 'advanced';
    const description = document.getElementById('description').value.trim();
    
    const includeItems = document.getElementById('includeItems').checked;
    const includeDropTables = document.getElementById('includeDropTables')?.checked || false;
    const advancedAI = document.getElementById('advancedAI')?.checked || false;
    const bossBarSystem = document.getElementById('bossBarSystem')?.checked || false;
    const soundSystem = document.getElementById('soundSystem')?.checked || false;
    
    // Advanced mechanics
    const phaseSystem = document.getElementById('phaseSystem')?.checked || false;
    const variableStates = document.getElementById('variableStates')?.checked || false;
    const environmentalHazards = document.getElementById('environmentalHazards')?.checked || false;
    const minionCoordination = document.getElementById('minionCoordination')?.checked || false;
    const adaptiveDifficulty = document.getElementById('adaptiveDifficulty')?.checked || false;
    const counterMechanics = document.getElementById('counterMechanics')?.checked || false;
    
    // Visual spawn effects
    const spawnAuraEffect = document.getElementById('spawnAuraEffect')?.checked || false;
    const spawnHologram = document.getElementById('spawnHologram')?.checked || false;
    const summonMechanic = document.getElementById('summonMechanic')?.checked || false;
    const summonMethod = document.getElementById('summonMethod')?.value || 'proximity_trigger';
    
    // NEW: Custom AI Behavior
    const customAIBehavior = document.getElementById('customAIBehavior')?.checked || false;
    const aiBehavior = customAIBehavior ? document.querySelector('input[name="ai_behavior"]:checked')?.value || 'aggressive_rush' : null;
    
    // NEW: Healing Tower System
    const healingTowerSystem = document.getElementById('healingTowerSystem')?.checked || false;
    const towerCount = document.getElementById('towerCount')?.value || '2';
    const towerHealPower = document.getElementById('towerHealPower')?.value || 'medium';
    const towerHP = document.getElementById('towerHP')?.value || '200';
    const towerRespawn = document.getElementById('towerRespawn')?.value || '60';
    
    // NEW: Boss Death Reward
    const bossDeathReward = document.getElementById('bossDeathReward')?.checked || false;
    const deathReward = bossDeathReward ? document.querySelector('input[name="death_reward"]:checked')?.value || 'chest_spawn' : null;
    
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
        difficulty,
        aiComplexity,
        description,
        options: {
            includeItems,
            includeDropTables,
            bossBarSystem,      // ✅ NEW
            soundSystem,        // 
            advancedAI: advancedAI || aiComplexity !== 'basic',
            phaseSystem,
            variableStates,
            environmentalHazards,
            minionCoordination,
            adaptiveDifficulty,
            counterMechanics,
            // Visual effects
            spawnAuraEffect,
            spawnHologram,
            summonMechanic,
            summonMethod: summonMechanic ? summonMethod : null,
            // NEW: AI Behavior
            customAIBehavior,
            aiBehavior,
            // NEW: Healing Tower
            healingTowerSystem,
            towerCount: healingTowerSystem ? parseInt(towerCount) : null,
            towerHealPower: healingTowerSystem ? towerHealPower : null,
            towerHP: healingTowerSystem ? parseInt(towerHP) : null,
            towerRespawn: healingTowerSystem ? towerRespawn : null,
            // NEW: Death Reward
            bossDeathReward,
            deathReward
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
        UIHelpers.showSuccess('Mob berhasil di-generate dengan fitur advanced!');
        
    } catch (error) {
        console.error('Generation error:', error);
        UIHelpers.showError(error.message || 'Terjadi kesalahan saat generate');
    } finally {
        UIHelpers.setLoading(false);
    }
}