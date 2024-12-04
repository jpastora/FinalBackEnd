document.addEventListener('DOMContentLoaded', async () => {
    await cargarResumenCompra();
});

async function cargarResumenCompra() {
    try {
        const response = await fetch('/pago/api/resumen-compra');
        const data = await response.json();
        
        mostrarDetallesEventos(data.cart.items);
        mostrarMetodoPago();
        mostrarResumenTotal(data.subtotal, data.iva, data.total);
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar el resumen');
    }
}

function mostrarDetallesEventos(items) {
    const contenedor = document.getElementById('detalles-eventos');
    const html = items.map(item => `
        <div class="evento-item">
            <div class="evento-info">
                <h3>${item.evento.nombre}</h3>
                <p>Fecha: ${new Date(item.evento.fecha).toLocaleDateString('es-ES')}</p>
                <p>Cantidad: ${item.cantidad} tickets</p>
                <p>Precio unitario: ₡${item.precioUnitario.toLocaleString()}</p>
            </div>
            <div class="evento-total">
                ₡${(item.cantidad * item.precioUnitario).toLocaleString()}
            </div>
        </div>
    `).join('');
    contenedor.innerHTML += html;
}

function mostrarMetodoPago() {
    const datosPago = JSON.parse(sessionStorage.getItem('datosPago'));
    const contenedor = document.getElementById('metodo-pago');
    
    if (datosPago.usarTarjetaGuardada) {
        contenedor.innerHTML += `
            <div class="metodo-pago-info">
                <p>Tarjeta guardada seleccionada</p>
            </div>`;
    } else {
        contenedor.innerHTML += `
            <div class="metodo-pago-info">
                <p>Tarjeta terminada en ${datosPago.cardNumber.slice(-4)}</p>
            </div>`;
    }
}

function mostrarResumenTotal(subtotal, iva, total) {
    document.getElementById('resumen-total').innerHTML = `
        <div class="total-section">
            <div class="linea-total">
                <span>Subtotal</span>
                <span>₡${subtotal.toLocaleString()}</span>
            </div>
            <div class="linea-total">
                <span>IVA (13%)</span>
                <span>₡${iva.toLocaleString()}</span>
            </div>
            <div class="linea-total total-final">
                <span>Total a Pagar</span>
                <span>₡${total.toLocaleString()}</span>
            </div>
        </div>
    `;
}

async function confirmarCompra() {
    try {
        const datosPago = JSON.parse(sessionStorage.getItem('datosPago'));
        const response = await fetch('/pago/api/process-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosPago)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error en el proceso de pago');
        }

        if (result.success) {
            sessionStorage.removeItem('datosPago');
            await Swal.fire({
                icon: 'success',
                title: '¡Pago exitoso!',
                text: 'Tu compra ha sido procesada correctamente',
                showConfirmButton: true,
                confirmButtonText: 'Continuar'
            });
            window.location.href = `/pago/confirmacion?orden=${result.ordenId}`;
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Error al procesar el pago'
        });
    }
}