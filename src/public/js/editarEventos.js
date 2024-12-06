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
            
            // Verificar que tenemos el ID del evento antes de redirigir
            if (data.evento && data.evento._id) {
                window.location.href = `/eventos/evento/${data.evento._id}`;
            } else {
                console.error('No se recibió el ID del evento');
                window.location.href = '/eventos'; // Redirección fallback a la lista de eventos
            }
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

// Función mejorada para cargar eventos
async function cargarEventos(busqueda = '') {
    try {
        console.log('Cargando eventos con búsqueda:', busqueda);
        const response = await fetch(`/admin/eventos/listar?busqueda=${encodeURIComponent(busqueda)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Datos recibidos:', data);
        
        const tbody = document.getElementById('listaEventosBody');
        tbody.innerHTML = '';
        
        if (data.success && data.eventos.length > 0) {
            data.eventos.forEach(evento => {
                tbody.innerHTML += `
                    <tr>
                        <td>
                            <img src="${evento.imagen}" alt="${evento.nombre}" class="evento-imagen">
                        </td>
                        <td>${evento.nombre}</td>
                        <td>${new Date(evento.fecha).toLocaleDateString()}</td>
                        <td>${evento.lugar}</td>
                        <td>${evento.categoria}</td>
                        <td>₡${evento.price?.toLocaleString() || 0}</td>
                        <td>${evento.numerotickets || 0}</td>
                        <td class="accionesBotones">
                            <button class="botonEditar" onclick="editarEvento('${evento._id}')">
                                <i class="fi fi-ss-pencil"></i>
                            </button>
                            <button class="botonEliminar" onclick="confirmarEliminar('${evento._id}')">
                                <i class="fi fi-ss-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center;">No hay eventos disponibles</td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error al cargar eventos:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los eventos'
        });
    }
}

// Función para confirmar eliminación
async function confirmarEliminar(id) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d94423',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        eliminarEvento(id);
    }
}

// Función de búsqueda con debounce
let timeoutId;
const searchInput = document.getElementById('searchInput');

if (searchInput) {
    searchInput.addEventListener('input', () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            buscarEventos();
        }, 300);
    });
}

function buscarEventos() {
    const busqueda = searchInput?.value.trim() || '';
    cargarEventos(busqueda);
}

// Asegurarse de cargar eventos cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página cargada, iniciando carga de eventos'); // Debug
    cargarEventos();
});

// Función mejorada para editar evento
async function editarEvento(id) {
    try {
        console.log('Editando evento con ID:', id); // Debug
        const response = await fetch(`/admin/eventos/${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Datos del evento:', data); // Debug
        
        if (data.success && data.evento) {
            const evento = data.evento;
            // Rellenar el formulario con los datos del evento
            document.getElementById('nombre').value = evento.nombre;
            document.getElementById('lugar').value = evento.lugar;
            document.getElementById('categoria').value = evento.categoria;
            document.getElementById('numerotickets').value = evento.numerotickets;
            document.getElementById('price').value = evento.price;
            document.getElementById('descripcion').value = evento.descripcion;
            document.getElementById('fecha').value = new Date(evento.fecha).toISOString().split('T')[0];
            document.getElementById('hora').value = evento.hora;
            document.getElementById('previewImagen').src = evento.imagen;
            
            // Cambiar el comportamiento del formulario para actualizar
            const form = document.getElementById('EditarEventoForm');
            form.dataset.eventoId = id;
            
            // Scroll al formulario
            form.scrollIntoView({ behavior: 'smooth' });
        } else {
            throw new Error('No se recibieron datos válidos del evento');
        }
    } catch (error) {
        console.error('Error al cargar evento:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar el evento para editar',
            confirmButtonColor: '#d94423'
        });
    }
}

// Función para eliminar evento
async function eliminarEvento(id) {
    try {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d94423',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            const response = await fetch(`/admin/eventos/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                Swal.fire('¡Eliminado!', 'El evento ha sido eliminado.', 'success');
                cargarEventos(); // Recargar la tabla
            } else {
                throw new Error('Error al eliminar');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el evento'
        });
    }
}

// Cargar eventos inicialmente
document.addEventListener('DOMContentLoaded', () => {
    cargarEventos();
});
