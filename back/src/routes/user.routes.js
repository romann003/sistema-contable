import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authJwt } from "../middlewares/index.js";
import { validateUser } from "../validators/user.validator.js";

const router = Router();

router.post('/', [authJwt.verifyToken, authJwt.isAdmin], validateUser(1), userController.createUser);
router.get('/', [authJwt.verifyToken, authJwt.isAdmin], userController.getUsers);
router.get('/:userId', [authJwt.verifyToken, authJwt.isAdmin], userController.getUserById);
router.put('/:userId', [authJwt.verifyToken, authJwt.isAdmin], validateUser(), userController.updateUserById);
router.delete('/:userId', [authJwt.verifyToken, authJwt.isAdmin], userController.deleteUserById);

export default router;