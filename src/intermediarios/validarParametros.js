const validarParametros = joiSchema => async (req, res, next) => {
    try {
        await joiSchema.validateAsync(req.params)
        return next()
    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }
}

module.exports = validarParametros