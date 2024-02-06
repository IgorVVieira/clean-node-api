const config = require('./jest.config')

// --findRelatedTests: Roda os testes relacionados ao arquivo que foi alterado
// --runInBand: Roda os testes em série, todos de uma vez
config.testMatch = ['**/*.spec.ts']

module.exports = config
