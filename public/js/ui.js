// UI Event Handlers (UPDATED)
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeCopyButtons();
    initializeDownloadButton();
    initializeSummonMethodToggle(); // NEW
    initializeNewFeatureToggles();
});

function initializeNewFeatureToggles() {
    // AI Behavior Toggle
    const aiBehaviorCheckbox = document.getElementById('customAIBehavior');
    const aiBehaviorContainer = document.getElementById('aiBehaviorContainer');
    
    if (aiBehaviorCheckbox && aiBehaviorContainer) {
        aiBehaviorCheckbox.addEventListener('change', (e) => {
            aiBehaviorContainer.style.display = e.target.checked ? 'block' : 'none';
        });
    }
    
    // Healing Tower Toggle
    const healingTowerCheckbox = document.getElementById('healingTowerSystem');
    const healingTowerContainer = document.getElementById('healingTowerContainer');
    
    if (healingTowerCheckbox && healingTowerContainer) {
        healingTowerCheckbox.addEventListener('change', (e) => {
            healingTowerContainer.style.display = e.target.checked ? 'block' : 'none';
        });
    }
    
    // Boss Death Reward Toggle
    const deathRewardCheckbox = document.getElementById('bossDeathReward');
    const deathRewardContainer = document.getElementById('deathRewardContainer');
    
    if (deathRewardCheckbox && deathRewardContainer) {
        deathRewardCheckbox.addEventListener('change', (e) => {
            deathRewardContainer.style.display = e.target.checked ? 'block' : 'none';
        });
    }
}

// NEW: Toggle summon method dropdown visibility
function initializeSummonMethodToggle() {
    const summonCheckbox = document.getElementById('summonMechanic');
    const summonMethodContainer = document.getElementById('summonMethodContainer');
    
    if (summonCheckbox && summonMethodContainer) {
        summonCheckbox.addEventListener('change', (e) => {
            summonMethodContainer.style.display = e.target.checked ? 'block' : 'none';
        });
    }
}

// Tab System
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            button.classList.add('active');
            document.getElementById(`${targetTab}-content`).classList.add('active');
        });
    });
}

// Copy to Clipboard
function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const targetId = button.dataset.target;
            const codeElement = document.getElementById(targetId);
            const text = codeElement.textContent;
            
            try {
                await navigator.clipboard.writeText(text);
                
                // Visual feedback
                const originalText = button.innerHTML;
                button.innerHTML = '✅ Copied!';
                button.classList.add('copied');
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                showError('Gagal copy ke clipboard');
            }
        });
    });
}

// Download All Configs
function initializeDownloadButton() {
    const downloadBtn = document.getElementById('downloadBtn');
    
    downloadBtn.addEventListener('click', () => {
        const mobsCode = document.getElementById('mobsCode').textContent;
        const skillsCode = document.getElementById('skillsCode').textContent;
        const itemsCode = document.getElementById('itemsCode').textContent;
        const setupGuide = document.getElementById('setupGuide').textContent;
        
        // Create ZIP-like structure (we'll just create separate files)
        downloadFile('Mobs.yml', mobsCode);
        setTimeout(() => downloadFile('Skills.yml', skillsCode), 100);
        setTimeout(() => downloadFile('Items.yml', itemsCode), 200);
        setTimeout(() => downloadFile('SETUP_GUIDE.txt', setupGuide), 300);
        
        showSuccess('Files downloaded! Check your Downloads folder.');
    });
}

// Helper: Download Single File
function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Display Results
function displayResults(data) {
    const resultsSection = document.getElementById('resultsSection');
    const mobsCode = document.getElementById('mobsCode');
    const skillsCode = document.getElementById('skillsCode');
    const itemsCode = document.getElementById('itemsCode');
    const setupGuide = document.getElementById('setupGuide');
    
    // Parse and display each section
    mobsCode.textContent = data.mobs || '# No mobs configuration generated';
    skillsCode.textContent = data.skills || '# No skills configuration generated';
    itemsCode.textContent = data.items || '# No items configuration generated';
    
    // Format setup guide as HTML
    setupGuide.innerHTML = formatSetupGuide(data.setup_guide || 'No setup guide available');
    
    // Show results
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Format Setup Guide
function formatSetupGuide(text) {
    // Convert markdown-like text to HTML
    return text
        .replace(/### (.*)/g, '<h3>$1</h3>')
        .replace(/## (.*)/g, '<h3>$1</h3>')
        .replace(/# (.*)/g, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^\d+\. /gm, '</li><li>')
        .replace(/<li>/g, '<ol><li>')
        .replace(/<\/li>$/g, '</li></ol>')
        .replace(/^- /gm, '</li><li>')
        .replace(/<p><li>/g, '<ul><li>')
        .replace(/<\/li><\/p>/g, '</li></ul>');
}

// Show Error Message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = `❌ Error: ${message}`;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Show Success Message
function showSuccess(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.style.background = '#d1fae5';
    errorDiv.style.borderColor = '#10b981';
    errorDiv.style.color = '#065f46';
    errorDiv.textContent = `✅ ${message}`;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
        errorDiv.style.background = '#fee';
        errorDiv.style.borderColor = '#ef4444';
        errorDiv.style.color = '#b91c1c';
    }, 3000);
}

// Show/Hide Loading
function setLoading(isLoading) {
    const btn = document.getElementById('generateBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    if (isLoading) {
        btn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'block';
        progressBar.style.display = 'block';
        
        // Simulate progress messages
        const messages = [
            'Menghubungi Claude AI...',
            'Menganalisis request...',
            'Membaca dokumentasi MythicMobs...',
            'Generating mob configuration...',
            'Generating skills...',
            'Creating spawn effects...',
            'Optimizing syntax...',
            'Finalizing...'
        ];
        
        let index = 0;
        const interval = setInterval(() => {
            if (index < messages.length) {
                progressText.textContent = messages[index];
                index++;
            }
        }, 2000);
        
        // Store interval ID for cleanup
        btn.dataset.intervalId = interval;
    } else {
        btn.disabled = false;
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
        progressBar.style.display = 'none';
        
        // Clear interval
        if (btn.dataset.intervalId) {
            clearInterval(parseInt(btn.dataset.intervalId));
            delete btn.dataset.intervalId;
        }
    }
}

// Export functions for use in generator.js
window.UIHelpers = {
    displayResults,
    showError,
    showSuccess,
    setLoading
};