document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const progressContainer = document.getElementById('progressContainer');
    const uploadBtn = document.getElementById('uploadBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const removeFileBtn = document.getElementById('removeFile');

    // Variables globales
    let selectedFile = null;
    let uploadInProgress = false;

    // Initialisation
    initializeUpload();

    function initializeUpload() {
        // Événements de glisser-déposer
        uploadZone.addEventListener('dragover', handleDragOver);
        uploadZone.addEventListener('dragleave', handleDragLeave);
        uploadZone.addEventListener('drop', handleDrop);

        // Clic sur la zone de téléversement
        uploadZone.addEventListener('click', () => {
            if (!uploadInProgress) {
                fileInput.click();
            }
        });

        // Sélection de fichier
        fileInput.addEventListener('change', handleFileSelect);

        // Boutons d'action
        uploadBtn.addEventListener('click', startUpload);
        cancelBtn.addEventListener('click', cancelUpload);
        removeFileBtn.addEventListener('click', removeFile);
    }

    function handleDragOver(e) {
        e.preventDefault();
        if (!uploadInProgress) {
            uploadZone.classList.add('dragover');
        }
    }

    function handleDragLeave(e) {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
    }

    function handleDrop(e) {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        
        if (uploadInProgress) return;

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    }

    function handleFileSelect(e) {
        if (e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    }

    function processFile(file) {
        // Validation du fichier
        if (!validateFile(file)) {
            return;
        }

        selectedFile = file;
        showFilePreview(file);
        uploadBtn.disabled = false;
        uploadZone.classList.add('has-file');
    }

    function validateFile(file) {
        // Vérifier le type de fichier
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            showNotification('Type de fichier non supporté. Utilisez JPG, PNG ou DICOM.', 'error');
            return false;
        }

        // Vérifier la taille du fichier (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            showNotification('Le fichier est trop volumineux. Taille maximale: 10MB.', 'error');
            return false;
        }

        return true;
    }

    function showFilePreview(file) {
        // Afficher les informations du fichier
        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileSize').textContent = formatFileSize(file.size);
        document.getElementById('fileType').textContent = file.type;

        // Créer un aperçu de l'image
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewImg').src = e.target.result;
        };
        reader.readAsDataURL(file);

        // Afficher la section d'aperçu
        filePreview.style.display = 'block';
        filePreview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function startUpload() {
        if (!selectedFile || uploadInProgress) return;

        uploadInProgress = true;
        uploadBtn.style.display = 'none';
        cancelBtn.style.display = 'inline-block';
        progressContainer.style.display = 'block';

        // Animation de la zone de téléversement
        uploadZone.classList.add('pulse');

        // Simuler le processus de téléversement
        simulateUpload();
    }

    function simulateUpload() {
        const progressFill = document.getElementById('progressFill');
        const progressPercentage = document.getElementById('progressPercentage');
        const progressStatus = document.getElementById('progressStatus');

        let progress = 0;
        const stages = [
            { progress: 20, status: 'Validation du fichier...', duration: 800 },
            { progress: 40, status: 'Téléversement vers le serveur...', duration: 1500 },
            { progress: 60, status: 'Préparation pour l\'analyse IA...', duration: 1000 },
            { progress: 80, status: 'Analyse en cours...', duration: 2000 },
            { progress: 95, status: 'Finalisation...', duration: 500 },
            { progress: 100, status: 'Analyse terminée!', duration: 300 }
        ];

        let currentStage = 0;

        function updateProgress() {
            if (currentStage >= stages.length) {
                completeUpload();
                return;
            }

            const stage = stages[currentStage];
            progressStatus.textContent = stage.status;

            // Animation progressive
            const startProgress = progress;
            const targetProgress = stage.progress;
            const duration = stage.duration;
            const startTime = Date.now();

            function animateProgress() {
                const elapsed = Date.now() - startTime;
                const progressRatio = Math.min(elapsed / duration, 1);
                
                progress = startProgress + (targetProgress - startProgress) * progressRatio;
                
                progressFill.style.width = progress + '%';
                progressPercentage.textContent = Math.round(progress) + '%';

                if (progressRatio < 1 && uploadInProgress) {
                    requestAnimationFrame(animateProgress);
                } else {
                    currentStage++;
                    setTimeout(updateProgress, 200);
                }
            }

            animateProgress();
        }

        updateProgress();
    }

    function completeUpload() {
        uploadZone.classList.remove('pulse');
        uploadZone.classList.add('upload-success');

        showNotification('Analyse terminée avec succès! Redirection vers les résultats...', 'success');

        setTimeout(() => {
            // Redirection vers la page de résultats
            window.location.href = 'results.html?file=' + encodeURIComponent(selectedFile.name);
        }, 2000);
    }

    function cancelUpload() {
        if (!uploadInProgress) return;

        uploadInProgress = false;
        uploadBtn.style.display = 'inline-block';
        cancelBtn.style.display = 'none';
        progressContainer.style.display = 'none';

        uploadZone.classList.remove('pulse', 'upload-success');

        showNotification('Téléversement annulé.', 'info');
    }

    function removeFile() {
        selectedFile = null;
        fileInput.value = '';
        filePreview.style.display = 'none';
        uploadBtn.disabled = true;
        uploadZone.classList.remove('has-file', 'upload-success');

        // Reset du formulaire
        if (uploadInProgress) {
            cancelUpload();
        }
    }

    // Prévenir le comportement par défaut du navigateur pour le glisser-déposer
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Animation d'entrée pour les éléments
    const animatedElements = document.querySelectorAll('.upload-zone, .instructions');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200 + 300);
    });
});

