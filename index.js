const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const emailRoutes = require('./routes/emailRoutes')

const app = express();
const PORT = 3000;

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do bodyparser (necessário para que o db funcione)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//importação das rotas de email:
app.use(emailRoutes)

// Rota principal que serve o arquivo HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
