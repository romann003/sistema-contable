import { Router } from "express";
import * as nominaController from "../controllers/nomina.controller.js";
import { authJwt } from "../middlewares/index.js";
// import {validateEmployee} from "../validators/employee.validator.js";

const router = Router();

router.post('/', [authJwt.verifyToken, authJwt.isAdmin], nominaController.createNomina);
router.get('/', [authJwt.verifyToken, authJwt.isAdmin], nominaController.getNominas);
router.get('/:nominaId', [authJwt.verifyToken, authJwt.isAdmin], nominaController.getNominaById);
router.put('/:nominaId', [authJwt.verifyToken, authJwt.isAdmin], nominaController.updateNominaById);
router.delete('/:nominaId', [authJwt.verifyToken, authJwt.isAdmin], nominaController.deleteNominaById);

export default router;