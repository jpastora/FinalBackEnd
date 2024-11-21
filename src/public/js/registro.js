document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");

  // Función para mostrar mensaje de error en un campo específico
  function showError(inputId, message) {
      const errorElement = document.getElementById(`error-${inputId}`);
      errorElement.innerText = message;
      errorElement.style.display = "block";
  }

  // Función para limpiar el mensaje de error de un campo
  function clearError(inputId) {
      const errorElement = document.getElementById(`error-${inputId}`);
      errorElement.innerText = "";
      errorElement.style.display = "none";
  }

  // Validaciones individuales para cada campo
  document.getElementById("fullname").addEventListener("blur", () => {
      const fullname = document.getElementById("fullname").value.trim();
      if (fullname.length < 3) {
          showError("fullname", "El nombre completo debe tener al menos 3 caracteres.");
      } else {
          clearError("fullname");
      }
  });

  document.getElementById("id").addEventListener("blur", () => {
      const id = document.getElementById("id").value.trim();
      if (!/^\d+$/.test(id)) {
          showError("id", "La identificación debe contener solo números.");
      } else {
          clearError("id");
      }
  });

  document.getElementById("email").addEventListener("blur", () => {
      const email = document.getElementById("email").value.trim();
      if (!validateEmail(email)) {
          showError("email", "El correo electrónico no es válido.");
      } else {
          clearError("email");
      }
  });

  document.getElementById("confirm_email").addEventListener("blur", () => {
      const email = document.getElementById("email").value.trim();
      const confirmEmail = document.getElementById("confirm_email").value.trim();
      if (email !== confirmEmail) {
          showError("confirm-email", "Los correos electrónicos no coinciden.");
      } else {
          clearError("confirm-email");
      }
  });

  document.getElementById("password").addEventListener("blur", () => {
      const password = document.getElementById("password").value;
      if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
          showError("password", "La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número.");
      } else {
          clearError("password");
      }
  });

  document.getElementById("confirm_password").addEventListener("blur", () => {
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm_password").value;
      if (password !== confirmPassword) {
          showError("confirm-password", "Las contraseñas no coinciden.");
      } else {
          clearError("confirm-password");
      }
  });

  document.getElementById("phone").addEventListener("blur", () => {
      const phone = document.getElementById("phone").value.trim();
      if (!/^\+\d{1,3}\s\d{8,15}$/.test(phone)) {
          showError("phone", "El teléfono debe tener el formato correcto, por ejemplo: +506 88888888.");
      } else {
          clearError("phone");
      }
  });

  document.getElementById("terms").addEventListener("change", () => {
      const terms = document.getElementById("terms").checked;
      if (!terms) {
          showError("terms", "Debe aceptar los Términos y Condiciones.");
      } else {
          clearError("terms");
      }
  });

  /**  Validación final al enviar el formulario
  form.addEventListener("submit", (event) => {
      event.preventDefault();
      let valid = true;

      // Forzamos todas las validaciones para mostrar errores si hay campos inválidos
      ["fullname", "id", "email", "confirm_email", "password", "confirm_password", "phone", "terms"].forEach((id) => {
          const element = document.getElementById(id);
          element.dispatchEvent(new Event("blur"));
          if (document.getElementById(`error-${id}`).innerText !== "") {
              valid = false;
          }
      });

      if (valid) {
          form.submit();
      }
  });*/

  // Función para validar formato de correo
  function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
  }
});
