function incrementarCantidad(event) {
    const input = event.target.previousElementSibling;
    let valor = parseInt(input.value);
    input.value = valor + 1;
    actualizarCantidad(input);
}

function decrementarCantidad(event) {
    const input = event.target.nextElementSibling;
    let valor = parseInt(input.value);
    if (valor > 1) {
        input.value = valor - 1;
        actualizarCantidad(input);
    }
}

async function actualizarCantidad(input) {
    const itemId = input.closest('.evento').dataset.itemId;
    const cantidad = parseInt(input.value);

    try {
        const response = await fetch(`/cart/update/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cantidad })
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();
        if (data.success) {
            location.reload();
        } else {
            throw new Error(data.message || 'Error al actualizar cantidad');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar la cantidad');
    }
}

async function eliminarDelCarrito(itemId) {
    try {
        const response = await fetch(`/cart/remove/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();
        if (data.success) {
            location.reload();
        } else {
            throw new Error(data.message || 'Error al eliminar item');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el item del carrito');
    }
}

// Agregar el event listener para los inputs de cantidad
document.querySelectorAll('.cantidadInput').forEach(input => {
    input.addEventListener('change', async function () {
        const itemId = this.closest('.evento').dataset.itemId;
        const cantidad = parseInt(this.value);

        if (cantidad < 1) {
            this.value = 1;
            return;
        }

        try {
            const response = await fetch(`/cart/update/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cantidad })
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const data = await response.json();
            if (data.success) {
                location.reload();
            } else {
                throw new Error(data.message || 'Error al actualizar cantidad');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar la cantidad');
        }
    });
});
