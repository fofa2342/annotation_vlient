document.addEventListener('DOMContentLoaded', function() {
    // Gestion du téléversement rapide
    const quickUploadZone = document.getElementById('quickUploadZone');
    const quickFileInput = document.getElementById('quickFileInput');

    if (quickUploadZone && quickFileInput) {
        // Événements de glisser-déposer
        quickUploadZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            quickUploadZone.classList.add('dragover');
        });

        quickUploadZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            quickUploadZone.classList.remove('dragover');
        });

        quickUploadZone.addEventListener('drop', function(e) {
            e.preventDefault();
            quickUploadZone.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileUpload(files[0]);
            }
        });

        // Clic sur la zone de téléversement
        quickUploadZone.addEventListener('click', function() {
            quickFileInput.click();
        });

        // Sélection de fichier
        quickFileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                handleFileUpload(e.target.files[0]);
            }
        });
    }

    // Animation des statistiques au scroll
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatNumber(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Charger les analyses récentes
    loadRecentAnalyses();
});

function handleFileUpload(file) {
    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
        showNotification('Type de fichier non supporté. Utilisez JPG, PNG ou DICOM.', 'error');
        return;
    }

    // Vérifier la taille du fichier (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        showNotification('Le fichier est trop volumineux. Taille maximale: 10MB.', 'error');
        return;
    }

    // Simuler le téléversement
    showNotification('Téléversement en cours...', 'info');
    
    // Animation de la zone de téléversement
    const uploadZone = document.getElementById('quickUploadZone');
    uploadZone.style.transform = 'scale(0.95)';
    uploadZone.style.opacity = '0.7';

    setTimeout(() => {
        uploadZone.style.transform = 'scale(1)';
        uploadZone.style.opacity = '1';
        
        // Simuler le succès du téléversement
        showNotification('Fichier téléversé avec succès! Redirection vers les résultats...', 'success');
        
        setTimeout(() => {
            // Rediriger vers la page de résultats (simulé)
            window.location.href = 'results.html?file=' + encodeURIComponent(file.name);
        }, 2000);
    }, 1500);
}

function animateStatNumber(element) {
    const finalValue = element.textContent;
    let currentValue = 0;
    const increment = finalValue.includes('%') ? 
        parseFloat(finalValue) / 50 : 
        finalValue.includes('s') ? 
        parseFloat(finalValue) / 20 :
        finalValue.includes('/') ? 
        1 :
        parseInt(finalValue) / 50;

    const timer = setInterval(() => {
        if (finalValue.includes('%')) {
            currentValue += increment;
            if (currentValue >= parseFloat(finalValue)) {
                currentValue = parseFloat(finalValue);
                clearInterval(timer);
            }
            element.textContent = currentValue.toFixed(1) + '%';
        } else if (finalValue.includes('s')) {
            currentValue += increment;
            if (currentValue >= parseFloat(finalValue)) {
                currentValue = parseFloat(finalValue);
                clearInterval(timer);
            }
            element.textContent = currentValue.toFixed(1) + 's';
        } else if (finalValue.includes('/')) {
            element.textContent = finalValue; // 24/7 reste constant
            clearInterval(timer);
        } else {
            currentValue += increment;
            if (currentValue >= parseInt(finalValue)) {
                currentValue = parseInt(finalValue);
                clearInterval(timer);
            }
            element.textContent = Math.floor(currentValue).toLocaleString();
        }
    }, 50);
}

function loadRecentAnalyses() {
    // Simuler le chargement des analyses récentes
    const analysesContainer = document.getElementById('recentAnalyses');
    if (!analysesContainer) return;

    // Ajouter un effet de chargement
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading-placeholder';
    loadingElement.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--gray);">
            <div class="loading-spinner" style="width: 32px; height: 32px; margin: 0 auto 20px;"></div>
            Chargement des analyses récentes...
        </div>
    `;

    // Simuler un délai de chargement
    setTimeout(() => {
        // Les analyses sont déjà dans le HTML, on peut ajouter des animations
        const analysisCards = analysesContainer.querySelectorAll('.analysis-card');
        analysisCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });

        // Ajouter les événements de clic
        analysisCards.forEach(card => {
            const detailsBtn = card.querySelector('.btn-secondary');
            if (detailsBtn) {
                detailsBtn.addEventListener('click', function() {
                    const fileName = card.querySelector('h3').textContent;
                    showNotification('Redirection vers les détails de l\'analyse...', 'info');
                    setTimeout(() => {
                        window.location.href = 'results.html?file=' + encodeURIComponent(fileName);
                    }, 1000);
                });
            }
        });
    }, 800);
}

// Animation de parallaxe légère pour le hero
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');
    
    if (heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Effet de hover sur les cartes d'analyse
document.addEventListener('mouseover', function(e) {
    if (e.target.closest('.analysis-card')) {
        const card = e.target.closest('.analysis-card');
        card.style.transform = 'translateY(-8px) scale(1.02)';
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.closest('.analysis-card')) {
        const card = e.target.closest('.analysis-card');
        card.style.transform = 'translateY(0) scale(1)';
    }
});

