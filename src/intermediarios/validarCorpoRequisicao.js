const validarCorpoRequisicao = joiSchema => async (req, res, next) => {
    try {
        await joiSchema.validateAsync(req.body)
        return next()
    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }
}

module.exports = validarCorpoRequisicao