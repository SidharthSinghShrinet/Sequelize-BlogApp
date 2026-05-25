import { Router } from 'express';
import {registerUser} from "../controllers/user.contoller.ts";

const router = Router();

router.post('/register', registerUser);

export default router;