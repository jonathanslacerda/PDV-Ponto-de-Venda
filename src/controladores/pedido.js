const knex = require('../conexao');

const cadastrarPedido = async (req, res) => {
    const { cliente_id, observacao, pedido_produtos } = req.body;

    const verificarProduto = async (produto) => {
        const produtoEncontrado = await knex('produtos').where({ id: produto.produto_id }).first()

        if (!produtoEncontrado) {
            const error = new Error(`O produto de id ${produto.produto_id} não está disponível.`)
            error.produtoId = produto.produto_id
            throw error
        }
    
        if (produtoEncontrado.quantidade_estoque < produto.quantidade_produto) {
            const error = new Error(`O produto de id ${produto.produto_id} não está disponível nesta quantidade.`)
            error.produtoId = produto.produto_id
            throw error
        }

        return {
            produto_id: produto.produto_id,
            quantidade_produto: produto.quantidade_produto,
            valor_produto: produtoEncontrado.valor
        }
    }

    try {
        const cliente = await knex('clientes').where({ id: cliente_id }).first().returning('*');
        if (!cliente) return res.status(404).json({ mensagem: "O cliente não foi encontrado." })
    
        const produtosParaInserir = await Promise.all(pedido_produtos.map(verificarProduto))
        const valorTotal = produtosParaInserir.reduce((total, produto) => total + (produto.valor_produto * produto.quantidade_produto), 0)
        
        const novoPedido = await knex('pedidos').insert({ cliente_id, observacao, valor_total: valorTotal }).returning('*')

        await knex('pedido_produtos').insert(produtosParaInserir.map(produto => ({
            ...produto,
            pedido_id: novoPedido[0].id,
        })))

        return res.status(201).json(novoPedido[0])
    } catch (error) {
        if(error.produtoId) return res.status(400).json({ mensagem: error.message }) 
        return res.status(500).json({ mensagem: 'Erro interno do servidor' }) 
    }
}

const listarPedidos = async (req, res) => {
    const { cliente_id } = req.query

    try {
        let pedidos;

        if (cliente_id) {
            const cliente = await knex('clientes').where({ id: cliente_id }).first();
            if (!cliente) return res.status(404).json({ mensagem: 'Cliente não cadastrado.' });
            pedidos = await knex('pedidos').where({ cliente_id }).returning('*');
        } else {
            pedidos = await knex('pedidos').returning('*');
        }

        return res.status(200).json(pedidos);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' }) 
    }
}

module.exports = {
    cadastrarPedido,
    listarPedidos
}
