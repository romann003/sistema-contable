import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authJwt } from "../middlewares/index.js";
import { validateUser } from "../validators/user.validator.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { userSchema } from "../schemas/user.schema.js";

const router = Router();

// router.post('/', [authJwt.verifyToken, authJwt.isAdmin], validateUser(1), userController.createUser);
// router.get('/', [authJwt.verifyToken, authJwt.isAdmin], userController.getUsers);
// router.get('/:userId', [authJwt.verifyToken, authJwt.isAdmin], userController.getUserById);
// router.put('/:userId', [authJwt.verifyToken, authJwt.isAdmin], validateUser(), userController.updateUserById);
// router.delete('/:userId', [authJwt.verifyToken, authJwt.isAdmin], userController.deleteUserById);


router.post('/', [authJwt.verifyToken, authJwt.isSuperAdmin], validateSchema(userSchema), validateUser(1), userController.createUser);
router.get('/', [authJwt.verifyToken, authJwt.isSuperAdmin], userController.getUsers);
router.get('/:userId', [authJwt.verifyToken, authJwt.isSuperAdmin], userController.getUserById);
router.put('/:userId', [authJwt.verifyToken, authJwt.isSuperAdmin], validateUser(), userController.updateUserById);
router.delete('/:userId', [authJwt.verifyToken, authJwt.isSuperAdmin], userController.deleteUserById);

export default router;