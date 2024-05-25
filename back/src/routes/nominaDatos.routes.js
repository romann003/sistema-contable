import { Router } from "express";
import * as nominaDatosController from "../controllers/nominaDatos.controller.js";
import { authJwt } from "../middlewares/index.js";
// import {validateEmployee} from "../validators/employee.validator.js";

const router = Router();

// Nuevo periodo liquidacion
router.post('/periodos', [authJwt.verifyToken, authJwt.isValidUser], nominaDatosController.createNuevoPeriodo);
router.get('/periodos', [authJwt.verifyToken, authJwt.isValidUser], nominaDatosController.getPeriodos);
router.put('/periodos/:periodoId', [authJwt.verifyToken, authJwt.isValidUser], nominaDatosController.updatePeriodoById);
router.delete('/periodos/:periodoId', [authJwt.verifyToken, authJwt.isValidUser], nominaDatosController.deletePeriodoById);

// Bonificaciones
router.post('/bonificaciones', [authJwt.verifyToken, authJwt.isValidUser], nominaDatosController.createBonificaciones);
router.get('/bonificaciones/:nominaId', [authJwt.verifyToken, authJwt.isValidUser], nominaDatosController.getBonificaciones);
// router.get('/bonificaciones/:bonificacionId', [authJwt.verifyToken, authJwt.isValidUser], nominaDatosController.getBonificacionById);
router.put('/bonificaciones/:bonificacionId', [authJwt.verifyToken, authJwt.isValidUser], nominaDatosController.updateBonificacionById);
router.delete('/bonificaciones/:bonificacionId', [authJwt.verifyToken, authJwt.isValidUser], nominaDatosController.deleteBonificacionById);

export default router;