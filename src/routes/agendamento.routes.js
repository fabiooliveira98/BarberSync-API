const express = require('express');
const router = express.Router();
const AgendamentoController = require('../controllers/agendamento.controller');
const { autenticacaoMiddleware } = require('../middlewares/autenticacao.middleware');

/**
 * @swagger
 * /agendamentos:
 *   get:
 *     summary: Lista agendamentos (Próprios para Clientes, Todos para Admin)
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 */
router.get('/', autenticacaoMiddleware, AgendamentoController.listar);

/**
 * @swagger
 * /agendamentos:
 *   post:
 *     summary: Cria um novo agendamento
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - barbeiro_id
 *               - servico_id
 *               - data
 *               - hora
 *             properties:
 *               barbeiro_id:
 *                 type: integer
 *               servico_id:
 *                 type: integer
 *               data:
 *                 type: string
 *                 example: "2023-12-25"
 *               hora:
 *                 type: string
 *                 example: "14:00"
 *     responses:
 *       201:
 *         description: Agendamento criado
 *       400:
 *         description: Conflito de horário ou erro na data
 */
router.post('/', autenticacaoMiddleware, AgendamentoController.criar);

module.exports = router;
