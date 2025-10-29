import { Router } from 'express'
import { register, login } from '../controllers/authController'
import { userValidation, validate } from '../middlewares/validationMiddleware'

const router = Router()
router.post('/register', userValidation.register, validate, register)
router.post('/login', userValidation.login, validate, login)
export default router