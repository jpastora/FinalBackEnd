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
});