// Camada onde se cria todas instancias de objetos e configurações do servidor
import { MongoHelper } from '../infra/db/mongodb/helper/mongo'
import env from './config/env'

const { port, mongoUrl } = env
MongoHelper.connect(mongoUrl).then(async () => {
  console.log('Connected to MongoDB')
  const app = (await import('./config/app')).default
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
  })
}).catch(console.error)
