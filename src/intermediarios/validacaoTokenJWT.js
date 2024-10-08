const jwt = require('jsonwebtoken')
const knex = require('../conexao')

const validacaoTokenJWT = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Token não informado' })
    }

    const token = authorization.replace('Bearer ', '')
    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET)

        const usuario = await knex('usuarios').where({id}).returning('*')
        if (!usuario) {
            return res.status(401).json({ mensagem: 'Não autorizado' });
        }
        const { senha, ...usuarioLogado } = usuario
        req.usuario = usuarioLogado
        return next()
    } catch (error) {
        if(error.message === "jwt malformed") return res.status(401).json({ mensagem: "Token inválido."})
        if(error.message === "invalid signature") return res.status(401).json({ mensagem: "Token inválido."})
        if(error.message === "invalid token") return res.status(401).json({ mensagem: "Token inválido."})
        if(error.message === "jwt expired") return res.status(401).json({ mensagem: "Token expirado."})
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' })
    }
}

module.exports = validacaoTokenJWT