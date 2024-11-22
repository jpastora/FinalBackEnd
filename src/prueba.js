const transporter = require("./transporter"); // Asegúrate de importar correctamente tu transportador

const mailOptions = {
    from: "joe.red.pruebas@gmail.com",      // Tu correo de Gmail
    to: "joseph.pastora@gmail.com",    // Correo del destinatario
    subject: "Correo de Prueba",
    text: "Este es un correo de prueba enviado desde Nodemailer usando SMTP de Gmail.",
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error("Error al enviar el correo:", error);
    } else {
        console.log("Correo enviado con éxito:", info.response);
    }
});
