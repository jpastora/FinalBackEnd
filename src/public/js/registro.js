document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");

    function showError(inputId, message) {
        const errorElement = document.getElementById(`error-${inputId}`);
        if (errorElement) {
            errorElement.innerText = message;
            errorElement.style.display = "block";
        }
    }

    function clearError(inputId) {
        const errorElement = document.getElementById(`error-${inputId}`);
        if (errorElement) {
            errorElement.innerText = "";
            errorElement.style.display = "none";
        }
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhone(phone) {
        const phoneRegex = /^\d{8}$/;
        return phoneRegex.test(phone);
    }

    function validateMatchingFields(field1Id, field2Id, errorMessage) {
        const field1 = document.getElementById(field1Id);
        const field2 = document.getElementById(field2Id);
        if (field1.value !== field2.value) {
            showError(field2Id, errorMessage);
            return false;
        }
        clearError(field2Id);
        return true;
    }

    function validateText(text) {
        const textRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]{3,}$/;
        return textRegex.test(text);
    }

    form.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", (e) => {
            const { id, value } = e.target;
            switch (id) {
                case "name":
                    if (!validateText(value)) {
                        showError(id, "El nombre debe tener al menos 3 caracteres y solo puede contener letras.");
                    } else {
                        clearError(id);
                    }
                    break;
                case "secondName":
                    if (!validateText(value)) {
                        showError(id, "El apellido debe tener al menos 3 caracteres y solo puede contener letras.");
                    } else {
                        clearError(id);
                    }
                    break;
                case "id":
                    /^\d{1,9}$/.test(value) 
                        ? clearError(id) 
                        : showError(id, "La identificación debe contener solo números y tener máximo 9 dígitos.");
                    break;
                case "email":
                    if (!validateEmail(value)) {
                        showError(id, "El correo electrónico no es válido.");
                    } else {
                        clearError(id);
                        // Validar coincidencia si confirm_email tiene valor
                        if (document.getElementById("confirm_email").value) {
                            validateMatchingFields("email", "confirm_email", "Los correos no coinciden.");
                        }
                    }
                    break;
                case "confirm_email":
                    validateMatchingFields("email", "confirm_email", "Los correos no coinciden.");
                    break;
                case "password":
                    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)) {
                        showError(id, "La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número.");
                    } else {
                        clearError(id);
                        // Validar coincidencia si confirm_password tiene valor
                        if (document.getElementById("confirm_password").value) {
                            validateMatchingFields("password", "confirm_password", "Las contraseñas no coinciden.");
                        }
                    }
                    break;
                case "confirm_password":
                    validateMatchingFields("password", "confirm_password", "Las contraseñas no coinciden.");
                    break;
                case "phone":
                    validatePhone(value) ? clearError(id) : showError(id, "El número debe tener exactamente 8 dígitos.");
                    break;
                case "terms":
                    e.target.checked ? clearError(id) : showError(id, "Debe aceptar los Términos y Condiciones.");
                    break;
            }
        });
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let isValid = true;

        form.querySelectorAll("input").forEach(input => {
            const event = new Event("input");
            input.dispatchEvent(event);
            if (document.getElementById(`error-${input.id}`)?.innerText !== "") {
                isValid = false;
            }
        });

        if (isValid) {
            try {
                const formData = new FormData(form);
                const response = await fetch('/registerUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(formData)
                });

                const data = await response.json();

                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Registro exitoso!',
                        text: 'Tu cuenta ha sido creada correctamente.',
                        confirmButtonColor: '#db4437',
                        background: '#fefefe'
                    }).then((result) => {
                        if (result.isConfirmed || result.isDismissed) {
                            window.location.href = '/auth/login';
                        }
                    });
                } else {
                    throw new Error(data.error || 'Error en el registro');
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el registro',
                    text: error.message || 'No se pudo completar el registro. Por favor, intenta nuevamente.',
                    confirmButtonColor: '#db4437',
                    background: '#fefefe'
                });
            }
        }
    });
});
