import { Router } from 'express';
import { createUser, deleteUser, getOneUser, getUsers, updateUserFullname } from '../controllers/users.controller';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getOneUser);
router.post('/', createUser);
router.patch('/:id', updateUserFullname);
router.delete('/:id', deleteUser);

export default router;