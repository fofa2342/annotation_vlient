document.addEventListener('DOMContentLoaded', function () {
    // Éléments DOM
    const authForms = document.querySelectorAll('.auth-form');
    const switchFormLinks = document.querySelectorAll('.switch-form');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const passwordToggles = document.querySelectorAll('.password-toggle');
    const forms = document.querySelectorAll('.form');

    // Éléments spécifiques aux formulaires
    const loginForm = document.getElementById('loginFormElement');
    const registerForm = document.getElementById('registerFormElement');
    const forgotForm = document.getElementById('forgotFormElement');

    // Éléments de validation
    const registerPassword = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordStrength = document.getElementById('passwordStrength');

    // Variables globales
    let currentForm = 'loginForm';

    // Initialisation
    initializeAuth();

    function initializeAuth() {
        // Basculement des mots de passe
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', togglePasswordVisibility);
        });

        // Soumission des formulaires
        if (loginForm) loginForm.addEventListener('submit', handleLogin);
        if (registerForm) registerForm.addEventListener('submit', handleRegister);
        if (forgotForm) forgotForm.addEventListener('submit', handleForgotPassword);

        // Validation en temps réel
        if (registerPassword) {
            registerPassword.addEventListener('input', checkPasswordStrength);
        }

        if (confirmPassword) {
            confirmPassword.addEventListener('input', checkPasswordMatch);
        }

        // Validation des champs en temps réel
        setupRealTimeValidation();

        // Animation d'entrée
        animateFormEntrance();
    }
    function togglePasswordVisibility(e) {
        const button = e.currentTarget;
        const input = button.previousElementSibling;
        const icon = button.querySelector('svg');

        if (input.type === 'password') {
            input.type = 'text';
            icon.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="1" y1="1" x2="23" y2="23" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            `;
        } else {
            input.type = 'password';
            icon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="#64748b" stroke-width="2" fill="none"/>
            `;
        }
    }

    function handleLogin(e) {
        e.preventDefault();

        const password = document.getElementById('loginPassword').value;

        // Validation basique
        if (!validateEmail(email)) {
            showFieldError('loginEmail', 'Veuillez saisir un email valide');
            return;
        }

        if (password.length < 8) {
            showFieldError('loginPassword', 'Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        // Animation de chargement
        setButtonLoading(submitBtn, true);

        // Simulation de la connexion
        setTimeout(() => {
            setButtonLoading(submitBtn, false);

            // Simuler une connexion réussie
            showNotification('Connexion réussie! Redirection en cours...', 'success');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }, 2000);
    }

    function handleRegister(e) {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPass = document.getElementById('confirmPassword').value;
        const acceptTerms = document.getElementById('acceptTerms').checked;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        // Validation
        let hasError = false;

        if (firstName.length < 2) {
            showFieldError('firstName', 'Le prénom doit contenir au moins 2 caractères');
            hasError = true;
        }

        if (lastName.length < 2) {
            showFieldError('lastName', 'Le nom doit contenir au moins 2 caractères');
            hasError = true;
        }

        if (!validateEmail(email)) {
            showFieldError('registerEmail', 'Veuillez saisir un email valide');
            hasError = true;
        }

        if (!isPasswordStrong(password)) {
            showFieldError('registerPassword', 'Le mot de passe doit être plus fort');
            hasError = true;
        }

        if (password !== confirmPass) {
            showFieldError('confirmPassword', 'Les mots de passe ne correspondent pas');
            hasError = true;
        }

        if (!acceptTerms) {
            showNotification('Vous devez accepter les conditions d\'utilisation', 'error');
            hasError = true;
        }

        if (hasError) return;

        // Animation de chargement
        setButtonLoading(submitBtn, true);

        // Simulation de l'inscription
        setTimeout(() => {
            setButtonLoading(submitBtn, false);

            // Simuler une inscription réussie
            showNotification('Compte créé avec succès! Vérifiez votre email.', 'success');

            setTimeout(() => {
                switchForm('loginForm');
            }, 2000);
        }, 2500);
    }

    function handleForgotPassword(e) {
        e.preventDefault();

        const email = document.getElementById('forgotEmail').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        if (!validateEmail(email)) {
            showFieldError('forgotEmail', 'Veuillez saisir un email valide');
            return;
        }

        // Animation de chargement
        setButtonLoading(submitBtn, true);

        // Simulation de l'envoi
        setTimeout(() => {
            setButtonLoading(submitBtn, false);

            showNotification('Lien de réinitialisation envoyé! Vérifiez votre email.', 'success');

            setTimeout(() => {
                switchForm('loginForm');
            }, 2000);
        }, 1500);
    }

    function checkPasswordStrength() {
        const password = registerPassword.value;
        const strengthFill = passwordStrength.querySelector('.strength-fill');
        const strengthText = passwordStrength.querySelector('.strength-text');

        if (password.length === 0) {
            strengthFill.className = 'strength-fill';
            strengthText.textContent = 'Saisissez un mot de passe';
            return;
        }

        const strength = calculatePasswordStrength(password);

        strengthFill.className = `strength-fill ${strength.level}`;
        strengthText.textContent = strength.text;
        strengthText.style.color = strength.color;
    }

    function calculatePasswordStrength(password) {
        let score = 0;

        // Longueur
        if (password.length >= 8) score += 25;
        if (password.length >= 12) score += 25;

        // Caractères
        if (/[a-z]/.test(password)) score += 10;
        if (/[A-Z]/.test(password)) score += 15;
        if (/[0-9]/.test(password)) score += 15;
        if (/[^A-Za-z0-9]/.test(password)) score += 10;

        if (score < 30) {
            return { level: 'weak', text: 'Faible', color: '#ef4444' };
        } else if (score < 60) {
            return { level: 'fair', text: 'Moyen', color: '#f59e0b' };
        } else if (score < 90) {
            return { level: 'good', text: 'Bon', color: '#3b82f6' };
        } else {
            return { level: 'strong', text: 'Fort', color: '#10b981' };
        }
    }

    function isPasswordStrong(password) {
        return calculatePasswordStrength(password).level !== 'weak';
    }

    function checkPasswordMatch() {
        const password = registerPassword.value;
        const confirm = confirmPassword.value;

        if (confirm.length === 0) return;

        if (password === confirm) {
            showFieldSuccess('confirmPassword', 'Les mots de passe correspondent');
        } else {
            showFieldError('confirmPassword', 'Les mots de passe ne correspondent pas');
        }
    }

    function setupRealTimeValidation() {
        // Validation email en temps réel
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', function () {
                if (this.value && !validateEmail(this.value)) {
                    showFieldError(this.id, 'Format d\'email invalide');
                } else if (this.value) {
                    clearFieldError(this.id);
                }
            });
        });

        // Validation des champs requis
        const requiredInputs = document.querySelectorAll('input[required]');
        requiredInputs.forEach(input => {
            input.addEventListener('blur', function () {
                if (!this.value.trim()) {
                    showFieldError(this.id, 'Ce champ est requis');
                } else {
                    clearFieldError(this.id);
                }
            });

            input.addEventListener('input', function () {
                if (this.value.trim()) {
                    clearFieldError(this.id);
                }
            });
        });
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.classList.add('error');
        field.classList.remove('success');

        // Supprimer l'ancien message d'erreur
        const existingError = field.parentNode.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Ajouter le nouveau message d'erreur
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            ${message}
        `;

        field.parentNode.parentNode.appendChild(errorDiv);
    }

    function showFieldSuccess(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.classList.add('success');
        field.classList.remove('error');

        // Supprimer l'ancien message
        const existingMessage = field.parentNode.parentNode.querySelector('.error-message, .success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Ajouter le message de succès
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            ${message}
        `;

        field.parentNode.parentNode.appendChild(successDiv);
    }

    function clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.classList.remove('error', 'success');

        // Supprimer les messages
        const messages = field.parentNode.parentNode.querySelectorAll('.error-message, .success-message');
        messages.forEach(msg => msg.remove());
    }

    function setButtonLoading(button, loading) {
        const btnText = button.querySelector('.btn-text');
        const btnLoader = button.querySelector('.btn-loader');

        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
            btnText.style.opacity = '0';
            btnLoader.style.display = 'block';
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            btnText.style.opacity = '1';
            btnLoader.style.display = 'none';
        }
    }

    function animateFormEntrance() {
        const activeForm = document.querySelector('.auth-form.active');
        if (activeForm) {
            activeForm.style.opacity = '0';
            activeForm.style.transform = 'translateY(20px)';

            setTimeout(() => {
                activeForm.style.transition = 'all 0.6s ease';
                activeForm.style.opacity = '1';
                activeForm.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    // Gestion des raccourcis clavier
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            const activeForm = document.querySelector('.auth-form.active form');
            if (activeForm) {
                activeForm.dispatchEvent(new Event('submit'));
            }
        }
    });

    // Animation de la marque au chargement
    setTimeout(() => {
        const brandLogo = document.querySelector('.brand-logo svg');
        if (brandLogo) {
            brandLogo.style.transform = 'scale(1.1)';
            setTimeout(() => {
                brandLogo.style.transform = 'scale(1)';
            }, 300);
        }
    }, 1000);
});

