import { Router } from 'express'
import { makeSignUpController } from '@main/factories/signup'
import { adaptRoute } from '@main/adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
}
