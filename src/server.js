const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota de saúde para teste inicial
app.get('/saude', (req, res) => {
  res.json({ mensagem: 'API está rodando' });
});

// Rotas
const { swaggerUi, specs } = require('./config/swagger');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

const autenticacaoRotas = require('./routes/autenticacao.routes');
const barbeiroRotas = require('./routes/barbeiro.routes');
const agendamentoRotas = require('./routes/agendamento.routes');

app.use('/autenticacao', autenticacaoRotas);
app.use('/barbeiros', barbeiroRotas);
app.use('/agendamentos', agendamentoRotas);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;
