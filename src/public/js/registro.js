document.addEventListener('DOMContentLoaded', () => {
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
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        return /^\d{8}$/.test(phone);
    }

    function validateText(text) {
        return /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]{3,}$/.test(text);
    }

    // Validaciones en tiempo real
    const form = document.getElementById('registrationForm');
    if (form) {
        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', (e) => {
                const { id, value } = e.target;
                switch (id) {
                    case 'name':
                    case 'secondName':
                        if (!validateText(value)) {
                            showError(id, `El ${id === 'name' ? 'nombre' : 'apellido'} debe tener al menos 3 caracteres y solo letras`);
                        } else {
                            clearError(id);
                        }
                        break;
                    case 'id':
                        if (!/^\d{1,9}$/.test(value)) {
                            showError(id, 'La identificación debe contener solo números (máximo 9 dígitos)');
                        } else {
                            clearError(id);
                        }
                        break;
                    case 'email':
                    case 'confirm_email':
                        if (!validateEmail(value)) {
                            showError(id, 'Correo electrónico no válido');
                        } else if (id === 'confirm_email' && value !== document.getElementById('email').value) {
                            showError(id, 'Los correos no coinciden');
                        } else {
                            clearError(id);
                        }
                        break;
                    case 'password':
                    case 'confirm_password':
                        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)) {
                            showError(id, 'La contraseña debe tener al menos 8 caracteres, una letra y un número');
                        } else if (id === 'confirm_password' && value !== document.getElementById('password').value) {
                            showError(id, 'Las contraseñas no coinciden');
                        } else {
                            clearError(id);
                        }
                        break;
                    case 'phone':
                        if (!validatePhone(value)) {
                            showError(id, 'El teléfono debe tener 8 dígitos');
                        } else {
                            clearError(id);
                        }
                        break;
                }
            });
        });

        // Manejo del envío del formulario
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Verificar todas las validaciones
            let isValid = true;
            form.querySelectorAll('input').forEach(input => {
                const errorSpan = document.getElementById(`error-${input.id}`);
                if (errorSpan && errorSpan.innerText !== '') {
                    isValid = false;
                }
            });

            if (!isValid) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error de validación',
                    text: 'Por favor, corrige los errores en el formulario',
                    confirmButtonColor: '#db4437'
                });
                return;
            }

            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;

            try {
                const formData = {
                    name: document.getElementById('name').value,
                    secondName: document.getElementById('secondName').value,
                    id: document.getElementById('id').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value,
                    phone: document.getElementById('phone').value
                };

                const response = await fetch('/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (data.success) {
                    await Swal.fire({
                        icon: 'success',
                        title: '¡Registro exitoso!',
                        text: 'Tu cuenta ha sido creada correctamente. Por favor, revisa tu correo electrónico.',
                        confirmButtonColor: '#db4437'
                    });
                    window.location.href = '/auth/login';
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error en el registro',
                    text: error.message || 'Error al procesar el registro',
                    confirmButtonColor: '#db4437'
                });
            } finally {
                submitButton.disabled = false;
            }
        });
    }
});
