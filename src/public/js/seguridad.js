
document.getElementById('Formulario__Contrasena').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nuevaContrasena = document.getElementById('nuevaContrasena').value;
    const repetirContrasena = document.getElementById('repetirContrasena').value;
    
    if (nuevaContrasena !== repetirContrasena) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    const formData = new FormData(e.target);
    const datos = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch('/perfil/actualizar-contrasena', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos)
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Contraseña actualizada correctamente');
            document.getElementById('Formulario__Contrasena').reset();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        alert('Error al actualizar la contraseña');
    }
});