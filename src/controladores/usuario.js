const knex = require('../conexao');
const transportador = require('../servicos/nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = await knex('usuarios').insert({ nome, email, senha: senhaCriptografada }).returning(['nome', 'email']);

        return res.status(201).json(novoUsuario);

    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ mensagem: "Já existe usuário cadastrado com o e-mail informado." })
        }
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await knex('usuarios').where({ email }).first().returning('*');
        if (!usuario) return res.status(404).json({ mensagem: "E-mail ou senha inválido" })

        const validarSenha = await bcrypt.compare(senha, usuario.senha)
        if (!validarSenha) return res.status(400).json({ mensagem: "E-mail ou senha inválido" });
        
        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '4h' })

        const { senha: _, ...usuarioLogado } = usuario

        return res.status(200).json({ usuario: usuarioLogado, token })
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const redefinirSenha = async (req, res) => {
    const { email, senha_antiga, senha_nova } = req.body;

    try {
        const usuario = await knex('usuarios').where({ email }).first()
        if(!usuario) return res.status(404).json({ mensagem: "E-mail ou senha antiga inválida" })
        
        const validarSenha = await bcrypt.compare(senha_antiga, usuario.senha)
        if (!validarSenha) return res.status(400).json({ mensagem: "E-mail ou senha antiga inválida" })

        if (senha_antiga === senha_nova) return res.status(409).json({ mensagem: "A nova senha deve ser diferente da antiga" })

        const senhaCriptografada = await bcrypt.hash(senha_nova, 10)
        usuario.senha = senhaCriptografada

        await knex("usuarios").update(usuario).where({ email })

        transportador.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Senha PDV alterada',
            text: `Olá ${usuario.nome}

Sua senha foi alterada, se você não solicitou essa alteração entre em contato imediatamente com nosso suporte para recuperar sua conta.
        
Obrigado por usar o nosso sistema.
            
Por favor, não responda esta mensagem. Em caso de dúvidas, acesse nossa central de ajuda.`,
        })

        return res.status(201).json({ messagem: "A senha foi alterada com sucesso." })
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor'})
    }
}

const detalharUsuario = async (req, res) => {
    const id = req.usuario[0].id

    try {
        const usuario = await knex('usuarios').where({ id }).first()

        const { senha: _, ...usuarioLogado } = usuario

        return res.status(200).json(usuarioLogado)
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const editarPerfilUsuario = async (req, res) => {
    const { email: usuarioEmail } = req.usuario[0]
    const { nome, email, senha } = req.body

    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10)

        await knex('usuarios').update({ nome, email, senha: senhaCriptografada }).where({ email: usuarioEmail })

        return res.status(204).send()
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário' })
        }
        return res.status(500).json({ mensagem: 'Erro no servidor' })
    }
}

module.exports = {
    cadastrarUsuario,
    loginUsuario,
    detalharUsuario,
    redefinirSenha,
    editarPerfilUsuario
} 
