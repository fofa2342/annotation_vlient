document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const imageToggleBtns = document.querySelectorAll('.toggle-btn');
    const imageViews = document.querySelectorAll('.image-view');
    const medicalImages = document.querySelectorAll('.medical-image');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const resetViewBtn = document.getElementById('resetView');
    const downloadBtn = document.getElementById('downloadBtn');
    const retestBtn = document.getElementById('retestBtn');
    const saveToHistoryBtn = document.getElementById('saveToHistory');
    const newAnalysisBtn = document.getElementById('newAnalysis');

    // Variables globales
    let currentZoom = 1;
    let currentView = 'original';

    // Initialisation
    initializeResults();

    function initializeResults() {
        // Gestion des onglets d'images
        imageToggleBtns.forEach(btn => {
            btn.addEventListener('click', () => switchImageView(btn.dataset.view));
        });

        // Contrôles de zoom
        zoomInBtn.addEventListener('click', () => zoomImage(1.2));
        zoomOutBtn.addEventListener('click', () => zoomImage(0.8));
        resetViewBtn.addEventListener('click', resetImageView);

        // Boutons d'action
        downloadBtn.addEventListener('click', downloadReport);
        retestBtn.addEventListener('click', retestAnalysis);
        saveToHistoryBtn.addEventListener('click', saveToHistory);
        newAnalysisBtn.addEventListener('click', startNewAnalysis);

        // Initialiser le graphique
        initializeChart();

        // Animer l'entrée des éléments
        animateElements();

        // Charger les données depuis l'URL
        loadDataFromURL();
    }

    function switchImageView(view) {
        currentView = view;
        
        // Mettre à jour les boutons
        imageToggleBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Mettre à jour les vues d'image
        imageViews.forEach(imageView => {
            imageView.classList.toggle('active', imageView.id === view + 'View');
        });

        // Animation de transition
        const activeView = document.querySelector('.image-view.active');
        if (activeView) {
            activeView.style.transform = 'scale(0.95)';
            setTimeout(() => {
                activeView.style.transform = 'scale(1)';
            }, 150);
        }
    }

    function zoomImage(factor) {
        currentZoom *= factor;
        currentZoom = Math.max(0.5, Math.min(3, currentZoom)); // Limiter le zoom entre 0.5x et 3x

        medicalImages.forEach(img => {
            img.style.transform = `scale(${currentZoom})`;
        });

        // Mettre à jour l'état des boutons
        zoomInBtn.disabled = currentZoom >= 3;
        zoomOutBtn.disabled = currentZoom <= 0.5;
    }

    function resetImageView() {
        currentZoom = 1;
        medicalImages.forEach(img => {
            img.style.transform = 'scale(1)';
        });
        
        // Réactiver tous les boutons
        zoomInBtn.disabled = false;
        zoomOutBtn.disabled = false;

        // Animation de reset
        medicalImages.forEach(img => {
            img.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
                img.style.transition = 'transform 0.3s ease';
            }, 300);
        });
    }

    function downloadReport() {
        // Animation du bouton
        downloadBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            downloadBtn.style.transform = 'scale(1)';
        }, 150);

        showNotification('Téléchargement du rapport en cours...', 'info');
        
        // Faire  le téléchargement
        setTimeout(() => {
            showNotification('Rapport téléchargé avec succès!', 'success');
        }, 2000);
    }

    function retestAnalysis() {
        showNotification('Redirection vers la page de téléversement...', 'info');
        setTimeout(() => {
            window.location.href = 'upload.html';
        }, 1000);
    }

    function saveToHistory() {
        // Animation du bouton
        saveToHistoryBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            saveToHistoryBtn.style.transform = 'scale(1)';
        }, 150);

        showNotification('Analyse sauvegardée dans l\'historique!', 'success');
        
        // Changer le texte du bouton temporairement
        const originalText = saveToHistoryBtn.textContent;
        saveToHistoryBtn.textContent = 'Sauvegardé ✓';
        saveToHistoryBtn.disabled = true;
        
        setTimeout(() => {
            saveToHistoryBtn.textContent = originalText;
            saveToHistoryBtn.disabled = false;
        }, 3000);
    }

    function startNewAnalysis() {
        showNotification('Redirection vers une nouvelle analyse...', 'info');
        setTimeout(() => {
            window.location.href = 'upload.html';
        }, 1000);
    }

    function initializeChart() {
        const canvas = document.getElementById('confidenceChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Données du graphique
        const data = [
            { label: 'Normal', value: 94, color: '#10b981' },
            { label: 'Incertain', value: 4, color: '#f59e0b' },
            { label: 'Anormal', value: 2, color: '#ef4444' }
        ];

        // Dessiner un graphique en barres simple
        const barWidth = 80;
        const barSpacing = 40;
        const maxHeight = 200;
        const startX = 50;
        const startY = canvas.height - 50;

        // Effacer le canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dessiner les barres avec animation
        data.forEach((item, index) => {
            const x = startX + index * (barWidth + barSpacing);
            const height = (item.value / 100) * maxHeight;
            
            // Animation progressive
            setTimeout(() => {
                animateBar(ctx, x, startY, barWidth, height, item.color, item.label, item.value);
            }, index * 200);
        });
    }

    function animateBar(ctx, x, startY, width, targetHeight, color, label, value) {
        let currentHeight = 0;
        const animationDuration = 1000;
        const startTime = Date.now();

        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / animationDuration, 1);
            
            currentHeight = targetHeight * easeOutCubic(progress);
            
            // Effacer la zone de la barre
            ctx.clearRect(x - 5, startY - targetHeight - 30, width + 10, targetHeight + 60);
            
            // Dessiner la barre
            ctx.fillStyle = color;
            ctx.fillRect(x, startY - currentHeight, width, currentHeight);
            
            // Dessiner le label
            ctx.fillStyle = '#334155';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(label, x + width/2, startY + 20);
            
            // Dessiner la valeur
            ctx.fillStyle = color;
            ctx.font = 'bold 14px Arial';
            ctx.fillText(value + '%', x + width/2, startY - currentHeight - 10);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        animate();
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function animateElements() {
        // Animer les cartes de résultats
        const resultCards = document.querySelectorAll('.result-card');
        resultCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200 + 300);
        });

        // Animer la barre d'action
        const actionBar = document.querySelector('.action-bar');
        if (actionBar) {
            actionBar.style.transform = 'translateY(100%)';
            setTimeout(() => {
                actionBar.style.transition = 'transform 0.5s ease';
                actionBar.style.transform = 'translateY(0)';
            }, 1000);
        }
    }

    function loadDataFromURL() {
        // Récupérer les paramètres de l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const fileName = urlParams.get('file');
        
        if (fileName) {
            document.getElementById('fileName').textContent = fileName;
            
            // Simuler différents résultats selon le nom du fichier
            if (fileName.toLowerCase().includes('scanner')) {
                updateDiagnosis('Poumons normaux', 'Aucune anomalie détectée dans les structures pulmonaires', 94);
            } else if (fileName.toLowerCase().includes('irm')) {
                updateDiagnosis('Anomalie détectée', 'Zone d\'intérêt identifiée nécessitant un examen approfondi', 87);
            } else if (fileName.toLowerCase().includes('ecg')) {
                updateDiagnosis('Rythme normal', 'Activité cardiaque dans les paramètres normaux', 92);
            }
        }
    }

    function updateDiagnosis(title, description, confidence) {
        const diagnosisTitle = document.querySelector('.diagnosis-text h3');
        const diagnosisDesc = document.querySelector('.diagnosis-text p');
        const confidenceValue = document.querySelector('.confidence-value');
        
        if (diagnosisTitle) diagnosisTitle.textContent = title;
        if (diagnosisDesc) diagnosisDesc.textContent = description;
        if (confidenceValue) confidenceValue.textContent = confidence + '%';
        
        // Mettre à jour la couleur de l'icône selon le résultat
        const diagnosisIcon = document.querySelector('.diagnosis-icon svg path');
        if (diagnosisIcon) {
            if (confidence >= 90) {
                diagnosisIcon.setAttribute('stroke', '#10b981'); // Vert pour normal
            } else if (confidence >= 80) {
                diagnosisIcon.setAttribute('stroke', '#f59e0b'); // Orange pour incertain
            } else {
                diagnosisIcon.setAttribute('stroke', '#ef4444'); // Rouge pour anormal
            }
        }
    }

    // Gestion du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        // Réinitialiser le graphique si nécessaire
        setTimeout(initializeChart, 100);
    });

    // Gestion des raccourcis clavier
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case '1':
                switchImageView('original');
                break;
            case '2':
                switchImageView('annotated');
                break;
            case '3':
                switchImageView('overlay');
                break;
            case '+':
            case '=':
                e.preventDefault();
                zoomImage(1.2);
                break;
            case '-':
                e.preventDefault();
                zoomImage(0.8);
                break;
            case '0':
                e.preventDefault();
                resetImageView();
                break;
        }
    });
});

