const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.NODE_ENV === 'test' 
  ? path.resolve(__dirname, 'database_test.sqlite')
  : path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Tabela de Usuários
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      cargo TEXT CHECK(cargo IN ('admin', 'cliente')) DEFAULT 'cliente'
    )
  `);

  // Tabela de Barbeiros
  db.run(`
    CREATE TABLE IF NOT EXISTS barbeiros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      especialidade TEXT
    )
  `);

  // Tabela de Serviços
  db.run(`
    CREATE TABLE IF NOT EXISTS servicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      preco REAL NOT NULL
    )
  `);

  // Tabela de Agendamentos
  db.run(`
    CREATE TABLE IF NOT EXISTS agendamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER,
      barbeiro_id INTEGER,
      servico_id INTEGER,
      data TEXT NOT NULL,
      hora TEXT NOT NULL,
      status TEXT DEFAULT 'agendado',
      FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
      FOREIGN KEY(barbeiro_id) REFERENCES barbeiros(id),
      FOREIGN KEY(servico_id) REFERENCES servicos(id)
    )
  `);
});

module.exports = db;
