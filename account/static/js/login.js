document.addEventListener("DOMContentLoaded", function () {
    // --- Éléments du DOM ---
    // On vérifie si les formulaires existent sur la page actuelle
    const loginForm = document.getElementById("loginFormElement");
    const registerForm = document.getElementById("registerFormElement");

    // --- Initialisation ---
    // Le script s'exécute seulement si l'un des formulaires est présent
    if (loginForm || registerForm) {
        initializeAuthPage();
    }

    /**
     * @function initializeAuthPage
     * Fonction principale qui initialise toutes les fonctionnalités de la page.
     */
    function initializeAuthPage() {
        // Active le basculement de la visibilité pour tous les champs de mot de passe
        setupPasswordToggles();

        // Met en place la validation en temps réel pour les champs du formulaire d'inscription
        if (registerForm) {
            setupRegistrationValidation();
        }

        // Ajoute une animation d'entrée au formulaire actif
        animateFormEntrance();

        // Gère l'état de chargement du bouton lors de la soumission du formulaire
        const currentForm = loginForm || registerForm;
        currentForm.addEventListener("submit", function () {
            const submitButton = currentForm.querySelector("button[type='submit']");
            if (submitButton) {
                setButtonLoading(submitButton, true);
            }
        });
    }

    // --- Fonctions de Configuration ---

    /**
     * @function setupPasswordToggles
     * Ajoute des écouteurs d'événements aux boutons pour afficher/masquer le mot de passe.
     */
    function setupPasswordToggles() {
        document.querySelectorAll(".password-toggle").forEach(toggle => {
            toggle.addEventListener("click", function () {
                const input = this.previousElementSibling;
                if (input && input.type) {
                    togglePasswordVisibility(input, this);
                }
            });
        });
    }

    /**
     * @function setupRegistrationValidation
     * Configure les écouteurs pour la validation en direct du formulaire d'inscription.
     */
    function setupRegistrationValidation() {
        const passwordInput = document.getElementById("id_password1");
        const confirmPasswordInput = document.getElementById("id_password2");
        const emailInput = document.getElementById("id_email");

        if (passwordInput && confirmPasswordInput) {
            passwordInput.addEventListener("input", () => checkPasswordMatch(passwordInput, confirmPasswordInput));
            confirmPasswordInput.addEventListener("input", () => checkPasswordMatch(passwordInput, confirmPasswordInput));
        }

        if (emailInput) {
            emailInput.addEventListener("blur", () => validateEmailField(emailInput));
        }
    }

    // --- Fonctions Utilitaires ---

    /**
     * @function togglePasswordVisibility
     * Change le type de l'input (password/text) et met à jour l'icône.
     * @param {HTMLInputElement} input - Le champ du mot de passe.
     * @param {HTMLElement} toggleButton - Le bouton avec les icônes.
     */
    function togglePasswordVisibility(input, toggleButton) {
        const eyeOpen = toggleButton.querySelector(".eye-open");
        const eyeClosed = toggleButton.querySelector(".eye-closed");

        if (input.type === "password") {
            input.type = "text";
            eyeOpen.style.display = "none";
            eyeClosed.style.display = "block";
        } else {
            input.type = "password";
            eyeOpen.style.display = "block";
            eyeClosed.style.display = "none";
        }
    }

    /**
     * @function checkPasswordMatch
     * Vérifie si les deux champs de mot de passe correspondent.
     * @param {HTMLInputElement} pass1 - Premier champ de mot de passe.
     * @param {HTMLInputElement} pass2 - Second champ de mot de passe (confirmation).
     */
    function checkPasswordMatch(pass1, pass2) {
        if (pass2.value.length === 0) {
            clearFieldError(pass2);
            return;
        }
        if (pass1.value === pass2.value) {
            showFieldSuccess(pass2, "Les mots de passe correspondent.");
        } else {
            showFieldError(pass2, "Les mots de passe ne correspondent pas.");
        }
    }

    /**
     * @function validateEmailField
     * Valide le format de l'email lors de la perte de focus.
     * @param {HTMLInputElement} emailInput - Le champ de l'email.
     */
    function validateEmailField(emailInput) {
        const emailRegex = /^[^@]+@[^@] +\.[^@] + $ /;
        if (emailInput.value.length > 0 && !emailRegex.test(emailInput.value)) {
            showFieldError(emailInput, "Format d'email invalide.");
        } else {
            clearFieldError(emailInput);
        }
    }

    /**
     * @function setButtonLoading
     * Gère l'état visuel (chargement/normal) d'un bouton.
     * @param {HTMLButtonElement} button - Le bouton à modifier.
     * @param {boolean} isLoading - True pour afficher le chargement, false pour revenir à la normale.
     */
    function setButtonLoading(button, isLoading) {
        button.disabled = isLoading;
        if (isLoading) {
            button.classList.add("loading");
            button.dataset.originalText = button.innerHTML;
            button.innerHTML = '<span class="loading-spinner"></span> Chargement...';
        } else {
            button.classList.remove("loading");
            if (button.dataset.originalText) {
                button.innerHTML = button.dataset.originalText;
            }
        }
    }

    // --- Fonctions d'Affichage des Erreurs/Succès ---

    /**
     * @function showFieldError
     * Affiche un message d'erreur sous un champ de formulaire.
     * @param {HTMLElement} field - Le champ concerné.
     * @param {string} message - Le message d'erreur à afficher.
     */
    function showFieldError(field, message) {
        clearFieldError(field); // Évite les doublons
        field.classList.add("error");
        field.classList.remove("success");

        const errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        errorDiv.textContent = message;

        // Insère le message après le groupe d'input
        field.closest(".input-group").insertAdjacentElement("afterend", errorDiv);
    }

    /**
     * @function showFieldSuccess
     * Affiche un message de succès sous un champ de formulaire.
     * @param {HTMLElement} field - Le champ concerné.
     * @param {string} message - Le message de succès à afficher.
     */
    function showFieldSuccess(field, message) {
        clearFieldError(field);
        field.classList.add("success");
        field.classList.remove("error");

        const successDiv = document.createElement("div");
        successDiv.className = "success-message";
        successDiv.textContent = message;

        field.closest(".input-group").insertAdjacentElement("afterend", successDiv);
    }

    /**
     * @function clearFieldError
     * Supprime tout message d'erreur ou de succès associé à un champ.
     * @param {HTMLElement} field - Le champ concerné.
     */
    function clearFieldError(field) {
        field.classList.remove("error", "success");
        const formGroup = field.closest(".form-group");
        const message = formGroup.querySelector(".error-message, .success-message");
        if (message) {
            message.remove();
        }
    }

    // --- Animation ---

    /**
     * @function animateFormEntrance
     * Applique une animation de fondu et de translation au formulaire actif.
     */
    function animateFormEntrance() {
        const activeForm = document.querySelector(".auth-form.active");
        if (activeForm) {
            activeForm.style.opacity = "0";
            activeForm.style.transform = "translateY(20px)";
            setTimeout(() => {
                activeForm.style.transition = "all 0.5s ease-out";
                activeForm.style.opacity = "1";
                activeForm.style.transform = "translateY(0)";
            }, 100);
        }
    }
});

