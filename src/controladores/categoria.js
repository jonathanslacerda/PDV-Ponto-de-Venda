const knex = require('../conexao')

const listarCategoria = async (req, res) => {
    try {
        const categorias = await knex('categorias').returning('*');
        return res.status(200).json(categorias)
    } catch (error) {
        return res.status(500).json({mensagem: "Erro interno do servidor. "})
    }
}

module.exports = listarCategoria