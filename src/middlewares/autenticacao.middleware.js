const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'chave_secreta_barba';

const autenticacaoMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });

  try {
    const decodificado = jwt.verify(token, SECRET);
    req.user = decodificado;
    next();
  } catch (err) {
    res.status(401).json({ erro: 'Token inválido.' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.cargo === 'admin') {
    next();
  } else {
    res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' });
  }
};

module.exports = { autenticacaoMiddleware, adminMiddleware };
