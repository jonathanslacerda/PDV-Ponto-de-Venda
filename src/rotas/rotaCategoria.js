const express = require('express')
const router = express()
const listarCategoria = require('../controladores/categoria')

router.get('/categoria', listarCategoria)

module.exports = router