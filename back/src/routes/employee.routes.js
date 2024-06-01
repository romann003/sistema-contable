import { Router } from "express";
import * as employeeController from "../controllers/employee.controller.js";
import { authJwt } from "../middlewares/index.js";
import {validateEmployee} from "../validators/employee.validator.js";

const router = Router();

router.post('/', [authJwt.verifyToken, authJwt.isOnlyAdmins], validateEmployee(1), employeeController.createEmployee);
router.get('/', [authJwt.verifyToken, authJwt.isValidUser], employeeController.getEmployees);
router.get('/:employeeId', [authJwt.verifyToken, authJwt.isOnlyAdmins], employeeController.getEmployeeById);
router.put('/:employeeId', [authJwt.verifyToken, authJwt.isOnlyAdmins], validateEmployee(), employeeController.updateEmployeeById);
router.delete('/:employeeId', [authJwt.verifyToken, authJwt.isOnlyAdmins], employeeController.deleteEmployeeById);

export default router;