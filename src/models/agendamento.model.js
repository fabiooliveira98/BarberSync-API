const db = require('../database/db');

class AgendamentoModel {
  findAll(callback) {
    db.all('SELECT * FROM agendamentos', [], callback);
  }

  findByUsuarioId(usuario_id, callback) {
    db.all('SELECT * FROM agendamentos WHERE usuario_id = ?', [usuario_id], callback);
  }

  checkConflict(barbeiro_id, data, hora, callback) {
    const query = `SELECT * FROM agendamentos WHERE barbeiro_id = ? AND data = ? AND hora = ? AND status != 'cancelado'`;
    db.get(query, [barbeiro_id, data, hora], callback);
  }

  create({ usuario_id, barbeiro_id, servico_id, data, hora }, callback) {
    const query = `INSERT INTO agendamentos (usuario_id, barbeiro_id, servico_id, data, hora) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [usuario_id, barbeiro_id, servico_id, data, hora], callback);
  }

  findOccupiedHours(barbeiro_id, data, callback) {
    const query = `SELECT hora FROM agendamentos WHERE barbeiro_id = ? AND data = ? AND status != 'cancelado'`;
    db.all(query, [barbeiro_id, data], callback);
  }
}

module.exports = new AgendamentoModel();
