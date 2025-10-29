import { body, validationResult } from 'express-validator'

const passwordValidator = () =>
  body('password')
    .isLength({ min: 8, max: 16 })
    .matches(/[A-Z]/)
    .matches(/[!@#$%^&*(),.?":{}|<>]/)

export const userValidation = {
  register: [
    body('name').trim().isLength({ min: 3, max: 60 }),
    body('email').isEmail(),
    body('address').isLength({ max: 400 }),
    passwordValidator(),
    body('role').optional().isIn(['NORMAL_USER', 'STORE_OWNER'])
  ],
  login: [
    body('email').isEmail(),
    body('password').notEmpty()
  ],
  createUser: [
    body('name').trim().isLength({ min: 3, max: 60 }),
    body('email').isEmail(),
    body('address').isLength({ max: 400 }),
    body('role').isIn(['NORMAL_USER', 'STORE_OWNER', 'SYSTEM_ADMIN']),
    passwordValidator()
  ],
  createStore: [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('address').isLength({ max: 400 }),
    body('ownerId').isUUID()
  ],
  submitRating: [
    body('ratingValue').isInt({ min: 1, max: 5 })
  ],
  updatePassword: [
    body('currentPassword').notEmpty(),
    passwordValidator()
  ]
}

export const validate = (req: any, res: any, next: any) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) return next()
  const extractedErrors: { [key: string]: string }[] = []
  errors.array().forEach(err => extractedErrors.push({ [(err as any).param]: err.msg }))
  return res.status(400).json({ errors: extractedErrors })
}
