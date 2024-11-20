function toggleRespuesta(id) {
    const respuesta = document.getElementById(`Respuesta__${id}`);
    const preguntaTitulo = respuesta.previousElementSibling;

    // Alternar el estado de "mostrar" en la respuesta
    respuesta.style.display = respuesta.style.display === "block" ? "none" : "block";

    // Cambiar la clase "active" en el título para el icono
    preguntaTitulo.classList.toggle("active");
}
