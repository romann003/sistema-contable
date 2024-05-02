import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authJwt } from "../middlewares/index.js";	
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema } from "../schemas/auth.schema.js";
const router = Router();


router.post('/login', validateSchema(loginSchema), authController.login);
router.post('/logout', [authJwt.verifyToken], authController.logout);
router.get('/verify', authController.verifyToken);

export default router;