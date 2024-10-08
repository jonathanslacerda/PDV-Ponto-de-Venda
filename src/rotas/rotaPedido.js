const express = require('express')
const router = express()
const { cadastrarPedido, listarPedidos } = require('../controladores/pedido')
const validarCorpoRequisicao = require('../intermediarios/validarCorpoRequisicao')
const schemaCadastroPedidos = require('../validacoes/schemaCadastroPedidos')

router.post('/pedido', validarCorpoRequisicao(schemaCadastroPedidos), cadastrarPedido)
router.get('/pedido', listarPedidos)

module.exports = router