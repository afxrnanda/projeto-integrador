const express = require('express');
const router = express.Router();
const db = require('../database/db')

// Rota para salvar o e-mail
router.post('/subscribe', (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ error: 'E-mail é obrigatório.' });
    }
  
    const query = `INSERT INTO emails (email) VALUES (?)`;
    db.run(query, [email], function (err) {
      if (err) {
        console.log(err)
        if (err.message.includes('UNIQUE')) {
          return res.status(409).json({ error: 'E-mail já cadastrado.' });
        }
        return res.status(500).json({ error: 'Erro ao salvar o e-mail.' });
      }
  
      res.status(201).json({ message: 'E-mail cadastrado com sucesso!' });
    });
  });
  
  // Rota para listar e-mails (opcional)
  router.get('/emails', (req, res) => {
    const query = `SELECT * FROM emails`;
  
    db.all(query, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar e-mails.' });
      }
  
      res.json(rows);
    });
  });
  
  module.exports = router;