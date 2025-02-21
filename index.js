const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const emailRoutes = require('./routes/emailRoutes');
const enviaremailRoutes = require('./routes/enviaremailRoutes'); // Importa as rotas de email

const app = express();
const PORT = 3000;

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));
// Middleware para permitir o uso de JSON no corpo das requisições
app.use(express.json());

// Configuração do body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Importação das rotas de email
app.use(emailRoutes);
// Configuração das rotas
app.use(enviaremailRoutes);

// Rota principal que serve o arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});