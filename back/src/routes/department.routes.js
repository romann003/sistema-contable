import { Router } from "express";
import * as departmentController from "../controllers/department.controller.js";
import { authJwt } from "../middlewares/index.js";
import {validateDepartment} from "../validators/department.validator.js";

const router = Router();

router.post('/', [authJwt.verifyToken, authJwt.isOnlyAdmins], validateDepartment(1), departmentController.createDepartment);
router.get('/', [authJwt.verifyToken, authJwt.isOnlyAdmins], departmentController.getDepartments);
router.get('/department/', [authJwt.verifyToken, authJwt.isOnlyAdmins], departmentController.getActiveDepartments);
router.get('/:departmentId', [authJwt.verifyToken, authJwt.isOnlyAdmins], departmentController.getDepartmentById);
router.put('/:departmentId', [authJwt.verifyToken, authJwt.isOnlyAdmins], validateDepartment(), departmentController.updateDepartmentById);
router.delete('/:departmentId', [authJwt.verifyToken, authJwt.isOnlyAdmins], departmentController.deleteDepartmentById);

export default router;