const knex = require('../conexao');
const { uploadImagemStorage, excluirImagemStorage } = require('../servicos/storage')

const cadastrarProduto = async (req, res) => {
    let { descricao, quantidade_estoque, valor, categoria_id } = req.body;

    try {
        const categoria = await knex('categorias').where({ id: categoria_id }).first()
        if(!categoria) return res.status(404).json({ mensagem: 'Categoria inválida.' })

        const produto = await knex('produtos').insert({ descricao, quantidade_estoque, valor, categoria_id }).returning('*')

        return res.status(201).json(produto[0])
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const detalharProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const produto = await knex('produtos').where({id}).first().returning('*')

        if (!produto) return res.status(404).json({ mensagem: 'Produto não encontrado.' })
    
        return res.status(200).json(produto)
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })   
    }
}

const editarProduto = async (req, res) => {
    const { id } = req.params;
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

    try {
        const categoria = await knex('categorias').where({ id: categoria_id }).first()
        if(!categoria) return res.status(404).json({ mensagem: 'Categoria inválida.' })

        const produto = await knex('produtos').where({ id }).first();
        if(!produto) return res.status(404).json({ mensagem: 'Produto não encontrado.' })
            
        await knex('produtos').update({ descricao, quantidade_estoque, valor, categoria_id}).where({ id })

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro no servidor' })
    }
}

const deletarProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const produto = await knex('produtos').where({ id }).first()
        if (!produto) return res.status(404).json({ mensagem: "Produto não encontrado" })

        await knex('produtos').where({ id }).delete()

        if(produto.imagem_url) await excluirImagemStorage(produto.imagem_url.replace(process.env.S3_URL_PATH_STORAGE, ''))

        return res.status(204).json()
    } catch (error) {
        if (error.code === '23503') return res.status(409).json({ mensagem: 'Produto não pode ser excluído pois há um pedido cadastrado com esse produto' })
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const listarProdutos = async (req, res) => {
    const { categoria_id } = req.query;

    try {
        let produtos;
        
        if(categoria_id) {
            const categoria = await knex('categorias').where({id: categoria_id}).returning('*')
            if(!categoria[0]) return res.status(400).json({ mensagem: "Categoria inexistente" })
            produtos = await knex('produtos').where({ categoria_id }).returning('*');
        } else {
            produtos = await knex('produtos').returning('*');
        }

        return res.status(200).json(produtos)
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro no servidor' })
    }
}

const uploadImagem = async (req, res) => {
    const { file } = req
    const { id } = req.params

    try {        
        const produto = await knex('produtos').where({ id }).first()
        if(!produto) return res.status(404).json({ mensagem: "Produto não encontrado." })
            
        if(!file) {
            if(!produto.imagem_url) return res.status(200).json({ imagem_url: produto.imagem_url })
            await excluirImagem(produto.imagem_url, id)
        
            return res.status(200).json({ mensagem: 'Imagem excluida com sucesso.' })
        } else if(produto.imagem_url){
            await excluirImagem(produto.imagem_url, id)
        }

        const imageName = `images/Produto-${new Date().getTime()}`

        const imagem = await uploadImagemStorage(
            imageName,
            file.buffer,
            file.mimetype
        )
        
        const imagemUpload = await knex('produtos').update({ imagem_url: imagem.url }).where({ id }).returning('imagem_url')

        return res.status(200).json({
            mensagem: 'Imagem atualizada com sucesso.',
            imagem_url: imagemUpload[0].imagem_url
        })
    } catch (error) {
        if(error.excluirImagem) return res.status(400).json({ mensagem: error.message })
        return res.status(500).json({ mensagem: 'Erro no servidor' })
    }
}

const excluirImagem = async (imagemUrl, id) => {
    try {
        await excluirImagemStorage(imagemUrl.replace(process.env.S3_URL_PATH_STORAGE, ''))
        await knex('produtos').update({ imagem_url: null }).where({ id })
    } catch (err) {
        const error = new Error('Erro ao excluir imagem')
        error.excluirImagem = err.message
        throw error
    }
}

module.exports = {
    cadastrarProduto,
    detalharProduto,
    editarProduto,
    deletarProduto,
    listarProdutos,
    uploadImagem
};
