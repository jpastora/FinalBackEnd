
document.getElementById('recuperarForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Mostrar loading
    Swal.fire({
        title: 'Procesando...',
        text: 'Enviando instrucciones de recuperación',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const response = await fetch('/auth/recuperar-contrasena', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: document.getElementById('email').value
            })
        });
        const data = await response.json();
        
        if (data.success) {
            await Swal.fire({
                icon: 'success',
                title: '¡Enviado!',
                text: 'Se ha enviado una nueva contraseña a tu correo electrónico',
                showConfirmButton: true,
                confirmButtonText: 'Ir a inicio de sesión',
                allowOutsideClick: false
            });
            window.location.href = '/auth/login';
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message || 'Error al procesar la solicitud'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al procesar la solicitud'
        });
    }
});