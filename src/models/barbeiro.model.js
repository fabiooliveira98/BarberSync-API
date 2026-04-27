const db = require('../database/db');

class BarbeiroModel {
  findAll(callback) {
    db.all('SELECT * FROM barbeiros', [], callback);
  }

  create({ nome, especialidade }, callback) {
    db.run('INSERT INTO barbeiros (nome, especialidade) VALUES (?, ?)', [nome, especialidade], callback);
  }

  findById(id, callback) {
    db.get('SELECT * FROM barbeiros WHERE id = ?', [id], callback);
  }
}

module.exports = new BarbeiroModel();
