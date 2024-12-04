document.addEventListener('DOMContentLoaded', async () => {
    cargarTarjetasGuardadas();
    inicializarFormulario();

    // Agregar evento para habilitar el formulario al hacer clic en cualquier input
    const formInputs = document.querySelectorAll('#formPago input');
    formInputs.forEach(input => {
        input.addEventListener('click', () => {
            // Desseleccionar tarjeta guardada si existe
            document.querySelectorAll('.tarjeta-guardada').forEach(card => {
                card.classList.remove('seleccionada');
            });
            tarjetaSeleccionada = null;
            
            // Habilitar todos los inputs
            formInputs.forEach(inp => inp.disabled = false);
        });
    });
});

let tarjetaSeleccionada = null;

async function cargarTarjetasGuardadas() {
    try {
        const response = await fetch('/pago/api/payment-cards'); // Actualizar la ruta
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        
        const tarjetas = await response.json();
        const contenedor = document.getElementById('lista-tarjetas');
        
        if (!Array.isArray(tarjetas) || tarjetas.length === 0) {
            contenedor.innerHTML = '<p class="no-cards">No hay tarjetas guardadas</p>';
            return;
        }

        contenedor.innerHTML = tarjetas.map(tarjeta => `
            <div class="tarjeta-guardada" data-id="${tarjeta._id}" onclick="seleccionarTarjeta('${tarjeta._id}')">
                <div class="card-info">
                    <span class="card-number">**** **** **** ${tarjeta.lastFourDigits}</span>
                    <span class="card-expiry">Vence: ${tarjeta.expirationDate}</span>
                    <span class="card-holder">${tarjeta.cardholderName}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error al cargar tarjetas:', error);
        mostrarError('Error al cargar las tarjetas guardadas');
    }
}

function inicializarFormulario() {
    const numeroTarjeta = document.getElementById('numero-tarjeta');
    numeroTarjeta.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        valor = valor.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = valor;
    });

    const fechaExpiracion = document.getElementById('fecha-expiracion');
    fechaExpiracion.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length >= 2) {
            valor = valor.slice(0,2) + '/' + valor.slice(2,4);
        }
        e.target.value = valor;
    });
}

function obtenerDatosFormulario() {
    return {
        cardNumber: document.getElementById('numero-tarjeta').value.replace(/\s/g, ''),
        cardholderName: document.getElementById('titular-tarjeta').value.trim(),
        expirationDate: document.getElementById('fecha-expiracion').value,
        cvv: document.getElementById('codigo-seguridad').value,
        saveCard: true // Opción para guardar la tarjeta
    };
}

function validarDatosPago(datos) {
    if (datos.cardNumber.length !== 16) {
        mostrarError('El número de tarjeta debe tener 16 dígitos');
        return false;
    }

    if (!/^[A-Za-z\s]+$/.test(datos.cardholderName)) {
        mostrarError('El nombre del titular solo debe contener letras');
        return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(datos.expirationDate)) {
        mostrarError('Fecha de expiración inválida (MM/YY)');
        return false;
    }

    if (!/^\d{3}$/.test(datos.cvv)) {
        mostrarError('CVV inválido');
        return false;
    }

    return true;
}

async function procesarPago() {
    try {
        let datosPago;

        if (tarjetaSeleccionada) {
            // Si hay una tarjeta guardada seleccionada
            datosPago = {
                tarjetaId: tarjetaSeleccionada,
                usarTarjetaGuardada: true
            };
        } else {
            // Si es una tarjeta nueva
            const datosTarjeta = obtenerDatosFormulario();
            if (!validarDatosPago(datosTarjeta)) {
                return;
            }
            datosPago = {
                datosTarjeta,
                usarTarjetaGuardada: false
            };
        }

        // Guardar en sessionStorage y redirigir
        sessionStorage.setItem('datosPago', JSON.stringify(datosPago));
        window.location.href = '/pago/resumen';
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al procesar los datos de pago');
    }
}

function seleccionarTarjeta(tarjetaId) {
    // Desseleccionar todas las tarjetas
    document.querySelectorAll('.tarjeta-guardada').forEach(card => {
        card.classList.remove('seleccionada');
    });
    
    // Seleccionar la tarjeta clickeada
    const tarjeta = document.querySelector(`.tarjeta-guardada[data-id="${tarjetaId}"]`);
    if (tarjeta) {
        tarjeta.classList.add('seleccionada');
        tarjetaSeleccionada = tarjetaId;
        
        // Deshabilitar el formulario de nueva tarjeta
        const formInputs = document.querySelectorAll('#formPago input');
        formInputs.forEach(input => input.disabled = true);
    }
}

function mostrarError(mensaje) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensaje
    });
}