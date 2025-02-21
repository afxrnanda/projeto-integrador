const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('./database/dadosDB/emails.db');

// Cria a tabela se ela não existir
db.run(`
  CREATE TABLE IF NOT EXISTS emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`, (err) => {
  if (err) {
    console.error('Erro ao criar a tabela:', err.message);
  } else {
    console.log('Tabela de e-mails configurada com sucesso.');
  }
});

module.exports = db;
