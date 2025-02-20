const express = require('express');
const router = express.Router();
const path = require('path'); // Para manipular caminhos de arquivos
const db = require('../database/db'); // Importar o banco de dados
const { sendBulkEmail } = require('../services/emailService'); // Importar o serviço de email
const isValidEmail = require('../services/validaremailService')

// Rota para salvar o e-mail (mantida)
router.post('/subscribe', (req, res) => {
  const email = req.body.email?.trim();
  const query = `INSERT INTO emails (email) VALUES (?)`;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: "E-mail inválido." });
  }
  db.run(query, [email], function (err) {
    if (err) {
      console.log(err);
      if (err.message.includes('UNIQUE')) {
        return res.status(409).json({ error: 'E-mail já cadastrado.' });
      }
      return res.status(500).json({ error: 'Erro ao salvar o e-mail.' });
    }

    res.status(201).json({ message: 'E-mail cadastrado com sucesso!' });
  });
});

// Rota GET para a página de envio de emails (nova)
router.get('/send-emails', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/send-email.html')); // Envia o arquivo HTML
});

// Rota POST para enviar emails (mantida)
router.post('/send-emails', async (req, res) => {
    try {
        const emails = await getEmailsFromDatabase(); // Busca emails do banco de dados
        const { subject, text } = req.body;

        if (!subject || !text) {
            return res.status(400).json({ message: 'Assunto e texto são obrigatórios.' });
        }

        // Envia o email para todos os destinatários
        sendBulkEmail(emails, subject, text);

        res.status(200).json({ message: 'Emails enviados com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar emails:', error);
        res.status(500).json({ message: 'Erro ao enviar emails.' });
    }
});

// Função para buscar todos os emails (mantida)
const getEmailsFromDatabase = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT email FROM emails', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const emails = rows.map(row => row.email); // Extrai apenas os emails
                resolve(emails);
            }
        });
    });
};

module.exports = router;