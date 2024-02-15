module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.0.3', // Verificar versão do MongoDB em producao
      skipMD5: true
    },
    autoStart: false,
    instance: {}
  }
}
