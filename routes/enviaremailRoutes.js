const express = require("express");
const router = express.Router();
const emailService = require("../services/emailService.js");
const db = require("../database/db");

// Rota para enviar e-mails
router.get("/send-emails", async (req, res) => {
    try {
        const resultado = await emailService.sendEmails();
        res.status(200).json({
            message: "Processo de envio de e-mails concluído!",
            detalhes: resultado
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao enviar e-mails.", error: error.message });
    }
});

// Rota para listar os e-mails cadastrados
router.get("/list-emails", (req, res) => {
    db.all("SELECT * FROM emails", (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

module.exports = router;
