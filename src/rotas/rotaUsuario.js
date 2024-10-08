const express = require('express')
const router = express()
const { cadastrarUsuario, loginUsuario, detalharUsuario, editarPerfilUsuario, redefinirSenha } = require('../controladores/usuario')
const validacaoTokenJWT = require('../intermediarios/validacaoTokenJWT')
const validarCorpoRequisicao = require('../intermediarios/validarCorpoRequisicao')
const schemaUsuario = require('../validacoes/schemaCadastro')
const schemaLogin = require('../validacoes/schemaLogin')
const schemaRedefenirSenha = require('../validacoes/schemaRedefinirSenha')
const schemaEditarPerfil = require('../validacoes/schemaEditarPerfilUsuario')

router.post('/usuario', validarCorpoRequisicao(schemaUsuario), cadastrarUsuario)
router.post('/login', validarCorpoRequisicao(schemaLogin), loginUsuario)
router.patch('/usuario/redefinir', validarCorpoRequisicao(schemaRedefenirSenha), redefinirSenha)

router.use(validacaoTokenJWT)

router.get('/usuario', detalharUsuario)
router.put('/usuario', validarCorpoRequisicao(schemaEditarPerfil), editarPerfilUsuario)

module.exports = router