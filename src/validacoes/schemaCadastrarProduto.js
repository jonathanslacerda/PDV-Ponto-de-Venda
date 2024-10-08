const joi = require('joi')

const schemaCadastrarProduto = joi.object({
    descricao: joi.string().required().messages({
        'string.empty': 'O campo descrição é obrigatório',
        'any.required': 'O campo descrição é obrigatório',
    }),

    quantidade_estoque: joi.number().integer().positive().required().messages({
        'number.base': 'O valor não é um número ou não pode ser convertido em um número.',
        'number.integer': 'O número não é um número inteiro válido.',
        'number.positive': 'A quantidade não pode ser um valor negativo.',
        'any.required': 'O campo quantidade estoque é obrigatório',
    }),

    valor: joi.number().integer().positive().required().messages({
        'number.base': 'O valor não é um número ou não pode ser convertido em um número.',
        'number.integer': 'O número não é um número inteiro válido.',
        'number.positive': 'A quantidade não pode ser um valor negativo.',
        'any.required': 'O campo valor é obrigatório',
    }),

    categoria_id: joi.number().integer().positive().required().messages({
        'number.base': 'A categoria_id não é um número ou não pode ser convertido em um número.',
        'number.integer': 'O número não é um número inteiro válido.',
        'number.positive': 'A quantidade não pode ser um valor negativo.',
        'any.required': 'O campo categoria id é obrigatório',
    }),
})

module.exports = schemaCadastrarProduto