const joi = require('joi')

const schemaIdParams = joi.object({
    id: joi.number().required().positive().integer().messages({
        'number.base': 'O id não é um número ou não pode ser convertido em um número.',
        'number.integer': 'O id não é um número inteiro válido.',
        'number.positive': 'O id não pode ser um valor negativo.',
        'any.required': 'O parâmetro id é obrigatório',
    }),
})

module.exports = schemaIdParams