const express = require('express')
const router = express()
const { cadastrarCliente, listarClientes, detalharCliente, editarDadosCliente } = require('../controladores/cliente')
const validarCorpoRequisicao = require('../intermediarios/validarCorpoRequisicao')
const validarParametros = require('../intermediarios/validarParametros')
const schemaCadastroCliente = require('../validacoes/schemaCadastroCliente')
const schemaIdParams = require('../validacoes/schemaIdParams')

router.post('/cliente', validarCorpoRequisicao(schemaCadastroCliente), cadastrarCliente)
router.put('/cliente/:id', validarParametros(schemaIdParams), validarCorpoRequisicao(schemaCadastroCliente), editarDadosCliente)
router.get('/cliente',listarClientes)
router.get('/cliente/:id', validarParametros(schemaIdParams), detalharCliente)

module.exports = router