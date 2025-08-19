document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const searchInput = document.getElementById('searchInput');
    const dateFilter = document.getElementById('dateFilter');
    const resultFilter = document.getElementById('resultFilter');
    const confidenceFilter = document.getElementById('confidenceFilter');
    const sortBy = document.getElementById('sortBy');
    const viewBtns = document.querySelectorAll('.view-btn');
    const gridView = document.getElementById('gridView');
    const listView = document.getElementById('listView');
    const resultsCount = document.getElementById('resultsCount');
    const emptyState = document.getElementById('emptyState');
    const pagination = document.getElementById('pagination');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const bulkModal = document.getElementById('bulkModal');
    const closeBulkModal = document.getElementById('closeBulkModal');

    // Variables globales
    let currentView = 'grid';
    let currentPage = 1;
    let itemsPerPage = 12;
    let allAnalyses = [];
    let filteredAnalyses = [];
    let selectedAnalyses = [];

    // Données simulées
    const sampleAnalyses = [
        {
            id: 1,
            fileName: 'Scanner_thorax_001.jpg',
            fileSize: '2.3 MB',
            date: new Date('2024-01-15T14:30:00'),
            result: 'Poumons normaux',
            resultType: 'normal',
            confidence: 94,
            thumbnail: 'https://via.placeholder.com/200x200/e2e8f0/64748b?text=Scanner'
        },
        {
            id: 2,
            fileName: 'IRM_cerebral_002.png',
            fileSize: '4.1 MB',
            date: new Date('2024-01-14T09:15:00'),
            result: 'Anomalie détectée',
            resultType: 'anomaly',
            confidence: 87,
            thumbnail: 'https://via.placeholder.com/200x200/dbeafe/2563eb?text=IRM'
        },
        {
            id: 3,
            fileName: 'ECG_patient_003.jpg',
            fileSize: '1.8 MB',
            date: new Date('2024-01-12T16:45:00'),
            result: 'Rythme normal',
            resultType: 'normal',
            confidence: 92,
            thumbnail: 'https://via.placeholder.com/200x200/fef3c7/f59e0b?text=ECG'
        },
        {
            id: 4,
            fileName: 'Radio_genou_004.png',
            fileSize: '3.2 MB',
            date: new Date('2024-01-10T11:20:00'),
            result: 'Résultat incertain',
            resultType: 'uncertain',
            confidence: 68,
            thumbnail: 'https://via.placeholder.com/200x200/fee2e2/ef4444?text=Radio'
        },
        {
            id: 5,
            fileName: 'Scanner_abdominal_005.jpg',
            fileSize: '5.7 MB',
            date: new Date('2024-01-08T13:10:00'),
            result: 'Organes normaux',
            resultType: 'normal',
            confidence: 96,
            thumbnail: 'https://via.placeholder.com/200x200/e2e8f0/64748b?text=Abdomen'
        },
        {
            id: 6,
            fileName: 'IRM_colonne_006.png',
            fileSize: '6.4 MB',
            date: new Date('2024-01-05T10:30:00'),
            result: 'Anomalie mineure',
            resultType: 'anomaly',
            confidence: 79,
            thumbnail: 'https://via.placeholder.com/200x200/dbeafe/2563eb?text=Colonne'
        }
    ];

    // Initialisation
    initializeHistory();

    function initializeHistory() {
        allAnalyses = [...sampleAnalyses];
        filteredAnalyses = [...allAnalyses];

        // Événements
        setupEventListeners();

        // Charger les données initiales
        updateStats();
        renderAnalyses();
        updatePagination();

        // Animer les statistiques
        animateStats();
    }

    function setupEventListeners() {
        // Recherche et filtres
        searchInput.addEventListener('input', debounce(applyFilters, 300));
        dateFilter.addEventListener('change', applyFilters);
        resultFilter.addEventListener('change', applyFilters);
        confidenceFilter.addEventListener('change', applyFilters);
        sortBy.addEventListener('change', applySorting);

        // Vues
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => switchView(btn.dataset.view));
        });

        // Pagination
        prevPageBtn.addEventListener('click', () => changePage(currentPage - 1));
        nextPageBtn.addEventListener('click', () => changePage(currentPage + 1));

        // Modal
        closeBulkModal.addEventListener('click', closeBulkModalHandler);
        document.getElementById('bulkDownload').addEventListener('click', bulkDownload);
        document.getElementById('bulkDelete').addEventListener('click', bulkDelete);

        // Fermer modal en cliquant à l'extérieur
        bulkModal.addEventListener('click', (e) => {
            if (e.target === bulkModal) {
                closeBulkModalHandler();
            }
        });
    }

    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const dateFilterValue = dateFilter.value;
        const resultFilterValue = resultFilter.value;
        const confidenceFilterValue = confidenceFilter.value;

        filteredAnalyses = allAnalyses.filter(analysis => {
            // Filtre de recherche
            const matchesSearch = analysis.fileName.toLowerCase().includes(searchTerm);

            // Filtre de date
            let matchesDate = true;
            if (dateFilterValue) {
                const now = new Date();
                const analysisDate = analysis.date;
                
                switch (dateFilterValue) {
                    case 'today':
                        matchesDate = analysisDate.toDateString() === now.toDateString();
                        break;
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        matchesDate = analysisDate >= weekAgo;
                        break;
                    case 'month':
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        matchesDate = analysisDate >= monthAgo;
                        break;
                    case 'year':
                        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                        matchesDate = analysisDate >= yearAgo;
                        break;
                }
            }

            // Filtre de résultat
            const matchesResult = !resultFilterValue || analysis.resultType === resultFilterValue;

            // Filtre de confiance
            let matchesConfidence = true;
            if (confidenceFilterValue) {
                switch (confidenceFilterValue) {
                    case 'high':
                        matchesConfidence = analysis.confidence > 90;
                        break;
                    case 'medium':
                        matchesConfidence = analysis.confidence >= 70 && analysis.confidence <= 90;
                        break;
                    case 'low':
                        matchesConfidence = analysis.confidence < 70;
                        break;
                }
            }

            return matchesSearch && matchesDate && matchesResult && matchesConfidence;
        });

        currentPage = 1;
        applySorting();
        renderAnalyses();
        updatePagination();
    }

    function applySorting() {
        const sortValue = sortBy.value;
        
        filteredAnalyses.sort((a, b) => {
            switch (sortValue) {
                case 'date-desc':
                    return b.date - a.date;
                case 'date-asc':
                    return a.date - b.date;
                case 'name-asc':
                    return a.fileName.localeCompare(b.fileName);
                case 'name-desc':
                    return b.fileName.localeCompare(a.fileName);
                case 'confidence-desc':
                    return b.confidence - a.confidence;
                case 'confidence-asc':
                    return a.confidence - b.confidence;
                default:
                    return 0;
            }
        });

        renderAnalyses();
    }

    function switchView(view) {
        currentView = view;
        
        // Mettre à jour les boutons
        viewBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Mettre à jour les vues
        gridView.classList.toggle('active', view === 'grid');
        listView.classList.toggle('active', view === 'list');

        // Ajuster la pagination
        itemsPerPage = view === 'grid' ? 12 : 20;
        currentPage = 1;
        renderAnalyses();
        updatePagination();
    }

    function renderAnalyses() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedAnalyses = filteredAnalyses.slice(startIndex, endIndex);

        // Mettre à jour le compteur
        resultsCount.textContent = filteredAnalyses.length;

        // Afficher l'état vide si nécessaire
        if (filteredAnalyses.length === 0) {
            emptyState.style.display = 'block';
            gridView.style.display = 'none';
            listView.style.display = 'none';
            pagination.style.display = 'none';
            return;
        } else {
            emptyState.style.display = 'none';
            pagination.style.display = 'flex';
        }

        if (currentView === 'grid') {
            renderGridView(paginatedAnalyses);
        } else {
            renderListView(paginatedAnalyses);
        }
    }

    function renderGridView(analyses) {
        gridView.innerHTML = '';
        
        analyses.forEach((analysis, index) => {
            const card = createAnalysisCard(analysis);
            card.style.animationDelay = `${index * 0.1}s`;
            gridView.appendChild(card);
        });
    }

    function renderListView(analyses) {
        const listContent = listView.querySelector('.list-content');
        listContent.innerHTML = '';
        
        analyses.forEach((analysis, index) => {
            const item = createAnalysisListItem(analysis);
            item.style.animationDelay = `${index * 0.05}s`;
            listContent.appendChild(item);
        });
    }

    function createAnalysisCard(analysis) {
        const card = document.createElement('div');
        card.className = 'analysis-card';
        card.innerHTML = `
            <div class="card-checkbox">
                <input type="checkbox" data-id="${analysis.id}">
            </div>
            <div class="card-image">
                <img src="${analysis.thumbnail}" alt="${analysis.fileName}" loading="lazy">
            </div>
            <div class="card-content">
                <div class="card-header">
                    <div>
                        <div class="card-title">${analysis.fileName}</div>
                        <div class="card-date">${formatDate(analysis.date)}</div>
                    </div>
                </div>
                <div class="card-result">
                    <span class="result-label">${analysis.result}</span>
                    <span class="confidence-score">${analysis.confidence}%</span>
                </div>
                <div class="card-actions">
                    <button class="action-btn primary" onclick="viewDetails(${analysis.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" fill="none"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                        Voir
                    </button>
                    <button class="action-btn secondary" onclick="downloadAnalysis(${analysis.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                    <button class="action-btn danger" onclick="deleteAnalysis(${analysis.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        // Événement de sélection
        const checkbox = card.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', handleSelection);

        return card;
    }

    function createAnalysisListItem(analysis) {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="item-file">
                <div class="item-checkbox">
                    <input type="checkbox" data-id="${analysis.id}">
                </div>
                <div class="file-info">
                    <div class="file-name">${analysis.fileName}</div>
                    <div class="file-size">${analysis.fileSize}</div>
                </div>
            </div>
            <div class="item-date">${formatDate(analysis.date)}</div>
            <div class="item-result">
                <div class="result-status ${analysis.resultType}"></div>
                <span>${analysis.result}</span>
            </div>
            <div class="item-confidence">${analysis.confidence}%</div>
            <div class="item-actions">
                <button class="action-btn primary" onclick="viewDetails(${analysis.id})">Voir</button>
                <button class="action-btn secondary" onclick="downloadAnalysis(${analysis.id})">DL</button>
                <button class="action-btn danger" onclick="deleteAnalysis(${analysis.id})">×</button>
            </div>
        `;

        // Événement de sélection
        const checkbox = item.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', handleSelection);

        return item;
    }

    function handleSelection(e) {
        const analysisId = parseInt(e.target.dataset.id);
        const isChecked = e.target.checked;

        if (isChecked) {
            selectedAnalyses.push(analysisId);
        } else {
            selectedAnalyses = selectedAnalyses.filter(id => id !== analysisId);
        }

        // Mettre à jour l'affichage
        updateSelectionUI();

        // Afficher le modal d'actions groupées si nécessaire
        if (selectedAnalyses.length > 0 && selectedAnalyses.length <= 1) {
            // Pas de modal pour une seule sélection
        } else if (selectedAnalyses.length > 1) {
            showBulkModal();
        }
    }

    function updateSelectionUI() {
        // Mettre à jour les cartes/items sélectionnés
        document.querySelectorAll('.analysis-card, .list-item').forEach(element => {
            const checkbox = element.querySelector('input[type="checkbox"]');
            const analysisId = parseInt(checkbox.dataset.id);
            
            if (selectedAnalyses.includes(analysisId)) {
                element.classList.add('selected');
            } else {
                element.classList.remove('selected');
            }
        });
    }

    function showBulkModal() {
        document.getElementById('selectedCount').textContent = selectedAnalyses.length;
        bulkModal.style.display = 'flex';
    }

    function closeBulkModalHandler() {
        bulkModal.style.display = 'none';
    }

    function updatePagination() {
        const totalPages = Math.ceil(filteredAnalyses.length / itemsPerPage);
        
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
        
        pageInfo.textContent = `Page ${currentPage} sur ${totalPages}`;
    }

    function changePage(page) {
        const totalPages = Math.ceil(filteredAnalyses.length / itemsPerPage);
        
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            renderAnalyses();
            updatePagination();
            
            // Scroll vers le haut
            document.querySelector('.results-section').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    function updateStats() {
        const totalAnalyses = allAnalyses.length;
        const thisMonth = allAnalyses.filter(analysis => {
            const now = new Date();
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return analysis.date >= monthAgo;
        }).length;
        const avgConfidence = Math.round(
            allAnalyses.reduce((sum, analysis) => sum + analysis.confidence, 0) / totalAnalyses
        );

        document.getElementById('totalAnalyses').textContent = totalAnalyses;
        document.getElementById('thisMonth').textContent = thisMonth;
        document.getElementById('avgConfidence').textContent = avgConfidence + '%';
    }

    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const finalValue = stat.textContent;
            let currentValue = 0;
            const increment = finalValue.includes('%') ? 
                parseFloat(finalValue) / 30 : 
                parseInt(finalValue) / 30;

            const timer = setInterval(() => {
                if (finalValue.includes('%')) {
                    currentValue += increment;
                    if (currentValue >= parseFloat(finalValue)) {
                        currentValue = parseFloat(finalValue);
                        clearInterval(timer);
                    }
                    stat.textContent = Math.floor(currentValue) + '%';
                } else {
                    currentValue += increment;
                    if (currentValue >= parseInt(finalValue)) {
                        currentValue = parseInt(finalValue);
                        clearInterval(timer);
                    }
                    stat.textContent = Math.floor(currentValue);
                }
            }, 50);
        });
    }

    function formatDate(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return 'Hier';
        } else if (diffDays < 7) {
            return `Il y a ${diffDays} jours`;
        } else {
            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Fonctions globales pour les boutons
    window.viewDetails = function(id) {
        const analysis = allAnalyses.find(a => a.id === id);
        if (analysis) {
            window.location.href = `results.html?file=${encodeURIComponent(analysis.fileName)}`;
        }
    };

    window.downloadAnalysis = function(id) {
        showNotification('Téléchargement en cours...', 'info');
        setTimeout(() => {
            showNotification('Analyse téléchargée avec succès!', 'success');
        }, 1500);
    };

    window.deleteAnalysis = function(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette analyse ?')) {
            allAnalyses = allAnalyses.filter(a => a.id !== id);
            filteredAnalyses = filteredAnalyses.filter(a => a.id !== id);
            selectedAnalyses = selectedAnalyses.filter(selectedId => selectedId !== id);
            
            updateStats();
            renderAnalyses();
            updatePagination();
            
            showNotification('Analyse supprimée avec succès!', 'success');
        }
    };

    function bulkDownload() {
        showNotification(`Téléchargement de ${selectedAnalyses.length} analyses en cours...`, 'info');
        setTimeout(() => {
            showNotification('Téléchargement terminé!', 'success');
            selectedAnalyses = [];
            updateSelectionUI();
            closeBulkModalHandler();
        }, 2000);
    }

    function bulkDelete() {
        if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedAnalyses.length} analyses ?`)) {
            allAnalyses = allAnalyses.filter(a => !selectedAnalyses.includes(a.id));
            filteredAnalyses = filteredAnalyses.filter(a => !selectedAnalyses.includes(a.id));
            
            const deletedCount = selectedAnalyses.length;
            selectedAnalyses = [];
            
            updateStats();
            renderAnalyses();
            updatePagination();
            updateSelectionUI();
            closeBulkModalHandler();
            
            showNotification(`${deletedCount} analyses supprimées avec succès!`, 'success');
        }
    }
});

