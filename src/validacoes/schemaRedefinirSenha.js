const joi = require('joi')

const schemaRedefenirSenha = joi.object({
    email: joi.string().email().required().messages({
        'string.empty': 'O campo email é obrigatório',
        'string.email': 'O email deve conter um email válido',
        'any.required': 'O campo email é obrigatório'
    }),

    senha_antiga: joi.string().min(5).required().messages({
        'string.empty': 'O campo senha é obrigatório',
        'any.required': 'O campo senha é obrigatório',
        'string.min': 'A senha precisa conter no minimo 5 caracteres'
    }),

    senha_nova: joi.string().min(5).required().messages({
        'string.empty': 'O campo senha é obrigatório',
        'any.required': 'O campo senha é obrigatório',
        'string.min': 'A senha precisa conter no minimo 5 caracteres'
    })

})

module.exports = schemaRedefenirSenha;