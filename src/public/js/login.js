document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");

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

    // Validaciones individuales para cada campo
    document.getElementById("Email__Usuario").addEventListener("blur", () => {
        const email = document.getElementById("Email__Usuario").value.trim();
        if (!validateEmail(email)) {
            showError("email", "El correo electrónico no es válido.");
        } else {
            clearError("email");
        }
    });

    document.getElementById("Password__Usuario").addEventListener("blur", () => {
        const password = document.getElementById("Password__Usuario").value;
        if (password.length < 8) {
            showError("password", "La contraseña debe tener al menos 8 caracteres.");
        } else {
            clearError("password");
        }
    });

    // Validación final al enviar el formulario
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        let valid = true;

        // Forzamos todas las validaciones para mostrar errores si hay campos inválidos
        ["email", "password"].forEach((id) => {
            const element = document.getElementById(`Email__Usuario`);
            element.dispatchEvent(new Event("blur"));
            if (document.getElementById(`error-${id}`).innerText !== "") {
                valid = false;
            }
        });

        if (valid) {
            form.submit();
        }
    });

    // Función para validar formato de correo
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});
