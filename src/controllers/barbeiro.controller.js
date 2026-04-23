const db = require('../database/db');

class BarbeiroController {
  listar(req, res) {
    db.all('SELECT * FROM barbeiros', [], (err, linhas) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json(linhas);
    });
  }

  criar(req, res) {
    const { nome, especialidade } = req.body;
    if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' });

    db.run('INSERT INTO barbeiros (nome, especialidade) VALUES (?, ?)', [nome, especialidade], function(err) {
      if (err) return res.status(500).json({ erro: err.message });
      res.status(201).json({ id: this.lastID, nome, especialidade });
    });
  }
}

module.exports = new BarbeiroController();
