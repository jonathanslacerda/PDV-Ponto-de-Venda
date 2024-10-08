const express = require('express')
const router = express()
const { cadastrarProduto, editarProduto, deletarProduto, detalharProduto, listarProdutos, uploadImagem } = require('../controladores/produto')
const validarCorpoRequisicao = require('../intermediarios/validarCorpoRequisicao')
const validarParametros = require('../intermediarios/validarParametros')
const schemaCadastrarProduto = require('../validacoes/schemaCadastrarProduto')
const schemaIdParams = require('../validacoes/schemaIdParams')
const validacaoMulter = require('../intermediarios/validacaoMulter')

router.post('/produto', validarCorpoRequisicao(schemaCadastrarProduto), cadastrarProduto)
router.put('/produto/:id', validarCorpoRequisicao(schemaCadastrarProduto), validarParametros(schemaIdParams), editarProduto)
router.get('/produto', listarProdutos)
router.get('/produto/:id', validarParametros(schemaIdParams), detalharProduto)
router.delete('/produto/:id', validarParametros(schemaIdParams), deletarProduto)
router.patch('/produto/:id/imagem', validarParametros(schemaIdParams), validacaoMulter, uploadImagem)

module.exports = router