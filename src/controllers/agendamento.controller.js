const AgendamentoModel = require('../models/agendamento.model');

class AgendamentoController {
  listar(req, res) {
    if (req.user.cargo !== 'admin') {
      AgendamentoModel.findByUsuarioId(req.user.id, (err, linhas) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(linhas);
      });
    } else {
      AgendamentoModel.findAll((err, linhas) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(linhas);
      });
    }
  }

  criar(req, res) {
    const { barbeiro_id, servico_id, data, hora } = req.body;
    const usuario_id = req.user.id;

    if (!barbeiro_id || !servico_id || !data || !hora) {
      return res.status(400).json({ erro: 'Campos obrigatórios ausentes' });
    }

    // Regra: Apenas datas futuras
    const dataAgendamento = new Date(`${data}T${hora}`);
    if (dataAgendamento < new Date()) {
      return res.status(400).json({ erro: 'Não é possível agendar no passado' });
    }

    // Regra: Verificar conflito de horário para o barbeiro
    AgendamentoModel.checkConflict(barbeiro_id, data, hora, (err, linha) => {
      if (err) return res.status(500).json({ erro: err.message });
      if (linha) {
        return res.status(400).json({ erro: 'O barbeiro já possui um agendamento neste horário' });
      }

      AgendamentoModel.create({ usuario_id, barbeiro_id, servico_id, data, hora }, function(err) {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(201).json({ id: this.lastID, usuario_id, barbeiro_id, servico_id, data, hora, status: 'agendado' });
      });
    });
  }
}

module.exports = new AgendamentoController();
