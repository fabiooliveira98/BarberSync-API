const express = require('express');
const router = express.Router();
const BarbeiroController = require('../controllers/barbeiro.controller');
const { autenticacaoMiddleware, adminMiddleware } = require('../middlewares/autenticacao.middleware');

/**
 * @swagger
 * /barbeiros:
 *   get:
 *     summary: Lista todos os barbeiros
 *     tags: [Barbeiros]
 *     responses:
 *       200:
 *         description: Lista de barbeiros
 */
router.get('/', BarbeiroController.listar);

/**
 * @swagger
 * /barbeiros:
 *   post:
 *     summary: Cria um novo barbeiro (Apenas Admin)
 *     tags: [Barbeiros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *               especialidade:
 *                 type: string
 *     responses:
 *       201:
 *         description: Barbeiro criado com sucesso
 *       403:
 *         description: Acesso negado
 */
router.post('/', autenticacaoMiddleware, adminMiddleware, BarbeiroController.criar);

/**
 * @swagger
 * /barbeiros/{id}/disponibilidade:
 *   get:
 *     summary: Consulta horários disponíveis de um barbeiro para uma data
 *     tags: [Barbeiros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do barbeiro
 *       - in: query
 *         name: data
 *         required: true
 *         schema:
 *           type: string
 *           example: "2026-04-25"
 *         description: Data para consulta (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de horários disponíveis
 */
router.get('/:id/disponibilidade', BarbeiroController.disponibilidade);

module.exports = router;
