require('dotenv').config()

const express = require('express')
const cors = require('cors')
const swagger = require('swagger-ui-express');
const rotas = require('./rotas')
const port = process.env.PORT || 3000;
const swaggerDoc = require('./swagger.json')


const app = express()
app.use(cors())
app.use(express.json())
app.use('/doc', swagger.serve, swagger.setup(swaggerDoc))
app.use(rotas)

app.get('/hi', (req, res) => {
    res.status(200).json({msg: "hi it's running!"});
  });

app.listen(port)