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

  disponibilidade(req, res) {
    const { id } = req.params;
    const { data } = req.query;

    if (!data) return res.status(400).json({ erro: 'Data é obrigatória (formato YYYY-MM-DD)' });

    // Definimos um horário padrão de funcionamento (09h às 17h)
    const horariosTrabalho = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

    const query = `SELECT hora FROM agendamentos WHERE barbeiro_id = ? AND data = ? AND status != 'cancelado'`;
    
    db.all(query, [id, data], (err, agendamentos) => {
      if (err) return res.status(500).json({ erro: err.message });

      const horasOcupadas = agendamentos.map(a => a.hora);
      const horariosLivres = horariosTrabalho.filter(h => !horasOcupadas.includes(h));

      res.json({
        barbeiro_id: id,
        data,
        horarios_disponiveis: horariosLivres
      });
    });
  }
}

module.exports = new BarbeiroController();
