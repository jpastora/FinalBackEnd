const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const mailerSend = new MailerSend({
    apiKey: 'mlsn.63a3c27299ea23c6376b823107554664a07911864ad75b64217aea286416da4c'
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
        const sentFrom = new Sender("MS_9LuM3X@trial-351ndgwe0kqgzqx8.mlsender.net", "VibeTickets");
        const recipients = [new Recipient(user.email)];

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject("Recuperación de Contraseña - VibeTickets")
            .setHtml(`
                <h1>Recuperación de Contraseña</h1>
                <p>Hola,</p>
                <p>Has solicitado recuperar tu contraseña.</p>
                <p>Tu nueva contraseña temporal es: <strong>${tempPassword}</strong></p>
                <p>Por favor, cambia tu contraseña inmediatamente después de iniciar sesión.</p>
                <p>Si no solicitaste este cambio, por favor ignora este mensaje.</p>
            `);

        const response = await mailerSend.email.send(emailParams);
        console.log('Email enviado:', response);
        return true;
    } catch (error) {
        console.error("Error detallado al enviar email:", error.response || error);
        return false;
    }
}

module.exports = {
    mailerSend,
    sendConfirmationEmail,
    sendPasswordResetEmail
};