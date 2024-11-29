
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const mailerSend = new MailerSend({
    apiKey: process.env.API_KEY || 'mlsn.63a3c27299ea23c6376b823107554664a07911864ad75b64217aea286416da4c'
});

async function sendConfirmationEmail(user) {
    try {
        const sentFrom = new Sender("MS_9LuM3X@trial-351ndgwe0kqgzqx8.mlsender.net", "Vibe Tickets");
        const recipients = [new Recipient(user.email, user.name)];

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject("Bienvenido a Vibe Tickets - Confirmación de Registro")
            .setHtml(`
                <h1>¡Bienvenido a Vibe Tickets!</h1>
                <p>Hola ${user.name},</p>
                <p>Tu registro ha sido exitoso. Aquí están tus datos:</p>
                <ul>
                    <li>Nombre: ${user.name} ${user.secondName || ''}</li>
                    <li>ID: ${user.id}</li>
                    <li>Email: ${user.email}</li>
                    <li>Teléfono: ${user.phone || 'No proporcionado'}</li>
                </ul>
                <p>Ya puedes iniciar sesión en nuestra plataforma.</p>
                <p>¡Gracias por unirte a nosotros!</p>
            `);

        await mailerSend.email.send(emailParams);
        return true;
    } catch (error) {
        console.error("Error enviando email:", error);
        return false;
    }
}

async function sendPasswordResetEmail(user, tempPassword) {
    try {
        const sentFrom = new Sender("MS_9LuM3X@trial-351ndgwe0kqgzqx8.mlsender.net", "Vibe Tickets");
        const recipients = [new Recipient(user.email, user.name)];

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject("Vibe Tickets - Recuperación de Contraseña")
            .setHtml(`
                <h1>Recuperación de Contraseña</h1>
                <p>Hola ${user.name},</p>
                <p>Has solicitado recuperar tu contraseña. Tu nueva contraseña temporal es:</p>
                <h2>${tempPassword}</h2>
                <p>Por favor, inicia sesión con esta contraseña y cámbiala inmediatamente.</p>
                <p>Si no solicitaste este cambio, contacta con soporte inmediatamente.</p>
                <p>Saludos,<br>Equipo de Vibe Tickets</p>
            `);

        await mailerSend.email.send(emailParams);
        return true;
    } catch (error) {
        console.error("Error enviando email de recuperación:", error);
        return false;
    }
}

module.exports = {
    mailerSend,
    sendConfirmationEmail,
    sendPasswordResetEmail
};