const db = require('../database/db');

class UsuarioModel {
  create({ nome, email, senhaCriptografada, cargo }, callback) {
    const query = `INSERT INTO usuarios (nome, email, senha, cargo) VALUES (?, ?, ?, ?)`;
    db.run(query, [nome, email, senhaCriptografada, cargo || 'cliente'], callback);
  }

  findByEmail(email, callback) {
    const query = `SELECT * FROM usuarios WHERE email = ?`;
    db.get(query, [email], callback);
  }
}

module.exports = new UsuarioModel();
