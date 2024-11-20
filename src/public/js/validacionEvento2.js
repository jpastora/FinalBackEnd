
document.addEventListener('DOMContentLoaded', function() {
    // Obtener botones
    const btnGuardar = document.querySelector('input[value="Guardar"]');
    const btnReservar = document.querySelector('input[value="Reservar"]');
    
    // Obtener campos de cantidad de asientos
    const inputsAsientos = document.querySelectorAll('.cantidadAsientos');
    
    // Función para guardar evento
    btnGuardar.addEventListener('click', function() {
        alert('Evento guardado con éxito.');
    });
    
    // Función para reservar evento
    btnReservar.addEventListener('click', function() {
        // Verificar si hay al menos un asiento seleccionado
        let totalAsientos = 0;
        inputsAsientos.forEach(input => {
            totalAsientos += parseInt(input.value || 0);
        });
        
        if (totalAsientos > 0) {
            // Crear mensaje con enlace
            const mensaje = document.createElement('div');
            mensaje.innerHTML = 'Evento reservado en tu <a href="pagos.html">Carrito de Compras</a>';
            
            // Mostrar mensaje como alerta
            alert('Evento reservado en tu Carrito de Compras');
            window.location.href = 'pagos.html';
        } else {
            alert('Debes seleccionar al menos un asiento para reservar.');
        }
    });
});