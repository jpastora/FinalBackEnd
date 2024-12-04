document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const resetButton = document.getElementById('resetButton');

    // Manejar envío del formulario
    searchForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener los valores actuales del formulario
        const formData = new FormData(searchForm);
        const params = new URLSearchParams();

        // Mantener búsqueda existente si hay una
        const currentParams = new URLSearchParams(window.location.search);
        const existingSearch = currentParams.get('busqueda');
        if (existingSearch) {
            params.set('busqueda', existingSearch);
        }

        // Añadir nuevos valores del formulario
        for (let [key, value] of formData.entries()) {
            if (value.trim()) {
                params.set(key, value.trim());
            }
        }

        // Redirigir con todos los parámetros
        window.location.href = `/eventos?${params.toString()}`;
    });

    // Reset limpia todo y vuelve a la página base
    resetButton?.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '/eventos';
    });

    // Establecer valores iniciales
    const urlParams = new URLSearchParams(window.location.search);
    for (let [key, value] of urlParams.entries()) {
        const element = document.querySelector(`[name="${key}"]`);
        if (element) {
            element.value = value;
        }
    }

    const cantidadInput = document.getElementById('cantidadTickets');
    if (cantidadInput) {
        cantidadInput.addEventListener('change', actualizarTotal);
        actualizarTotal(); // Calcular total inicial
    }
});

// Configuración global para SweetAlert2
const swalConfig = {
    confirmButtonColor: '#d94423',
    cancelButtonColor: '#d94423'
};

// Funciones para manejo de cantidad
function decrementarCantidad() {
    const input = document.getElementById('cantidadTickets');
    const currentValue = parseInt(input.value);
    if (currentValue > 1) {
        input.value = currentValue - 1;
        actualizarTotal();
    }
}

function incrementarCantidad() {
    const input = document.getElementById('cantidadTickets');
    const max = parseInt(input.max);
    const currentValue = parseInt(input.value);
    if (currentValue < max) {
        input.value = currentValue + 1;
        actualizarTotal();
    }
}

function actualizarTotal() {
    const cantidad = parseInt(document.getElementById('cantidadTickets').value);
    const precioUnitario = parseFloat(document.querySelector('.precio').textContent.replace('₡', '').replace(/,/g, ''));
    const total = cantidad * precioUnitario;
    document.querySelector('.precio-total').textContent = `₡${total.toLocaleString()}`;
}

async function guardarEvento(eventoId) {
    try {
        if (!eventoId) {
            throw new Error('ID de evento no válido');
        }

        const response = await fetch(`/eventos/guardar/${eventoId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' 
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al guardar el evento');
        }

        if (response.status === 401) {
            Swal.fire({
                ...swalConfig,
                title: '¡Debes iniciar sesión!',
                text: 'Para guardar eventos necesitas estar logueado',
                icon: 'warning',
                iconColor: '#d94423',
                showCancelButton: true,
                confirmButtonText: 'Ir a login',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/auth/login';
                }
            });
            return;
        }

        if (data.success) {
            Swal.fire({
                ...swalConfig,
                title: '¡Éxito!',
                text: data.message,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            Swal.fire({
                ...swalConfig,
                title: 'Error',
                text: data.message || 'Error al guardar el evento',
                icon: 'error'
            });
        }
    } catch (error) {
        console.error('Error detallado:', error);
        Swal.fire({
            ...swalConfig,
            title: 'Error',
            text: error.message || 'Ocurrió un error al procesar tu solicitud',
            icon: 'error'
        });
    }
}

// Función para mostrar alerta de login
function mostrarAlertaLogin() {
    Swal.fire({
        title: '¡Inicia Sesión!',
        text: 'Debes estar registrado para poder comprar tickets',
        icon: 'warning',
        iconColor: '#d94423',
        showCancelButton: true,
        confirmButtonText: 'Ir a Login',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d94423',
        cancelButtonColor: '#6c757d'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '/auth/login';
        }
    });
}

// Función para agregar al carrito
function agregarAlCarrito(eventoId, precio) {
    const cantidad = parseInt(document.getElementById('cantidadTickets').value);
    
    fetch('/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            eventoId: eventoId,
            cantidad: cantidad,
            precio: precio
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: '¡Éxito!',
                text: 'Evento agregado al carrito',
                icon: 'success',
                iconColor: '#d94423',
                showCancelButton: true,
                confirmButtonText: 'Ir al carrito',
                cancelButtonText: 'Seguir comprando',
                confirmButtonColor: '#d94423',
                cancelButtonColor: '#6c757d'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/cart';
                }
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: data.message || 'Error al agregar al carrito',
                icon: 'error',
                confirmButtonColor: '#d94423'
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al agregar al carrito',
            icon: 'error'
        });
    });
}

// Event listeners cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    const cantidadInput = document.getElementById('cantidadTickets');
    if (cantidadInput) {
        cantidadInput.addEventListener('change', actualizarTotal);
        actualizarTotal();
    }
});

// Asegurarnos de que las funciones estén disponibles globalmente
window.mostrarAlertaLogin = mostrarAlertaLogin;
window.agregarAlCarrito = agregarAlCarrito;
window.decrementarCantidad = decrementarCantidad;
window.incrementarCantidad = incrementarCantidad;