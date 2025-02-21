const nodemailer = require("nodemailer");
const db = require("../database/db");
require("dotenv").config();

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail", // Se usar outro provedor, ajuste aqui
    auth: {
        user: 'airtrackinfos@gmail.com', // substitua pelo seu email
        pass: 'rfycfqncqyouqdbd' // substitua pela sua senha
    },
});

/**
 * Envia e-mails para todos os endereços armazenados no banco de dados.
 */
async function sendEmails() {
    return new Promise((resolve, reject) => {
        db.all("SELECT email FROM emails", async (err, rows) => {
            if (err) {
                console.error("Erro ao buscar emails:", err);
                reject(err);
                return;
            }

            let resultados = [];

            for (const row of rows) {
                try {
                    await transporter.sendMail({
                        from: process.env.EMAIL_USER,
                        to: row.email,
                        subject: "Teste de E-mail",
                        text: "Este é um teste do Nodemailer com SQLite.",
                    });
                    console.log(`✅ E-mail enviado para: ${row.email}`);
                    resultados.push({ email: row.email, status: "Enviado" });
                } catch (error) {
                    console.error(`❌ Erro ao enviar para ${row.email}:`, error.message);
                    resultados.push({ email: row.email, status: "Erro", motivo: error.message });
                }
            }
            resolve(resultados);
        });
    });
}

module.exports.sendEmails = sendEmails;

