document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const eventosContainer = document.querySelector('.boxdeafuera');
    const resetButton = document.getElementById('resetButton');

    // Función para mostrar todos los eventos
    function mostrarTodosEventos() {
        const eventos = document.querySelectorAll('.evento1');
        eventos.forEach(evento => {
            evento.style.display = 'flex';
        });
        
        const noEventosMsg = document.querySelector('.no-eventos');
        if (noEventosMsg) {
            noEventosMsg.style.display = 'none';
        }
    }

    // Evento para el botón de reset
    resetButton.addEventListener('click', function() {
        // Limpiar los campos del formulario
        document.getElementById('busqueda').value = '';
        document.getElementById('lugar').value = '';
        document.getElementById('categoria').value = '';
        
        // Mostrar todos los eventos
        mostrarTodosEventos();
    });

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const busqueda = document.getElementById('busqueda').value.toLowerCase();
        const lugar = document.getElementById('lugar').value;
        const categoria = document.getElementById('categoria').value;
        
        const eventos = document.querySelectorAll('.evento1');
        
        eventos.forEach(evento => {
            const eventoData = JSON.parse(evento.querySelector('.debug-info').textContent);
            let mostrar = true;
            
            // Filtrar por búsqueda
            if (busqueda && !eventoData.nombre.toLowerCase().includes(busqueda)) {
                mostrar = false;
            }
            
            // Filtrar por lugar
            if (lugar && eventoData.lugar !== lugar) {
                mostrar = false;
            }
            
            // Filtrar por categoría
            if (categoria && eventoData.categoria !== categoria) {
                mostrar = false;
            }
            
            // Mostrar u ocultar el evento
            evento.style.display = mostrar ? 'flex' : 'none';
        });
        
        // Mostrar mensaje si no hay resultados
        const eventosVisibles = [...eventos].filter(evento => 
            evento.style.display !== 'none'
        ).length;
        
        const noEventosMsg = document.querySelector('.no-eventos');
        if (noEventosMsg) {
            noEventosMsg.style.display = eventosVisibles === 0 ? 'block' : 'none';
        }
    });
});