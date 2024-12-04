document.addEventListener('DOMContentLoaded', function() {
    const inputBusqueda = document.getElementById('inputBusqueda');
    const botonBusqueda = document.getElementById('Boton__Busqueda');

    function realizarBusqueda() {
        const termino = inputBusqueda?.value?.trim();
        if (termino) {
            const params = new URLSearchParams();
            params.set('busqueda', termino);
            
            // Preservar otros parámetros si existen
            const urlParams = new URLSearchParams(window.location.search);
            for (let [key, value] of urlParams) {
                if (key !== 'busqueda') {
                    params.set(key, value);
                }
            }

            window.location.href = `/eventos?${params.toString()}`;
        }
    }

    if (botonBusqueda) {
        botonBusqueda.addEventListener('click', realizarBusqueda);
    }
    
    if (inputBusqueda) {
        inputBusqueda.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                realizarBusqueda();
            }
        });
    }
});