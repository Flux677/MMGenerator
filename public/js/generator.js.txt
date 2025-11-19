// Main Generator Logic (UPDATED)
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
    const includeDropTables = document.getElementById('includeDropTables').checked;
    const advancedAI = document.getElementById('advancedAI')?.checked || false;
    const particleEffects = document.getElementById('particleEffects').checked;
    
    // Advanced mechanics
    const phaseSystem = document.getElementById('phaseSystem')?.checked || false;
    const variableStates = document.getElementById('variableStates')?.checked || false;
    const environmentalHazards = document.getElementById('environmentalHazards')?.checked || false;
    const minionCoordination = document.getElementById('minionCoordination')?.checked || false;
    const adaptiveDifficulty = document.getElementById('adaptiveDifficulty')?.checked || false;
    const counterMechanics = document.getElementById('counterMechanics')?.checked || false;
    
    // NEW: Visual spawn effects
    const spawnAuraEffect = document.getElementById('spawnAuraEffect')?.checked || false;
    const spawnHologram = document.getElementById('spawnHologram')?.checked || false;
    const summonMechanic = document.getElementById('summonMechanic')?.checked || false;
    const summonMethod = document.getElementById('summonMethod')?.value || 'proximity_trigger';
    
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
            advancedAI: advancedAI || aiComplexity !== 'basic',
            particleEffects,
            phaseSystem,
            variableStates,
            environmentalHazards,
            minionCoordination,
            adaptiveDifficulty,
            counterMechanics,
            // NEW options
            spawnAuraEffect,
            spawnHologram,
            summonMechanic,
            summonMethod: summonMechanic ? summonMethod : null
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