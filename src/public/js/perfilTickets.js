document.addEventListener('DOMContentLoaded', function() {
    // Función para manejar la paginación mediante AJAX
    function handlePagination(e) {
        if (e.target.classList.contains('pagina')) {
            e.preventDefault();
            const url = new URL(e.target.href);
            const ordenesPage = url.searchParams.get('ordenesPage');
            const ticketsPage = url.searchParams.get('ticketsPage');

            // Actualizar URL sin recargar la página
            window.history.pushState({}, '', url);

            // Realizar petición AJAX para actualizar el contenido
            fetch(url)
                .then(response => response.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    
                    // Actualizar sección de órdenes
                    const ordenesSection = doc.querySelector('.seccionTickets');
                    if (ordenesSection) {
                        document.querySelector('.seccionTickets').innerHTML = ordenesSection.innerHTML;
                    }

                    // Recargar los event listeners
                    addPaginationListeners();
                })
                .catch(error => console.error('Error:', error));
        }
    }

    // Función para agregar event listeners a los controles de paginación
    function addPaginationListeners() {
        document.querySelectorAll('.paginacion').forEach(paginacion => {
            paginacion.addEventListener('click', handlePagination);
        });
    }

    // Inicializar los event listeners
    addPaginationListeners();
});

// Estilos CSS como una hoja de estilo separada
const styles = `
.paginacion {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 20px 0;
}

.pagina {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    text-decoration: none;
    color: #333;
}

.pagina.active {
    background-color: #d94423;
    color: white;
    border-color: #d94423;
}

.pagina:hover:not(.active) {
    background-color: #f0f0f0;
}
`;

// Crear y agregar la hoja de estilos
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
