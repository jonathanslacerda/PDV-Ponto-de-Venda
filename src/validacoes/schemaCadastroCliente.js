const joi = require('joi')

const schemaCadastroCliente = joi.object({
    nome: joi.string().required().messages({
        'string.empty': 'O campo nome é obrigatório',
        'any.required': 'O campo nome é obrigatório',
        'string.base': 'O nome não deve conter numeros'
    }),

    email: joi.string().email().required().messages({
        'string.empty': 'O campo email é obrigatório',
        'string.email': 'O email deve conter um email válido',
        'any.required': 'O campo email é obrigatório',
    }),

    cpf: joi.string().max(14).required().messages({
        'string.empty': 'O campo cpf é obrigatório',
        'string.max': 'O cpf precisa conter no maximo 14 caracteres',
        'any.required': 'O campo cpf é obrigatório'
    }),

    cep: joi.string().empty('').max(9).min(8).messages({
        'string.empty': 'O campo cep deve conter algo',
        'string.max': 'O cep precisa conter no maximo 9 caracteres',
        'string.min': 'O cep precisa conter no minimo 8 caracteres'
    }),

    rua: joi.string().empty('').min(2).max(100).messages({
        'string.empty': 'O campo rua deve conter algo',
        'string.min': 'A rua precisa conter no minimo 2 caracteres',
        'string.max': 'A rua precisa conter no maximo 100 caracteres',
    }),

    numero: joi.string().empty('').max(10).messages({
        'string.empty': 'O campo número deve conter algo',
        'string.max': 'O número da rua precisa conter no maximo 10 caracteres',
    }),

    bairro: joi.string().empty('').max(50).messages({
        'string.empty': 'O campo bairro deve conter algo',
        'string.max': 'O bairro precisa conter no maximo 50 caracteres'
    }),

    cidade: joi.string().empty('').max(50).messages({
        'string.empty': 'O campo cidade deve conter algo',
        'string.max': 'A cidade precisa conter no maximo 50 caracteres',
    }),

    estado: joi.string().empty('').max(50).messages({
        'string.empty': 'O campo estado deve conter algo',
        'string.max': 'O estado precisa conter no maximo 50 caracteres',
    })
})

module.exports = schemaCadastroCliente