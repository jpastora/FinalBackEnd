const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const mailerSend = new MailerSend({
    apiKey: process.env.API_KEY || 'mlsn.63a3c27299ea23c6376b823107554664a07911864ad75b64217aea286416da4c'
});

async function sendConfirmationEmail(user) {
    try {
        const sentFrom = new Sender("MS_9LuM3X@trial-351ndgwe0kqgzqx8.mlsender.net", "Vibe Tickets");
        const recipients = [new Recipient(user.email, user.name)];

        const htmlContent = `
            <h1>¡Bienvenido a Vibe Tickets!</h1>
            <p>Hola ${user.name},</p>
            // ...existing code...
        `;

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject("Bienvenido a Vibe Tickets - Confirmación de Registro")
            .setHtml(htmlContent);

        await mailerSend.email.send(emailParams);
        return true;
    } catch (error) {
        console.error("Error enviando email:", error);
        return false;
    }
}

module.exports = { mailerSend, sendConfirmationEmail };