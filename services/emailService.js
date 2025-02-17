const nodemailer = require('nodemailer');

// Configuração do transporte (usando Gmail como exemplo)
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use 'Gmail' ou outro serviço, se necessário
    auth: {
        user: process.env.EMAIL_USER || 'airtrackinfos@gmail.com', // Email do remetente
        pass: process.env.EMAIL_PASS || 'rfycfqncqyouqdbd' // Senha do remetente (ou senha de app)
    }
});

// Função para enviar email para uma lista de destinatários
const sendBulkEmail = (emails, subject, text) => {
    emails.forEach(to => {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'airtrackinfos@gmail.com', // Remetente
            to, // Destinatário
            subject, // Assunto
            text // Corpo do email (texto simples)
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(`Erro ao enviar para ${to}:`, error);
            } else {
                console.log(`Email enviado para ${to}:`, info.response);
            }
        });
    });
};

module.exports = { sendBulkEmail };