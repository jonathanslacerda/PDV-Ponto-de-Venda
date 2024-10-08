const knex = require('../conexao');
const validarCpf = require('cpf-cnpj-validator')

const cadastrarCliente = async (req, res) => {
    let { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

    try {
        const cepNumero = cep ? cep.replace(/\D/g, '') : null
        const cpfNumero = cpf.replace(/\D/g, '')

        const cpfValido = validarCpf.cpf.isValid(cpfNumero)
        if (!cpfValido) return res.status(400).json({ mensagem: "O CPF é inválido" })

        const clienteCadastrado = await knex('clientes').insert({ nome, email, cpf: cpfNumero, cep: cepNumero, rua, numero, bairro, cidade, estado }).returning('*')

        return res.status(201).json(clienteCadastrado[0])
    } catch (error) {
        if (error.code === '23505') return res.status(409).json({ mensagem: "O cpf ou o email ja possui um cadastro" })
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const listarClientes = async (req, res) => {
    try {
        const clientes = await knex('clientes').returning('*')
        if(clientes < 1) return res.status(404).json({ mensagem: 'Não há clientes cadastrados' })

        return res.status(200).json(clientes)
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const detalharCliente = async (req, res) => {
    let { id } = req.params

    try {
        const cliente = await knex('clientes').where({ id }).first().returning('*')
        if(!cliente) return res.status(404).json({ mensagem: 'Cliente não encontrado' })

        return res.status(200).json(cliente)
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const editarDadosCliente = async (req, res) => {
    const { id } = req.params;
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body

    try {
        const cepNumero = cep ? cep.replace(/\D/g, '') : null
        const cpfNumero = cpf.replace(/\D/g, '')

        const cpfValido = validarCpf.cpf.isValid(cpfNumero)
        if (!cpfValido) return res.status(400).json({ mensagem: "O CPF é inválido" })

        const cliente = await knex('clientes').where({ id }).first()
        if (!cliente) return res.status(404).json({ mensagem: 'Cliente não encontrado.' })

        await knex('clientes').where({ id }).update({ nome, email, cpf: cpfNumero, cep: cepNumero, rua, numero, bairro, cidade, estado })

        return res.status(204).send()
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ mensagem: "O cpf ou o email ja possui um cadastro" })
        }
        return res.status(500).json({ mensagem: 'Erro no servidor.' })
    }
}

module.exports = {
    cadastrarCliente,
    detalharCliente,
    listarClientes,
    editarDadosCliente
};
