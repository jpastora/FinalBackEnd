// Función para previsualizar la imagen
document.getElementById('imagen').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewImagen').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

document.getElementById('EditarEventoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', document.getElementById('nombre').value); 
    formData.append('lugar', document.getElementById('lugar').value);
    formData.append('categoria', document.getElementById('categoria').value);
    formData.append('numerotickets', document.getElementById('numerotickets').value);
    formData.append('precio', document.getElementById('price').value);
    formData.append('fecha', document.getElementById('fecha').value);
    formData.append('hora', document.getElementById('hora').value);
    formData.append('descripcion', document.getElementById('descripcion').value);
    formData.append('imagen', document.getElementById('imagen').files[0]);

    // Validación más completa
    if (!formData.get('nombre') || !formData.get('lugar') || !formData.get('categoria') || 
        !formData.get('numerotickets') || !formData.get('precio') || !formData.get('fecha') || 
        !formData.get('hora') || !formData.get('descripcion')) {
        Swal.fire({
            icon: 'error',
            title: '¡Campos incompletos!',
            text: 'Por favor complete todos los campos requeridos',
            confirmButtonColor: '#3085d6'
        });
        return;
    }

    try {
        const response = await fetch('/eventos/crear', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        console.log('Respuesta del servidor:', data); // Para debugging

        if (response.ok && data.success) {
            await Swal.fire({
                title: '¡Éxito!',
                text: 'El evento ha sido creado correctamente',
                icon: 'success',
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#d94423',
                timer: 3000,
                timerProgressBar: true
            });
            
            document.getElementById('EditarEventoForm').reset();
            document.getElementById('previewImagen').src = '/img/eventoCategoria6.png';
            window.location.href = '/eventos';
        } else {
            await Swal.fire({
                title: 'Error',
                text: data.mensaje || 'Hubo un error al crear el evento',
                icon: 'error',
                confirmButtonColor: '#d94423',
                confirmButtonText: 'Intentar nuevamente'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        await Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al procesar tu solicitud',
            icon: 'error',
            confirmButtonColor: '#d94423',
            confirmButtonText: 'Cerrar'
        });
    }
});
