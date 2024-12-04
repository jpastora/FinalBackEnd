
document.getElementById('Formulario__Perfil').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        const response = await fetch('/perfil/actualizar-perfil', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Perfil actualizado correctamente');
            location.reload();
        } else {
            alert('Error al actualizar perfil: ' + data.message);
        }
    } catch (error) {
        alert('Error al actualizar perfil');
    }
});