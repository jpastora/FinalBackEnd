document.addEventListener('DOMContentLoaded', async () => {
    await cargarResumenCompra();
});

async function cargarResumenCompra() {
    try {
        const response = await fetch('/pago/api/resumen-compra');
        const data = await response.json();
        
        const datosPago = JSON.parse(sessionStorage.getItem('datosPago'));
        
        mostrarResumen(data, datosPago);
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar el resumen');
    }
}

function mostrarResumen(data, datosPago) {
    // Mostrar eventos
    const eventosHTML = data.cart.items.map(item => `
        <div class="evento-item">
            <h3>${item.evento.nombre}</h3>
            <p>Cantidad: ${item.cantidad}</p>
            <p>Precio unitario: ₡${item.precioUnitario.toLocaleString()}</p>
            <p>Subtotal: ₡${(item.cantidad * item.precioUnitario).toLocaleString()}</p>
        </div>
    `).join('');
    document.getElementById('detalles-eventos').innerHTML += eventosHTML;

    // Mostrar método de pago
    const metodoPagoHTML = datosPago.usarTarjetaGuardada ? 
        `<p>Tarjeta guardada seleccionada</p>` :
        `<p>Nueva tarjeta terminada en ${datosPago.datosTarjeta.cardNumber.slice(-4)}</p>`;
    document.getElementById('metodo-pago').innerHTML = `
        <h2>Método de Pago</h2>
        ${metodoPagoHTML}
    `;

    // Mostrar totales
    document.getElementById('resumen-total').innerHTML = `
        <div class="totales">
            <p>Subtotal: ₡${data.subtotal.toLocaleString()}</p>
            <p>IVA (13%): ₡${data.iva.toLocaleString()}</p>
            <p class="total">Total: ₡${data.total.toLocaleString()}</p>
        </div>
    `;
}

async function confirmarCompra() {
    try {
        const datosPago = JSON.parse(sessionStorage.getItem('datosPago'));
        
        const response = await fetch('/pago/api/process-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosPago)
        });

        const data = await response.json();
        
        if (data.success) {
            sessionStorage.removeItem('datosPago');
            window.location.href = `/pago/completado/${data.ordenId}`;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Error al procesar el pago'
        });
    }
}