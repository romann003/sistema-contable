import { Router } from "express";
import * as departmentController from "../controllers/department.controller.js";
import { authJwt } from "../middlewares/index.js";
import {validateDepartment} from "../validators/department.validator.js";

const router = Router();

router.post('/', [authJwt.verifyToken, authJwt.isAdmin], validateDepartment(1), departmentController.createDepartment);
router.get('/', [authJwt.verifyToken, authJwt.isAdmin], departmentController.getDepartments);
router.get('/:departmentId', [authJwt.verifyToken, authJwt.isAdmin], departmentController.getDepartmentById);
router.put('/:departmentId', [authJwt.verifyToken, authJwt.isAdmin], validateDepartment(), departmentController.updateDepartmentById);
router.delete('/:departmentId', [authJwt.verifyToken, authJwt.isAdmin], departmentController.deleteDepartmentById);

export default router;