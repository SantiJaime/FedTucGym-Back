import { Router } from 'express';
import { createUser, deleteUser, getOneUser, getUsers, updateUser } from '../controllers/users.controller';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getOneUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;