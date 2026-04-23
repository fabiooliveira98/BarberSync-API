const db = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'chave_secreta_barba';

class AutenticacaoController {
  registrar(req, res) {
    const { nome, email, senha, cargo } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Campos obrigatórios ausentes' });
    }

    const senhaCriptografada = bcrypt.hashSync(senha, 10);

    const query = `INSERT INTO usuarios (nome, email, senha, cargo) VALUES (?, ?, ?, ?)`;
    db.run(query, [nome, email, senhaCriptografada, cargo || 'cliente'], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ erro: 'E-mail já cadastrado' });
        }
        return res.status(500).json({ erro: err.message });
      }
      res.status(201).json({ id: this.lastID, nome, email, cargo: cargo || 'cliente' });
    });
  }

  login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Campos obrigatórios ausentes' });
    }

    const query = `SELECT * FROM usuarios WHERE email = ?`;
    db.get(query, [email], (err, usuario) => {
      if (err) return res.status(500).json({ erro: err.message });
      if (!usuario) return res.status(401).json({ erro: 'Credenciais inválidas' });

      const senhaValida = bcrypt.compareSync(senha, usuario.senha);
      if (!senhaValida) return res.status(401).json({ erro: 'Credenciais inválidas' });

      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, cargo: usuario.cargo },
        SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, cargo: usuario.cargo } });
    });
  }
}

module.exports = new AutenticacaoController();
