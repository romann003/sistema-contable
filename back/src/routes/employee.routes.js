import { Router } from "express";
import * as employeeController from "../controllers/employee.controller.js";
import { authJwt } from "../middlewares/index.js";
import {validateEmployee} from "../validators/employee.validator.js";

const router = Router();

router.post('/', [authJwt.verifyToken, authJwt.isValidUser], validateEmployee(1), employeeController.createEmployee);
router.get('/', [authJwt.verifyToken, authJwt.isValidUser], employeeController.getEmployees);
router.get('/:employeeId', [authJwt.verifyToken, authJwt.isValidUser], employeeController.getEmployeeById);
router.put('/:employeeId', [authJwt.verifyToken, authJwt.isValidUser], validateEmployee(), employeeController.updateEmployeeById);
router.delete('/:employeeId', [authJwt.verifyToken, authJwt.isValidUser], employeeController.deleteEmployeeById);

export default router;