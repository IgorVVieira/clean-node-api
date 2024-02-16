export default {
  port: process.env.PORT ?? 3333,
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://admin:admin@localhost:27017/clean-node-api?authSource=admin'
}
