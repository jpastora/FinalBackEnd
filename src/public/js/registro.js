document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");

    // Función para mostrar mensaje de error en un campo específico
    function showError(inputId, message) {
        const errorElement = document.getElementById(`error-${inputId}`);
        errorElement.innerText = message;
        errorElement.style.display = "block";
    }

    // Función para limpiar el mensaje de error de un campo
    function clearError(inputId) {
        const errorElement = document.getElementById(`error-${inputId}`);
        errorElement.innerText = "";
        errorElement.style.display = "none";
    }

    // Validar correos electrónicos
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validar todos los campos requeridos en el submit
    form.addEventListener("submit", (e) => {
        let isValid = true;

        // Validar nombre
        const name = document.getElementById("name").value.trim();
        if (name.length < 3) {
            showError("name", "El nombre debe tener al menos 3 caracteres.");
            isValid = false;
        } else {
            clearError("name");
        }

        // Validar segundo nombre (apellido)
        const secondName = document.getElementById("secondName").value.trim();
        if (secondName.length < 3) {
            showError("secondName", "El apellido debe tener al menos 3 caracteres.");
            isValid = false;
        } else {
            clearError("secondName");
        }

        // Validar identificación
        const id = document.getElementById("id").value.trim();
        if (!/^\d+$/.test(id)) {
            showError("id", "La identificación debe contener solo números.");
            isValid = false;
        } else {
            clearError("id");
        }

        // Validar correo electrónico
        const email = document.getElementById("email").value.trim();
        if (!validateEmail(email)) {
            showError("email", "El correo electrónico no es válido.");
            isValid = false;
        } else {
            clearError("email");
        }

        // Validar confirmación de correo electrónico
        const confirmEmail = document.getElementById("confirm_email").value.trim();
        if (email !== confirmEmail) {
            showError("confirm_email", "Los correos electrónicos no coinciden.");
            isValid = false;
        } else {
            clearError("confirm_email");
        }

        // Validar contraseña
        const password = document.getElementById("password").value;
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
            showError("password", "La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número.");
            isValid = false;
        } else {
            clearError("password");
        }

        // Validar confirmación de contraseña
        const confirmPassword = document.getElementById("confirm_password").value;
        if (password !== confirmPassword) {
            showError("confirm_password", "Las contraseñas no coinciden.");
            isValid = false;
        } else {
            clearError("confirm_password");
        }

        // Validar teléfono
        const phone = document.getElementById("phone").value.trim();
        const phoneRegex = /{8}$/;
        if (!phoneRegex.test(phone)) {
            showError("phone", "Ingrese un número de teléfono válido con formato XXXXXXXX.");
            isValid = false;
        } else {
            clearError("phone");
        }

        // Validar términos y condiciones
        const terms = document.getElementById("terms").checked;
        if (!terms) {
            showError("terms", "Debe aceptar los Términos y Condiciones.");
            isValid = false;
        } else {
            clearError("terms");
        }

        // Si alguna validación falla, prevenir el envío del formulario
        if (!isValid) {
            e.preventDefault();
        }
    });
});
