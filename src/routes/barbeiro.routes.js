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

module.exports = router;
