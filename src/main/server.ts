// Camada onde se cria todas instancias de objetos e configurações do servidor
// Onde sera definido os factories e middlewares

import express from 'express'

const app = express()

const port = process.env.PORT ?? 3333
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
