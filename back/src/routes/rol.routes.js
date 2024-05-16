import { Router } from "express";
import * as rolController from "../controllers/rol.controller.js";
import { authJwt } from "../middlewares/index.js";

const router = Router();

router.get('/', [authJwt.verifyToken, authJwt.isSuperAdmin], rolController.getRoles);

export default router;