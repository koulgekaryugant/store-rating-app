import { Router } from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import { userValidation, validate } from '../middlewares/validationMiddleware';
import { updatePassword } from '../controllers/userController';
import { Role } from '@prisma/client';

const router = Router();
const AUTHED_USERS = [Role.NORMAL_USER, Role.STORE_OWNER, Role.SYSTEM_ADMIN];

router.put(
  '/update-password',
  protect,
  authorize(AUTHED_USERS),
  userValidation.updatePassword,
  validate,
  updatePassword
);

export default router;