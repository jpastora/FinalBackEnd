document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");
    const messageContainer = document.getElementById("messageContainer");

    // Función para mostrar mensajes dinámicos en la página
    function showMessage(type, message) {
        messageContainer.innerHTML = `
            <div class="message ${type}">
                ${message}
            </div>
        `;
        messageContainer.style.display = "block";
    }

    // Validaciones
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhone(phone) {
        const phoneRegex = /^\d{8}$/; // Acepta exactamente 8 dígitos
        return phoneRegex.test(phone);
    }

    // Enviar formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Previene el envío estándar del formulario

        const formData = new FormData(form);

        try {
            const response = await fetch('/registerUser', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                showMessage("success", "Registro exitoso. Por favor, revisa tu correo para más detalles.");
            } else {
                showMessage("error", `Error en el registro: ${result.message}`);
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            showMessage("error", "Ocurrió un error inesperado. Intente nuevamente.");
        }
    });
});
