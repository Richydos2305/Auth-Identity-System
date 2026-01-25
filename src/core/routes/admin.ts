import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { auth, authorizePermission } from '../middleware/auth';
import { getUsers } from '../controllers/admin';
import { Permissions } from '../constants/permissions';

const router = Router();

router.get('/admin/users', auth, authorizePermission(Permissions.CanViewUsers), asyncHandler(getUsers));

export default router;
