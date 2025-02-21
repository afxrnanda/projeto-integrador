const express = require('express');
const router = express.Router();
const path = require('path'); // Para manipular caminhos de arquivos
const db = require('../database/db'); // Importar o banco de dados
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

module.exports = router;