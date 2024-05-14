import { Router } from "express";
import * as areaController from "../controllers/area.controller.js";
import { authJwt } from "../middlewares/index.js";
import {validateArea} from "../validators/area.validator.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { areaSchema } from "../schemas/area.schema.js";

const router = Router();

router.post('/', [authJwt.verifyToken, authJwt.isAdmin], validateArea(1), areaController.createArea);
router.get('/', [authJwt.verifyToken, authJwt.isAdmin], areaController.getAreas);
router.get('/:areaId', [authJwt.verifyToken, authJwt.isAdmin], areaController.getAreaById);
router.put('/:areaId', [authJwt.verifyToken, authJwt.isAdmin], validateArea(), areaController.updateAreaById);
router.delete('/:areaId', [authJwt.verifyToken, authJwt.isAdmin], areaController.deleteAreaById);

export default router;