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

// Modificar el event listener del formulario para manejar tanto creación como edición
document.getElementById('EditarEventoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const eventoId = e.target.dataset.eventoId; // Obtener ID si es edición
    
    formData.append('nombre', document.getElementById('nombre').value); 
    formData.append('lugar', document.getElementById('lugar').value);
    formData.append('categoria', document.getElementById('categoria').value);
    formData.append('numerotickets', document.getElementById('numerotickets').value);
    formData.append('precio', document.getElementById('price').value);
    formData.append('fecha', document.getElementById('fecha').value);
    formData.append('hora', document.getElementById('hora').value);
    formData.append('descripcion', document.getElementById('descripcion').value);

    // Si es edición, agregar el ID
    if (eventoId) {
        formData.append('eventoId', eventoId);
    }

    // Solo agregar imagen si se seleccionó una nueva
    const imagenFile = document.getElementById('imagen').files[0];
    if (imagenFile) {
        formData.append('imagen', imagenFile);
    }

    // Validación de campos requeridos (excepto imagen para edición)
    if (!formData.get('nombre') || !formData.get('lugar') || !formData.get('categoria') || 
        !formData.get('numerotickets') || !formData.get('precio') || !formData.get('fecha') || 
        !formData.get('hora') || !formData.get('descripcion')) {
        Swal.fire({
            icon: 'error',
            title: '¡Campos incompletos!',
            text: 'Por favor complete todos los campos requeridos',
            confirmButtonColor: '#d94423'
        });
        return;
    }

    // Si es creación nueva, validar que haya imagen
    if (!eventoId && !imagenFile) {
        Swal.fire({
            icon: 'error',
            title: '¡Imagen requerida!',
            text: 'Se requiere una imagen para crear un nuevo evento',
            confirmButtonColor: '#d94423'
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
                text: eventoId ? 'El evento ha sido actualizado correctamente' : 'El evento ha sido creado correctamente',
                icon: 'success',
                confirmButtonColor: '#d94423'
            });
            
            document.getElementById('EditarEventoForm').reset();
            document.getElementById('previewImagen').src = '/uploads/eventos/1733172139529-10.jpg';
            delete e.target.dataset.eventoId;
            cargarEventos();
            
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

let paginaActual = 1;

// Función mejorada para cargar eventos
async function cargarEventos(busqueda = '', pagina = 1) {
    try {
        console.log('Cargando eventos...', { busqueda, pagina });
        const response = await fetch(`/admin/eventos/listar?busqueda=${encodeURIComponent(busqueda)}&page=${pagina}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Datos recibidos:', data);
        
        const tbody = document.getElementById('listaEventosBody');
        const contenedorLista = document.querySelector('.listaEventos');
        
        if (!tbody || !contenedorLista) {
            console.error('No se encontraron elementos necesarios');
            return;
        }

        tbody.innerHTML = '';
        
        // Eliminar paginador existente si hay uno
        const paginadorExistente = document.querySelector('.paginacion');
        if (paginadorExistente) {
            paginadorExistente.remove();
        }
        
        if (data.success && data.eventos && data.eventos.length > 0) {
            data.eventos.forEach(evento => {
                tbody.innerHTML += `
                    <tr>
                        <td>
                            <img src="${evento.imagen || '/img/default-event.jpg'}" 
                                 alt="${evento.nombre}" 
                                 class="evento-imagen"
                                 onerror="this.src='/img/default-event.jpg'">
                        </td>
                        <td>
                            <a href="/eventos/evento/${evento._id}" class="evento-link">
                                ${evento.nombre || ''}
                            </a>
                        </td>
                        <td>${evento.fecha ? new Date(evento.fecha).toLocaleDateString() : ''}</td>
                        <td>${evento.lugar || ''}</td>
                        <td>${evento.categoria || ''}</td>
                        <td>₡${evento.price ? evento.price.toLocaleString() : '0'}</td>
                        <td>${evento.numerotickets || '0'}</td>
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

            // Agregar paginación después de la tabla
            const paginacionHTML = `
                <div class="paginacion">
                    ${data.paginacion.hasPrev ? 
                        `<button onclick="cambiarPagina(${data.paginacion.actual - 1})">Anterior</button>` : 
                        '<button disabled>Anterior</button>'}
                    <span>Página ${data.paginacion.actual} de ${data.paginacion.total}</span>
                    ${data.paginacion.hasNext ? 
                        `<button onclick="cambiarPagina(${data.paginacion.actual + 1})">Siguiente</button>` : 
                        '<button disabled>Siguiente</button>'}
                </div>
            `;
            contenedorLista.insertAdjacentHTML('beforeend', paginacionHTML);
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 20px;">
                        No hay eventos disponibles
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error al cargar eventos:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los eventos',
            confirmButtonColor: '#d94423'
        });
    }
}

function cambiarPagina(nuevaPagina) {
    paginaActual = nuevaPagina;
    const busqueda = document.getElementById('searchInput')?.value.trim() || '';
    cargarEventos(busqueda, paginaActual);
}

function buscarEventos() {
    paginaActual = 1; // Resetear a la primera página al buscar
    const busqueda = document.getElementById('searchInput')?.value.trim() || '';
    cargarEventos(busqueda, paginaActual);
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
            
            // Quitar el required del input de imagen
            const imagenInput = document.getElementById('imagen');
            imagenInput.removeAttribute('required');
            
            // Rellenar el formulario con los datos del evento
            document.getElementById('nombre').value = evento.nombre || '';
            document.getElementById('lugar').value = evento.lugar || '';
            document.getElementById('categoria').value = evento.categoria || '';
            document.getElementById('numerotickets').value = evento.numerotickets || '';
            document.getElementById('price').value = evento.precio || evento.price || '';
            document.getElementById('descripcion').value = evento.descripcion || '';
            
            // Formatear fecha correctamente
            if (evento.fecha) {
                const fecha = new Date(evento.fecha);
                fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
                document.getElementById('fecha').value = fecha.toISOString().split('T')[0];
            }
            
            document.getElementById('hora').value = evento.hora || '';
            
            // Actualizar imagen preview
            if (evento.imagen) {
                document.getElementById('previewImagen').src = evento.imagen;
            }
            
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
                await Swal.fire({
                    title: '¡Eliminado!',
                    text: 'El evento ha sido eliminado.',
                    icon: 'success',
                    confirmButtonColor: '#d94423'
                });
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
            text: 'No se pudo eliminar el evento',
            confirmButtonColor: '#d94423'
        });
    }
}

// Cargar eventos inicialmente
document.addEventListener('DOMContentLoaded', () => {
    cargarEventos();
});
