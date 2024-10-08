const express = require('express')
const validacaoTokenJWT = require('../intermediarios/validacaoTokenJWT')
const categoria = require('./rotaCategoria')
const usuario = require('./rotaUsuario')
const produto = require('./rotaProduto')
const cliente = require('./rotaCliente')
const pedido = require('./rotaPedido')

const rotas = express()

rotas.use(categoria)
rotas.use(usuario)

rotas.use(validacaoTokenJWT)

rotas.use(produto)
rotas.use(cliente)
rotas.use(pedido)

module.exports = rotas
