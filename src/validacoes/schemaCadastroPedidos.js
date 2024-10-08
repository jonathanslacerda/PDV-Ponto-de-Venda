const joi = require('joi')

const produto_id = joi.number().positive().integer().required().messages({
    'number.base': 'O id do produto não é um número ou não pode ser convertido em um número.',
    'number.integer': 'O id do produto não é um número inteiro válido.',
    'number.positive': 'O id do produto não pode ser um valor negativo.',
    'any.required': 'O id do produto é obrigatório'
})

const quantidade_produto = joi.number().positive().integer().required().messages({
    'number.base': 'A quantidade do produto não é um número ou não pode ser convertido em um número.',
    'number.integer': 'A quantidade do produto não é um número inteiro válido.',
    'number.positive': 'A quantidade do produto não pode ser um valor negativo.'
})

const schemaCadastroPedidos = joi.object({
    cliente_id: joi.number().positive().integer().required().messages({
        'number.base': 'O id do cliente não é um número ou não pode ser convertido em um número.',
        'number.integer': 'O id do cliente não é um número inteiro válido.',
        'number.positive': 'O id do cliente não pode ser um valor negativo.',
        'any.required': 'O id do cliente é obrigatório'
    }),

    observacao: joi.string().messages({
        'any.required': 'O campo observação é obrigatório'
    }),

    pedido_produtos: joi.array().items({produto_id, quantidade_produto}).required().min(1).messages({
        'array.base': "O pedido_produto deve ser um array",
        'any.required': 'O pedido_produto é obrigatório',
        'array.min': 'Precisa conter produto(s) no pedido.'
    }),
})

module.exports = schemaCadastroPedidos