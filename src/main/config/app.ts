import express from 'express'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'

const app = express()
setupMiddlewares(app)
setupRoutes(app).catch(console.error)

export default app
