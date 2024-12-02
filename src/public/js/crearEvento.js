document.addEventListener('DOMContentLoaded', function() {
    // Función para previsualizar la imagen
    document.getElementById('imagenEvento').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('previewImagen').src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });
});    
