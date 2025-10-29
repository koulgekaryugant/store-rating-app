import { Router } from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import { listStoresForUser, submitRating, getOwnerDashboard } from '../controllers/storeController';
import { userValidation, validate } from '../middlewares/validationMiddleware';
import { Role } from '@prisma/client';

const router = Router();
const NORMAL_USER = [Role.NORMAL_USER];
const STORE_OWNER = [Role.STORE_OWNER];

router.get('/', protect, authorize(NORMAL_USER), listStoresForUser);
router.post('/rate/:storeId', protect, authorize(NORMAL_USER), userValidation.submitRating, validate, submitRating);

router.get('/owner/dashboard', protect, authorize(STORE_OWNER), getOwnerDashboard);

export default router;