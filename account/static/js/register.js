document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('registerForm');
    if (!form) return;

    // Initialize functionality
    setupPasswordToggles();
    setupFormValidation();

    // Form submit handler
    form.addEventListener('submit', function (e) {
        const submitBtn = document.getElementById('submitBtn');
        setButtonLoading(submitBtn, true);
    });

    function setupPasswordToggles() {
        document.querySelectorAll(".password-toggle").forEach(toggle => {
            toggle.addEventListener("click", function () {
                const inputGroup = this.closest('.input-group');
                const input = inputGroup.querySelector('input');
                if (input) togglePasswordVisibility(input, this);
            });
        });
    }

    function togglePasswordVisibility(input, toggleButton) {
        const eyeOpen = toggleButton.querySelector('.eye-open');
        const eyeClosed = toggleButton.querySelector('.eye-closed');

        if (input.type === "password") {
            input.type = "text";
            eyeOpen.style.display = 'none';
            eyeClosed.style.display = 'block';
        } else {
            input.type = "password";
            eyeOpen.style.display = 'block';
            eyeClosed.style.display = 'none';
        }
    }

    function setupFormValidation() {
        const password1 = document.getElementById('id_password1');
        const password2 = document.getElementById('id_password2');
        const email = document.getElementById('id_email');

        if (password1 && password2) {
            password1.addEventListener('input', () => {
                validatePasswordStrength(password1);
                checkPasswordMatch(password1, password2);
            });

            password2.addEventListener('input', () => {
                checkPasswordMatch(password1, password2);
            });
        }

        if (email) {
            email.addEventListener('blur', () => validateEmailField(email));
        }
    }

    function validatePasswordStrength(input) {
        clearFieldError(input);
        const value = input.value;

        if (value.length < 8) {
            showFieldError(input, "Le mot de passe doit contenir au moins 8 caractères");
            return false;
        }
        return true;
    }

    function checkPasswordMatch(pass1, pass2) {
        clearFieldError(pass2);

        if (!pass1.value || !pass2.value) return;

        if (pass1.value !== pass2.value) {
            showFieldError(pass2, "Les mots de passe ne correspondent pas");
            return false;
        }
        return true;
    }

    function validateEmailField(input) {
        clearFieldError(input);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (input.value && !emailRegex.test(input.value)) {
            showFieldError(input, "Format d'email invalide");
            return false;
        }
        return true;
    }

    function setButtonLoading(button, isLoading) {
        button.disabled = isLoading;
        if (isLoading) {
            button.classList.add('loading');
            const btnText = button.querySelector('.btn-text');
            const btnLoader = button.querySelector('.btn-loader');
            if (btnText) btnText.style.opacity = "0";
            if (btnLoader) btnLoader.style.display = "block";
        } else {
            button.classList.remove('loading');
            const btnText = button.querySelector('.btn-text');
            const btnLoader = button.querySelector('.btn-loader');
            if (btnText) btnText.style.opacity = "1";
            if (btnLoader) btnLoader.style.display = "none";
        }
    }

    function showFieldError(field, message) {
        clearFieldError(field);
        field.classList.add("error");

        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        const errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        errorDiv.textContent = message;

        formGroup.appendChild(errorDiv);
    }

    function clearFieldError(field) {
        field.classList.remove("error");
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        const errorMsg = formGroup.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    }
});