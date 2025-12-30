// Global variable for selected scan type
let selectedScanType = 'full'; // default scan type

// ===== Authenticated Scan Toggle Logic =====
document.addEventListener('DOMContentLoaded', () => {
    const authToggle = document.getElementById('authToggle');
    const authFields = document.querySelector('.auth-fields');

    if (!authToggle || !authFields) return;

    authToggle.addEventListener('change', () => {
        authFields.classList.toggle('hidden', !authToggle.checked);
    });
});

// Attach click listeners to scan type cards
document.addEventListener('DOMContentLoaded', () => {
    const scanTypeCards = document.querySelectorAll('.scan-type-card');

    scanTypeCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selection from all cards
            scanTypeCards.forEach(c => c.classList.remove('selected'));
            // Highlight clicked card
            card.classList.add('selected');
            // Store selected type
            selectedScanType = card.dataset.type;
            console.log('Selected scan type:', selectedScanType);
        });
    });
});

async function startScan() {
    const urlInput = document.getElementById('urlInput');
    const url = urlInput.value.trim();

    const loadingDiv = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');
    const scanButton = document.querySelector('button');
    const container = document.querySelector('.container');

    // Basic URL validation
    if (!url || !url.startsWith('http')) {
        alert('Please enter a valid URL (https://example.com)');
        return;
    }
    // ===== Add dynamic glow based on scan type =====
    container.classList.remove('glow-full', 'glow-quick', 'glow-custom');
    if (selectedScanType === 'full') container.classList.add('glow-full');
    if (selectedScanType === 'quick') container.classList.add('glow-quick');
    if (selectedScanType === 'custom') container.classList.add('glow-custom');

    // Reset UI
    resultsDiv.innerHTML = '';
    resultsDiv.classList.add('hidden');
    loadingDiv.classList.remove('hidden');
    scanButton.disabled = true;
    scanButton.innerText = `Scanning (${selectedScanType.toUpperCase()})...`;

    try {
        // Simulated scan (replace with Flask API later)
        const data = await fakeScan(url, selectedScanType);

        // Show results
        displayResults(data);
    } catch (error) {
        alert('Scan failed. Please try again.');
    } finally {
        // Restore UI
        loadingDiv.classList.add('hidden');
        resultsDiv.classList.remove('hidden');
        startProgressBar();
        scanButton.disabled = false;
        scanButton.innerText = 'Start Scan';
    }
}
function startProgressBar() {
    const container = document.querySelector('.progress-container');
    const bar = document.querySelector('.progress-bar');
    const text = document.getElementById('progressText');

    if (!container || !bar || !text) return;

    let progress = 0;
    container.classList.remove('hidden');
    bar.style.width = '0%';
    text.innerText = '0%';

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 8) + 3; // realistic speed
        if (progress >= 100) progress = 100;

        bar.style.width = progress + '%';
        text.innerText = progress + '%';

        if (progress === 100) clearInterval(interval);
    }, 200);
}

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    data.vulnerabilities.forEach((vuln, index) => {
        const card = document.createElement('div');
        card.classList.add('result-card');

        // Severity styling
        if (vuln.severity === 'High') card.classList.add('severity-high');
        if (vuln.severity === 'Medium') card.classList.add('severity-medium');
        if (vuln.severity === 'Low') card.classList.add('severity-low');

        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <h3>${vuln.name}</h3>
            <p><strong>Severity:</strong> ${vuln.severity}</p>
            <p>${vuln.description}</p>
        `;

        resultsDiv.appendChild(card);
    });
}

// Fake scan (demo only) – different types affect results
function fakeScan(url, scanType) {
    return new Promise(resolve => {
        setTimeout(() => {
            // Base vulnerabilities
            let vulnerabilities = [
                {
                    name: 'SQL Injection',
                    severity: 'High',
                    description: 'Improper input validation allows SQL manipulation.'
                },
                {
                    name: 'Cross-Site Scripting (XSS)',
                    severity: 'Medium',
                    description: 'User input is reflected without sanitization.'
                },
                {
                    name: 'CSRF Protection Missing',
                    severity: 'Low',
                    description: 'No CSRF tokens detected in sensitive requests.'
                }
            ];

            // Modify vulnerabilities based on scan type
            if (scanType === 'quick') {
                vulnerabilities = vulnerabilities.filter(v => v.severity !== 'Low');
            } else if (scanType === 'custom') {
                // Randomize for custom scan demo
                vulnerabilities = vulnerabilities.sort(() => Math.random() - 0.5);
            }

            resolve({ vulnerabilities });
        }, 2200);
    });
}
