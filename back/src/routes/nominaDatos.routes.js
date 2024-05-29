import { Router } from "express";
import * as nominaDatosController from "../controllers/nominaDatos.controller.js";
import { authJwt } from "../middlewares/index.js";
const router = Router();

// Nuevo periodo liquidacion
router.post('/periodos', [authJwt.verifyToken, authJwt.isValidUser], nominaDatosController.createNuevoPeriodo);
router.get('/periodos', [authJwt.verifyToken, authJwt.isValidUser], nominaDatosController.getPeriodos);
router.put('/periodos/:periodoId', [authJwt.verifyToken, authJwt.isValidUser], nominaDatosController.updatePeriodoById);
router.delete('/periodos/:periodoId', [authJwt.verifyToken, authJwt.isValidUser], nominaDatosController.deletePeriodoById);

export default router;