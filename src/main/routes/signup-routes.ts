import { Router } from 'express'
import { makeSignUpController } from '@main/factories/sign-up'
import { adaptRoute } from '@main/adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/signup', (req, res) => {
    (async () => {
      await adaptRoute(makeSignUpController())(req, res)
    })().catch(console.error)
  })
}
