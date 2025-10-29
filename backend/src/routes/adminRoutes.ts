import { Router } from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import { getDashboardStats, createUser, createStore, getAllUsers, getAllStores } from '../controllers/adminController';
import { userValidation, validate } from '../middlewares/validationMiddleware';
import { Role } from '@prisma/client';

const router = Router();
const ADMIN = [Role.SYSTEM_ADMIN];

router.use(protect, authorize(ADMIN));

router.get('/dashboard', getDashboardStats);

router.post('/users', userValidation.createUser, validate, createUser);
router.get('/users', getAllUsers);

router.post('/stores', userValidation.createStore, validate, createStore);
router.get('/stores', getAllStores);

export default router;